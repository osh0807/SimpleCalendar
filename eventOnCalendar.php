<?php
ini_set("session.cookie_httponly", 1);
session_start();
require 'db.php';
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);
$username = $_SESSION['loggedin'];
$d = $json_obj['d'];
$days = $json_obj['days'];
$month = $json_obj['month'];
$year = $json_obj['year'];
$day = $days[$d];
//$token = $json_obj['token'];
//
//if(!hash_equals($_SESSION['token'], $token)){
//   die("Request forgery detected");
//}
// also need event name
//how do you get the event id
// $stmt = $mysqli->prepare("select event_name from events where (date_year like '$year' AND date_month like '$month' AND date_day like '$day' AND user like '$username')");
$stmt = $mysqli->prepare("select content, startday from event where (startyear like '$year' AND startmonth like '$month' AND usernum like '$username')");
if(!$stmt){
   printf("Query Prep Failed: %s\n", $mysqli->error);
   exit;
}
$arr = array();
$days = array();
$stmt->execute();
$stmt->bind_result($eventName, $eventDay);
$eventName = $json_obj['eventName'];
$eventDay = $json_obj['eventDay'];
$temp = 0;
while($stmt->fetch()) {
   $arr[$temp] = $eventName;
   $days[$temp] = $eventDay;
   $temp = $temp + 1;
}
$stmt->close();
   echo json_encode(array(
      "multiple" => $arr,
      "event_day" => $days,
      "success" => true,
      "eventName" => $eventName,
      "message" => "You were not registered"
   ));
?>