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

    $userId =
        (int)($data["user_id"] ?? 0);

    $doctorId =
        (int)($data["doctor_id"] ?? 0);

    $date =
        trim($data["appointment_date"] ?? "");

    $time =
        trim($data["appointment_time"] ?? "");

    $reason =
        trim($data["reason"] ?? "");

    if (
        $userId <= 0 ||
        $doctorId <= 0 ||
        $date === "" ||
        $time === ""
    ) {

        echo json_encode([
            "success" => false,
            "message" =>
                "Required appointment information is missing"
        ]);

        exit;
    }

    // Check user
    $userStmt = $pdo->prepare("
        SELECT id
        FROM users
        WHERE id = ?
        LIMIT 1
    ");

    $userStmt->execute([$userId]);

    if (!$userStmt->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);

        exit;
    }

    // Check active doctor
    $doctorStmt = $pdo->prepare("
        SELECT id
        FROM doctors
        WHERE id = ?
        AND status = 'Active'
        LIMIT 1
    ");

    $doctorStmt->execute([$doctorId]);

    if (!$doctorStmt->fetch()) {

        echo json_encode([
            "success" => false,
            "message" =>
                "Doctor is not available"
        ]);

        exit;
    }

    // Check duplicate slot
    $check = $pdo->prepare("
        SELECT id
        FROM appointments
        WHERE doctor_id = ?
        AND appointment_date = ?
        AND appointment_time = ?
        AND status IN ('Pending', 'Approved')
        LIMIT 1
    ");

    $check->execute([
        $doctorId,
        $date,
        $time
    ]);

    if ($check->fetch()) {

        echo json_encode([
            "success" => false,
            "message" =>
                "This appointment time is already booked"
        ]);

        exit;
    }

    $stmt = $pdo->prepare("
        INSERT INTO appointments
        (
            user_id,
            doctor_id,
            appointment_date,
            appointment_time,
            reason,
            status
        )
        VALUES (?, ?, ?, ?, ?, 'Pending')
    ");

    $stmt->execute([
        $userId,
        $doctorId,
        $date,
        $time,
        $reason
    ]);

    echo json_encode([
        "success" => true,
        "message" =>
            "Appointment booked successfully",
        "appointment_id" =>
            $pdo->lastInsertId()
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}