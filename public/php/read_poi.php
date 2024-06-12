<?php
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    include 'db_connection.php';

    // Check database connection
    if ($koneksi->connect_error) {
        die('Connection failed: ' . $koneksi->connect_error);
    }

    $result = $koneksi->query('SELECT * FROM poi');
    $pois = [];
    while ($row = $result->fetch_assoc()) {
        $pois[] = $row;
    }

    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'message' => 'Success get data POI', 'data' => $pois]);

    $koneksi->close();
}
?>