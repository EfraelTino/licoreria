<?php
// require_once '/app/Models/User.php';
require_once './app/Models/User.php';
require_once './config/Utils.php';

use Firebase\JWT\JWT;

class UserController
{
    private $userModel;
    private $utils;

    public function __construct($db)
    {
        $this->userModel = new User($db);
        $this->utils = new Utils();
    }
    private function validarCampos($data)
    {
        // Verifica si la clave 'body' existe en $data y contiene los campos necesarios
        return isset($data['name'], $data['lastname'], $data['email'], $data['password'], $data['password_repeat'], $data['userType']);
    }

    public function loginUser($request)
    {
        $data = $request['body'];

        // Validar email
        if (!$this->validarEmail($data['email'])) {
            return $this->jsonResponse(200, ['success' => false, 'error' => 'El email no es válido, intente de nuevo.']);
        }

        // Validar contraseña
        if (empty($data['password'])) {
            return $this->jsonResponse(200, ['success' => false, 'error' => 'Ingrese una contraseña para continuar']);
        }

        // Buscar usuario por email
        $user = $this->userModel->findUserByEmail($data['email']);
        if (!$user) {
            return $this->jsonResponse(200, ['success' => false, 'error' => 'Usuario no encontrado']);
        }
        if ($user['status'] == 0) {
            return $this->jsonResponse(200, ['error' => 'Tu usuario no se encuentra activo, contacta al administrador', 'success' => false]);
        }

        // Verificar contraseña
        /**
         *  if (!password_verify($data['password'], $user['password'])) {
            return $this->jsonResponse(200, ['success' => false, 'error' => 'Contraseña incorrecta, intente de nuevo']);
        }
         */
        // Generar token
        $this->userModel->updateLogin($data['email']);
        $token = $this->generateToken($user);

        return $this->jsonResponse(200, ['success' => true, 'userdata' => [
            'token' => $token,
            'email' => $user['email'],
            'name' => $user['name'],
            'lastname' => $user['lastname'],
            'typeuser' => $user['typeuser'],
            'status' => $user['status'],
            'iduser' => $user['id']
        ]]);
    }




    public function crearUsuario($request)
    {
        $data = $request['body'];

        // Validar campos
        if (!$this->validarCampos($data)) {
            return $this->jsonResponse(200, ['success' => false, 'error' => 'Por favor, complete todos los campos.']);
        }

        // Validar email
        if (!$this->validarEmail($data['email'])) {
            return $this->jsonResponse(200, ['success' => false, 'error' => 'El email no es válido, intente de nuevo.']);
        }

        // Comparar contraseñas
        if ($data['password'] !== $data['password_repeat']) {
            return $this->jsonResponse(200, ['success' => false, 'error' => 'Las contraseñas no coinciden, intente de nuevo.']);
        }

        // Hash de contraseñas
        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        $data['repeat_password'] = $data['password'];

        // Verificar si el usuario existe
        if ($this->userModel->checkUserExists($data['email'])) {
            return $this->jsonResponse(200, ['success' => false, 'error' => 'Usuario registrado, inicia sesión']);
        }

        // Crear usuario
        if ($this->userModel->createUser($data)) {
            $this->utils->sendEmail($data['email']);
            return $this->jsonResponse(200, ['success' => true, 'message' => 'Usuario creado correctamenteo']);
        } else {
            return $this->jsonResponse(200, ['success' => false, 'error' => 'Error al crear el usuario']);
        }
    }


