import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link, useParams, useNavigate } from "react-router-dom"
import { HedaerGeneral } from "@/components/header-general"
import { useEffect, useState } from "react"
import { postDatas, patchData } from "@/api/api"
import { toast } from "sonner"
import { useAuth } from "@/store/auth"
interface User {
    id: number
    name: string
    password: string
    role: string
    status: number
    username: string
    email: string
    phone: string
}

export default function DataUsuario() {
    const { id } = useParams()
    const [user, setUser] = useState<User>({} as User)
    const [password, setPassword] = useState("")
    const [passwordRepeat, setPasswordRepeat] = useState("")
    const navigate = useNavigate()
    const userData = useAuth((state) => state.user)
    console.log(userData)
    const fetchUserData = async () => {
        const response = await postDatas('/userdata', { id })
        console.log(response)
        if (response.success) {
            setUser(response.message)
            if(response.message.id !== userData?.id || userData?.role !== 'Administrador'){
                navigate('/dashboard/')
            }
        } else {
            navigate('/')
        }
    }

    useEffect(() => {
        fetchUserData()
    }, [id])

    const handleSave = async () => {
     
        if (password && password !== passwordRepeat) {
            toast.error("Las contraseñas no coinciden", {position: "top-center"})
            return
        }
        if(password && password.length < 6){
            toast.error("La contraseña debe tener al menos 6 caracteres", {position: "top-center"})
            return
        }
        const response = await patchData('update-data', {
            name: user.name,
            username: user.username,
            role: user.role,
            status: user.status,
            password: password,
            iduser: user.id
        })
        console.log(response)
        if (response.success) {
            toast.success(response.message.toString(), {position: "top-center"})
        } else {
            toast.error(response.message.toString(), {position: "top-center"})
        }
    }

    // Mapear `status` de número a string
    const statusMap: Record<number, string> = {
        1: "Activo",
        0: "Inactivo",
    }

    return (
        <>
            <HedaerGeneral />
            <div className="container mx-auto p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link to="/dashboard/usuarios">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight capitalize">{user.name}</h1>
                        <p className="text-muted-foreground">Gestion de perfil y cuenta del usuario</p>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Informacion del usuario</CardTitle>
                        <CardDescription>Ver y actualizar los detalles del perfil del usuario</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select value={user.role} onValueChange={(value) => setUser({ ...user, role: value })}>
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Select role">{user.role}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="Vendedor">Vendedor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Account Status</Label>
                                <Select value={statusMap[user.status] || "Pending"} onValueChange={(value) => {
                                    const newStatus = Object.keys(statusMap).find(key => statusMap[Number(key)] === value)
                                    setUser({ ...user, status: newStatus ? Number(newStatus) : user.status })
                                }}>
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Select status">{statusMap[user.status]}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Activo</SelectItem>
                                        <SelectItem value="0">Inactivo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="passwordRepeat">Repeat Password</Label>
                                <Input id="passwordRepeat" type="password" value={passwordRepeat} onChange={(e) => setPasswordRepeat(e.target.value)} />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button onClick={handleSave}>Guardar Cambios</Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}
