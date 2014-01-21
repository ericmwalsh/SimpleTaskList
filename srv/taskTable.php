<?php
/**
 * Pulls the queue table for the specified user the MySQL DB, analyzes and calculates priorities of events,
 * then organizes the list and renders the JSON.
 * User: eric.walsh
 * Date: 9/13/13
 * Time: 9:57 AM
 */

include 'mysqlConnect.php';

//Return the tasks assigned to '$user_name' (re-organized by priority).
$statement = $conn->prepare ("SELECT sq.task_id, sq.task_name, sq.task_details, sq.task_time,
                                      sq.task_priority, u.user_name as originator

                                FROM

                                (SELECT t.*, w.task_priority
                                FROM tasktable t
                                JOIN workertable w ON t.task_id = w.task_id
                                JOIN userTable u ON w.user_id = u.user_id
                                WHERE u.user_name = :username) as sq

                                JOIN userTable as u ON sq.originator = u.user_id
                                ORDER BY sq.task_priority ASC");
$statement->execute(array(':username' => $user_name_master));
$task_list = array();
while($temp = $statement->fetch(PDO::FETCH_ASSOC))  //change to FETCH_ASSOC before production.
{
    $task_list []= $temp;
}

echo json_encode($task_list);