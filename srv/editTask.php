<?php
/**
 * Takes validated input for a task, cleans for SQL inject/malicious code,
 * and throws the event (and all info) into the attached MySQL DB.
 * User: eric.walsh
 * Date: 10/03/13
 * Time: 7:08 PM
 */

include 'mysqlConnect.php';

//retrieve submitted fields
$task_id = $_GET['taskID'];
$task_name = $_GET['taskName'];
$task_details = $_GET['taskDetails'];
$task_priority = $_GET['taskPriority'];
$task_originator = $_GET['taskOriginator'];
$task_workers = $_GET['taskWorkers'];
$task_ip = $_SERVER['REMOTE_ADDR']; //This is taken for security purposes (misuse, spam, etc.)


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