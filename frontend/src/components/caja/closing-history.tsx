"use client"

import { postDatas } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { obtenerFechaActual } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Calendar } from "@/components/ui/calendar"
import { CheckCircleIcon, EyeIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useNavigate } from "react-router-dom";
export function ClosingHistory() {
  const [ventas, setVentas] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [limite] = useState(10);
  const [totalPaginas, setTotalPaginas] = useState(null);
  const diahoy = obtenerFechaActual();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date())
  const navigate = useNavigate();
  const fetchVentas = async (paginaActual: number) => {
    try {
      setLoading(true);

      // Formatea la fecha seleccionada en el formato requerido
      const fechaSeleccionada = date ?
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` :
        diahoy;

      const response = await postDatas("listar-ventas", {
        fecha: fechaSeleccionada,
        limite: limite,
        pagina: paginaActual,
      });
      console.log(response)
      if (response.success) {
        setVentas(response.data);
        setTotalPaginas(response.paginacion?.total_paginas || Math.ceil(response.total_registros / limite));
      } else {
        setError(response.message.toString());
      }
    } catch {
      setError("Hubo un error al obtener las ventas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVentas(pagina);
  }, [pagina, date]);
  console.log(totalPaginas)
  const formatearMonto = (monto: number) => {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(monto);
  }
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Historial de Ventas</CardTitle>
            <CardDescription>Revisa todas tu ventas</CardDescription>
          </div>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  {date ? date.toLocaleDateString() : "Select date of birth..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => {
                    const today = new Date()
                    setPagina(1)
                    return date > today
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><strong>#</strong></TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">Cargando...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">{error}</TableCell>
              </TableRow>
            ) : ventas.length > 0 ? (
              ventas.map((venta: { created_at: string, name: string, role: string, total: number, sale_id: number }, key) => (
                <TableRow key={key}>
                  <TableCell>{((pagina - 1) * limite) + key + 1}</TableCell>
                  <TableCell>
                    {new Date(venta.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }).replace(",", " -")}
                  </TableCell>

                  <TableCell className="capitalize">{venta.name}</TableCell>
                  <TableCell className="capitalize">{venta.role}</TableCell>
                  <TableCell className="text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button onClick={() => navigate(`${venta.sale_id}`)} variant="outline">
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Ver Detalles</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell >
                  <TableCell className="text-right">
                    <span className="flex items-center gap-2 justify-end text-green-500">
                      <CheckCircleIcon className="h-4 w-4" /> {formatearMonto(venta.total)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No hay ventas</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            disabled={pagina === 1}
            onClick={() => setPagina((prev) => prev - 1)}
          >
            Anterior
          </Button>

          {
            /** <span>Página {pagina} de {totalPaginas || "?"}</span> */
          }

          <Button
            variant="outline"
            disabled={ventas.length === 0 || (totalPaginas !== null && pagina >= totalPaginas)}
            onClick={() => setPagina((prev) => prev + 1)}
          >
            Siguiente
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
