{/**Using -> I need user id */}
import { CalendarIcon, DollarSign } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { DialogContent } from '../ui/dialog'
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { toast } from "sonner"
import { useState } from "react"
import { postDatas } from "@/api/api"
import { useAuth } from "@/store/auth"
export const OpenCaja = ({ isFormOpen, setIsFormOpen }: { isFormOpen: boolean, setIsFormOpen: (isFormOpen: boolean) => void}) => {
    const [initialAmount, setInitialAmount] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const user = useAuth((state) => state.user)
    const fechaActual = new Date().toLocaleDateString("es-CO", {
        weekday: "long", 
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    const horaActual = new Date().toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit", 
        hour12: true,
        timeZone: "America/Bogota"
    })

        const handleOpenRegister = async () => {
        setIsLoading(true);
        try {
            if (!initialAmount) {
                {/** if (!initialAmount || !user) { */ }
                toast.error("Todos los campos son requeridos", { position: "top-center" })
            return
        }
        const response = await postDatas('/abrir-caja', {
            usuario_id: user?.id,
            monto_inicial: initialAmount
        })
        if(response.success){
            toast.success(response.message, {position: "top-center"})
            setIsFormOpen(false)
            window.location.reload()
        }else{
            toast.error(response.message.toString(), {position: "top-center"})
        }
        } catch {
            toast.error("Error al abrir caja", { position: "top-center" })
        } finally {
            setIsLoading(false);
        }
        // Here you would typically save this data to your backend
    }
    return (
        <div>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Apertura de caja</DialogTitle>
                        <DialogDescription>Ingresa el monto inicial para iniciar tu turno</DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-4 text-muted-foreground">
                        <CalendarIcon className="h-5 w-5" />
                        <span className="capitalize text-sm">
                            {fechaActual} - {horaActual}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="initialAmount">Monto inicial en efectivo</Label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="initialAmount"
                                type="number"
                                placeholder="0.00"
                                className="pl-10"
                                value={initialAmount}
                                onChange={(e) => setInitialAmount(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleOpenRegister} disabled={isLoading}>{isLoading ? "Cargando..." : "Aperturar caja"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
