import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus } from "lucide-react"
import { postDatas } from "@/api/api"
import { toast } from "sonner"

interface FormData {
  name: string;
  username: string;
  role: string;
  status: string;
  password: string;
  password_repeat: string;
}

export function CreateUserDialog({ fetchUsers }: { fetchUsers: () => void }) {
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    username: '',
    role: '',
    status: '',
    password: '',
    password_repeat: ''
  })

  const resetForm = () => {
    setFormData({
      name: '',
      username: '',
      role: '',
      status: '',
      password: '',
      password_repeat: ''
    })
    setErrors({})
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    console.log(`Cambiando ${field}:`, value) // Verificar cambios en consola
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Partial<FormData> = {}
    console.log("Validando formulario:", formData)

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido'
    if (!formData.username.trim()) newErrors.username = 'El nombre de usuario es requerido'
    if (!formData.role.trim()) newErrors.role = 'El rol es requerido'
    if (!formData.status.trim()) newErrors.status = 'El estado es requerido'
    if (!formData.password) newErrors.password = 'La contraseña es requerida'
    if (!formData.password_repeat) newErrors.password_repeat = 'Debe confirmar la contraseña'
    if (formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    if (formData.password_repeat.length < 6) newErrors.password_repeat = 'La contraseña debe tener al menos 6 caracteres'
    if (formData.password !== formData.password_repeat) {
      newErrors.password_repeat = 'Las contraseñas no coinciden'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Formulario enviado:", formData)

    if (!validateForm()) {
      toast.error("Por favor complete todos los campos requeridos", { position: "top-center" })
      return
    }

    try {
      setIsLoading(true)
      const response = await postDatas('/create-user', {
        name: formData.name,
        username: formData.username,
        role: formData.role,
        status: formData.status,
        password: formData.password,
        password_repeat: formData.password_repeat
      })
      console.log("Respuesta:", response)
      if (response.success) {
        toast.success("Usuario creado exitosamente", { position: "top-center" })
        setOpen(false)
        fetchUsers()
      } else {
        toast.error(response.error || "Error al crear usuario", { position: "top-center" })
      }
    } catch {
      toast.error("Error al crear usuario", { position: "top-center" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (isOpen) resetForm()
    }}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Añadir Usuario
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          <DialogDescription>
            Añade un nuevo usuario a la plataforma.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombres</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ingrese su nombre"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de Usuario</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Ingrese el usuario"
                  className={errors.username ? 'border-red-500' : ''}
                />
                {errors.username && <span className="text-sm text-red-500">{errors.username}</span>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Tipo de Usuario</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange('role', value)}
                >
                  <SelectTrigger id="role" className={errors.role ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecciona el Rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrador">Administrador</SelectItem>
                    <SelectItem value="Vendedor">Vendedor</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <span className="text-sm text-red-500">{errors.role}</span>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger id="status" className={errors.status ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecciona el Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Activo</SelectItem>
                    <SelectItem value="0">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <span className="text-sm text-red-500">{errors.status}</span>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Ingrese la contraseña"
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && <span className="text-sm text-red-500">{errors.password}</span>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password_repeat">Repetir Contraseña</Label>
                <Input
                  id="password_repeat"
                  type="password"
                  value={formData.password_repeat}
                  onChange={(e) => handleInputChange('password_repeat', e.target.value)}
                  placeholder="Repita la contraseña"
                  className={errors.password_repeat ? 'border-red-500' : ''}
                />
                {errors.password_repeat && <span className="text-sm text-red-500">{errors.password_repeat}</span>}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2" >
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Creando..." : "Crear Usuario"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
