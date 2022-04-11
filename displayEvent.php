<?php
ini_set("session.cookie_httponly", 1);
session_start();
require 'db.php';
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);
$usernum = $_SESSION['loggedin'];
$stmt = $mysqli->prepare("select * from events where (usernum like '$usernum') OR (share_user like '$usernum')"); 
if(!$stmt){
   printf("Query Prep Failed: %s\n", $mysqli->error);
   exit;
}
$contents = array();
$eventnums = array();
$starts = array();
// $months = array();
// $days = array();
// $hours = array();
// $minutes = array();
// $apms = array();
// $end_hours = array();
// $end_minutes = array();
$ends = array();
$tags = array();
$shares = array();
$usernums = array();
// $invites = array();

$stmt->execute();
$stmt->bind_result($usernum, $share, $eventnum, $start, $content, $end, $tag);
$content = $json_obj['content'];
$eventnum = $json_obj['eventnum'];
$usernum = $json_obj['usernum'];
$start = $json_obj['start'];
$end = $json_obj['end'];
$tag = $json_obj['tag'];
$share = $json_obj['share'];

$temp = 0;
while($stmt->fetch()) {
   $contents[$temp] = addslashes(htmlentities($content));
   $eventnums[$temp] = $eventnum;
   $starts[$temp] = $start;
   $ends[$temp] = $end;
   $tags[$temp] = addslashes(htmlentities($tag));
   $shares[$temp] = addslashes(htmlentities($share));
   $temp = $temp + 1;
}
$stmt->close();
   echo json_encode(array(
      "multiple" => $contents,
      "eventnums" => $eventnums,
      "starts" => $starts,
      "ends" => $ends,
      "tags" => $tags,
      "shares" => $shares,
      "success" => true,
      "eventName" => $eventName,
      "message" => "You were not registered"
   ));
//   echo $eventName;
//   echo "<br>";
//}
//while($data = mysql_fetch_array($stm)){
//   $arr[$data['name']] = $data[$eventName];
//}
//
//echo json_encode($arr);
//echo json_encode(array(
//   $eventName
//));
?>