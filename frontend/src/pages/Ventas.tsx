import { DetailAmounts } from '@/components/detail-amounts'
import { HedaerGeneral } from '@/components/header-general'
export const Ventas = () => {
  return (
    <>
      <HedaerGeneral /> 
      <div className='container mx-auto p-4 md:p-6'>
      <DetailAmounts />
      </div>
    
    </>
  )
}
