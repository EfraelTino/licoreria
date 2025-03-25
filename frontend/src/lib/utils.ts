import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const formatearFechaISO = (fecha: string | Date) => {
  const fechaObj = new Date(fecha);
  if (isNaN(fechaObj.getTime())) return "No especificada"; // Manejar errores

  return fechaObj.toISOString().split("T")[0]; // Extrae solo "YYYY-MM-DD"
};


export const obtenerFechaActual = () => {
  const fecha = new Date();
  const diahoy = fecha.getFullYear() + '-' + String(fecha.getMonth() + 1).padStart(2, '0') + '-' + String(fecha.getDate()).padStart(2, '0');
  return diahoy;
}