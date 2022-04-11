<?php
    //select events related to user
    $mysqli = new mysqli('localhost', 'wustl_inst', 'wustl_pass', 'module5');
    
    if ($mysqli->connect_errno) {
        printf("Connection Failed: %s\n", $mysqli->connect_error);
        exit; 
    } 
   
    header("Content-Type: application/json"); 
	session_start();
	// Login succeeded!
    $user_id = $_SESSION['loggedin'];
    
    //fetch table rows from mysql db
    $sql = "select * FROM event WHERE usernum = $user_id";
   
    $result = mysqli_query($mysqli, $sql) or die("Error in Selecting " . mysqli_error($connection));
  
    //create an array
    $events = array();
    while($row =mysqli_fetch_assoc($result))
    {
        $events['events'][] = $row;
    }
    echo json_encode(array("events" => $events));
    
    //close the db connection
    mysqli_close($connection);
?>
