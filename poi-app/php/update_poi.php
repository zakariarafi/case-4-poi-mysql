<?php
require_once 'db_connection.php';

$data = json_decode(file_get_contents('php://input'), true);

$id = $data['id'];
$name = $data['name'];
$description = $data['description'];
$address = $data['address'];
$category = $data['category'];
$latitude = $data['latitude'];
$longitude = $data['longitude'];
$rating = $data['rating'];
$imageUrl = $data['image_url'];

$sql = "UPDATE poi SET name = :name, description = :description, address = :address, category = :category,
        latitude = :latitude, longitude = :longitude, rating = :rating, image_url = :image_url
        WHERE id = :id";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':id', $id);
$stmt->bindParam(':name', $name);
$stmt->bindParam(':description', $description);
$stmt->bindParam(':address', $address);
$stmt->bindParam(':category', $category);
$stmt->bindParam(':latitude', $latitude);
$stmt->bindParam(':longitude', $longitude);
$stmt->bindParam(':rating', $rating);
$stmt->bindParam(':image_url', $imageUrl);
$stmt->execute();

echo "POI updated successfully";