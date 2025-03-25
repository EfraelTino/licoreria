import { CashRegisterClosing } from '@/components/caja/cash-register-closing'
import { CashRegisterDashboard } from '@/components/caja/cash-register-dashboard'
import { CashRegisterOpening } from '@/components/caja/cash-register-opening'
import { ClosingHistory } from '@/components/caja/closing-history'
import { SalesRegister } from '@/components/caja/sales-register'
import { DetailAmounts } from '@/components/detail-amounts'
import { HedaerGeneral } from '@/components/header-general'
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tabs } from '@/components/ui/tabs'

export const Ventas = () => {
  return (
    <>
      <HedaerGeneral />

      <div className='container mx-auto p-4 md:p-10'>
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="opening">Opening</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="closing">Closing</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="opening">
          <CashRegisterOpening />
        </TabsContent>
        <TabsContent value="dashboard">
          <DetailAmounts />
        </TabsContent>
        <TabsContent value="sales">
          <SalesRegister />
        </TabsContent>
        <TabsContent value="closing">
          <CashRegisterClosing />
        </TabsContent>
        <TabsContent value="history">
          <ClosingHistory />
        </TabsContent>
      </Tabs>
      </div>
    
    </>
  )
}
