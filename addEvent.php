<?php
require 'db.php';
header("Content-Type: application/json");
session_start();
$token_POST = $_POST['token'];
//CSRF case:
if(!hash_equals($token_POST, $_SESSION['token'])){
  session_unset();
  session_destroy();
  die("Request forgery detected");
}
if (!(isset($_SESSION['loggedin']))) {
    echo json_encode(array(
        "success" => false,
        "message" => "Try again"
        
    ));
    exit;
}
//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

$user = $_SESSION['loggedin'];
$stmt = $mysqli->prepare('SELECT num FROM user WHERE username = ?');
$stmt->bind_param('s', $user);
$stmt->execute();
$stmt->bind_result($usernum);
$stmt->fetch();
$stmt->close();

$content = $json_obj["content"];
$start = $json_obj["start"];
$end = $json_obj["end"];

$startdate = strtotime($start);
$mysqlStart = date('Y-m-d H:i:s', $startdate);

$enddate = strtotime($end);
$mysqlEnd = date('H:i:s', $enddate);


//submits new story into the database.
    $stmt = $mysqli ->prepare('insert into event (content, start, end, usernum) values (?, ?, ?, ?)');
    if(!$stmt){
        echo json_encode(array(
            "success" => false,
            "message" => "Try again"
        ));
      }
    else {
    $stmt->bind_param('ssss', $content, $mysqlStart, $mysqlEnd, $user);
    $stmt->execute();

    $stmt->close();
    echo json_encode(array("success" => true, "message" => "added!"));
    }




?>
