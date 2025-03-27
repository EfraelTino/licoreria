<?php
require_once './config/Utils.php';

class User
{
    private $db;
    private $utils;

    public function __construct($db)
    {
        $this->db = $db;
        $this->utils = new Utils();
    }

    public function findUserByEmail($email)
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_ASSOC); // Solo se llama a fetch una vez
    }
    public function findUserIdActive($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = ? AND status = 1");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC); // Solo se llama a fetch una vez
    }
    public function findUserId($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC); // Solo se llama a fetch una vez
    }
    public function findUserByDocument($document)
    {
        $stmt = $this->db->prepare("SELECT id FROM customers WHERE document = ?");
        $stmt->execute([$document]);
        return $stmt->fetchColumn(); // Devuelve solo el ID
    }

    public function createCustomer($data)
    {
        $stmt = $this->db->prepare("INSERT INTO customers (name, phone, document, email) VALUES (?, ?, ?, ?)");
        $stmt->execute([$data['names'], $data['phone'], $data['dni'], $data['email']]);
        return $this->db->lastInsertId();
    }
    public function updateLogin($email)
    {
        $fecha = $this->utils->dataNow();
        $stmt = $this->db->prepare("UPDATE users SET date_login = ? WHERE username = ?");
        $stmt->execute([$fecha, $email]); // Corregido: los parámetros deben estar en un array

        // Como es un UPDATE, no se usa fetch() aquí
        return $stmt->rowCount(); // Opcional: devuelve el número de filas afectadas

    }
    // Validar si un usuario existe 
    public function checkUserExists($email)
    {
        return self::findUserByEmail($email) !== false;
    }
    public function findClientByDocument($document)
    {
        $stmt = $this->db->prepare("SELECT * FROM credit_user WHERE dni = ?");
        $stmt->execute([$document]);
        //retornar solo la fila
        return $stmt->fetchColumn();
    }





















    public function updateData($actualizar, $condicion, $valorCondicion)
    {
        $sql = "UPDATE user SET $actualizar WHERE $condicion = :valorCondicion";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':valorCondicion', $valorCondicion, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->rowCount();
    }

    public function createUser($data)
    {

        $stmt = $this->db->prepare(
            "INSERT INTO users (name, username, password, role, status) 
            VALUES (?, ?, ?, ?, ?)"
        );
        $success = $stmt->execute([
            $data['name'],
            $data['username'],
            $data['password'],
            $data['role'],
            $data['status']
        ]);

        // Verifica si la inserción fue exitosa
        return $success;
    }

    public function updateDataUser($data)
    {
        if (!isset($data['id'])) {
            return 0; // Si no hay ID, no se puede actualizar
        }

        $fields = [];
        $values = [];
        $columnas = ['name', 'username', 'role', 'status', 'password'];

        foreach ($columnas as $columna) {
            if (array_key_exists($columna, $data)) {
                $fields[] = "$columna = ?";
                $values[] = $data[$columna];
            }
        }

        if (empty($fields)) {
            return 0; // Si no hay nada que actualizar, no ejecuta la consulta
        }

        $values[] = $data['id']; // Agregamos el ID al final
        $sql = "UPDATE users SET " . implode(", ", $fields) . " WHERE id = ?";

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($values);

            if ($stmt->rowCount() === 0) {
                return ['success' => false, 'message' => 'No se modificaron registros.'];
            }

            return ['success' => true, 'message' => 'Usuario actualizado correctamente.'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Error SQL: ' . $e->getMessage()];
        }
    }


    public function allUsers()
    {
        $stmt = $this->db->prepare("SELECT name, username, role, created_at, id, status FROM users ORDER BY status DESC");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    //desactivar usuario
    public function desactivarUsuario($data)
    {
        $stmt = $this->db->prepare("UPDATE users SET status = ? WHERE id = ?");
        $stmt->execute([$data['status'], $data['id']]);
        return $stmt->rowCount();
    }
    //datos de un usuario
    public function findUserById($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    public function allOccupations()
    {
        $stmt = $this->db->prepare("SELECT * FROM occupation");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }









    public function updateDataFoto($data)
    {

        $stmt = $this->db->prepare("UPDATE user SET perfil=? WHERE id =?");
        $stmt->execute([$data['foto'], $data['id_user']]);
        return $stmt->rowCount();
    }
    public function updatePassword($data)
    {

        $stmt = $this->db->prepare("UPDATE user SET password=?, repeat_password=? WHERE id =?");
        $stmt->execute([$data['password'], $data['repeat_password'], $data['id_user']]);
        return $stmt->rowCount();
    }
    public function updatePasswordEmail($data)
    {

        $stmt = $this->db->prepare("UPDATE user SET password=?, repeat_password=? WHERE email =?");
        $stmt->execute([$data['password'], $data['repeat_password'], $data['email']]);
        return $stmt->rowCount();
    }
}
