<?php

class SalesModel
{

    private $db;


    public function __construct($db)
    {
        $this->db = $db;
        date_default_timezone_set('America/Bogota');
    }
    public function createSale($data)
    {
        try {
            $stmt = $this->db->prepare("INSERT INTO sales (total, payment_method, userid_sale, created_at) VALUES (?, ?, ?, NOW())");
            $stmt->execute([$data['total'], $data['paymentMethodSelected'], $data['userid']]);
            return $this->db->lastInsertId();
        } catch (\Throwable $th) {
            return false;
        }
    }
    public function createSaleDetails($saleid, $data)
    {
        try {
            // si hay price_offert se usa ese, si no, se usa el price multiplicado por la cantidad
            $stmt = $this->db->prepare("INSERT INTO sale_details (sale_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
            foreach ($data['cart'] as $product) {

                $price = $product['product']['price_offert'] != 0 ? $product['product']['price_offert'] : $product['product']['price'] ;
                $stmt->execute([$saleid, $product['product']['id'], $product['quantity'], $price]);
            }
            return true;
        } catch (\Throwable $th) {
            return false;
        }
    }
    //descontar producto de acuerdo a la cantidad que se compró
    public function discountQuantityproduct($data)
    {
        try {
            $stmt = $this->db->prepare("UPDATE products SET stock = stock - ? WHERE id = ?");
            foreach ($data['cart'] as $product) {
                $stmt->execute([$product['quantity'], $product['product']['id']]);
            }
            return true;
        } catch (\Throwable $th) {
            return false;
        }
    }
    //registrar un cliente en la tabla de clientes
    public function insertDataCustomer($saleid, $data)
    {
        try {
            $stmt = $this->db->prepare("INSERT INTO sale_customers (sale_id, customer_id) VALUES (?, ?)");
            $stmt->execute([$saleid, $data]);
            return true;
        } catch (\Throwable $th) {
            return false;
        }
    }
    // Registrar una nueva venta
    public function registrarVenta($datosVenta)
    {
        try {
            // Iniciar transacción
            $this->db->beginTransaction();

            // 1. Insertar en la tabla de ventas
            $stmtVenta = $this->db->prepare(
                "INSERT INTO sales (total, payment_method, created_at) 
                VALUES (?, ?, NOW())"
            );

            $stmtVenta->execute([
                $datosVenta['total'],
                $datosVenta['metodo_pago']
            ]);

            $ventaId = $this->db->lastInsertId();

            // 2. Asociar cliente si existe
            if (!empty($datosVenta['cliente_id'])) {
                $stmtCliente = $this->db->prepare(
                    "INSERT INTO sale_customers (sale_id, customer_id) 
                    VALUES (?, ?)"
                );
                $stmtCliente->execute([$ventaId, $datosVenta['cliente_id']]);
            }

            // 3. Insertar detalles de la venta
            $stmtDetalle = $this->db->prepare(
                "INSERT INTO sale_details (sale_id, product_id, quantity, price) 
                VALUES (?, ?, ?, ?)"
            );

            foreach ($datosVenta['productos'] as $producto) {
                $stmtDetalle->execute([
                    $ventaId,
                    $producto['id'],
                    $producto['cantidad'],
                    $producto['precio']
                ]);

                // 4. Actualizar stock
                $stmtStock = $this->db->prepare(
                    "UPDATE products SET stock = stock - ? WHERE id = ?"
                );
                $stmtStock->execute([$producto['cantidad'], $producto['id']]);
            }

            // 5. Registrar movimiento de caja
            $stmtCaja = $this->db->prepare(
                "INSERT INTO cash_movements (user_id, sale_id, amount, type, description) 
                VALUES (?, ?, ?, 'Ingreso', ?)"
            );
            $stmtCaja->execute([
                $datosVenta['usuario_id'],
                $ventaId,
                $datosVenta['total'],
                "Venta #" . $ventaId
            ]);

            // Confirmar transacción
            $this->db->commit();

            return $ventaId;
        } catch (\Exception $e) {
            // Revertir transacción en caso de error
            $this->db->rollBack();
            throw $e;
        }
    }

    // Obtener detalles de una venta específica
    public function obtenerDetalleVenta($ventaId)
{
    try {
        // Obtener los detalles de la venta con productos y cliente
        $stmtVenta = $this->db->prepare(
            "SELECT sales.total, sales.userid_sale, sales.payment_method, sales.created_at,
                    products.id as product_id, products.name, products.description, products.brand_id, products.category_id, 
                    products.photo, products.price as price_product, products.price_offert, products.stock, 
                    sale_details.sale_id, sale_details.quantity, sale_details.price as price_sale,
                    sale_customers.customer_id,
                    customers.name as customer_name, customers.email as customer_email, customers.phone as customer_phone
             FROM sales
             INNER JOIN sale_details ON sales.id = sale_details.sale_id
             INNER JOIN products ON sale_details.product_id = products.id
             LEFT JOIN sale_customers ON sales.id = sale_customers.sale_id
             LEFT JOIN customers ON sale_customers.customer_id = customers.id
             WHERE sales.id=?"
        );

        $stmtVenta->execute([$ventaId]);
        $ventas = $stmtVenta->fetchAll(PDO::FETCH_ASSOC);

        if (empty($ventas)) {
            return false;
        }

        // Estructurar la respuesta en el formato solicitado
        $venta = [
            "total" => $ventas[0]["total"],
            "userid_sale" => $ventas[0]["userid_sale"],
            "payment_method" => $ventas[0]["payment_method"],
            "created_at" => $ventas[0]["created_at"]
        ];

        // Datos del cliente
        $cliente = [
            "customer_id" => $ventas[0]["customer_id"] ?? null,
            "name" => $ventas[0]["customer_name"] ?? null,
            "email" => $ventas[0]["customer_email"] ?? null,
            "phone" => $ventas[0]["customer_phone"] ?? null
        ];

        $products = [];
        $saleDetails = [];

        foreach ($ventas as $ventaRow) {
            $products[] = [
                "id" => $ventaRow["product_id"],
                "name" => $ventaRow["name"],
                "description" => $ventaRow["description"],
                "brand_id" => $ventaRow["brand_id"],
                "category_id" => $ventaRow["category_id"],
                "photo" => $ventaRow["photo"],
                "price" => $ventaRow["price_product"],
                "price_offert" => $ventaRow["price_offert"],
                "stock" => $ventaRow["stock"]
            ];

            $saleDetails[] = [
                "sale_id" => $ventaRow["sale_id"],
                "product_id" => $ventaRow["product_id"],
                "quantity" => $ventaRow["quantity"],
                "price_sale" => $ventaRow["price_sale"]
            ];
        }

        return [
            "venta" => $venta,
            "cliente" => $cliente,
            "product" => $products,
            "sale_details" => $saleDetails
        ];
    } catch (\Exception $e) {
        throw $e;
    }
}

    
    //obtener amounts actuales
    public function getAmounts($fecha)
    {
        $stmt = $this->db->prepare("SELECT * FROM sales WHERE DATE(created_at) = ?");
        $stmt->execute([$fecha]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    // Obtener todas las ventas (con paginación opcional)
    public function listarVentas($limite = 20, $pagina = 1, $fecha = null)
    {
        $offset = ($pagina - 1) * $limite;
    
        try {
            $query = "SELECT us.id, us.name, us.username, us.role, 
                             sales.id AS sale_id, sales.total, sales.created_at  
                      FROM users AS us  
                      INNER JOIN sales ON sales.userid_sale = us.id
                      WHERE DATE(sales.created_at) = :fecha
                      ORDER BY sales.created_at DESC
                      LIMIT :limite OFFSET :offset";
    
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':fecha', $fecha);
            $stmt->bindParam(':limite', $limite, PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
    
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (\Exception $e) {
            throw $e;
        }
    }
    


    // Registrar movimiento de caja
    public function registrarMovimientoCaja($datos)
    {
        try {
            $stmt = $this->db->prepare(
                "INSERT INTO cash_movements (user_id, sale_id, amount, type, description) 
                    VALUES (?, ?, ?, ?, ?)"
            );

            $stmt->execute([
                $datos['usuario_id'],
                $datos['venta_id'] ?? null,
                $datos['monto'],
                $datos['tipo'], // 'Ingreso' o 'Egreso'
                $datos['descripcion']
            ]);

            return $this->db->lastInsertId();
        } catch (\Exception $e) {
            throw $e;
        }
    }

    // Abrir caja
    public function abrirCaja($datos)
    {
        try {
            $fechaColombia = date('Y-m-d H:i:s');
            $stmt = $this->db->prepare(
                "INSERT INTO cash_registers (user_id, opening_balance, status, created_at) 
                VALUES (?, ?, 'Abierta', ?)"
            );

            $stmt->execute([
                $datos['usuario_id'],
                $datos['monto_inicial'],
                $fechaColombia
            ]);

            return $this->db->lastInsertId();
        } catch (\Exception $e) {
            throw $e;
        }
    }
    //listar cajas
    public function listarCajas()
    {
        $stmt = $this->db->prepare("SELECT cash_registers.*, users.name, users.role FROM cash_registers INNER JOIN users ON cash_registers.user_id = users.id ORDER BY cash_registers.created_at DESC");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    // Cerrar caja
    public function cerrarCaja($datos)
    {
        try {
            $stmt = $this->db->prepare(
                "UPDATE cash_registers 
                SET closing_balance = ?, 
                    status = 'Cerrada', 
                    closed_at = NOW() 
                WHERE id = ? AND status = 'Abierta'"
            );

            $stmt->execute([
                $datos['monto_final'],
                $datos['caja_id']
            ]);
            return $stmt->rowCount() > 0;
        } catch (\Exception $e) {
            throw $e;
        }
    }

    // Obtener movimientos de caja
    public function obtenerMovimientosCaja()
    {
        try {
            $sql = "SELECT * FROM cash_movements ORDER BY created_at DESC";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    // Obtener estado actual de la caja
    public function   obtenerEstadoCaja()
    {
        try {
            $sql = "SELECT * FROM cash_registers WHERE status = 'Abierta' ORDER BY created_at DESC LIMIT 1";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
    
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (\Exception $e) {
            throw $e;
        }
    }
}
