<?php
// Database connection details
$server = "127.0.0.1";
$username = "root";
$password = "damanik";
$database = "poi_db";
$koneksi = mysqli_connect($server, $username, $password, $database);
if (mysqli_connect_error()) {
    echo json_encode(['success' => false, 'message' => "Failed to connect to Database: " . mysqli_connect_error()]);
}

?>
