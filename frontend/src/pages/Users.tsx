{/**uSING */ }

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Search, Trash } from "lucide-react"
import { CreateUserDialog } from "@/components/create-user-dialog"
import { Link } from "react-router-dom"
import { HedaerGeneral } from "@/components/header-general"
import { useState, useEffect } from "react"
import { getDatas, postDatas } from "@/api/api"
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Tooltip } from "@/components/ui/tooltip"
import { TooltipProvider } from "@/components/ui/tooltip"
import { toast } from "sonner"

export default function Users() {
    const [dataUsers, setDataUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const fetchUsers = async () => {
        try {
            setIsLoading(true)
            const response = await getDatas("usuarios")
            console.log(response)
            if (response.success) {
                setDataUsers(response.message)
                setError("")
            } else {
                setError(response.message.toString())
            }
        } catch {
            setError("Error al obtener los usuarios")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value.toLowerCase()
        setSearch(searchTerm)
        setCurrentPage(1)
    }

    const filteredUsers = dataUsers.filter((user: { id: number, name: string, username: string, role: string, status: number }) => {
        return user.name.toLowerCase().includes(search) ||
            user.username.toLowerCase().includes(search) ||
            user.role.toLowerCase().includes(search)
    })
    const handleDesactivateUser = async (id: number, status: number) => {
        const response = await postDatas("desactivar-usuario", { id, status: status === 1 ? 0 : 1 })
        console.log(response)
        if(response.success){
            toast.success(status === 0 ? "Usuario activado" : "Usuario desactivado",{position: "top-center"})
            fetchUsers()
        }else{
            toast.error(response.message,{position: "top-center"})
        }
    }
    // Pagination calculations
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentUsers = filteredUsers.slice(startIndex, endIndex)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    return (
        <>
            <HedaerGeneral />
            <div className="container mx-auto p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h1 className="text-xl md:text-2xl font-bold">Usuarios</h1>
                    <CreateUserDialog fetchUsers={fetchUsers} />
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex items-center gap-2 w-full max-w-sm">
                                <Search className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar Usuarios..."
                                    className="h-9"
                                    value={search}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="overflow-auto">
                        <div className="w-full min-w-[640px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="font-bold">#</TableHead>
                                        <TableHead className="font-bold">Nombres</TableHead>
                                        <TableHead className="font-bold">Nombre de Usuario</TableHead>
                                        <TableHead className="font-bold">Rol</TableHead>
                                        <TableHead className="font-bold">Estado</TableHead>
                                        <TableHead className="text-right font-bold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        isLoading ? <TableRow><TableCell colSpan={6} className="text-center">Cargando...</TableCell></TableRow> :
                                            error ? <TableRow><TableCell colSpan={6} className="text-center">{error}</TableCell></TableRow> :
                                                currentUsers.map((user: { id: number, name: string, username: string, role: string, status: number }, index: number) => (
                                                    <TableRow key={user.id}>
                                                        <TableCell className="font-bold capitalize">
                                                            {startIndex + index + 1}
                                                        </TableCell>
                                                        <TableCell className="font-medium capitalize">
                                                            {user.name}
                                                        </TableCell>
                                                        <TableCell className="normal-case">{user.username}</TableCell>
                                                        <TableCell className="capitalize">{user.role}</TableCell>
                                                        <TableCell>
                                                            <div
                                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${user.status === 1
                                                                    ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                                                                    : "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                                                                    }`}
                                                            >
                                                                {user.status === 1 ? "Activo" : "Inactivo"}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button className={user.status === 1 ? "bg-red-100" : "bg-green-100"} variant="ghost" size="icon" asChild onClick={() => handleDesactivateUser(user.id, user.status)}>

                                                                            <span><Trash className="h-4 w-4" />
                                                                            <span className="sr-only">Desativar</span></span>

                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>{user.status === 1 ? "Desactivar usuario" : "Activar usuario"}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button variant="ghost" size="icon" asChild>
                                                                            <Link to={`/dashboard/datos-usuario/${user.id}`}>
                                                                                <Edit className="h-4 w-4" />
                                                                                <span className="sr-only">Edit user</span>
                                                                            </Link>
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>Editar usuario</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                </TableBody>
                            </Table>

                            {/* Pagination Controls */}
                            {!isLoading && !error && (
                                <div className="flex justify-between items-center gap-2 mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Anterior
                                    </Button>
                                    {/**
                                     * 
                                     * Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            variant={currentPage === page ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </Button>
                                    ))
                                     */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Siguiente
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
