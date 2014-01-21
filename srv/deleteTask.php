<?php
/**
 * Deletes a task from the DB (and from the list).
 * User: eric.walsh
 * Date: 9/16/13
 * Time: 9:59 AM
 */

include 'mysqlConnect.php';

//Retrieve the task_id for the task to be deleted.
$task_id = $_GET['taskID'];

//Need to delete the task in the 'taskTable' and the link in the 'workerTable'
$statement=$conn->prepare("DELETE FROM workerTable
                            WHERE task_id = :taskid;
                           DELETE FROM taskTable
                            WHERE task_id = :taskid;");
echo json_encode($statement->execute(array(':taskid' => $task_id)));