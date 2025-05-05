'use client'
import React from 'react'
import { Skeleton } from '../ui/skeleton'
import { Badge } from '../ui/badge'
import { OrderCustomerInfoCard } from './OrderCustomerInfoCard'
import { OrderDetailsCard } from './OrderDetailsCard'
import { OrderPaymentSummaryCard } from './OrderPaymentSummaryCard'
import { OrderOutsourcedItemsDetailsTable } from './OrderOutsourcedItemsDetailsTable'
import { OrderItemsDetailsTable } from './OrderItemsDetailsTable'
import { OrderDispatchHistory } from './OrderDispatchHistory'

const OrderOverview = ({ data, loading,fetchOrder }: any) => {

  const handleDispatchSuccess = () => {
    fetchOrder()
  }


  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return <div className="text-center py-8">No order data available</div>
  }

  // Combine both dispatch item types
  const allDispatchItems = [
    ...(data.dispatch_items || []).map((item: any) => ({ ...item, type: 'product' })),
    ...(data.outsourced_dispatch_items || []).map((item: any) => ({ ...item, type: 'outsourced' }))
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order Overview</h1>
          <p className="text-muted-foreground">Order ID: {data?.order_id}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Badge variant={data?.status === 'inreturn' ? 'default' : 'outline'}>
            {data?.status}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <OrderCustomerInfoCard customer={data?.user} />
        <OrderDetailsCard booking={data} />
        <OrderPaymentSummaryCard booking={data} />
      </div>

      <div className="space-y-4">
      {data?.order_items?.length > 0 && (
          <OrderItemsDetailsTable 
            items={data?.order_items} 
            dispatchItems={data?.dispatch_items}
            orderId={data?._id}
            onDispatchSuccess={handleDispatchSuccess}
          />
        )}
        {data?.outsourced_items?.length > 0 && (
          <OrderOutsourcedItemsDetailsTable 
            items={data?.outsourced_items} 
            dispatchItems={data?.outsourced_dispatch_items}
            orderId={data?._id}
            onDispatchSuccess={handleDispatchSuccess}
          />
        )}
      </div>
    </div>
  )
}

export default OrderOverview