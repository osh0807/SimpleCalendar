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
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);
$user = $_SESSION['loggedin'];

////
if(!hash_equals($_SESSION['token'], $token)){
   die("Request forgery detected");
}
$iserror = true;
$stmt = $mysqli->prepare("update events set event_name = '$eventName', date_year = '$year', date_month = '$month', date_day = '$day', time_hour = '$hour', time_minute = '$minute', apm = '$apm', end_hour = '$end_hour', end_minute = '$end_minute', end_apm = '$end_apm', tag = '$tag', share_user = '$share', invite = '$invite' where (event_id like '$eventID' AND user like '$user')");
if(!$stmt){
   //printf("Query Prep Failed: %s\n", $mysqli->error);
   //exit;
    $iserror = false;
}
$stmt->bind_param('siiiiiiiiissi', $eventName, $year, $month, $day, $hour, $minute, $apm, $end_hour, $end_minute, $end_apm, $tag, $share, $invite);
$stmt->execute();
$stmt->close();
   echo json_encode(array(
      "modified" => $iserror,
      "success" => true,
      "message" => "Cannot display events"
   ));
exit;
?>