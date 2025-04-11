-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:8889
-- Tiempo de generación: 11-04-2025 a las 04:28:18
-- Versión del servidor: 8.0.35
-- Versión de PHP: 8.2.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `licoreria`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `brands`
--

CREATE TABLE `brands` (
  `id_brand` int NOT NULL,
  `name_brand` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at_brand` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `brands`
--

INSERT INTO `brands` (`id_brand`, `name_brand`, `created_at_brand`) VALUES
(1, 'Sprite', '2025-03-27 06:25:50');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cash_movements`
--

CREATE TABLE `cash_movements` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `sale_id` int DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `type` enum('Ingreso','Egreso') COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cash_movements`
--

INSERT INTO `cash_movements` (`id`, `user_id`, `sale_id`, `amount`, `type`, `description`, `created_at`) VALUES
(1, 1, 1, 12.30, 'Ingreso', 'Venta de productos ', '2025-03-27 06:31:54'),
(2, 2, 2, 98.40, 'Ingreso', 'Venta de productos ', '2025-03-30 00:55:44'),
(3, 2, 3, 12.30, 'Ingreso', 'Venta de productos ', '2025-04-02 04:50:05');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cash_registers`
--

CREATE TABLE `cash_registers` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `opening_balance` decimal(10,2) NOT NULL,
  `closing_balance` decimal(10,2) DEFAULT NULL,
  `status` enum('Abierta','Cerrada') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Abierta',
  `created_at` datetime DEFAULT NULL,
  `closed_at` datetime DEFAULT NULL,
  `balance_final` decimal(10,0) DEFAULT NULL,
  `notas` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `egresos` decimal(10,2) DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cash_registers`
--

INSERT INTO `cash_registers` (`id`, `user_id`, `opening_balance`, `closing_balance`, `status`, `created_at`, `closed_at`, `balance_final`, `notas`, `egresos`) VALUES
(1, 1, 40.30, 14.00, 'Cerrada', '2025-03-27 01:31:39', '2025-04-02 00:00:27', NULL, NULL, 0.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categories`
--

CREATE TABLE `categories` (
  `id_category` int NOT NULL,
  `name_cat` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description_cat` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categories`
--

INSERT INTO `categories` (`id_category`, `name_cat`, `description_cat`, `created_at`) VALUES
(1, 'Gaseosa', NULL, '2025-03-27 06:25:45');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `customers`
--

CREATE TABLE `customers` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `document` varchar(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `customers`
--

INSERT INTO `customers` (`id`, `name`, `phone`, `document`, `email`, `created_at`) VALUES
(1, 'Efrael Villanueva', '915068001', '70934018', 'efrael2001@gmail.com', '2025-03-27 06:31:54'),
(2, 'efrael', '91450823', '9312', '', '2025-03-30 00:55:44'),
(3, 'Tania', '915068001', '123456789', 'tania@gmail.com', '2025-04-02 04:50:05');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `payment_method`
--

CREATE TABLE `payment_method` (
  `id_payment` int NOT NULL,
  `name_payment` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `payment_method`
--

INSERT INTO `payment_method` (`id_payment`, `name_payment`) VALUES
(1, 'Efectivo'),
(2, 'Yape'),
(3, 'Plin'),
(4, 'Transferencia');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `category_id` int NOT NULL,
  `stock_unidades` int NOT NULL,
  `photo` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `brand_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `category_id`, `stock_unidades`, `photo`, `created_at`, `updated_at`, `brand_id`) VALUES
(1, 'Gaseosa Sprite 1 litro', 'Gaseosa', 1, 0, '67e4f0a739172.webp', '2025-03-27 06:31:03', '2025-04-02 04:50:05', 1),
(2, 'prueba', 'asdasd', 1, 0, 'placeholder.svg', '2025-04-02 05:19:03', '2025-04-02 05:19:03', NULL),
(3, 'Efrael', 'a', 1, 0, 'placeholder.svg', '2025-04-02 05:20:05', '2025-04-02 05:20:05', NULL),
(4, 'Hola', 'asd', 1, 0, 'placeholder.svg', '2025-04-02 05:21:24', '2025-04-02 05:21:24', 1),
(5, 'Cintas Impresas', 'asdad', 1, 0, NULL, '2025-04-02 05:24:38', '2025-04-02 05:24:38', 1),
(6, 'test', 'asdasd', 1, 0, NULL, '2025-04-02 05:27:54', '2025-04-02 05:27:54', 1),
(7, 'asd', 'asdasd', 1, 0, NULL, '2025-04-02 05:29:58', '2025-04-02 05:29:58', 1),
(10, 'hola', 'hola', 1, 1, '67f897799f11e.webp', '2025-04-11 04:15:54', '2025-04-11 04:15:54', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `product_variants`
--

CREATE TABLE `product_variants` (
  `id_variants` int NOT NULL,
  `id_product` int NOT NULL,
  `presentation` enum('unidad','caja','sixpack') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `quantity_per_pack` int NOT NULL DEFAULT '1',
  `price_ant` decimal(10,2) NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `price_offert` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `product_variants`
--

INSERT INTO `product_variants` (`id_variants`, `id_product`, `presentation`, `quantity_per_pack`, `price_ant`, `price`, `price_offert`) VALUES
(1, 1, 'caja', 16, 0.00, 120.00, 0.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sales`
--

CREATE TABLE `sales` (
  `id` int NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `payment_method` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `userid_sale` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sales`
--

INSERT INTO `sales` (`id`, `total`, `payment_method`, `created_at`, `userid_sale`) VALUES
(1, 12.30, 3, '2025-03-27 06:31:54', 1),
(2, 98.40, 1, '2025-03-30 00:55:44', 2),
(3, 12.30, 1, '2025-04-02 04:50:05', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sale_customers`
--

CREATE TABLE `sale_customers` (
  `sale_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sale_customers`
--

INSERT INTO `sale_customers` (`sale_id`, `customer_id`, `created_at`) VALUES
(1, 1, '2025-03-27 06:31:54'),
(2, 2, '2025-03-30 00:55:44'),
(3, 3, '2025-04-02 04:50:05');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sale_details`
--

CREATE TABLE `sale_details` (
  `id` int NOT NULL,
  `sale_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sale_details`
--

INSERT INTO `sale_details` (`id`, `sale_id`, `product_id`, `quantity`, `price`, `created_at`) VALUES
(1, 1, 1, 1, 12.30, '2025-03-27 06:31:54'),
(2, 2, 1, 8, 12.30, '2025-03-30 00:55:44'),
(3, 3, 1, 1, 12.30, '2025-04-02 04:50:05');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `suppliers`
--

CREATE TABLE `suppliers` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `contact_info` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('Administrador','Vendedor') COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `date_login` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `password`, `role`, `created_at`, `date_login`, `status`) VALUES
(1, 'Efrael Villanueva', 'efrael', '$2y$10$Aa0nlUjl5g3Vmp.XxVMbyuyKe7ECS0wZbrvwwd0e.nCEpY/eNB6Q.', 'Administrador', '2025-03-27 06:22:06', NULL, 1),
(2, 'Usuario test', 'test', '$2y$10$Z3Zh3mdYlCMReD9wHqP9y.DfUdnOl3tLZkUvAj9qmFZtttZD6V1x2', 'Vendedor', '2025-03-30 00:55:12', NULL, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id_brand`),
  ADD UNIQUE KEY `name` (`name_brand`);

--
-- Indices de la tabla `cash_movements`
--
ALTER TABLE `cash_movements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `sale_id` (`sale_id`);

--
-- Indices de la tabla `cash_registers`
--
ALTER TABLE `cash_registers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id_category`),
  ADD UNIQUE KEY `name` (`name_cat`);

--
-- Indices de la tabla `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `payment_method`
--
ALTER TABLE `payment_method`
  ADD PRIMARY KEY (`id_payment`);

--
-- Indices de la tabla `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `brand_id` (`brand_id`);

--
-- Indices de la tabla `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id_variants`),
  ADD KEY `id_product` (`id_product`);

--
-- Indices de la tabla `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payment_method` (`payment_method`);

--
-- Indices de la tabla `sale_customers`
--
ALTER TABLE `sale_customers`
  ADD PRIMARY KEY (`sale_id`,`customer_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indices de la tabla `sale_details`
--
ALTER TABLE `sale_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sale_id` (`sale_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indices de la tabla `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `brands`
--
ALTER TABLE `brands`
  MODIFY `id_brand` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `cash_movements`
--
ALTER TABLE `cash_movements`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `cash_registers`
--
ALTER TABLE `cash_registers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `categories`
--
ALTER TABLE `categories`
  MODIFY `id_category` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `payment_method`
--
ALTER TABLE `payment_method`
  MODIFY `id_payment` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id_variants` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `sale_details`
--
ALTER TABLE `sale_details`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cash_movements`
--
ALTER TABLE `cash_movements`
  ADD CONSTRAINT `cash_movements_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cash_movements_ibfk_2` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `cash_registers`
--
ALTER TABLE `cash_registers`
  ADD CONSTRAINT `cash_registers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id_category`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id_brand`) ON DELETE SET NULL;

--
-- Filtros para la tabla `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`id_product`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sale_customers`
--
ALTER TABLE `sale_customers`
  ADD CONSTRAINT `sale_customers_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sale_customers_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sale_details`
--
ALTER TABLE `sale_details`
  ADD CONSTRAINT `sale_details_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sale_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
