<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include("../config.php");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['total'])) {
    echo json_encode(["success" => false, "message" => "Invalid order data"]);
    exit;
}

$orderCode = "ORD" . time();
$total = $data['total'];

$stmt = $conn->prepare("INSERT INTO orders (order_code, total, status) VALUES (?, ?, 'Pending')");
$stmt->bind_param("sd", $orderCode, $total);
$stmt->execute();

echo json_encode([
    "success" => true,
    "orderId" => $conn->insert_id,
    "orderCode" => $orderCode
]);
?>
