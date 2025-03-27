import { Building2, CalendarDays, Download, FileText, Mail, Phone, User, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { HedaerGeneral } from "../header-general"
import { useNavigate, useParams } from "react-router-dom";
import { useRef, useState } from "react"
import { useEffect } from "react"
import { postDatas } from "@/api/api"
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type DetailsSales = {
    sale_details: SaleDetail[]
    venta: Venta
    cliente: Cliente
    product: Product[]
}
type SaleDetail = {
    sale_id: number
    quantity: number
    product_id: number
    price_sale: number
}
type Venta = {
    id: number
    created_at?: string
    total: number
    payment_method: number
}
type Cliente = {
    id: number
    name: string
    email: string
    phone: string
}
type Product = {
    id: number
    name: string
    price?: number
    price_offert?: number
}
export default function DetailsSales() {
    const pdfRef = useRef(null);
    const navigate = useNavigate();
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-PE", {
            style: "currency",
            currency: "PEN",
        }).format(amount)
    }
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState<DetailsSales | null>(null);
    const fetchData = async () => {
        try {
            const response = await postDatas(`ventas`, { id: id });
            console.log(response)

            if (response.success) {
                setData(response.data);
            } else {
               
                setError(response.message.toString());
                navigate("../ventas");
            }

        } catch {
            setError("Error al obtener los datos");
            navigate("../ventas");

        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchData();
    }, [id]);
    const generatePDF = () => {
        if (pdfRef.current) {
            // Ignorar el prettier que marca error
            // prettier-ignore
            const cardFooter: HTMLElement | null = (pdfRef.current as HTMLElement).querySelector('.card-footer');
            const footerOriginalDisplay = cardFooter ? cardFooter.style.display : null;
            if (cardFooter) cardFooter.style.display = 'none';

            html2canvas(pdfRef.current).then(canvas => {
                try {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = pdf.internal.pageSize.getHeight();
                    const imgWidth = canvas.width;
                    const imgHeight = canvas.height;
                    const ratio = Math.min((pdfWidth - 20) / imgWidth, pdfHeight / imgHeight);

                    // Agregar padding horizontal (10mm por lado)
                    const imgX = 10;
                    const imgY = 20;

                    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
                    pdf.save(`factura-${data?.sale_details[0]?.sale_id || 'venta'}.pdf`);
                } finally {
                    // Restaurar la visibilidad del CardFooter
                    if (cardFooter) cardFooter.style.display = footerOriginalDisplay || '';
                }
            });
        }
    }

    return (
        <>
            <HedaerGeneral />
            <div className="container mx-auto py-10 px-4">
                {
                    loading ? <p>Cargando...</p> :
                        error ? <p>{error}</p> :

                            <Card className="w-full max-w-2xl mx-auto" ref={pdfRef}>
                                <CardHeader className="flex flex-row items-start justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-bold">Factura</CardTitle>
                                        <CardDescription className="mt-2">
                                            <div className="text-sm text-muted-foreground">
                                                <div className="font-medium text-dark-500 flex items-center">
                                                    <Building2 className="h-4 w-4 mr-1" />
                                                    <strong className="mr-1">Empresa: </strong> Nombre de la empresa
                                                </div>
                                                <div className="flex items-center mt-2">
                                                    <Mail className="h-4 w-4 mr-1" />
                                                    <strong className="mr-1">Email: </strong> ventas@gmail.com
                                                </div>
                                                <div className="flex items-center mt-1">
                                                    <Phone className="h-4 w-4 mr-1" />
                                                    <strong className="mr-1">Teléfono: </strong> 915068001
                                                </div>
                                                <div className="flex items-center mt-1">
                                                    <FileText className="h-4 w-4 mr-1" />
                                                    <strong className="mr-1">RUC: </strong> 915068001
                                                </div>
                                            </div>
                                        </CardDescription>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-primary">#FAC-2025-{data?.sale_details[0]?.sale_id}</p>
                                        <div className="flex items-center justify-end mt-2 text-sm text-muted-foreground">
                                            <CalendarDays className="h-4 w-4 mr-1" />
                                            <span><strong>Fecha: </strong> {new Date(data?.venta?.created_at?.toString() || "").toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                            })}</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="border rounded-lg p-4">
                                            <h3 className="font-medium text-sm text-muted-foreground mb-2">Facturar a:</h3>
                                            <div className="text-sm font-medium">
                                                <div className=" flex items-center">
                                                    <User className="h-4 w-4 mr-1" />
                                                   <strong>Nombre: </strong> {data?.cliente?.name}
                                                </div>
                                                <div className="flex items-center mt-1">
                                                    <Mail className="h-4 w-4 mr-1" />
                                                    <strong>Email: </strong> {data?.cliente?.email}
                                                </div>
                                                <div className="flex items-center mt-1">
                                                    <Phone className="h-4 w-4 mr-1" />
                                                    <strong>Teléfono: </strong> {data?.cliente?.phone}
                                                </div>
                                                <div className="flex items-center mt-1">
                                                    <CreditCard className="h-4 w-4 mr-1" />
                                                    <strong>Método pago: </strong> 
                                                    {
                                                        data?.venta?.payment_method === 1 ? " Efectivo " : data?.venta?.payment_method === 2 ? " Yape " : data?.venta?.payment_method === 3 ? " Plin " : data?.venta?.payment_method === 4 ? " Transferencia " : " Otro "
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>#</TableHead>
                                                <TableHead>Producto</TableHead>
                                                <TableHead className="text-right">Cantidad</TableHead>
                                                <TableHead className="text-right">Precio Unitario</TableHead>
                                                <TableHead className="text-right">Monto</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data?.product.map((item, key: number) => {
                                                const saleDetail = data?.sale_details.find((sale) => sale.product_id === item.id);

                                                return (
                                                    <TableRow key={key}>
                                                        <TableCell className="font-medium">{key + 1}</TableCell>
                                                        <TableCell className="font-medium">{item.name}</TableCell>
                                                        <TableCell className="text-right">
                                                            {
                                                                data?.sale_details.find((sale: { product_id: number }) => sale.product_id === item.id)?.quantity
                                                            }
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {
                                                                formatCurrency(
                                                                    (data?.product.find(sale => sale.id === item.id)?.price_offert || 0) > 0
                                                                        ? (data?.product.find(sale => sale.id === item.id)?.price_offert || 0)
                                                                        : (data?.product.find(sale => sale.id === item.id)?.price || 0)
                                                                )
                                                            }
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {saleDetail ? formatCurrency(saleDetail.price_sale * saleDetail.quantity) : formatCurrency(0)}
                                                        </TableCell>

                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow>
                                                <TableCell colSpan={4}>Subtotal</TableCell>
                                                <TableCell className="text-right">{formatCurrency(data?.venta?.total || 0)}</TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell colSpan={4} className="font-bold">
                                                    Total
                                                </TableCell>
                                                <TableCell className="text-right font-bold">{formatCurrency(data?.venta?.total || 0)}</TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>

                                    <div className="mt-6 border-t pt-4">
                                        <h3 className="font-medium mb-2">Notas:</h3>
                                        <p className="text-sm text-muted-foreground">¡Gracias por su compra!</p>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between card-footer">

                                    <Button onClick={generatePDF}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Descargar PDF
                                    </Button>
                                </CardFooter>
                            </Card>
                }
            </div>
        </>
    )
}

