<?php
if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    include 'db_connection.php';

    // Read the raw POST data
    $rawData = file_get_contents("php://input");

    // Debugging: Output the raw data
    error_log("Raw POST data: " . $rawData);

    // Decode the JSON data
    $data = json_decode($rawData, true);

    // Debugging: Output the decoded data
    error_log("Decoded JSON data: " . print_r($data, true));

    $id = $data['id'] ?? null;

    // Check database connection
    if ($koneksi->connect_error) {
        die('Connection failed: ' . $koneksi->connect_error);
    }

    $stmt = $koneksi->prepare('DELETE FROM poi WHERE id = ?');

    // Check if statement preparation was successful
    if ($stmt === false) {
        echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $koneksi->error]);
        exit();
    }

    // Bind parameters
    if (!$stmt->bind_param('i', $id)) {
        echo json_encode(['success' => false, 'message' => 'Binding parameters failed: ' . $stmt->error]);
        $stmt->close();
        $koneksi->close();
        exit();
    }

    // Execute statement
    if (!$stmt->execute()) {
        echo json_encode(['success' => false, 'message' => 'Execute failed: ' . $stmt->error, 'body' => $data]);
    } else {
        echo json_encode(['success' => true, 'message' => 'POI Deleted']);
    }

    // Close statement and connection
    $stmt->close();
    $koneksi->close();
}
?>