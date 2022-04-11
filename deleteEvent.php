<?php
require 'db.php';
ini_set("session.cookie_httponly", 1);
session_start();
$token_POST = $_POST['token'];
//CSRF case:
if(!hash_equals($token_POST, $_SESSION['token'])){
  session_unset();
  session_destroy();
  die("Request forgery detected");
}

header("Content-Type: application/json"); 
$json_str = file_get_contents('php://input');

$json_obj = json_decode($json_str, true);
$user = $_SESSION['loggedin'];
$eventID = (float) $json_obj['eventID'];
$token = $json_obj['token'];
//
if(!hash_equals($_SESSION['token'], $token)){
   die("Request forgery detected");
}
$iserror = true;
$stmt = $mysqli->prepare("delete from events where (event_id like '$eventID' AND user like '$user')");
if(!$stmt){
   echo json_encode(array(
      "deleted" => $iserror,
      "success" => true,
      "message" => "deletion failed"
   ));
    $iserror = false;
}
$stmt->bind_param('i', $eventID);
$stmt->execute();
$stmt->close();
   echo json_encode(array(
      "deleted" => $iserror,
      "success" => true,
      "message" => "Cannot display events"
   ));
exit;
