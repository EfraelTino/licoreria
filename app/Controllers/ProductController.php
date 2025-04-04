<?php


require_once './app/Models/Product.php';
require_once './config/Utils.php';

class   ProductController
{
    private $productModel;
    private $utils;
    public function __construct($db)
    {
        $this->productModel = new  Product($db);
        $this->utils = new Utils();
    }
    public function mostrarProductos()
    {
        try {
            $productos = $this->productModel->mostrarProductos();

            // Aquí se envía un array con un key "data" que contiene los productos
            if(empty($productos)){
                return $this->utils->jsonResponse(200, ['message' => 'No se encontraron productos', 'success'=>false]);
            }
            return $this->utils->jsonResponse(200, ['message' => $productos, 'success'=>true]);
        } catch (\Throwable $th) {
            $this->utils->jsonResponse(200, ['message' => $th->getMessage(), 'success'=>false]);
        }
    }
    //OBTENER METODOS DE PAGO
    public function obtenerMetodosPago()
    {
        $metodosPago = $this->productModel->obtenerMetodosPago();
        if(empty($metodosPago)){
            return $this->utils->jsonResponse(200, ['message' => 'No se encontraron métodos de pago', 'success'=>false]);
        }
        return $this->utils->jsonResponse(200, ['message' => $metodosPago, 'success'=>true]);
    }
    public function crearProducto($request)
    {
        $data = $request['body'];
        
        // Validar datos mínimos requeridos
        if (empty($data['name']) || empty($data['price']) || empty($data['id_category'])) {
            return $this->utils->jsonResponse(200, [
                'message' => 'Faltan datos obligatorios (nombre, precio, categoría)',
                'success' => false
            ]);
        }
        $infoProducto = [
            'nombre' => $data['name'],
            'descripcion' => $data['description'],
            'categoria_id' => $data['id_category'],
            'precio' => $data['price'],
            'precio_oferta' => $data['price_offert'],
            'stock' => $data['stock'],
            'foto' => $data['photo'],
            'brand_id' => $data['id_brand'],
        ];

        $crearProducto = $this->productModel->insertarProducto($infoProducto);
        if(!$crearProducto){
            return $this->utils->jsonResponse(200, ['message' => 'Error al crear producto, intente nuevamente', 'success' => false]);
        }
          return $this->utils->jsonResponse(200, ['message' => 'Producto creado correctamente', 'success' => true]);
        

        

    }
    public function uploadFile()
    {
        // Validar datos mínimos requeridos
        $subida = $this->utils->convertirImagen($_FILES['photo']);
        if($subida){
            return $this->utils->jsonResponse(200, ['message' =>$subida, 'success' => true]);
        }
        return $this->utils->jsonResponse(200, ['message' => 'Error al subir la imagen', 'success'=>false]);


    }


    
    public function creatCategoria($request)
    {
        $data = $request['body'];
        if(empty($data['name_cat'])){
            return $this->utils->jsonResponse(200, ['message' => 'El nombre de la categoría es requerido', 'success' => false]);
        }
        // Inserta el producto
        $insertdata = $this->productModel->insertCategoria($data);
        if (!$insertdata) {
            return $this->utils->jsonResponse(200, ['message' => 'Error al crear categoría', 'success' => false]);
        }

        return $this->utils->jsonResponse(200, ['message' => 'Categoria se a creado', 'success'=>true]);
   
    }    
    //Editar categoría
    public function editarCategoria($request)
    {
        $data = $request['body'];
        $categoria = $this->productModel->buscarCategoriaPorId($data['id_category']);
        if(!$categoria){
            return $this->utils->jsonResponse(404, ['message' => 'Categoria no encontrada', 'success' => false]);
        }
        $actualizar = $this->productModel->actualizarCategoria($data);
        return $this->utils->jsonResponse(200, ['message' => 'Categoria actualizada correctamente', 'success' => true]);
    }
    //Eliminar categoría
    public function eliminarCategoria($request)
    {
        $data = $request['body'];
        $categoria = $this->productModel->buscarCategoriaPorId($data['id_category']);
        if(!$categoria){
            return $this->utils->jsonResponse(404, ['message' => 'Categoria no encontrada', 'success' => false]);
        }
        $eliminar = $this->productModel->eliminarCategoria($data['id_category']);
        return $this->utils->jsonResponse(200, ['message' => 'Categoria eliminada correctamente', 'success' => true]);
    }
    public function productoPorCategoria($request){
        $data = $request['body'];
        try {
            $productos = $this->productModel->obtenerProductoPorCategoria($data['categoria']);
            if (empty($productos)) {
                return $this->utils->jsonResponse(['status' => 200], 
                ['message' => 'No se encontraron productos de esta categoría', 'success' => false]);
            }
            return $this->utils->jsonResponse(['status' => 200], ['message' => $productos , 'success' => true]);
        } catch (\Throwable $th) {
            return $this->utils->jsonResponse(['status' => 500], ['message' => $th->getMessage(), 'success' => false]);
        }
    
    }
    public function actualizarProducto($request)
    {
        $data = $request['body'];
        $producto = $this->productModel->buscarProductoPorId($data['idProduct']);

        if (!$producto) {
            return $this->utils->jsonResponse(404, ['message' => 'Producto no encontrado', 'success' => false]);
        }

        $actualizar = $this->productModel->actualizarProducto($data);


        return $this->utils->jsonResponse(200, ['message' => 'Producto actualizado correctamente', 'success' => true]);
    }
    public function mostrarCategoria()
    {
        try {
            $categorias = $this->productModel->mostrarCategoria();

            // Aquí se envía un array con un key "data" que contiene los productos
           if(empty($categorias)){
            return $this->utils->jsonResponse(200, ['message' => 'No se encontraron categorías', 'success'=>false]);
           }
           return $this->utils->jsonResponse(200, ['message' => $categorias, 'success'=>true]);
        } catch (\Throwable $th) {
            $this->utils->jsonResponse(500, ['error' => $th->getMessage(), 'success'=>false]);
        }
    }
    //Mostrar marcas
    public function mostrarMarca()
    {
        try {
            $marcas = $this->productModel->mostrarMarca();
            if(empty($marcas)){
                return $this->utils->jsonResponse(200, ['message' => 'No se encontraron marcas', 'success'=>false]);
            }
            return $this->utils->jsonResponse(200, ['message' => $marcas, 'success' => true]);
        } catch (\Throwable $th) {  
            return $this->utils->jsonResponse(500, ['error' => $th->getMessage(), 'success'=>false]);
        }
    }
    //Crear marca
    public function crearMarca($request)
    {
        $data = $request['body'];
        $marca = $this->productModel->crearMarca($data);
        if(!$marca){
            return $this->utils->jsonResponse(200, ['message' => 'Error al crear marca', 'success' => false]);
        }
        return $this->utils->jsonResponse(200, ['message' => 'Marca creada correctamente', 'success' => true]);
    }
    //Editar marca
    public function editarMarca($request)
    {
        $data = $request['body'];
        $marca = $this->productModel->buscarMarcaPorId($data['id_brand']);
        if(!$marca){
            return $this->utils->jsonResponse(404, ['message' => 'Marca no encontrada', 'success' => false]);
        }
        $actualizar = $this->productModel->actualizarMarca($data);
        return $this->utils->jsonResponse(200, ['message' => 'Marca actualizada correctamente', 'success' => true]);
    }
    //Eliminar marca
    public function eliminarMarca($request)
    {
        $data = $request['body'];
        $marca = $this->productModel->buscarMarcaPorId($data['id_brand']);
        if(!$marca){
            return $this->utils->jsonResponse(404, ['message' => 'Marca no encontrada', 'success' => false]);
        }
        $eliminar = $this->productModel->eliminarMarca($data['id_brand']);
        return $this->utils->jsonResponse(200, ['message' => 'Marca eliminada correctamente', 'success' => true]);
    }
    
