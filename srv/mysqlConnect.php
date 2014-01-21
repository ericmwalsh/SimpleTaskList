<?php
/**
 * Script that connects to MySQL DB
 * User: eric.walsh
 * Date: 9/16/13
 * Time: 10:21 AM
 */

/**Connect into the MySQL Database**/
// configuration
$dbhost     = "127.0.0.1";
$dbname     = "task_list";
$dbuser     = "task_queue_user";
$dbpass     = "1234qwer";
// database connection
$conn = new PDO("mysql:host=$dbhost;dbname=$dbname",$dbuser,$dbpass);

//This is the "user" name of the owner of the table (e.g. Eric for Eric's Task Queue) - change this for different users.
//Support for routing will be added and this convention shall be replaced!
$user_name_master = 'Eric';

//Fetch user_name_master 's user_id
$statement = $conn->prepare ("SELECT user_id
                                  FROM userTable
                                  WHERE user_name = :usernamemaster");
$statement->execute(array(':usernamemaster' => $user_name_master));
$user_name_master_id = $statement->fetch();
$user_name_master_id= $user_name_master_id[0];