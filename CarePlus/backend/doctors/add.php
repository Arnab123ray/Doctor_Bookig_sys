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

    $name = trim($data["name"] ?? "");
    $specialization =
        trim($data["specialization"] ?? "");

    $experience =
        (int)($data["experience"] ?? 0);

    $fee =
        (float)($data["fee"] ?? 0);

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
        INSERT INTO doctors
        (name, specialization, experience, fee, status)
        VALUES (?, ?, ?, ?, 'Active')
    ");

    $stmt->execute([
        $name,
        $specialization,
        $experience,
        $fee
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Doctor added successfully",
        "id" => $pdo->lastInsertId()
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}