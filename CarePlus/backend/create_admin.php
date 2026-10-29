<?php

require_once __DIR__ . "/config/db.php";

$username = "admin";
$password = "admin123";

try {

    $hash = password_hash($password, PASSWORD_DEFAULT);

    // Check if admin exists
    $check = $pdo->prepare(
        "SELECT id FROM admins WHERE username = ? LIMIT 1"
    );

    $check->execute([$username]);

    $existing = $check->fetch();

    if ($existing) {

        $stmt = $pdo->prepare("
            UPDATE admins
            SET password = ?
            WHERE username = ?
        ");

        $stmt->execute([
            $hash,
            $username
        ]);

        echo "<h2 style='color:green'>Admin updated successfully</h2>";

    } else {

        $stmt = $pdo->prepare("
            INSERT INTO admins
            (username, password)
            VALUES (?, ?)
        ");

        $stmt->execute([
            $username,
            $hash
        ]);

        echo "<h2 style='color:green'>Admin created successfully</h2>";
    }

    echo "<hr>";
    echo "<b>Username:</b> admin<br>";
    echo "<b>Password:</b> admin123<br><br>";

    echo "Now check phpMyAdmin → doctor_booking → admins.";

} catch (PDOException $e) {

    echo "<h2 style='color:red'>Database Error</h2>";
    echo $e->getMessage();
}