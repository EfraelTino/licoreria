<?php
function getDBConnection() {
    $host = 'localhost';  
    $db = 'licoreria'; 
    $user = 'root';  
    $pass = 'root';
    
    // $host = 'localhost';  
    // $db = 'u694359124_tincuydb'; 
    // $user = 'u694359124_efradev'; 
    // $pass = '@Developer2024';

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        echo 'Connection failed: ' . $e->getMessage();
        exit;  // Termina la ejecución si la conexión falla
    }
}
