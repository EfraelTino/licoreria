{/**Using */}
import { useState } from "react"
import { Check, DollarSign } from "lucide-react"
import { Products } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { postDatas } from "@/api/api"
import { toast } from "sonner"
import { useAuth } from "@/store/auth"

interface CheckoutProps {
  total: number
  onComplete: () => void
  onCancel: () => void
  cart: Array<{ product: Products; quantity: number }>
  paymentMethodSelected: { id_payment: number, name_payment: string } | null
  fetchProducts: () => void
}

export function Checkout({ total, onComplete, onCancel, cart, paymentMethodSelected, fetchProducts }: CheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [processing, setProcessing] = useState(false)
  const [completed, setCompleted] = useState(false)

  const user = useAuth((state) => state.user)
  const [userDate, setUserData] = useState({
    names: "",
    dni: "",
    phone: "",
    email: "",
  })

  const handlePayment = async () => {
    setProcessing(true)
    try {
      if(!userDate.dni || !userDate.names || !userDate.phone){
        toast.error("Todos los campos son requeridos", {
          position: "top-center",
        })
        setProcessing(false)
        return
      }
      //tomaar en cuelta el id del cliente
      const response = await postDatas("/registrar-venta", {
        total: total,
        paymentMethodSelected: paymentMethodSelected?.id_payment,
        cart: cart,
        userdata: userDate,
        userid: user?.id  
      })
      const {success, message} = response;
      if (!success) {
        toast.error(
          typeof message === "string" ? message : JSON.stringify(message), {position: "top-center"}
        );
        return;
      }
      
      toast.success(
        typeof message === "string" ? message : "Venta registrada correctamente", {position: "top-center"}
      );
      fetchProducts(); 
      setCompleted(true);
      onComplete();

    } catch {
      toast.error("Error al registrar la venta", {position: "top-center"} )
    }
  }

    const handleSelectChange = (value: string, name: string) => {
      setUserData({
        ...userDate,
        [name]: value,
      })
    }
    return (
      <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Completar Pago  </DialogTitle>
            <DialogDescription>Total a pagar: S/.{total.toFixed(2)}</DialogDescription>
          </DialogHeader>

          {completed ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="mb-4 rounded-full bg-primary/20 p-3">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Payment Complete</h3>
              <p className="text-muted-foreground">Thank you for your purchase!</p>
            </div>
          ) : (
            <Tabs defaultValue="cash" value={paymentMethod} onValueChange={setPaymentMethod}>
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="cash">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Detalles de facturación
                </TabsTrigger>
              </TabsList>
              <TabsContent value="cash" className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="amount-tendered">Nombres</Label>
                  <Input
                    id="names"
                    type="text"
                    placeholder="Ingresar nombre"
                    value={userDate.names}
                    onChange={(e) => handleSelectChange(e.target.value, "names")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount-tendered">DNI</Label>
                  <Input
                    id="dni"
                    type="number"
                    placeholder="Ingresar DNI"
                    value={userDate.dni}
                    onChange={(e) => handleSelectChange(e.target.value, "dni")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount-tendered">Teléfono</Label>
                  <Input
                    id="phone"
                    type="number"
                    placeholder="Ingresar teléfono"
                    value={userDate.phone}
                    onChange={(e) => handleSelectChange(e.target.value, "phone")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount-tendered">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Ingresar email"
                    value={userDate.email}
                    onChange={(e) => handleSelectChange(e.target.value, "email")}
                  />
                </div>
              </TabsContent>

            </Tabs>
          )}

          {!completed && (
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={onCancel} disabled={processing}>
                Cancelar
              </Button>
              <Button
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? "Procesando..." : "Completar Pago"}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    )
  }
