<?php
header("Content-Type: application/json");
//session continues
session_start();
//unset session variables
session_unset();
//destroy the session
session_destroy();
echo json_encode(array("success" => true, "message" => "Logout!"));
exit;
?>