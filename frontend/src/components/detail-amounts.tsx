import { Card, CardContent, CardDescription,  CardHeader, CardTitle } from "@/components/ui/card"
import {
    BanknoteIcon,
    CreditCardIcon,
    DollarSign,
} from "lucide-react"
import { useEffect, useState } from "react"
import { postDatas } from "@/api/api"
import { obtenerFechaActual } from "@/lib/utils"
import { ClosingHistory } from "./caja/closing-history"
export function DetailAmounts() {
    const [sales, setSales] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    //obtener fecha actual de colombia

    const diahoy = obtenerFechaActual()
    const fetchSales = async () => {
        try {
            setLoading(true)
            const response = await postDatas("amount-day", { fechaObtener: diahoy })
            if (response.success) {
                setSales(response.message)
                setError('');
                return;
            }
            setSales([])
            setError(response.message.toString())
        } catch {
            setError('Hubo un error contacta con soporte');
        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        fetchSales()
    }, [])
    const amountCash = sales.filter((sale: { payment_method: number }) => sale.payment_method === 1)
    const amountCard = sales.filter((sale: { payment_method: number }) => sale.payment_method !== 1)

    const montoEfectivo = amountCash.reduce((acumulador: number, actual: { total: number }) => acumulador + parseFloat(actual.total.toString()), 0)
    const montoTarjeta = amountCard.reduce((acumulador: number, actual: { total: number }) => acumulador + parseFloat(actual.total.toString()), 0)
    const totalAmount = montoEfectivo + montoTarjeta;
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {
                    loading ? 'cargando...' : error ? <p>{error}</p> : <>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-medium">Efectivo</CardTitle>
                                <CardDescription>Efectivo físico</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <BanknoteIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <span className="text-2xl font-bold">S/.{montoEfectivo.toFixed(2)}</span>
                                    </div>
                                    <span className=" text-green-600 bg-green-100 px-2 py-1 text-xs lg:text-sm rounded-full">+S/ {montoEfectivo.toFixed(2)} hoy</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-medium">Pagos Diversos</CardTitle>
                                <CardDescription>Transacciones electrónicas</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <CreditCardIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <span className="text-2xl font-bold">S/.{montoTarjeta.toFixed(2)}</span>
                                    </div>
                                    <span className=" text-green-600 bg-green-100 px-2 py-1 text-xs lg:text-sm rounded-full">+S/ {montoTarjeta.toFixed(2)} hoy</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-medium">Ventas Totales</CardTitle>
                                <CardDescription>Todos los métodos de pago</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <span className="text-2xl font-bold">S/.{totalAmount.toFixed(2)}</span>
                                    </div>
                                    <span className=" text-green-600 bg-green-100 px-2 py-1 text-xs lg:text-sm rounded-full">+S/ {totalAmount.toFixed(2)} hoy</span>
                                </div>
                            </CardContent>
                        </Card></>
                }
            </div>
         <ClosingHistory />
        </div>
    )
}

