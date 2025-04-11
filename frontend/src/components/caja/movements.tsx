{/**Using ->  */ }
import React, { useEffect } from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { getDatas } from "@/api/api"

type Movements = {
    amount: number;
    type: string;
    created_at: string;
}
export function Movements() {

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [clients, setClients] = React.useState<[]>([])
    const [loading, setLoading] = React.useState(false)
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [error, setError] = React.useState("")

    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await getDatas(`movimientos-caja`)
            console.log(response)
            if (response.success) {
                //recargar la pagina

                setClients(response.data)
                setError("");
            } else {
                setError(response.message.toString())
            }
            setLoading(false)
        } catch {
            setError("No se encontraron resultados")
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchUsers()
    }, [])
    const columns: ColumnDef<Movements>[] = [
        {
            id: "index",
            header: "#",
            cell: ({ row }) => (<strong>{row.index + 1}</strong>),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "fecha",
            accessorKey: "created_at", // Mantenemos accessorKey original
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Fecha
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => (
                <div>{new Date(row.original.created_at).toLocaleDateString('en-US')}</div>
            ),
        },
        {
            id: "monto",
            accessorKey: "amount", // Mantenemos accessorKey original
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Monto
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => (
                <div>{`${row.original.amount}`}</div>
            ),
        },
        {
            id: "tipo",
            accessorKey: "type", // Mantenemos accessorKey original
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tipo
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => {
                return (
                    <div className="mx-auto ">
                        <span className={`capitalize font-medium px-4 gap-2 mx-auto rounded-full ${row.original.type === "Egreso" ? "text-red-600" : "text-green-600"}`}>{row.original.type}</span>
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data: clients,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        initialState: {
            pagination: {
                pageSize: 10, // Muestra solo 1 usuario por página
            },
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })


    return (
        <div className="mx-auto w-full   max-w-screen-xl grid gap-y-2">
            <Card className="overflow-x-scroll p-4">

                <div className="flex items-center py-4 justify-between">
                    <h2 className="font-semibold leading-none tracking-tight">Últimos Movimientos</h2>

                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    Filtrar <ChevronDown />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) =>
                                                    column.toggleVisibility(!!value)
                                                }
                                            >
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        )
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="rounded-md border">
                    {
                        loading ? <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                        </div> : <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            {error}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    }
                </div>
                {
                    error ? '' : <div className="flex items-center justify-end space-x-2 py-4">
                        <div className="flex-1 text-sm text-muted-foreground">
                            {table.getFilteredSelectedRowModel().rows.length} of{" "}
                            {table.getFilteredRowModel().rows.length} filas(s).
                        </div>
                        <div className="space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Atrás
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Siguiente
                            </Button>
                        </div>
                    </div>
                }
            </Card>
        </div>
    )
}
