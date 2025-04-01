
{/**
 * Using -> vuelve a verificar esto efrael esta fuera de lo comun jaja
 * 
 * 
 * 
 */}
import { ClosingHistoryTwo } from "@/components/caja/closing-history-two"
import { HedaerGeneral } from "@/components/header-general"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { getDatas, postDatas } from "@/api/api"
import { toast } from "sonner"
import { OpenCaja } from "@/components/caja/open-caja"
import { RegisterDischarge } from "@/components/caja/register-discharge"
import { Movements } from "@/components/caja/movements"
export default function Caja() {

  const [cajaAbierta, setCajaAbierta] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isFormOpenDischarge, setIsFormOpenDischarge] = useState(false)
  const [dataCaja, setDataCaja] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const fetchCaja = async () => {
    const response = await postDatas('/verificar-caja', {})
    if (response.success) {
      setCajaAbierta(true)
    } else {
      toast.error(response.message, { position: "top-center" })
      setCajaAbierta(false)
    }
  }
  const fetchDataCaja = async () => {
    try {
      setIsLoading(true)
      const response = await getDatas('listar-cajas')

      if (response.success) {
        setDataCaja(response.message)
        setError("")
      } else {
        setError(response.message.toString())
      }
    } catch {
      setError("Error al obtener datos de la caja")
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchCaja()
    fetchDataCaja()
  }, [])
  return (
    <>
      <HedaerGeneral />
      <div className="container mx-auto p-4 md:p-6">

        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold">Caja</h1>
          <div className="flex gap-2">
            {
              cajaAbierta ? (
                <Button onClick={() => setIsFormOpenDischarge(true)} variant="secondary">
                  <Minus className="h-4 w-4" /> Gastos
                </Button>
              ) : null
            }
            {
              !cajaAbierta ? (
                <Button onClick={() => setIsFormOpen(true)}>
                  <Plus className="h-4 w-4" /> Abrir Caja
                </Button>
              ) : null
            }
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 ">
          <div className="col-span-1 md:col-span-5">

            <ClosingHistoryTwo dataCaja={dataCaja} isLoading={isLoading} error={error} />
          </div>
          <div className="col-span-1 md:col-span-2">
            <Movements />
          </div>
        </div>
        <OpenCaja isFormOpen={isFormOpen} setIsFormOpen={setIsFormOpen} />
        <RegisterDischarge isFormOpen={isFormOpenDischarge} setIsFormOpen={setIsFormOpenDischarge} />

      </div>
    </>
  )
}

