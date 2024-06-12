<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        include 'db_connection.php';

        // Read the raw POST data
        $rawData = file_get_contents("php://input");

        // Debugging: Output the raw data
        error_log("Raw POST data: " . $rawData);

        // Decode the JSON data
        $data = json_decode($rawData, true);

        // Debugging: Output the decoded data
        error_log("Decoded JSON data: " . print_r($data, true));

        // Extract data from the decoded JSON
        $name = $data['name'] ?? null;
        $description = $data['description'] ?? null;
        $address = $data['address'] ?? null;
        $category = $data['category'] ?? null;
        $image_url = $data['image_url'] ?? null;
        $rating = isset($data['rating']) ? floatval($data['rating']) : null;
        $latitude = isset($data['latitude']) ? floatval($data['latitude']) : null;
        $longitude = isset($data['longitude']) ? floatval($data['longitude']) : null;

        // Validate extracted data
        if (is_null($name) || is_null($description) || is_null($address) || is_null($category) || is_null($rating) || is_null($latitude) || is_null($longitude)) {
                echo json_encode(['success' => false, 'message' => 'Missing required fields', 'body' => $data]);
                exit();
        }

        // Check database connection
        if ($koneksi->connect_error) {
                die('Connection failed: ' . $koneksi->connect_error);
        }

        // Prepare SQL statement
        $stmt = $koneksi->prepare('INSERT INTO poi (name, description, address, category, image_url, rating,  latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');

        // Check if statement preparation was successful
        if ($stmt === false) {
                echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $koneksi->error]);
                exit();
        }

        // Bind parameters
        if (!$stmt->bind_param('sssssddd', $name, $description, $address, $category, $image_url, $rating, $latitude, $longitude)) {
                echo json_encode(['success' => false, 'message' => 'Binding parameters failed: ' . $stmt->error]);
                $stmt->close();
                $koneksi->close();
                exit();
        }

        // Execute statement
        if (!$stmt->execute()) {
                echo json_encode(['success' => false, 'message' => 'Execute failed: ' . $stmt->error, 'body' => $data]);
        } else {
                echo json_encode(['success' => true, 'message' => 'POI created successfully']);
        }

        // Close statement and connection
        $stmt->close();
        $koneksi->close();
}
?>
