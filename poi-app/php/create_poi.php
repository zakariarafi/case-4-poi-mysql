<?php
require_once 'db_connection.php';

$data = json_decode(file_get_contents('php://input'), true);

$name = $data['name'];
$description = $data['description'];
$address = $data['address'];
$category = $data['category'];
$latitude = $data['latitude'];
$longitude = $data['longitude'];
$rating = $data['rating'];
$imageUrl = $data['image_url'];

$sql = "INSERT INTO poi (name, description, address, category, latitude, longitude, rating, image_url)
        VALUES (:name, :description, :address, :category, :latitude, :longitude, :rating, :image_url)";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':name', $name);
$stmt->bindParam(':description', $description);
$stmt->bindParam(':address', $address);
$stmt->bindParam(':category', $category);
$stmt->bindParam(':latitude', $latitude);
$stmt->bindParam(':longitude', $longitude);
$stmt->bindParam(':rating', $rating);
$stmt->bindParam(':image_url', $imageUrl);
$stmt->execute();

echo "POI created successfully";