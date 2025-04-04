{/**Using */ }
import { Camera, Pencil, Plus, Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialog } from "../ui/alert-dialog"
import { toast } from "sonner"
import { Brand } from "@/lib/types"
import { Categories } from "@/lib/types"
import { useState } from "react"
import { postDatas, putData } from "@/api/api"
import { postDataWithImage } from "@/api/api"
import { PEN } from "@/lib/pen"
import { useAuth } from "@/store/auth"
type Product = {
    id?: number
    name: string
    name_cat?: string
    name_brand?: string
    price?: number | null
    price_offert?: number | null
    description: string
    stock?: number | null
    image?: string | null
    id_category?: number
    id_brand?: number
    idProduct?: number | null
    price_ant?: number | null
    photo?: string | null
}
const api = import.meta.env.VITE_API_ASSETS

export const ProductTable = ({ loading, fetchProducts, initialFormData, setInitialFormData, productos, categories, brands,  fetchCategories, fetchBrands, error }: { loading: boolean, fetchProducts: () => void, initialFormData: Product, setInitialFormData: (product: Product) => void, productos: Product[], categories: Categories[], brands: Brand[],  fetchCategories: () => void, fetchBrands: () => void, error: string }) => {
    const [chandePhoto, setChandePhoto] = useState(false)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
    console.log(productos)
    const { user } = useAuth()
    const [productToDelete, setProductToDelete] = useState<number | null>(null)
    const handleAddProduct = async () => {
        setCurrentProduct(null)
        setInitialFormData({
            name: "",
            name_cat: "",
            name_brand: "",
            price_ant: 0,
            price: 0,
            price_offert: 0,
            description: "",
            stock: 0,
            image: null,
            photo: null,
        })
        setIsFormOpen(true)
    }

    // Handle opening the form for editing an existing product
    const handleEditProduct = (product: Product) => {
        setCurrentProduct(product)
        setInitialFormData({
            name: product.name,
            id_category: product.id_category,
            id_brand: product.id_brand,
            price: product.price,
            price_offert: product.price_offert,
            description: product.description,
            stock: product.stock,
            image: product.image,
            idProduct: product.id,
        })
        setIsFormOpen(true)
    }

    // Handle form input changes

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'file' && e.target instanceof HTMLInputElement && e.target.files) {
            const file = e.target.files[0];
            console.log(file);
            setInitialFormData({
                ...initialFormData,
                [name]: file
            });
        } else {
            setInitialFormData({
                ...initialFormData,
                [name]: name === "price" || name === "price_offert" || name === "stock"
                    ? Number.parseFloat(value) || 0
                    : value
            });
        }
    }

    // Handle select input changes
    const handleSelectChange = (value: string, name: string) => {
        setInitialFormData({
            ...initialFormData,
            [name]: value,
        })
    }
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, field: "price" | "price_offert" | "price_ant") => {
        const rawValue = e.target.value.replace(/[^0-9.]/g, ""); // Solo números y punto
        setInitialFormData({ ...initialFormData, [field]: rawValue }); // Guardar como string temporal
    };

    const handlePriceBlur = (field: "price" | "price_offert" | "price_ant") => {
        const formattedPrice = PEN(initialFormData[field]?.toString() ?? "").format();
        setInitialFormData({
            ...initialFormData,
            [field]: Number(formattedPrice.replace(/[^0-9.]/g, ""))
        });
    };

    // Handle form submission
    const handleSubmit = async () => {
        setIsLoading(true)
        if (currentProduct) {
            try {
                if (
                    !initialFormData.name ||
                    !initialFormData.id_category ||
                   // !initialFormData.id_brand ||
                    (initialFormData.price ?? 0) <= 0 ||
                    (initialFormData.stock ?? 0) <= 0 ||
                    !initialFormData.description ||
                    !initialFormData.idProduct
                ) {
                    console.log(initialFormData)
                    toast.error("Todos los campos son requeridos", { position: "top-center" });
                    return;
                }
                console.log(initialFormData)
                if (chandePhoto) {
                    setIsLoading(true)
                    if (!initialFormData.image) {
                        toast.error("La imagen es requerida", { position: "top-center" })
                        return;
                    }
                    const photoData = new FormData();
                    photoData.append('photo', initialFormData.image)
                    const responseImage = await postDataWithImage('subir-image', photoData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    console.log(responseImage)
                    console.log(initialFormData)
                    initialFormData.id_brand=1;
                    if (responseImage.success) {
                        initialFormData.photo = responseImage.message
                        console.log(initialFormData)
                        const updateProduct = await putData('actualizar-producto', initialFormData);
                        console.log(updateProduct)
                        if (updateProduct.success) {
                            toast.success(updateProduct.message, { position: "top-center" })
                            fetchProducts()
                            setIsFormOpen(false)
                        } else {
                            toast.error(updateProduct.message, { position: "top-center" })
                        }

                    } else {
                        toast.error('Error al subir la imagen', { position: "top-center" })
                    }
                } else {
                    console.log(initialFormData)
                    const responseProduct = await putData('actualizar-producto', initialFormData)
                    if (responseProduct.success) {
                        toast.success(responseProduct.message, { position: "top-center" })
                        fetchProducts()
                        setIsFormOpen(false)
                    } else {
                        toast.error(responseProduct.message, { position: "top-center" })
                    }
                }
            } catch (error) {
                console.log(error)
                toast.error('Error al actualizar el producto', { position: "top-center" })
            } finally {
                setIsLoading(false);
                fetchCategories();
                fetchBrands();
            }
        } else {
            try {
                if (
                    !initialFormData.name ||
                    !initialFormData.id_category ||
                   // !initialFormData.id_brand ||
                    (initialFormData.price ?? 0) <= 0 ||
                    (initialFormData.stock ?? 0) <= 0 ||
                    !initialFormData.description ||
                    !initialFormData.image
                ) {
                    toast.error("Todos los campos son requeridos", { position: "top-center" });
                    return;
                }
                if (initialFormData.price_offert && (initialFormData.price_offert ?? 0) > (initialFormData.price ?? 0)) {
                    toast.error("El precio de oferta no puede ser mayor al precio", { position: "top-center" });
                    return;
                }
                initialFormData.id_brand=1;
                const photoData = new FormData();
                photoData.append('photo', initialFormData.image)
                console.log(initialFormData.image)
                console.log(photoData)

                const responseImage = await postDataWithImage('subir-image', photoData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })


                console.log(responseImage)
                if (responseImage.success) {
                    initialFormData.photo = responseImage.message
                    console.log(initialFormData)
                    const responseProduct = await postDatas('crear-producto', initialFormData)
                    console.log(responseProduct)
                    if (responseProduct.success) {
                        toast.success('Producto creado correctamente', { position: "top-center" })
                        fetchProducts()
                        setIsFormOpen(false)
                    } else {
                        toast.error('Error al crear el producto', { position: "top-center" })
                    }

                } else {
                    toast.error('Error al subir la imagen', { position: "top-center" })
                }
            } catch {
                toast.error("Error al crear el producto", { position: "top-center" });
            } finally {
                setIsLoading(false);
            }
        }
    };
    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        try {
            setIsLoading(true)
            if (productToDelete !== null) {
                const responseDelete = await putData('eliminar-producto', { id: productToDelete })
                if (responseDelete.success) {
                    toast.success(responseDelete.message, { position: "top-center" })
                    fetchProducts()
                } else {
                    toast.error(responseDelete.message, { position: "top-center" })
                }
                setIsDeleteDialogOpen(false)
                setProductToDelete(null)
            }
        } catch {
            toast.error("Error al eliminar el producto", { position: "top-center" })
        } finally {
            setIsLoading(false);
        }
    }

    // Open delete confirmation dialog
    const openDeleteDialog = (id: number) => {
        setProductToDelete(id)
        setIsDeleteDialogOpen(true)
    }
    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl md:text-2xl font-bold">Productos</h1>
                <Button onClick={handleAddProduct}>
                    <Plus className="h-4 w-4" /> Agregar Producto
                </Button>
            </div>

            <div className="">
                {
                    error ? <div className="flex justify-center py-2 text-red-500"> {error} </div> : <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead><strong>#</strong></TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Marca</TableHead>
                                <TableHead>Precio</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-2">Cargando...</TableCell>
                                    </TableRow>
                                ) : (
                                    productos.map((product, key) => (
                                        <TableRow key={product.id}>
                                            <TableCell><strong>{key + 1}</strong></TableCell>
                                            <TableCell>
                                                <img
                                                    src={`${api}${product?.photo}` || "placeholder.svg"}
                                                    alt={product.name}
                                                    className="h-10 w-10 rounded-md object-cover"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{product.name}</TableCell>
                                            <TableCell>{product.name_cat}</TableCell>
                                            <TableCell><span className="capitalize">{product.name_brand}</span></TableCell>
                                            <TableCell><p className="flex flex-col text-left">
                                                {product.price_offert != 0 ? (
                                                    <>
                                                        <span className="line-through text-gray-500 font-light">S/.{Number(product.price).toFixed(2)}
                                                        </span>
                                                        <span className="font-bold"> S/.{Number(product.price_offert).toFixed(2)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="font-bold">S/.{Number(product.price).toFixed(2)}</span>
                                                )}
                                            </p></TableCell>
                                            <TableCell>
                                                <p className="text-left whitespace-nowrap text-ellipsis overflow-hidden max-w-[100px]">
                                                    {product.description}
                                                </p>

                                            </TableCell>
                                            <TableCell>{product.stock}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {
                                                        user?.role === "Administrador" ? <Button variant="outline" size="icon" onClick={() => handleEditProduct(product)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button> : ''
                                                    }
                                                    <Button variant="outline" size="icon" onClick={() => openDeleteDialog(product.id ?? 0)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )
                            }
                        </TableBody>
                    </Table>

                }
                {/* Product Form Dialog */}
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>{currentProduct ? "Editar Produco" : "Nuevo Producto"}</DialogTitle>
                            <DialogDescription>Complete los detalles del producto</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            {/**
                                 * AGREGAR INPUT PARA FOTO
                                 */}
                            <div className="space-y-2">
                                <Label htmlFor="image">Foto</Label>
                                {
                                    currentProduct ? chandePhoto && (
                                        <Input id="image" name="image" accept="image/*" type="file" onChange={handleInputChange} />
                                    ) : (
                                        <Input id="image" name="image" accept="image/*" type="file" onChange={handleInputChange} />
                                    )
                                }
                                {
                                    currentProduct && (
                                        <div className="flex gap-2">
                                            {
                                                !chandePhoto && (
                                                    <Button variant="outline" onClick={() => setChandePhoto(true)}>
                                                        Cambiar fotografía   <Camera className="h-4 w-4" />
                                                    </Button>
                                                )
                                            }
                                            {
                                                chandePhoto && (
                                                    <Button variant="secondary" onClick={() => setChandePhoto(false)}>Cancelar</Button>
                                                )
                                            }
                                        </div>
                                    )
                                }
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre</Label>
                                    {/**
                                         * CUANDO LE DEA A EDITAR EL PRODUCTO, EL INPUT NO DEBE ESTAR VACIO
                                         */}
                                    <Input id="name" name="name" value={initialFormData.name} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Categoría</Label>

                                    <Select
                                        value={initialFormData.id_category?.toString() ?? ""}
                                        onValueChange={(value) => handleSelectChange(value, "id_category")}
                                    >


                                        <SelectTrigger>
                                            {/**
                                                 * CUANDO LE DEA A EDITAR EL PRODUCTO, EL SELECT NO DEBE ESTAR VACIO
                                                 */}
                                            <SelectValue placeholder="Seleccionar categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="default" disabled>Seleccionar categoría</SelectItem>

                                            {
                                                categories.map((category) => (
                                                    <SelectItem key={category.id_category} value={category.id_category?.toString() ?? "default"}>
                                                        {category.name_cat}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                    <Label htmlFor="stock">Cantidad Stock</Label>
                                    {/**
                                         * CUANDO LE DEA A EDITAR EL PRODUCTO, EL INPUT NO DEBE ESTAR VACIO
                                         */}
                                    <Input id="stock" name="stock" type="number" value={initialFormData.stock?.toString() ?? ""} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name_brand">Precio de compra</Label>
                                    <Input
                                        id="price_ant"
                                        name="price_ant"
                                        type="text"
                                        value={initialFormData.price_ant?.toString() ?? ""}
                                        onChange={(e) => handlePriceChange(e, "price_ant")}
                                        onBlur={() => handlePriceBlur("price_ant")}
                                    />
                                    <div className="hidden">
                                        <Select
                                            value={initialFormData.id_brand?.toString() || "1"}
                                            onValueChange={(value) => handleSelectChange(value, "id_brand")}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar marca" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={"default"} disabled>Seleccionar categoría</SelectItem>
                                                {
                                                    brands.map((brand) => (
                                                        <SelectItem key={brand.id_brand} value={brand.id_brand?.toString() || "default"}>
                                                            {brand.name_brand}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </div>



                                </div>
                                

                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Precio de venta</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="text"
                                        value={initialFormData.price?.toString() ?? ""}
                                        onChange={(e) => handlePriceChange(e, "price")}
                                        onBlur={() => handlePriceBlur("price")}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price_offert">Precio oferta</Label>
                                    <Input
                                        id="price_offert"
                                        name="price_offert"
                                        type="text"
                                        value={initialFormData.price_offert?.toString() ?? ""}
                                        onChange={(e) => handlePriceChange(e, "price_offert")}
                                        onBlur={() => handlePriceBlur("price_offert")}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={initialFormData.description}
                                    onChange={handleInputChange}
                                    rows={2}
                                />
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                                Cancelar
                            </Button>
                            <Button disabled={isLoading} onClick={handleSubmit}>{currentProduct ? "Actualizar" : "Agregar"}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción no se puede deshacer. Eliminará permanentemente el producto de la base de datos.                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction disabled={isLoading} onClick={handleDeleteConfirm}>Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>


        </>
    )
}
