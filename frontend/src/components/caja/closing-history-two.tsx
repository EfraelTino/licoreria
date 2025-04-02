{/**Using ->  */ }
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {  X } from "lucide-react"
import { useState } from "react"
import { ClosingCaja } from "./closing-caja"
export function ClosingHistoryTwo({ dataCaja, isLoading, error }: {
  dataCaja: { created_at: string, name: string, role: string, opening_balance: number, closing_balance: number, balance_final: number, status: string, id: number }[],
  isLoading: boolean,
  error: string,
}) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [id, setId] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const startingIndex = (currentPage - 1) * itemsPerPage + 1

  const handleOpenForm = (id: number) => {
    setIsFormOpen(!isFormOpen)
    setId(id)
  }

  // Calcular índices para la paginación
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = dataCaja.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(dataCaja.length / itemsPerPage)
  // Ajustar el índice para que comience desde el startingIndex
  const getRowIndex = (index: number) => startingIndex + index;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Historial de Cierre de Caja</CardTitle>
            <CardDescription>Ver cierres de caja anteriores</CardDescription>
          </div>
          {/** <div className="flex gap-2">
            <Button variant="outline">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div> */}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">#</TableHead>
              <TableHead className="font-bold">Apertura</TableHead>
              <TableHead className="font-bold">Hora</TableHead>
              <TableHead className="font-bold">Encargado</TableHead>
              <TableHead className=" md:table-cell font-bold">Usuario</TableHead>
              <TableHead className="text-left font-bold">Monto Inicial</TableHead>
              <TableHead className="text-left font-bold">Monto Final</TableHead>
             {/** <TableHead className="text-left">Diferencia</TableHead> */}
              <TableHead className="text-left">Estado</TableHead>
              <TableHead className=" md:table-cell text-left">Total Ventas</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-green-500">Cargando...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-red-500">{error}</TableCell>
              </TableRow>
            ) : (
              currentItems.map((closing, key) => (
                <TableRow key={key}>
                  <TableCell className="font-bold">{getRowIndex(key)}</TableCell>
                  <TableCell>{new Date(closing.created_at).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</TableCell>
                  <TableCell>{new Date(closing.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</TableCell>
                  <TableCell className="  capitalize">{closing.name}</TableCell>
                  <TableCell className=" capitalize">{closing.role}</TableCell>
                  <TableCell className="text-left">S/.{Number(closing.opening_balance).toFixed(2)}</TableCell>
                  <TableCell className="text-left">S/.{Number(closing.closing_balance).toFixed(2)}</TableCell>

                  {/**
                   * <TableCell className="text-left">
                    <div className="flex items-center justify-start gap-1">
                      {closing.closing_balance < closing.opening_balance ? (
                        <AlertCircleIcon className="h-4 w-4 text-red-500" />
                      ) : (
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      )}
                      <span className={closing.closing_balance < closing.opening_balance ? "text-red-500" : "text-green-500"}>
                        S/{Number(closing.closing_balance - closing.opening_balance).toFixed(2)}
                      </span>
                    </div>


                  </TableCell>
                   */}
                  <TableCell className="text-left"> {closing.status === "Abierta" ? <span className="text-green-500">{closing.status}</span> : <span className="text-muted-foreground">{closing.status}</span>} </TableCell>
                  <TableCell className="text-left">S/.{Number(closing.closing_balance).toFixed(2)}</TableCell>

                  {/**
                   * 
                   * <TableCell className=" text-left">
                    S/ {closing.balance_final !== null && closing.balance_final !== undefined
                      ? Number(closing.balance_final).toFixed(2)
                      : (
                        (Number(closing.opening_balance) + Number(closing.closing_balance || 0)).toFixed(2)
                      )}
                  </TableCell>
                   */}
                  <TableCell className="text-right">
                    {closing.status === "Abierta" ? (
                      <Button onClick={() => handleOpenForm(closing.id)} className="gap-0" size="sm">
                        <X /> Cerrar Caja
                      </Button>
                    ) : <span className="text-green-500">Cerrada</span>}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

        </Table>
        {!isLoading && !error && dataCaja.length > 0 && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <ClosingCaja isFormOpen={isFormOpen} setIsFormOpen={setIsFormOpen} id={id} />
    </Card>
  )
}

