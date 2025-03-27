import { postDatas } from '@/api/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/store/auth'
import { Eye, EyeOff, Loader2, LockKeyhole, Mail} from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner';

export const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('')
  const logindata = useAuth((state) => state.logindata)
  const navigate = useNavigate()
  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true)
    event.preventDefault()
    // Handle login logic here
  
    const form = event.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    if(email === '' || password === ''){
      toast.error('Email y contraseña son requeridos',{
        position: "top-center",
        cancel:{
          label: 'Cerrar',
          onClick: () => {
            console.log('Cancelar')
          }
        }
      })
      setLoading(false)
      return
    }
   try {
    const response = await postDatas('login', {email, password})

    if(response.success){
      console.log(response.userdata)
      logindata(response.token, response.userdata)
      navigate('/dashboard')
      return;
    }
    toast.error(response.error,{
      position: "top-center",
      cancel:{
        label: 'Cerrar',
        onClick: () => {
          console.log('Cerrar')
        },
        
      }
    })
   } catch  {
    toast.error('Erorr intentanto iniciar sesión', {position: "top-center"})
   }finally{
    setLoading(false)
   }
  }


  return (
    <React.Fragment>
      <div className="pointer-events-none fixed inset-0 overflow-hidden bg-white transition-opacity duration-300 opacity-60">
        <div className="absolute left-0 top-0 aspect-square w-full overflow-hidden sm:aspect-[2/1] [mask-image:radial-gradient(70%_100%_at_50%_0%,_black_70%,_transparent)] opacity-15">
          <div className="absolute inset-0 saturate-150 bg-general">
          </div>
          <div className="absolute inset-0 backdrop-blur-[100px]">
          </div>
        </div>
        <div className="absolute left-1/2 top-0 -translate-x-1/2 opacity-50 transition-all sm:opacity-100">
          <img alt="" loading="lazy" width="1750" height="1046" decoding="async" data-nimg="1" className="absolute inset-0" src="https://assets.dub.co/misc/welcome-background-grid.svg" style={{ color: "transparent" }} />
          <img alt="" loading="lazy" width="1750" height="1046" decoding="async" data-nimg="1" className="relative min-w-[1000px] max-w-screen-2xl transition-opacity duration-300 opacity-0" src="https://assets.dub.co/misc/welcome-background.svg" style={{ color: "transparent" }} />
        </div>
        <div className="absolute left-0 top-0 aspect-square w-full overflow-hidden sm:aspect-[2/1] [mask-image:radial-gradient(70%_100%_at_50%_0%,_black_70%,_transparent)] opacity-100 mix-blend-soft-light">
          <div className="absolute inset-0 saturate-150 bg-two" >
          </div>
          <div className="absolute inset-0 backdrop-blur-[100px]">
          </div>
        </div>
      </div>
      <section className='min-h-screen flex items-center z-10 relative px-2'>
        <Card className="w-full max-w-[320px] md:max-w-sm mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className=" text-xl md:text-2xl font-bold text-center">¡Te damos la bienvenida de nuevo!</CardTitle>
            <CardDescription className="text-center">Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <div className='relative'>
                  <Input id="username" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ingresa tu usuario" className='h-10 pl-7'  />
                  <Mail className='h-4 w-4 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2' />
                </div>

              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    
                    className='h-10 pl-7'
                  />
                  <LockKeyhole className='h-4 w-4 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2' />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full h-10" disabled={loading}>
                {
                  loading ? <Loader2 className='h-10 w-10 text-xl animate-spin' /> : 'Iniciar sesión'
                }
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </React.Fragment>

  )
}