    // Buscar producto
    public function buscarProduct($producto)
    {
        try {
            $result = $this->productModel->buscarProducto($producto);
            if ($result) {
                $this->utils->jsonResponse(200, ['data' => $result, 'success' => true]);
            } else {
                $this->utils->jsonResponse(404, ['error' => 'Producto no encontrado1', 'success' => false]);
            }
        } catch (\Throwable $th) {
            $this->utils->jsonResponse(500, ['error' => $th->getMessage()]);
        }
    }
    //Detalle de producto x id
    public function detalleProducto($id)
    {
        try {
            // Verificación estricta del ID
            if (!is_numeric($id)) {
                return $this->utils->jsonResponse(400, ['error' => 'Producto no encontrado2', 'success' => false]);
            }

            $producto = $this->productModel->buscarProductoPorId($id);
            if (!$producto) {
                return $this->utils->jsonResponse(404, ['error' => 'Producto no encontrado3', 'success' => false]);
            }

            $detalle = $this->productModel->detalleProducto(['id' => $id]);
            return $this->utils->jsonResponse(200, ['data' => $detalle, 'success' => true]);
        } catch (\Throwable $th) {
            return $this->utils->jsonResponse(500, ['error' => $th->getMessage(), 'success' => false]);
        }
    }

   
    public function desactivarProducto($request)
    {
        $data = $request['body'];
        
        if (empty($data['id'])) {
            return $this->utils->jsonResponse(200, [
                'message' => 'ID de producto requerido',
                'success' => false
            ]);
        }
        
        try {
            $eliminado = $this->productModel->eliminarProducto($data['id']);
            
            if (!$eliminado) {
                return $this->utils->jsonResponse(200, [
                    'message' => 'No se pudo eliminar el producto', 
                    'success' => false
                ]);
            }
            
            return $this->utils->jsonResponse(200, [
                'message' => 'Producto eliminado correctamente', 
                'success' => true
            ]);
        } catch (\Throwable $th) {
            return $this->utils->jsonResponse(200, [
                'message' => $th->getMessage(),
                'success' => false
            ]);
        }
    }
}
