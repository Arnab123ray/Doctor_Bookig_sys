<?php

header("Content-Type: application/json");

require_once __DIR__ . "/config/db.php";

try {

    $stmt = $pdo->query("SELECT DATABASE() AS database_name");

    $result = $stmt->fetch();

    echo json_encode([
        "success" => true,
        "message" => "Database connected successfully",
        "database" => $result["database_name"]
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database connection failed",
        "error" => $e->getMessage()
    ]);
}