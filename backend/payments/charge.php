<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include("../config.php");

$data = json_decode(file_get_contents("php://input"), true);
$orderId = $data['orderId'];
$amount = $data['amount'];

// Simulate payment success
$status = "succeeded";

if ($status === "succeeded") {
    $stmt = $conn->prepare("UPDATE orders SET status='Paid' WHERE id=?");
    $stmt->bind_param("i", $orderId);
    $stmt->execute();
}

echo json_encode(["status" => $status]);
?>
