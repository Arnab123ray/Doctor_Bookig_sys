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

    $userId = isset($_GET["user_id"])
        ? (int)$_GET["user_id"]
        : 0;

    if ($userId > 0) {

        $stmt = $pdo->prepare("
            SELECT
                a.id,
                a.doctor_id,
                d.name AS doctor_name,
                d.specialization,
                d.fee,
                a.appointment_date,
                a.appointment_time,
                a.reason,
                a.status,
                a.created_at
            FROM appointments a

            INNER JOIN doctors d
                ON a.doctor_id = d.id

            WHERE a.user_id = ?

            ORDER BY a.id DESC
        ");

        $stmt->execute([$userId]);

    } else {

        $stmt = $pdo->query("
            SELECT
                a.id,
                a.user_id,
                a.doctor_id,

                u.name AS patient_name,
                u.email AS patient_email,

                d.name AS doctor_name,
                d.specialization,
                d.fee,

                a.appointment_date,
                a.appointment_time,
                a.reason,
                a.status,
                a.created_at

            FROM appointments a

            INNER JOIN users u
                ON a.user_id = u.id

            INNER JOIN doctors d
                ON a.doctor_id = d.id

            ORDER BY a.id DESC
        ");
    }

    $appointments = $stmt->fetchAll();

    echo json_encode([
        "success" => true,
        "appointments" => $appointments
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}