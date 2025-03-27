import { useState, useEffect } from "react"
import { Filter, Loader2, Search, ShoppingCart } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CartItem } from "./pos/cart-item"
import { CategoryButton } from "./pos/category-button"
import { Checkout } from "./pos/checkout"
import { ProductCard } from "./pos/product-card";
import { getDatas, postDatas } from "@/api/api"
import { Categories, Products } from "@/lib/types"
import { HedaerGeneral } from "./header-general"
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "./ui/card"

export default function PosSystem() {
    const [cart, setCart] = useState<Array<{ product: (typeof productos)[0]; quantity: number }>>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [activeCategory, setActiveCategory] = useState<string>("all")
    const [showCheckout, setShowCheckout] = useState(false)
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<{
        errorCategorie: string,
        errorProducts: string,
        errorPaymentMethod: string,
    }>({
        errorCategorie: "",
        errorProducts: "",
        errorPaymentMethod: "",
    });
    const [paymentMethod, setPaymentMethod] = useState<{ id_payment: number, name_payment: string }[]>([])
    const [paymentMethodSelected, setPaymentMethodSelected] = useState<{ id_payment: number, name_payment: string } | null>(null)
    const [productos, setProductos] = useState<Products[]>([]);
    const [categories, setCategories] = useState<Categories[]>([]);
    const [showFilters, setShowFilters] = useState(false)
    const [showCart, setShowCart] = useState(false)
    const [cajaAbierta, setCajaAbierta] = useState(false)
    console.log(cajaAbierta)
    const fetchCaja = async () => {
        const response = await postDatas('/verificar-caja', {})
        console.log(response)
        if (response.success) {
            setCajaAbierta(true)
        } else {
            toast.error(response.message, { position: "top-center" })
            setCajaAbierta(false)
        }
    }

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await getDatas("/productos");
            if (response.success) {
                setError(prev => ({
                    ...prev,
                    errorProducts: "",
                }));
                return setProductos(response.message);
            }
            setError(prev => ({
                ...prev,
                errorProducts: response.message,
            }));
        } catch {
            setError(prev => ({
                ...prev,
                errorProducts: "Error al obtener los productos",
            }));
        } finally {
            setLoading(false);
        }
    }

    const fetchPaymentMethods = async () => {
        try {
            const response = await getDatas("/metodos-pago");
            if (response.success) {
                return setPaymentMethod(response.message);
            }
            setError(prev => ({
                ...prev,
                errorPaymentMethod: response.message,
            }));
        } catch {
            setError(prev => ({
                ...prev,
                errorPaymentMethod: "Error al obtener los métodos de pago",
            }));
        }
    }
    const fetchCategories = async () => {
        try {
            const response = await getDatas("/categorias");
            if (response.success) {
                setError(prev => ({
                    ...prev,
                    errorCategorie: "",
                }));
                return setCategories(response.message);
            }
            setError(prev => ({
                ...prev,
                errorCategorie: response.message,
            }));
        } catch {
            setError(prev => ({
                ...prev,
                errorCategorie: "Error al obtener las categorías",
            }));
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchPaymentMethods();
        fetchCaja()
    }, []);



    const filteredProducts = productos.filter((product) => {
        const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = activeCategory === "all" || String(product.category_id) === activeCategory
        return matchesSearch && matchesCategory
    })
    const addToCart = (product: (typeof productos)[0]) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.product.id === product.id)

            // Obtener la cantidad total en el carrito
            const currentQuantity = existingItem ? existingItem.quantity : 0

            // Validar si hay stock disponible
            if (currentQuantity >= (product.stock || 0)) {
                toast.error("No hay suficiente stock disponible", {
                    position: "top-center",
                })
                return prevCart
            }

            if (existingItem) {
                return prevCart.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            } else {
                return [...prevCart, { product, quantity: 1 }]
            }
        })
    }



    const removeFromCart = (productId: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId))
    }

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId)
            return
        }

        // Encontrar el producto en el carrito
        const cartItem = cart.find(item => item.product.id === productId)
        if (!cartItem) return

        // Encontrar el producto original para verificar el stock
        const product = productos.find(p => p.id === productId)
        if (!product) return

        // Verificar si hay suficiente stock
        if (quantity > (product.stock || 0)) {
            toast.error("No hay suficiente stock disponible", {
                position: "top-center",
            })
            return
        }

        setCart((prevCart) => prevCart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
        ))
    }

    const clearCart = () => {
        setCart([])
    }

    const subtotal = cart.reduce((sum, item) => sum + (((item.product.price_offert ?? 0) != 0 ? (item.product.price_offert ?? 0) : (item.product.price || 0)) * item.quantity), 0)
    // const tax = subtotal * 0.08 // 8% tax rate
    const total = subtotal // Definir total para el checkout

    const handleCheckout = () => {
        if (!paymentMethodSelected) {
            toast.error("Seleccione un método de pago", {
                position: "top-center",
            })
            return
        }
        setShowCheckout(true)
    }
    const handlePaymentMethod = (value: string) => {
        const paymentMethodSelected = paymentMethod.find(payment => payment.id_payment === Number(value))
        if (!paymentMethodSelected) {
            toast.error("Seleccione un método de pago")
            return
        }
        setPaymentMethodSelected(paymentMethodSelected)
    }

    const handlePaymentComplete = () => {
        clearCart()
        setShowCheckout(false)
    }
    return (
        <div className="flex h-screen flex-col">
            {/* Header */}
            <HedaerGeneral />

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Products Section */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* Search and Categories */}
                    <div className="border-b p-4">
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button className="md:hidden" onClick={() => setShowFilters(true)}>
                            <Filter className="h-4 w-4" />   Filtros
                        </Button>
                        <Sheet open={showFilters} onOpenChange={setShowFilters}>
                            <SheetContent side="left" className="w-[300px]">
                                <SheetHeader>
                                    <SheetTitle className="text-sm font-bold">Filtrar productos</SheetTitle>
                                </SheetHeader>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {
                                        loading ? (
                                            <div className="flex h-full items-center justify-center">
                                                <Loader2 className="h-10 w-10 animate-spin text-green-600" />
                                            </div>
                                        ) : error.errorCategorie ? (
                                            <div className="flex h-ful w-full items-center justify-center">
                                                <p className="text-red-500 text-center ">{error.errorCategorie}</p>
                                            </div>
                                        ) : (
                                            <>
                                                <CategoryButton active={activeCategory === "all"} onClick={() => setActiveCategory("all")}>
                                                    Todos
                                                </CategoryButton>
                                                {categories.map((category) => (
                                                    <CategoryButton key={category.id_category} active={activeCategory === String(category.id_category)} onClick={() => setActiveCategory(String(category.id_category))}>
                                                        {category.name_cat}
                                                    </CategoryButton>
                                                ))}
                                            </>
                                        )
                                    }
                                </div>
                            </SheetContent>
                        </Sheet>
                        <div className="hidden md:flex flex-wrap items-center gap-2 overflow-x-auto pb-2">

                            {
                                loading ? (
                                    <div className="flex h-full items-center justify-center col-span-full">
                                        <Loader2 className="h-10 w-10 animate-spin text-green-600" />
                                    </div>
                                ) : error.errorCategorie ? (
                                    <div className="flex h-full items-center w-full justify-center col-span-full">
                                        <p className="text-red-500 text-center">{error.errorCategorie}</p>
                                    </div>
                                ) : (
                                    <>
                                        <CategoryButton active={activeCategory === "all"} onClick={() => setActiveCategory("all")}>
                                            Todos
                                        </CategoryButton>
                                        {categories.map((category) => (
                                            <CategoryButton key={category.id_category} active={activeCategory === String(category.id_category)} onClick={() => setActiveCategory(String(category.id_category))}>
                                                {category.name_cat}
                                            </CategoryButton>
                                        ))}
                                    </>
                                )
                            }
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">

                            {loading ? (
                                <div className="flex h-full items-center justify-center col-span-full">
                                    <Loader2 className="h-10 w-10 animate-spin text-green-600" />
                                </div>
                            ) : error.errorProducts ? (
                                <div className="flex h-full items-center justify-center text-muted-foreground col-span-full">
                                    <p>{error.errorProducts}</p>
                                </div>
                            ) : (
                                <>

                                    {filteredProducts.map((product) => (
                                        <ProductCard
                                            key={product.id || Math.random()}
                                            product={{
                                                id: product.id || 0,
                                                name: product.name || '',
                                                price: product.price || 0,
                                                image: product.image || product.photo || 'placeholder.svg',
                                                price_offert: product.price_offert,
                                                name_brand: product.name_brand || '',
                                                stock: product.stock || 0
                                            }}

                                            onAddToCart={() => addToCart(product)}
                                        />
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <button className="fixed flex lg:hidden bottom-10 right-10 text-xl rounded-full p-2 bg-primary" onClick={() => setShowCart(true)}>
                    <div className="relative">
                        <ShoppingCart className="h-8 rounded-full w-8" />
                        <span className="absolute -top-3  -right-3 text-xs text-black bg-red-500 rounded-full p-1 px-2 ">{cart.length > 0 ? cart.length : 0}</span>
                    </div>
                </button>
                {/* Cart Section */}
                <div className="hidden lg:flex w-96 flex-col border-l">
                    <div className="border-b p-4">
                        <h2 className="flex items-center text-lg font-semibold">
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Venta actual
                        </h2>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {cart.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                                <ShoppingCart className="mb-2 h-12 w-12" />
                                <p>No hay productos en el carrito</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {cart.map((item) => (
                                    <CartItem
                                        key={item.product.id || 0}
                                        item={{
                                            product: {
                                                id: item.product.id || 0,
                                                name: item.product.name || '',
                                                price: item.product.price || 0,
                                                image: item.product.image || item.product.photo || '/placeholder.svg',
                                                price_offert: item.product.price_offert
                                            },
                                            quantity: item.quantity
                                        }}
                                        onUpdateQuantity={(quantity) => updateQuantity(item.product.id || 0, quantity)}
                                        onRemove={() => removeFromCart(item.product.id || 0)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cart Summary */}
                    <div className="border-t p-4">
                        {
                            cajaAbierta ? (
                                <>
                                    <div className="space-y-2">
                                        <div className="flex  justify-between text-sm">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span>S/.{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between font-semibold text-lg pt-2 border-t mt-2">
                                            <span>Total</span>
                                            <span>S/.{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="space-y-2">
                                            <span className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Método de Pago</span>
                                            {
                                                error.errorPaymentMethod ? (
                                                    <p className="text-red-500 text-sm text-center py-1">{error.errorPaymentMethod}</p>
                                                ) : (
                                                    <Select onValueChange={handlePaymentMethod}>

                                                        <SelectTrigger id="payment-method">
                                                            <SelectValue placeholder="Método de pago" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="default" disabled>Seleccionar Método de Pago</SelectItem>
                                                            {
                                                                paymentMethod.map((payment) => (
                                                                    <SelectItem key={payment.id_payment} value={payment.id_payment?.toString() ?? "default"}>
                                                                        {payment.name_payment}
                                                                    </SelectItem>
                                                                ))
                                                            }
                                                        </SelectContent>

                                                    </Select>

                                                )
                                            }
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                        <Button variant="outline" onClick={clearCart} disabled={cart.length === 0}>
                                            Cancelar venta
                                        </Button>
                                        <Button onClick={handleCheckout} disabled={cart.length === 0}>
                                            Pagar
                                        </Button>
                                    </div>
                                </>
                            ) : <p className="text-center text-muted-foreground">Abra la caja para empezara  vender</p>
                        }


                    </div>
                </div>
            </div>

            {/* Checkout Modal */}
            <Sheet open={showCart} onOpenChange={setShowCart}>
                <SheetContent className="w-full">
                    <Card className="w-full mt-4">
                        <div className="border-b p-4">
                            <h2 className="flex items-center text-lg font-semibold">
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Venta actual
                            </h2>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {cart.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                                    <ShoppingCart className="mb-2 h-12 w-12" />
                                    <p>No hay productos en el carrito</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {cart.map((item) => (
                                        <CartItem
                                            key={item.product.id || 0}
                                            item={{
                                                product: {
                                                    id: item.product.id || 0,
                                                    name: item.product.name || '',
                                                    price: item.product.price || 0,
                                                    image: item.product.image || item.product.photo || '/placeholder.svg',
                                                    price_offert: item.product.price_offert
                                                },
                                                quantity: item.quantity
                                            }}
                                            onUpdateQuantity={(quantity) => updateQuantity(item.product.id || 0, quantity)}
                                            onRemove={() => removeFromCart(item.product.id || 0)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Cart Summary */}
                        <div className="border-t p-4">

                            {
                                !cajaAbierta ? (
                                    <>
                                    <p className="text-center text-muted-foreground">Abra la caja para empezara  vender</p>
                                        
                                    </>
                                ) : <>
                                <div className="space-y-2">
                                            <div className="flex  justify-between text-sm">
                                                <span className="text-muted-foreground">Subtotal</span>
                                                <span>S/.{subtotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between font-semibold text-lg pt-2 border-t mt-2">
                                                <span>Total</span>
                                                <span>S/.{subtotal.toFixed(2)}</span>
                                            </div>
                                            <div className="space-y-2">
                                                <span className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Método de Pago</span>
                                                {
                                                    error.errorPaymentMethod ? (
                                                        <p className="text-red-500 text-sm text-center py-1">{error.errorPaymentMethod}</p>
                                                    ) : (
                                                        <Select onValueChange={handlePaymentMethod}>

                                                            <SelectTrigger id="payment-method">
                                                                <SelectValue placeholder="Método de pago" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="default" disabled>Seleccionar Método de Pago</SelectItem>
                                                                {
                                                                    paymentMethod.map((payment) => (
                                                                        <SelectItem key={payment.id_payment} value={payment.id_payment?.toString() ?? "default"}>
                                                                            {payment.name_payment}
                                                                        </SelectItem>
                                                                    ))
                                                                }
                                                            </SelectContent>

                                                        </Select>

                                                    )
                                                }
                                            </div>
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-2">
                                            <Button variant="outline" onClick={clearCart} disabled={cart.length === 0}>
                                                Cancelar venta
                                            </Button>
                                            <Button onClick={handleCheckout} disabled={cart.length === 0}>
                                                Pagar
                                            </Button>
                                        </div>
                                </>
                            }


                        </div>
                    </Card>
                </SheetContent>
            </Sheet>
            {showCheckout && (
                <Checkout fetchProducts={fetchProducts} total={total} paymentMethodSelected={paymentMethodSelected} cart={cart} onComplete={handlePaymentComplete} onCancel={() => setShowCheckout(false)} />
            )}
        </div>
    )
}

