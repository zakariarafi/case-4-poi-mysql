<?php
// Database connection details
$host = 'localhost';
$username = 'root';
$password = 'rahasia';
$database = 'poi_db';

// Create a new PDO instance
try {
    $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}