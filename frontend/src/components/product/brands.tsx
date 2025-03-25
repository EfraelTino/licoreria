import { Brand } from "@/lib/types"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../ui/table"
import { Button } from "../ui/button"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../ui/alert-dialog"
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription, DialogFooter } from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { AlertDialog } from "../ui/alert-dialog"
import { putData, postDatas } from "@/api/api"
import { toast } from "sonner"
export const BrandsPage = ({ brand, loading, fetchBrands }: { brand: Brand[], loading: boolean, fetchBrands: () => void }) => {
    const [currentBrand, setCurrentBrand] = useState<Brand | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [brandDelete, setBrandDelete] = useState<number | null>(null)

    const [initialFormData, setInitialFormData] = useState<Omit<Brand, "id">>({
        name_brand: "",
    })
    const handleAddBrand = async () => {
        setCurrentBrand(null)
        setInitialFormData({
            name_brand: "",
        })
        setIsFormOpen(true)
    }

    const handleEditBrand = (brand: Brand) =>{
        setCurrentBrand(brand)
        setInitialFormData({
            name_brand: brand.name_brand,
        })
        setIsFormOpen(true)
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setInitialFormData({
            ...initialFormData,
            [name]: name === "name_brand"
                ? value : ""
        });

    }
    const handleSubmit = async () => {
        if (currentBrand) {
          //editar
          const updatedBrand = await putData('/editar-marca', {
            id_brand: currentBrand.id_brand,
            name_brand: initialFormData.name_brand,
          })
          if(updatedBrand.success){
            toast.success(updatedBrand.message)
            fetchBrands()
            setIsFormOpen(false)
          }else{
            toast.error(updatedBrand.message)
          }
        } else {
           //agregar
           const newBrand = await postDatas('/crear-marca', {
            name_brand: initialFormData.name_brand,
           })
           if(newBrand.success){
            toast.success(newBrand.message)
            fetchBrands()
            setIsFormOpen(false)
           }else{
            toast.error(newBrand.message)
           }
        }
    }
    const handleDeleteConfirm = async () => {
        if (brandDelete !== null) {
            const deletedBrand = await postDatas('/eliminar-marca', {
                id_brand: brandDelete,
            })
            if(deletedBrand.success){
                toast.success(deletedBrand.message)
                fetchBrands()
                setIsDeleteDialogOpen(false)
                setBrandDelete(null)
            }else{
                toast.error(deletedBrand.message)
            }
        }
    }

    // Open delete confirmation dialog
    const openDeleteDialog = (id: number) => {
        setBrandDelete(id)
        setIsDeleteDialogOpen(true)
    }
    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl md:text-2xl font-bold">Marcas</h1>
                <Button onClick={handleAddBrand}>
                    <Plus className="h-4 w-4" /> Agregar Marca
                </Button>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead><strong>#</strong></TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center">Cargando...</TableCell>
                                </TableRow>
                            ) : (
                                brand.map((product, key) => (
                                    <TableRow key={product.id_brand}>
                                        <TableCell><strong>{key + 1}</strong></TableCell>

                                        <TableCell><span className="capitalize">{product.name_brand}</span></TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button onClick={() => handleEditBrand(product)} variant="outline" size="icon">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="outline" size="icon" onClick={() => openDeleteDialog(product.id_brand ? product.id_brand : 0)}>
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
                {/* Product Form Dialog */}
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>{currentBrand ? "Editar Marca" : "Nueva Marca"}</DialogTitle>
                            <DialogDescription>Complete los detalles de la marca</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            {/**
                                    * AGREGAR INPUT PARA FOTO
                                 */}
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre</Label>
                                    <Input id="name_brand" name="name_brand" value={initialFormData.name_brand} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleSubmit}>{currentBrand ? "Actualizar" : "Agregar"}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Estas seguro(a) de eliminar la marca?</AlertDialogTitle>
                            <AlertDialogDescription>
                            Esta acción no se puede deshacer. Eliminará permanentemente la marca y productos asociados de la base de datos.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </>
    )
}
