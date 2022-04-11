<?php
require 'db.php';
header("Content-Type: application/json");
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);
$exists = false;

//Variables can be accessed as such:
$username = $json_obj['username'];
$password = $json_obj['password'];

$password = password_hash($password, PASSWORD_DEFAULT);
//to prevent mysql injection

$stmt = $mysqli->prepare("insert into user (username, password) values (?, ?)");
if (!$stmt) {
    echo json_encode(array(
        "success" => false,
        "message" => "Try again"
    ));
    exit;
}
else {
$stmt->bind_param('ss', $username, $password);
$stmt->execute();
$stmt->close();
echo json_encode(array(
    "success" => true,
    "message" => "registered!"
));
}
exit;
?>