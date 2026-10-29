<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

try {

    require_once __DIR__ . "/../config/db.php";

    $id = isset($_GET["id"])
        ? (int) $_GET["id"]
        : 0;

    if ($id > 0) {

        $stmt = $pdo->prepare("
            SELECT
                id,
                name,
                specialization,
                experience,
                fee,
                status
            FROM doctors
            WHERE id = ?
        ");

        $stmt->execute([$id]);

    } else {

        $stmt = $pdo->query("
            SELECT
                id,
                name,
                specialization,
                experience,
                fee,
                status
            FROM doctors
            ORDER BY id DESC
        ");
    }

    $doctors = $stmt->fetchAll();

    echo json_encode([
        "success" => true,
        "doctors" => $doctors
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}