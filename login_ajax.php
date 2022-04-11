<?php
// login_ajax.php
require 'db.php';
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$username_POST = $json_obj['username'];
$password_POST = $json_obj['password'];
//This is equivalent to what you previously did with $_POST['username'] and $_POST['password']

// Check to see if the username and password are valid.  (You learned how to do this in Module 3.)

$exists = false;
$stmt = $mysqli->prepare("SELECT username FROM user WHERE username = ?");

if(!$stmt){
  printf("Query Prep Failed: %s\n", $mysqli->error);
  exit;
}
$stmt->bind_param('s', $username);
$username = $mysqli->real_escape_string($username_POST);
$stmt->execute();
$stmt->bind_result($db_user);
$stmt->fetch();
$stmt->close();


//found user from db
if($db_user != NULL){
  $exists = true;
}
//check for the password
if($exists){
  $stmt = $mysqli->prepare("SELECT num, password FROM user WHERE username = ?");
  if(!$stmt){
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
  }
  $stmt->bind_param('s', $username_login);
  $username_login = $mysqli->real_escape_string($username_POST);
  $stmt->execute();
  $stmt->bind_result($usernum, $db_password);
  $stmt->fetch();
  $stmt->close();
  //verify the password. Since password_verify supports random salt by default, additional salt is not required.
  $verify = password_verify( $password_POST, $db_password);
  if($verify){
    session_start();
    $_SESSION['id'] = $username_POST;
    $_SESSION['loggedin'] = $usernum;
    $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32)); 
    echo json_encode(array("success" => true, "message" => "Hello!", "logged_in_as" => $_SESSION['loggedin'], "token" => $_SESSION['token'], "usernum" => $usernum));
    exit;
  }
  else{
    echo json_encode(array(
    "success" => false,
    "message" => "Wrong password"));
    exit;
  }
}
//user not found from the list
else{
  //send msg: usernotfound FIXME!!!
  echo json_encode(array(
    "success" => false,
    "message" => "Not a registered user"));
    exit;
}
?>