    public function updateDatas($request)
    {
        $data = $request['body'];
        $updateFields = []; // Solo guardará los datos que se deben actualizar
    
        // Si el usuario quiere cambiar la contraseña, verificamos y la encriptamos
        if (!empty($data['password']) && !empty($data['password_repeat'])) {
            if ($data['password'] !== $data['password_repeat']) {
                return $this->utils->jsonResponse(200, ['success' => false, 'error' => 'Las contraseñas no coinciden']);
            }
            $updateFields['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        }
    
        // Agregar otros campos solo si existen en la solicitud
        if (array_key_exists('email', $data)) {
            $updateFields['email'] = $data['email'];
        }
        if (array_key_exists('name', $data)) {
            $updateFields['name'] = $data['name'];
        }
        if (array_key_exists('lastname', $data)) {
            $updateFields['lastname'] = $data['lastname'];
        }
        if (array_key_exists('typeuser', $data)) {
            $updateFields['typeuser'] = $data['typeuser'];
        }
        if (array_key_exists('status', $data)) {
            $updateFields['status'] = $data['status'];
        }
        // Asegurar que el ID del usuario está presente
        if (!array_key_exists('iduser', $data)) {
            return $this->utils->jsonResponse(200, ['success' => false, 'error' => 'ID de usuario no proporcionado']);
        }
        $updateFields['iduser'] = $data['iduser'];
    
        // Si no hay campos para actualizar, devolvemos un error
        if (empty($updateFields)) {
            return $this->utils->jsonResponse(200, ['success' => false, 'error' => 'No se enviaron datos para actualizar.']);
        }
    
        // Llamamos al modelo solo con los campos que realmente se actualizarán
        $updateData = $this->userModel->updateDataUser($updateFields);
    
        if (!$updateData) {
            return $this->utils->jsonResponse(200, ['success' => false, 'error' => 'Error al actualizar los datos: ' . json_encode($updateFields)]);
        }
    
        return $this->utils->jsonResponse(200, ['success' => true, 'message' => 'Datos actualizados']);
    }
    
    public function allUsers()
    {
        try {
            $users = $this->userModel->allUsers();
            if (empty($users)) {
                return $this->utils->jsonResponse(200, ['success' => false,'error' => 'No se encontraron usuarios']);
            }
            return $this->utils->jsonResponse(200, ['success' => true, 'message' =>$users] );
        } catch (\Throwable $th) {
            return $this->utils->jsonResponse(200, ['success' => true, 'error' => $th->getMessage()]);
        }
    }
    public function allOccupations()
    {
        $occupations = $this->userModel->allOccupations();
        if (empty($occupations)) {
            return $this->utils->jsonResponse(200, ['success' => false, 'error' => 'No se encontraron ocupaciones']);
        }
        return $this->utils->jsonResponse(200, ['success' => true, 'message' => $occupations]);
    }
















    public function recoverPassword($request)
    {
        $data = $request['body'];

        // Validar email


        // Buscar usuario por email
        $user = $this->userModel->findUserByEmail($data['email']);
        if (!$user) {

            $this->utils->jsonResponse(200, ["message" => "Ususario no encontrado, introduce una contraseña válida ", "success" => false]);
        }
        $enviarEmail = $this->utils->recoverEmail($data['email']);
        if (!$enviarEmail) {
            $this->utils->jsonResponse(200, ["message" => "Ocurrión un error, intenta de nuevo", "success" => false]);
        }
        $this->utils->jsonResponse(200, ["message" => "Hemos enviado un mensaje a tu bandeja de entrada. Revisa tu correo, sigue los pasos para cambiar tu contraseña y accede para explorar todos nuestros productos.", "success" => true]);
    }
    public function searchEmail($request)
    {
        $data = $request['body'];
        $email = $this->userModel->findUserByEmail($data['email']);
        if (!$email) {
            $this->utils->jsonResponse(200, ["message" => "Usuario no encontrado " . $data['email'], "success" => false]);
        }
        $this->utils->jsonResponse(200, ["message" => "Usuario encontrado " . $data['email'], "success" => true]);
    }
    public function changePassword($request)
    {
        $data = $request['body'];

        // Validar email


        // Buscar usuario por email
        $user = $this->userModel->findUserByEmail($data['email']);
        if (!$user) {

            $this->utils->jsonResponse(200, ["message" => "Correo incorrecto, intente de nuevo ", "success" => false]);
        }
        $enviarEmail = $this->utils->recoverEmail($data['email']);
        if (!$enviarEmail) {
            $this->utils->jsonResponse(200, ["message" => "Ocurrión un error, intenta de nuevo", "success" => false]);
        }
        $this->utils->jsonResponse(200, ["message" => "Hemos enviado un mensaje a tu bandeja de entrada. Revisa tu correo, sigue los pasos para cambiar tu contraseña y accede para explorar todos nuestros productos.", "success" => true]);
    }
    public function activarCuenta($request)
    {
        $data = $request['body'];

        // Validar el email
        if (!$this->validarEmail($data['email'])) {
            return $this->jsonResponse(['status' => 400], ['error' => 'El email no es válido, intente de nuevo.']);
        }

        // Buscar usuario por email
        $user = $this->userModel->findUserByEmail($data['email']);
        if (!$user) {
            return $this->jsonResponse(['status' => 400], ['error' => 'Usuario no encontrado, intenta registrarte']);
        }

        // Actualizar el estado de verificación
        $updated = $this->userModel->updateData("is_verify = 1", "email", $data['email']);

        if ($updated) {
            return $this->jsonResponse(['status' => 200], ['message' => 'Verificación de cuenta exitosa']);
        } else {
            return $this->jsonResponse(['status' => 500], ['error' => 'No se pudo verificar cuenta, intenta de nuevo']);
        }
    }
    private function validarEmail($email)
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }
    private function jsonResponse($status, $data = [])
    {
        // Verificar si $status es un array y contiene la clave 'status'
        if (is_array($status) && isset($status['status'])) {
            $statusCode = $status['status'];
        } else {
            // Si $status no es un array o no contiene la clave 'status', usar $status directamente
            $statusCode = $status;
        }

        // Crear la respuesta combinando el estado y los datos
        $response = array_merge(['status' => $statusCode], $data);

        // Establecer el código de estado HTTP
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($response); // Enviar el JSON con el estado incluido
        exit; // Finaliza el script después de enviar la respuesta
    }


    private function generateToken($user)
    {
        $payload = [
            'exp' => time() + 3600,
            'data' => $user
        ];
        return JWT::encode($payload, 'secret', 'HS256');
    }
    public function searchUserId($request)
    {
        $data = $request['body'];
        $searchUser = $this->userModel->findUserId($data['id_usuario']);
        if (!$searchUser) {
            return $this->utils->jsonResponse(400, ['error' => 'Error al actualizar producto']);
        }

        return $this->utils->jsonResponse(200, ['message' => [$searchUser]]);
    }

    public function updateFotoPerfil($request)
    {
        $data = $request['body'];
        $updateData = $this->userModel->updateDataFoto($data);
        if (!$updateData) {
            return $this->utils->jsonResponse(400, ['error' => $updateData]);
        }
        return $this->utils->jsonResponse(200, ['message' => 'Contraseña actualizada']);
    }
    public function updatePass($request)
    {
        $data = $request['body'];

        // Hash de contraseñas
        if ($data['password'] != $data['repeat_password']) {
            return $this->utils->jsonResponse(400, ['error' => 'Las contraseñas no coinciden']);
        }
        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        $data['repeat_password'] = $data['password'];
        $updateData = $this->userModel->updatePassword($data);
        if (!$updateData) {
            return $this->utils->jsonResponse(400, ['error' => 'Error al actualizar contraseña, itenta nuevamente']);
        }
        return $this->utils->jsonResponse(200, ['message' => 'Tu contraseña se a actualizado']);
    }
    public function updatePassword($request)
    {
        $data = $request['body'];

        // Hash de contraseñas
        if ($data['password'] != $data['repeat_password']) {
            return $this->utils->jsonResponse(200, ['message' => 'Las contraseñas no coinciden', 'success' => false]);
        }
        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        $data['repeat_password'] = $data['password'];
        $updateData = $this->userModel->updatePasswordEmail($data);
        if (!$updateData) {
            return $this->utils->jsonResponse(200, ['message' => 'Error al actualizar contraseña, itenta nuevamente', 'success' => false]);
        }
        return $this->utils->jsonResponse(200, ['message' => 'Tu contraseña se a actualizado', 'success' => true]);
    }
}
