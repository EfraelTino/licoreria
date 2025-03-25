import { Categories } from "@/lib/types"
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

export const CategoriesPage = ({ categories, loading, fetchCategories }: { categories: Categories[], loading: boolean, fetchCategories: () => void}) => {
    const [currentCategory, setCurrentCategory] = useState<Categories | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [categoryDelete, setCategoryDelete] = useState<number | null>(null)

    const [initialFormData, setInitialFormData] = useState<Omit<Categories, "id">>({
        name_cat: "",
    })
    const handleAddCategorie = async () => {
        setCurrentCategory(null)
        setInitialFormData({
            name_cat: "",
        })
        setIsFormOpen(true)
    }

    const handleEditCategorie = (categorie: Categories) =>{
        setCurrentCategory(categorie)
        setInitialFormData({
            name_cat: categorie.name_cat,
        })
        setIsFormOpen(true)
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setInitialFormData({
            ...initialFormData,
            [name]: name === "name_cat"
                ? value : ""
        });

    }
    const handleSubmit = async () => {
        if (currentCategory) {
          //editar
          const updatedCategory = await putData('/editar-categoria', {
            id_category: currentCategory.id_category,
            name_cat: initialFormData.name_cat,
          })
          if(updatedCategory.success){
            toast.success(updatedCategory.message)
            fetchCategories()
            setIsFormOpen(false)
          }else{
            toast.error(updatedCategory.message)
          }
        } else {
           //agregar
           const newCategory = await postDatas('/crear-categoria', {
            name_cat: initialFormData.name_cat,
           })
           console.log(newCategory)
           if(newCategory.success){
            toast.success(newCategory.message)
            fetchCategories()
            setIsFormOpen(false)
           }else{
            toast.error(newCategory.message)
           }
        }
    }
    const handleDeleteConfirm = async () => {
        if (categoryDelete !== null) {
            const deletedCategory = await postDatas('/eliminar-categoria', {
                id_category: categoryDelete,
            })
            if(deletedCategory.success){
                toast.success(deletedCategory.message)
                fetchCategories()
                setIsDeleteDialogOpen(false)
                setCategoryDelete(null)
            }else{
                toast.error(deletedCategory.message)
            }
        }
    }

    // Open delete confirmation dialog
    const openDeleteDialog = (id: number) => {
        setCategoryDelete(id)
        setIsDeleteDialogOpen(true)
    }
    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl md:text-2xl font-bold">Categorías</h1>
                <Button onClick={handleAddCategorie}>
                    <Plus className="h-4 w-4" /> Agregar Categoría
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
                                categories.map((category, key) => (
                                    <TableRow key={category.id_category}>
                                        <TableCell><strong>{key + 1}</strong></TableCell>

                                        <TableCell><span className="capitalize">{category.name_cat}</span></TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button onClick={() => handleEditCategorie(category)} variant="outline" size="icon">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="outline" size="icon" onClick={() => openDeleteDialog(category.id_category ? category.id_category : 0)}>
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
                            <DialogTitle>{currentCategory ? "Editar Categoria" : "Nueva Categoria"}</DialogTitle>
                            <DialogDescription>Complete los detalles de la categoria</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            {/**
                                    * AGREGAR INPUT PARA FOTO
                                 */}
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre</Label>
                                    <Input id="name_cat" name="name_cat" value={initialFormData.name_cat} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleSubmit}>{currentCategory ? "Actualizar" : "Agregar"}</Button>
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
