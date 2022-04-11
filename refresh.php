<?php
ini_set("session.cookie_httponly", 1);
session_start();
require 'db.php';
// Content of database.php

header("Content-Type: application/json"); // set the MIME Type to application/json

if(isset($_SESSION['user_id'])){
    echo json_encode(array(
		"success" => true,
        "token" => $_SESSION['token'],
        "id" => $_SESSION['loggedin'],
		"message" => "same user"
	));
} else {
    echo json_encode(array(
		"success" => false,
		"message" => "failure"
	));
}

?>
