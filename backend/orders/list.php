<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include("../config.php");

$result = $conn->query("SELECT id, order_code, total, status, created_at FROM orders ORDER BY id DESC");
$orders = [];
while ($row = $result->fetch_assoc()) {
    $orders[] = $row;
}
echo json_encode($orders);
?>
