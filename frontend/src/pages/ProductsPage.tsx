{/**Using */}
import { useEffect, useState } from "react"
import { HedaerGeneral } from "@/components/header-general"
import { getDatas } from "@/api/api"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TabsContent } from "@radix-ui/react-tabs"
import { Brand, Categories } from "@/lib/types"
import { CategoriesPage } from "@/components/product/categories"
import { ProductTable } from "@/components/product/product-table"
import { Card } from "@/components/ui/card"
{/**import { BrandsPage } from "@/components/product/brands" */}

// Product type definition
type Product = {
    id?: number
    name: string
    name_cat?: string
    name_brand?: string
    price?: number | null
    price_offert?: number | null
    description: string
    stock?: number | null
    image?: string | null
    id_category?: number
    id_brand?: number
    idProduct?: number | null
    photo?: string | null
}
export default function ProductsPage() {

    // State for product form dialog
    const [productos, setProductos] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Categories[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    // Form state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{
        errorProducts: string;
        errorCategorie: string;
        errorBrands: string;
    }>({
        errorProducts: "",
        errorCategorie: "",
        errorBrands: "",
    });
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await getDatas("/productos");
            console.log(response.message);
            if (response.success) {
                setError(prev => ({
                    ...prev,
                    errorProducts: "",
                }));
                return setProductos(response.message);
            }
            setError(prev => ({
                ...prev,
                errorProducts: response.message,
            }));
        } catch (error) {
            console.log(error);
            setError(prev => ({
                ...prev,
                errorProducts: "Error al obtener los productos",
            }));
        } finally {
            setLoading(false);
        }
    }
    const fetchCategories = async () => {
        try {
            const response = await getDatas("/categorias");
            console.log(response);
            if (response.success) {
                setError(prev => ({
                    ...prev,
                    errorCategorie: "",
                }));
                return setCategories(response.message);
            }else{
                setError(prev => ({
                    ...prev,
                    errorCategorie: response.message.toString(),
                }));
            }
           
        } catch (error) {
            console.log(error);
            setError(prev => ({
                ...prev,
                errorCategorie: "Error al obtener las categorías",
            }));
        } finally {
            setLoading(false);
        }
    }
    const fetchBrands = async () => {
        try {
            const response = await getDatas("/marcas");
            console.log(response);
            if (response.success) {
                setError(prev => ({
                    ...prev,
                    errorBrands: "",
                }));
                return setBrands(response.message);
            }
            setError(prev => ({
                ...prev,
                errorBrands: response.message,
            }));
        } catch (error) {
            console.log(error);
            setError(prev => ({
                ...prev,
                errorBrands: "Error al obtener las marcas",
            }));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProducts();
        fetchCategories();
       fetchBrands();
    }, []);
    const [initialFormData, setInitialFormData] = useState<Product>({

        name: "",
        name_cat: "",
        name_brand: "",
        price: 0,
        price_offert: 0,
        description: "",
        stock: 0,
        image: null,
    })

    // Handle opening the form for adding a new product





    return (
        <>
            <HedaerGeneral />
 
                <div className="container mx-auto p-4 md:p-10 space-y-2">
                <Card className="p-4 md:p-10">
                <Tabs defaultValue="productos" >
                <div className="flex justify-center w-full">
                    <TabsList className="flex justify-center">
                        <TabsTrigger value="productos">Productos</TabsTrigger>
                        <TabsTrigger value="categorias">Categorías</TabsTrigger>
                        {/**<TabsTrigger value="marcas">Marcas</TabsTrigger> */}
                    </TabsList>
                </div>
                <TabsContent value="categorias" >
                    <CategoriesPage errorCategories={error.errorCategorie} categories={categories} loading={loading} fetchCategories={fetchCategories} />
                </TabsContent>
                {/**<TabsContent value="marcas">
     
                     <BrandsPage brand={brands} errorBrands = {error.errorBrands} loading={loading} fetchBrands={fetchBrands} />
             
                </TabsContent> */}
                <TabsContent value="productos" className="">
                    <ProductTable error={error.errorProducts} loading={loading} fetchProducts={fetchProducts} initialFormData={initialFormData} setInitialFormData={setInitialFormData} productos={productos} categories={categories} brands={brands} fetchCategories={fetchCategories} fetchBrands={fetchBrands} />

                </TabsContent>
            </Tabs>
                </Card>

                </div>

        </>
    )
}

