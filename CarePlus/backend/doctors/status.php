<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

try {

    require_once __DIR__ . "/../config/db.php";

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    $id = (int)($data["id"] ?? 0);
    $status = trim($data["status"] ?? "");

    if ($id <= 0) {

        echo json_encode([
            "success" => false,
            "message" => "Invalid doctor ID"
        ]);

        exit;
    }

    if (!in_array(
        $status,
        ["Active", "Inactive"],
        true
    )) {

        echo json_encode([
            "success" => false,
            "message" => "Invalid doctor status"
        ]);

        exit;
    }

    $stmt = $pdo->prepare("
        UPDATE doctors
        SET status = ?
        WHERE id = ?
    ");

    $stmt->execute([
        $status,
        $id
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Doctor status updated"
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}