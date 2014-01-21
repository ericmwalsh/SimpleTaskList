<?php
/**
 * This is the suggest search that is going to be used in the "Assignees" section
 * as well as in the "Originator" section of the task input form.
 * User: Eric
 * Date: 9/15/13
 * Time: 1:42 PM
 * To change this template use File | Settings | File Templates.
 */

include 'mysqlConnect.php';

//Retrieve submitted fields
$search_input = $_GET['searchInput'] . '%';

//Fetch the users matching this field.
$statement = $conn->prepare ("SELECT user_name
                                  FROM userTable
                                  WHERE user_name LIKE :searchInput");
$statement->execute(array(':searchInput' => $search_input));

$search_results = array();
while($temp = $statement->fetch(PDO::FETCH_NUM))  //change to FETCH_ASSOC before production.
{
    $search_results []= $temp;
}

echo json_encode($search_results);