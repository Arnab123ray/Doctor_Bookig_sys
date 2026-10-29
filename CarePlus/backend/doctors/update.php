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

    $name = trim($data["name"] ?? "");

    $specialization =
        trim($data["specialization"] ?? "");

    $experience =
        (int)($data["experience"] ?? 0);

    $fee =
        (float)($data["fee"] ?? 0);

    if ($id <= 0) {

        echo json_encode([
            "success" => false,
            "message" => "Invalid doctor ID"
        ]);

        exit;
    }

    if (
        $name === "" ||
        $specialization === ""
    ) {

        echo json_encode([
            "success" => false,
            "message" =>
                "Doctor name and specialization are required"
        ]);

        exit;
    }

    $stmt = $pdo->prepare("
        UPDATE doctors
        SET
            name = ?,
            specialization = ?,
            experience = ?,
            fee = ?
        WHERE id = ?
    ");

    $stmt->execute([
        $name,
        $specialization,
        $experience,
        $fee,
        $id
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Doctor updated successfully"
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}