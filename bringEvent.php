<?php
header("Content-Type: application/json");
session_start();
require 'db.php';
header("Content-Type: application/json");

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

$usernum = $_SESSION['loggedin'];
$year = $_POST['year'];
$month = $_POST['month'];


$stmt = $mysqli->prepare("select start, end, content, eventnum from event where usernum = ? AND year = ? AND month = ?");
if (!$stmt) {
    //fail
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}
$stmt->bind_param('dss', $usernum,$year,$month);
$stmt->execute();
$stmt->bind_result($startT, $endT, $eContent, $eNum);

$result = array();
$startTs = [];
$endTs = [];
$eContents = [];
$eNums = [];

while ($stmt->fetch()) {
    array_push($eContents, $eContent);
    array_push($startTs, $startT);
    array_push($endTs, $endT);
    array_push($eNums, $eNum);
}

$result = array(
    "eContents" => $eContents,
    "startTs" => $startTs,
    "endTs" => $endTs,
    "enums" => $enums
);

echo json_encode($result);
$stmt->close();
