import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CashRegisterOpening } from "@/components/caja/cash-register-opening"
import { CashRegisterClosing } from "@/components/caja/cash-register-closing"
import { ClosingHistoryTwo } from "@/components/caja/closing-history-two"
import { HedaerGeneral } from "@/components/header-general"

export default function Caja() {
  return (
    <>
      <HedaerGeneral />
      <div className="container mx-auto p-4 md:p-6">
        <Tabs defaultValue="opening" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="opening">Opening</TabsTrigger>
            <TabsTrigger value="closing">Closing</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="opening">
            <CashRegisterOpening />
          </TabsContent>

          <TabsContent value="closing">
            <CashRegisterClosing />
          </TabsContent>
          <TabsContent value="history">
            <ClosingHistoryTwo />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

