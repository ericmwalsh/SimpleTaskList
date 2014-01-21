<?php
/**
 * Takes validated input for a task, cleans for SQL inject/malicious code,
 * and throws the event (and all info) into the attached MySQL DB.
 * User: eric.walsh
 * Date: 9/13/13
 * Time: 9:57 AM
 */

include 'mysqlConnect.php';

//retrieve submitted fields
$task_name = $_GET['taskName'];
$task_details = $_GET['taskDetails'];
$task_priority = $_GET['taskPriority'];
$task_originator = $_GET['taskOriginator'];
$task_workers = $_GET['taskWorkers'];
$task_ip = $_SERVER['REMOTE_ADDR']; //This is taken for security purposes (misuse, spam, etc.)


//temp HTML fix for learning purposes
//$task_workers[]= $task_temp;


//Add the originator and all the workers to the userTable if they don't already exist
//First the originator
$statement=$conn->prepare("INSERT INTO userTable (user_name)
                            VALUES (:taskorig)");
$statement->execute(array(':taskorig' => $task_originator));

//Fetch originator's ID
$statement = $conn->prepare ("SELECT user_id
                                  FROM userTable
                                  WHERE user_name = :taskorig");
$statement->execute(array(':taskorig' => $task_originator));
$originator_id = $statement->fetch();
$originator_id= $originator_id[0];

//Now the workers - returns an array of all the worker's ids
$worker_ids = array();
foreach($task_workers as $worker)
{
    $statement=$conn->prepare("INSERT INTO userTable (user_name)
                                VALUES (:worker)");
    $statement->execute(array(':worker' => $worker));

    $statement = $conn->prepare ("SELECT user_id
                                  FROM userTable
                                  WHERE user_name = :worker");
    $statement->execute(array(':worker' => $worker));
    $worker_ids_helper = $statement->fetch();
    $worker_ids []= $worker_ids_helper[0];
}

//Convert priority into a time and set the priority field to that datetime value.
//1 => 'as soon as possible' , 2 => 'end of today' , 30 => 'end of the week'
$priority = 3 * $task_priority * 3600;
$date = date('Y-m-d H:i:s', time() + $priority);
$task_priority = $date;

//Create the task then retrieve the ID
$statement=$conn->prepare("INSERT INTO taskTable (task_name, task_details, task_time, originator, task_ip)
                                VALUES (:taskname, :taskdetails, NOW(), :originatorid, :taskip)");
$statement->execute(array(':taskname' => $task_name, ':taskdetails' => $task_details,
                            ':originatorid' => $originator_id, ':taskip' => $task_ip));
$statement = $conn->prepare ("SELECT sq.task_id, sq.task_name, sq.task_details, sq.task_time, u.user_name as originator
                                  FROM taskTable as sq
                                  JOIN userTable as u ON sq.originator = u.user_id
                                  WHERE task_name = :taskname AND task_details = :taskdetails
                                  LIMIT 1");
$statement->execute(array(':taskname' => $task_name, ':taskdetails' => $task_details));
$task_store = $statement->fetch(PDO::FETCH_ASSOC);
$task_store['task_priority']=$task_priority;
$task_id = $task_store['task_id'];


$successCheck=count($worker_ids);
//echo $successCheck . '<br>';
//add all the workers (with the task id) to the mysql link table 'workerTable'
foreach($worker_ids as $worker_id)
{
    $statement=$conn->prepare("INSERT INTO workerTable
                VALUES (:taskid, :workerid, :taskpriority)");
    if($statement->execute(array(':taskid' => $task_id, ':workerid' => $worker_id, ':taskpriority' => $task_priority)))
    {
        $successCheck--;
    }
}

echo json_encode(['successCheck' => ($successCheck==0 ? 'true' : 'false'), 'taskInfo' => $task_store]);