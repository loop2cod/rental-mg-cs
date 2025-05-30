'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink, ChevronDown, ChevronUp, Truck, Undo } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/commonFunctions"
import { OrderDispatchHistory } from "./OrderDispatchHistory"
import { Button } from "@/components/ui/button"
import { DispatchModal } from "./DispatchModal"
import { ReturnModal } from './ReturnModel'

interface OutsourcedItem {
  _id: string
  out_product_id: string
  name: string
  price: number
  quantity: number
  total_price: number
}

interface DispatchItem {
  _id: string
  out_product_id: string
  quantity: number
  dispatch_date: string
  dispatch_time: string
  status: 'dispatched' | 'returned'
}

interface OrderOutsourcedItemsDetailsTableProps {
  items: OutsourcedItem[]
  dispatchItems?: DispatchItem[]
  orderId: string
  onDispatchSuccess?: () => void
}

export function OrderOutsourcedItemsDetailsTable({
  items,
  dispatchItems = [],
  orderId,
  onDispatchSuccess
}: OrderOutsourcedItemsDetailsTableProps) {
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null)
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Array<{
    id: string
    name: string
    type: 'product' | 'outsourced'
    maxQuantity: number
  }>>([])
  const [returnModalOpen, setReturnModalOpen] = useState(false)
  const [selectedReturnItems, setSelectedReturnItems] = useState<Array<{
    id: string
    name: string
    type: 'product' | 'outsourced'
    maxQuantity: number
  }>>([])

  const toggleExpand = (productId: string) => {
    setExpandedProduct(expandedProduct === productId ? null : productId)
  }

  const getProductDispatchItems = (productId: string) => {
    return dispatchItems?.filter(item => item.out_product_id === productId) || []
  }

  const getDispatchedQuantity = (productId: string) => {
    return dispatchItems
      ?.filter(item => item.out_product_id === productId && item.status === 'dispatched')
      ?.reduce((sum, item) => sum + item.quantity, 0) || 0
  }

  const getReturnedQuantity = (productId: string) => {
    return dispatchItems
      ?.filter(item => item.out_product_id === productId && item.status === 'returned')
      ?.reduce((sum, item) => sum + item.quantity, 0) || 0
  }

  const getAvailableForReturnQuantity = (productId: string) => {
    return getDispatchedQuantity(productId) - getReturnedQuantity(productId)
  }

  const getAvailableForDispatchQuantity = (productId: string) => {
    const item = items.find(i => i._id === productId)
    if (!item) return 0
    return item.quantity - getDispatchedQuantity(productId)
  }

  const handleBulkDispatch = () => {
    setSelectedItems(items.map(item => ({
      id: item._id,
      name: item.name,
      type: 'outsourced',
      maxQuantity: getAvailableForDispatchQuantity(item._id)
    })))
    setDispatchModalOpen(true)
  }

  const handleSingleDispatch = (item: OutsourcedItem) => {
    setSelectedItems([{
      id: item._id,
      name: item.name,
      type: 'outsourced',
      maxQuantity: getAvailableForDispatchQuantity(item._id)
    }])
    setDispatchModalOpen(true)
  }

  const handleBulkReturn = () => {
    setSelectedReturnItems(items
      .filter(item => getAvailableForReturnQuantity(item._id) > 0)
      .map(item => ({
        id: item._id,
        name: item.name,
        type: 'outsourced',
        maxQuantity: getAvailableForReturnQuantity(item._id)
      })))
    setReturnModalOpen(true)
  }

  const handleSingleReturn = (item: OutsourcedItem) => {
    const availableForReturn = getAvailableForReturnQuantity(item._id)
    if (availableForReturn > 0) {
      setSelectedReturnItems([{
        id: item._id,
        name: item.name,
        type: 'outsourced',
        maxQuantity: availableForReturn
      }])
      setReturnModalOpen(true)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Outsourced Items</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDispatch}
              className='text-xs'
              disabled={items.every(item => 
                getAvailableForDispatchQuantity(item.out_product_id) <= 0
              )}
            >
              <Truck className="mr-1 h-4 w-4" /> Dispatch All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkReturn}
              className='text-xs'
              disabled={items.every(item => 
                getAvailableForReturnQuantity(item.out_product_id) <= 0
              )}
            >
              <Undo className="mr-1 h-4 w-4" /> Return All
            </Button>
            <Badge variant="outline" className="ml-auto">
              {items.length} {items.length === 1 ? "item" : "items"}
            </Badge>
          </div>
        </div>
        <CardDescription>Items sourced from external vendors</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Dispatched</TableHead>
                <TableHead className="text-right">Returned</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const productDispatchItems = getProductDispatchItems(item._id)
                const hasDispatchHistory = productDispatchItems.length > 0
                const dispatchedQuantity = getDispatchedQuantity(item._id)
                const returnedQuantity = getReturnedQuantity(item._id)
                const dispatchPercentage = (dispatchedQuantity / item.quantity) * 100
                const returnPercentage = (returnedQuantity / item.quantity) * 100
                const availableForDispatch = getAvailableForDispatchQuantity(item._id)
                const availableForReturn = getAvailableForReturnQuantity(item._id)

                return (
                  <React.Fragment key={item._id}>
                    <TableRow
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => hasDispatchHistory && toggleExpand(item._id)}
                    >
                      <TableCell>
                        {hasDispatchHistory && (
                          expandedProduct === item._id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span>
                            {dispatchedQuantity} of {item.quantity}
                          </span>
                          <Progress
                            value={dispatchPercentage}
                            className="h-2 w-20"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span>
                            {returnedQuantity} of {item.quantity}
                          </span>
                          <Progress
                            value={returnPercentage}
                            className="h-2 w-20"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.total_price)}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSingleDispatch(item)
                          }}
                          className='text-xs'
                          disabled={availableForDispatch <= 0}
                        >
                          <Truck className="mr-1 h-4 w-4" /> Dispatch
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSingleReturn(item)
                          }}
                          className='text-xs'
                          disabled={availableForReturn <= 0}
                        >
                          <Undo className="mr-1 h-4 w-4" /> Return
                        </Button>
                      </TableCell>
                    </TableRow>

                    {expandedProduct === item._id && (
                      <TableRow>
                        <TableCell colSpan={8} className="p-0">
                          <div className="bg-primary/10">
                            <OrderDispatchHistory
                              dispatchItems={productDispatchItems}
                              title={`Dispatch History for ${item.name}`}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <DispatchModal
        open={dispatchModalOpen}
        onOpenChange={setDispatchModalOpen}
        orderId={orderId}
        items={selectedItems}
        onSuccess={() => {
          setDispatchModalOpen(false)
          onDispatchSuccess?.()
        }}
      />
      <ReturnModal
        open={returnModalOpen}
        onOpenChange={setReturnModalOpen}
        orderId={orderId}
        items={selectedReturnItems}
        onSuccess={() => {
          setReturnModalOpen(false)
          onDispatchSuccess?.()
        }}
      />
    </Card>
  )
}