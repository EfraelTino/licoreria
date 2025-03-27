{/**Using -> I need user id */}
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { postDatas } from "@/api/api";
import currency from "currency.js";
import { Input } from "../ui/input";
import { useAuth } from "@/store/auth";
const PEN = (value: string) => currency(value, {
    symbol: "S/",
    separator: ",",
    decimal: ".",
    precision: 2
});

export const RegisterDischarge = ({ isFormOpen, setIsFormOpen }: { isFormOpen: boolean, setIsFormOpen: (isFormOpen: boolean) => void }) => {
    const user = useAuth((state) => state.user)
    const [cashCounted, setCashCounted] = useState({
        monto: "",
        type: "Egreso",
        descripcion: "",
        //insertar el id del usuario
        userid: user?.id,
    });
    const [isLoading, setIsLoading] = useState(false);
    const handleCloseCaja = async () => {
        setIsLoading(true);
        try {
            const formattedMonto = cashCounted.monto.replace("S/", "").trim(); // Quita el "S/"
        if (parseFloat(formattedMonto) > 0) {
            const response = await postDatas('/registrar-egreso', {
                monto: Number(formattedMonto), // Lo manda como número
                tipo: cashCounted.type,
                descripcion: cashCounted.descripcion,
                usuario_id: cashCounted.userid,
            });
            if(response.success){
                window.location.reload()
                toast.success(response.message.toString(), { position: "top-center" });
                setIsFormOpen(false);
            }else{
                toast.error(response.message.toString(), { position: "top-center" });
            }
        } else {
                toast.error("No se puede registrar un egreso de 0", { position: "top-center" });
            }
        } catch {
            toast.error("Error al registrar el egreso", { position: "top-center" });
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <div>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Registro de egreso</DialogTitle>
                        <DialogDescription>Ingresa el monto de tu egreso</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="monto">Monto: </Label>
                        <Input
                            type="text"
                            className="text-right"
                            value={cashCounted.monto}
                            onChange={(e) => {
                                const rawValue = e.target.value.replace(/[^0-9.]/g, ""); // Permitir solo números y punto decimal
                                setCashCounted({ ...cashCounted, monto: rawValue });
                            }}
                            onBlur={() => {
                                setCashCounted({
                                    ...cashCounted,
                                    monto: PEN(cashCounted.monto).format() // Aplica formato cuando el input pierde el foco
                                });
                            }}
                            placeholder="S/0.00"
                        />

                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="type">Tipo: </Label>
                        <p className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm items-center text-muted-foreground">
                            {cashCounted.type}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="descripcion">Descripción: </Label>
                        <Textarea
                            id="descripcion"
                            placeholder="Descripción"
                            value={cashCounted.descripcion}
                            onChange={(e) => setCashCounted({ ...cashCounted, descripcion: e.target.value })}
                        />
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleCloseCaja} disabled={isLoading}>{isLoading ? "Cargando..." : "Registrar egreso"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
