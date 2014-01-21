<?php
/**
 * Created by JetBrains PhpStorm.
 * User: eric.walsh
 * Date: 9/16/13
 * Time: 10:45 AM
 * To change this template use File | Settings | File Templates.
 */

include 'mysqlConnect.php';

$task_list[0]['task_priority'] = '2013-09-16 10:24:44';
$i = 1;
$task_id = 12;

//$new_priority = date('Y-m-d H:i:s', strtotime($task_list[0]['task_priority']));
$new_priority = DateTime::createFromFormat('Y-m-d H:i:s', $task_list[$i-1]['task_priority'])-> modify('-1 second');

/**
echo $user_name_master_id . '<br>';
var_dump($new_priority);
echo '<br>' .  $task_id;
**/

$statement=$conn->prepare("UPDATE workerTable
                                            SET task_priority = :newpriority
                                            WHERE task_id = :taskid AND user_id = :masteruserid");
$statement->execute(array(':newpriority' =>  $new_priority->date, ':taskid' => $task_id, ':masteruserid' => $user_name_master_id));

//var_dump($new_priority);
// $new_priority;