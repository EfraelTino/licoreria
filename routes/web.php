<?php

require_once './app/Controllers/UserController.php';
require_once './app/Controllers/ProductController.php';
require_once './app/Controllers/SalesController.php';
require_once './config/database.php';

// No crear una nueva instancia de Router aquí
// $router ya está disponible desde index.php

$db = getDBConnection(); // Obtener la conexión a la base de datos
$userController = new UserController($db); // Crear instancia del controlador
$productoController = new ProductController($db);
$salesController = new SalesController($db);

$router->get('/', function () {
    echo "Welcome to the API!";
});


$router->post('/login', function () use ($userController) {
    $data = json_decode(file_get_contents('php://input'), true);
    echo $userController->loginUser(['body' => $data]);
});
$router->post('/create-user', function () use ($userController) {
    $data = json_decode(file_get_contents('php://input'), true);

    echo $userController->crearUsuario(['body' => $data]);
});
$router->patch('/update-data', function () use ($userController) {
    $data = json_decode(file_get_contents('php://input'), true);
    echo $userController->updateDatas(['body' => $data]);
});

$router->get('/usuarios', function () use ($userController) {
    echo $userController->allUsers();
});

//OBTENER PRODUCTOS
$router->get('/productos', function () use ($productoController) {
    echo $productoController->mostrarProductos();
});

//PRODUCTO BY ID
$router->get('/producto/:id', function ($id) use ($productoController) {
    echo $productoController->detalleProducto($id);
});
//OBTENER METODOS DE PAGO
$router->get('/metodos-pago', function () use ($productoController) {
    echo $productoController->obtenerMetodosPago();
});
//BUSCAR PRODUCTO
$router->post('/buscar-producto', function () use ($productoController) {
    $data = json_decode(file_get_contents('php://input'), true);
    echo $productoController->buscarProduct($data['producto']);
});

//CREAR PRODUCTO
$router->post('/crear-producto', function () use ($productoController) {
    $data = json_decode(file_get_contents('php://input'), true);
    echo $productoController->crearProducto(['body' => $data]);
});
// CARGAR IMAGEN
$router->post('/subir-image', function () use ($productoController) {
    $data = json_decode(file_get_contents('php://input'), true);
    echo $productoController->uploadFile(['body' => $data]);
});
//ACTUALIZAR PRODUCTO
$router->put('/actualizar-producto', function () use ($productoController) {
    $data = json_decode(file_get_contents('php://input'), true);
    echo $productoController->actualizarProducto(['body' => $data]);
});

//ELIMINAR PRODUCTO (Desactivar)
$router->put('/eliminar-producto', function () use ($productoController) {
    $data = json_decode(file_get_contents('php://input'), true);
    echo $productoController->desactivarProducto(['body' => $data]);
});

//CATEGORÍAS
$router->get('/categorias', function () use ($productoController) {
    echo $productoController->mostrarCategoria();
});

//MARCAS
$router->get('/marcas', function () use ($productoController) {
    echo $productoController->mostrarMarca();
});
//CREAR MARCA
$router->post('/crear-marca', function () use ($productoController) {
    $data = json_decode(file_get_contents('php://input'), true);
    echo $productoController->crearMarca(['body' => $data]);
});
//EDITAR MARCA
$router->put('/editar-marca', function () use ($productoController) {
    $data = json_decode(file_get_contents('php://input'), true);
    echo $productoController->editarMarca(['body' => $data]);
});
//ELIMINAR MARCA
$router->post('/eliminar-marca', function () use ($productoController) {
    $data = json_decode(file_get_contents('php://input'), true);
    echo $productoController->eliminarMarca(['body' => $data]);
});
//CREAR CATEGORÍA
$router->post('/crear-categoria', function () use ($productoController) {
    $data = json_decode(file_get_contents('php://input'), true);
    echo $productoController->creatCategoria(['body' => $data]);
});
//EDITAR CATEGORÍA
$router->put('/editar-categoria', function () use ($productoController) {
    $data = json_decode(file_get_contents('php://input'), true);
    echo $productoController->editarCategoria(['body' => $data]);
});
//ELIMINAR CATEGORÍA
$router->post('/eliminar-categoria', function () use ($productoController) {
    $data = json_decode(file_get_contents('php://input'), true);
    echo $productoController->eliminarCategoria(['body' => $data]);
});
$router->post('/productos-categoria', function () use ($productoController) {
    $data = json_decode(file_get_contents('php://input'), true);
    echo $productoController->productoPorCategoria(['body' => $data]);
});

//CREAR VENTA
$router->post('/registrar-venta', function () use ($salesController) {
    $data = json_decode(file_get_contents('php://input'), true);
    echo $salesController->procesarVenta(['body' => $data]);
});


$router->post('/ventas', function () use ($salesController) {
    $data = json_decode(file_get_contents('php://input'), true);
    echo $salesController->obtenerDetalleVenta(['body' => $data]);
});
$router->post('/amount-day', function () use ($salesController) {
    $data = json_decode(file_get_contents('php://input'), true);
    echo $salesController->amountDay(['body' => $data]);
});
$router->post('/listar-ventas', function () use ($salesController) {
    $data = json_decode(file_get_contents('php://input'), true);
    echo $salesController->listarVentas(['body' => $data]);
});

// RUTAS PARA CAJA

$router->post('/abrir-caja', function () use ($salesController) {
    $data = json_decode(file_get_contents('php://input'), true);
    echo $salesController->abrirCaja(['body' => $data]);
});
//verificar si la caja esta abierta
$router->post('/verificar-caja', function () use ($salesController) {
    $data = json_decode(file_get_contents('php://input'), true);
    echo $salesController->verificarCaja(['body' => $data]);
});
$router->post('/cerrar-caja', function () use ($salesController) {
    $data = json_decode(file_get_contents('php://input'), true);
    echo $salesController->cerrarCaja(['body' => $data]);
});

$router->post('/registrar-movimiento', function () use ($salesController) {
    $data = json_decode(file_get_contents('php://input'), true);
    echo $salesController->registrarMovimientoCaja(['body' => $data]);
});

$router->post('/movimientos-caja', function () use ($salesController) {
    $data = json_decode(file_get_contents('php://input'), true);
    echo $salesController->obtenerMovimientosCaja(['body' => $data]);
});

$router->post('/estado-caja', function () use ($salesController) {
    $data = json_decode(file_get_contents('php://input'), true);
    echo $salesController->obtenerEstadoCaja(['body' => $data]);
});
