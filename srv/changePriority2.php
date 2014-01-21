<?php
/**
 * Takes a task list input and the task ID for which the priority should be changed - changes the priority in the DB.
 * User: eric.walsh
 * Date: 9/28/13
 * Time: 3:32 PM
 */

include 'mysqlConnect.php';

//Retrieve task list, task ID, and up/down priority input.
$task_list = $_GET['taskList'];
$task_id = $_GET['taskID'];
$priority_change = $_GET['priorityChange'];

for($i=0; $i<count($task_list); $i++)
{
    if($task_list[$i]['task_id'] == $task_id)
    {
        if($priority_change == 0)
        {
            if($i >= 0)
            {
                $new_priority = DateTime::createFromFormat('Y-m-d H:i:s', $task_list[$i]['task_priority'])-> modify('-3 hours');
                $statement=$conn->prepare("UPDATE workerTable
                                            SET task_priority = :newpriority
                                            WHERE task_id = :taskid AND user_id = :masteruserid");
                $statement->execute(array(':newpriority' => $new_priority->format('Y-m-d H:i:s'), ':taskid' => $task_id,
                    ':masteruserid' => $user_name_master_id));
                echo ($statement == true) . '<br>';
                echo json_encode($new_priority->format('Y-m-d H:i:s'));
            }
        }
        else
        {
            if($i+1 <= count($task_list))
            {
                $new_priority = DateTime::createFromFormat('Y-m-d H:i:s', $task_list[$i]['task_priority'])-> modify('+3 hours');
                $statement=$conn->prepare("UPDATE workerTable
                                            SET task_priority = :newpriority
                                            WHERE task_id = :taskid AND user_id = :masteruserid");
                $statement->execute(array(':newpriority' => $new_priority->format('Y-m-d H:i:s'), ':taskid' => $task_id,
                    ':masteruserid' => $user_name_master_id));
                echo json_encode($new_priority->format('Y-m-d H:i:s'));
            }
        }
    }
}