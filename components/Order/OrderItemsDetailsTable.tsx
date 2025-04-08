'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, ChevronDown, ChevronUp, Truck, Undo } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/commonFunctions"
import { OrderDispatchHistory } from "./OrderDispatchHistory"
import { Button } from "@/components/ui/button"
import { DispatchModal } from "./DispatchModal"
import { ReturnModal } from './ReturnModel'

interface OrderItem {
  _id: string
  product_id: string
  name: string
  price: number
  quantity: number
  total_price: number
  reserved_quantity?: number
  available_quantity?: number
}

interface OrderItemsDetailsTableProps {
  items: OrderItem[]
  dispatchItems?: any[]
  orderId: string
  onDispatchSuccess?: () => void
}

export function OrderItemsDetailsTable({
  items,
  dispatchItems = [],
  orderId,
  onDispatchSuccess
}: OrderItemsDetailsTableProps) {
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
    return dispatchItems?.filter(item => item.product_id === productId) || []
  }

  const getDispatchedQuantity = (productId: string) => {
    return dispatchItems
      ?.filter(item => item.product_id === productId)
      ?.reduce((sum, item) => sum + item.quantity, 0) || 0
  }

  const handleBulkDispatch = () => {
    setSelectedItems(items.map(item => ({
      id: item.product_id,
      name: item.name,
      type: 'product',
      maxQuantity: item.quantity - getDispatchedQuantity(item.product_id)
    })))
    setDispatchModalOpen(true)
  }

  const handleSingleDispatch = (item: OrderItem) => {
    setSelectedItems([{
      id: item.product_id,
      name: item.name,
      type: 'product',
      maxQuantity: item.quantity - getDispatchedQuantity(item.product_id)
    }])
    setDispatchModalOpen(true)
  }

  const handleBulkReturn = () => {
    setSelectedReturnItems(items.map(item => ({
      id: item.product_id,
      name: item.name,
      type: 'product',
      maxQuantity: getDispatchedQuantity(item.product_id)
    })))
    setReturnModalOpen(true)
  }

  const handleSingleReturn = (item: OrderItem) => {
    setSelectedReturnItems([{
      id: item.product_id,
      name: item.name,
      type: 'product',
      maxQuantity: getDispatchedQuantity(item.product_id)
    }])
    setReturnModalOpen(true)
  }


  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Booked Items</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDispatch}
              className='text-xs'
              disabled={items.every(item =>
                item.quantity <= getDispatchedQuantity(item.product_id)
              )}
            >
              <Truck /> Dispatch All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkReturn}
              className='text-xs'
              disabled={items.every(item =>
                getDispatchedQuantity(item.product_id) <= 0
              )}
            >
              <Undo /> Return All
            </Button>
            <Badge variant="outline" className="ml-auto">
              {items.length} {items.length === 1 ? "item" : "items"}
            </Badge>
          </div>
        </div>
        <CardDescription>Items reserved for this booking</CardDescription>
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
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const productDispatchItems = getProductDispatchItems(item.product_id)
                const hasDispatchHistory = productDispatchItems.length > 0
                const dispatchedQuantity = getDispatchedQuantity(item.product_id)
                const dispatchPercentage = (dispatchedQuantity / item.quantity) * 100
                const remainingQuantity = item.quantity - dispatchedQuantity

                return (
                  <React.Fragment key={item._id}>
                    <TableRow
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => hasDispatchHistory && toggleExpand(item.product_id)}
                    >
                      <TableCell>
                        {hasDispatchHistory && (
                          expandedProduct === item.product_id ? (
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
                      <TableCell className="text-right font-medium">{formatCurrency(item.total_price)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSingleDispatch(item)
                          }}
                          className='text-xs'
                          disabled={remainingQuantity <= 0}
                        >
                          <Truck /> Dispatch
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSingleReturn(item)
                          }}
                          className='text-xs'
                          disabled={getDispatchedQuantity(item.product_id) <= 0}
                        >
                          <Undo /> Return
                        </Button>
                      </TableCell>
                    </TableRow>

                    {expandedProduct === item.product_id && (
                      <TableRow>
                        <TableCell colSpan={7} className="p-0">
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