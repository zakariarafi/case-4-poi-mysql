<?php
require_once 'db_connection.php';

$sql = "SELECT * FROM poi";
$stmt = $pdo->query($sql);
$pois = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($pois);