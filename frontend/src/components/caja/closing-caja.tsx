{/**Using -> I need id of the caja */}
import { postDatas } from "@/api/api"
import { Button } from "../ui/button"
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { DialogContent } from '../ui/dialog'
import { toast } from "sonner"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useState } from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { PEN } from "@/lib/pen"
import { useAuth } from "@/store/auth"

export const ClosingCaja = ({ isFormOpen, setIsFormOpen, id }: { isFormOpen: boolean, setIsFormOpen: (isFormOpen: boolean) => void, id: number}) => {
    const user = useAuth((state) => state.user)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [cashCounted, setCashCounted] = useState({
        monto: "",
        type: "Egreso",
        descripcion: "",
        userid: user?.id,
    });
    const [isLoading, setIsLoading] = useState(false);
    const handleCloseCaja = async (id: number) => {
        setIsLoading(true);
        try {
            const formattedMonto = cashCounted.monto.replace("S/", "").trim();
            const response = await postDatas('/cerrar-caja', {
                caja_id: id,
                monto_final: Number(formattedMonto)
            })
            if(response.success){
                toast.success(response.message, { position: "top-center" })
                setIsFormOpen(false)
                window.location.reload()
            }else{
                toast.error(response.message, { position: "top-center" })
            }
        } catch  {
            toast.error("Error al cerrar caja", { position: "top-center" })
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Cierre de caja</DialogTitle>
    
                        <DialogDescription>Ingresa el monto final para cerrar tu turno</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="monto">Monto: </Label>
                        <Input
                            type="text"
                            className="text-right"
                            value={cashCounted.monto}
                            onChange={(e) => {
                                const rawValue = e.target.value.replace(/[^0-9.]/g, "");
                                setCashCounted({ ...cashCounted, monto: rawValue });
                            }}
                            onBlur={() => {
                                setCashCounted({
                                    ...cashCounted,
                                    monto: PEN(cashCounted.monto).format()
                                });
                            }}
                            placeholder="S/0.00"
                        />
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={() => setShowConfirmDialog(true)} disabled={isLoading}>{isLoading ? "Cargando..." : "Cerrar caja"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Deseas cerrar la caja con un monto final de {cashCounted.monto}?
                            Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleCloseCaja(id)}>
                            Confirmar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
