<?php


$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

$allowedOrigins = [
    "http://localhost:5173"
];

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
}

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");



if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {

    http_response_code(200);

    echo json_encode([
        "success" => true,
        "message" => "CORS OK"
    ]);

    exit;
}



if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    echo json_encode([
        "success" => false,
        "message" => "Only POST request is allowed"
    ]);

    exit;
}

// ===============================
// DATABASE
// ===============================

require_once __DIR__ . "/../config/db.php";

try {

    // Read JSON
    $input = file_get_contents("php://input");

    $data = json_decode($input, true);

    if (!is_array($data)) {

        echo json_encode([
            "success" => false,
            "message" => "Invalid JSON data"
        ]);

        exit;
    }

    // ===============================
    // GET LOGIN DATA
    // ===============================

    $username = trim(
        $data["username"] ?? ""
    );

    $password = $data["password"] ?? "";

    if ($username === "" || $password === "") {

        echo json_encode([
            "success" => false,
            "message" =>
                "Username and password are required"
        ]);

        exit;
    }

    // ===============================
    // FIND ADMIN
    // ===============================

    $stmt = $pdo->prepare("
        SELECT
            id,
            username,
            password
        FROM admins
        WHERE username = ?
        LIMIT 1
    ");

    $stmt->execute([
        $username
    ]);

    $admin = $stmt->fetch();

    if (!$admin) {

        echo json_encode([
            "success" => false,
            "message" => "Admin not found"
        ]);

        exit;
    }

    // ===============================
    // CHECK PASSWORD
    // ===============================

    if (!password_verify(
        $password,
        $admin["password"]
    )) {

        echo json_encode([
            "success" => false,
            "message" => "Incorrect password"
        ]);

        exit;
    }

    // Remove password
    unset($admin["password"]);

    // ===============================
    // SUCCESS
    // ===============================

    echo json_encode([
        "success" => true,
        "message" => "Admin login successful",
        "admin" => $admin
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error" => $e->getMessage()
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Server error",
        "error" => $e->getMessage()
    ]);
}
