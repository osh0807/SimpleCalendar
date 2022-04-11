<?php
require("db.php");
header("Content-Type: application/json");

$token_POST = $_POST['token'];
//CSRF case:
if(!hash_equals($token_POST, $_SESSION['token'])){
  session_unset();
  session_destroy();
  die("Request forgery detected");
}
//save variables on this php
$eventTitle = $_POST['eventTitle'];
$startTime = $_POST['startTime'];
$endTime = $_POST['endTime'];
$eventNum = 1;
$phpdate = strtotime($startTime);
$mysqldateStart = date('Y-m-d H:i:s', $phpdate);
$phpdate2 = strtotime($endTime);
$mysqldateEnd = date('Y-m-d H:i:s', $phpdate2);
//modify the database -- mysql
$stmt = $mysqli->prepare("UPDATE event SET title = ?, startDate = ?, endDate = ? WHERE eventnum = ?");
if(!$stmt){
    echo json_encode(array("success" => false, "message" => "failed to modify."));
    exit;
}
$stmt->bind_param('sssi', $eventTitle, $mysqldateStart, $mysqldateEnd, $usernum);
$stmt->execute();
$stmt->close();
echo json_encode(array("success" => true, "message" => "Event modified."));
exit;
?>

?>