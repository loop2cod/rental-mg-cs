'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/commonFunctions'

interface Order {
  _id: string
  order_date: string
  total_amount: number
  outsourced_items: {
    name: string
    quantity: number
    total_price: number
  }
  status: string
}

interface Product {
  _id: string
  product_name: string
  unit_cost: number
  orders: Order[]
}


interface SupplierData {
  supplier: any
  products: Product[]
  total_purchase_amount: number
  total_purchase_quantity: number
}

const SupplierOverview = ({ data, loading }: { data?: any; loading: boolean }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-[300px] w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No supplier data available</p>
      </div>
    )
  }

  const { supplier, products, total_purchase_amount, total_purchase_quantity } = data

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Badge variant="default">Active</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'inreturn':
        return <Badge variant="destructive">In Return</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-muted-foreground">Supplier details and performance</p>
        </div>
        <div className="mt-2 md:mt-0">{getStatusBadge(supplier?.status) || 'NIL'}</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-sm font-medium">Total Purchases</CardDescription>
            <CardTitle className="text-4xl">{total_purchase_amount && formatCurrency(total_purchase_amount||0)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-sm font-medium">Total Quantity</CardDescription>
            <CardTitle className="text-4xl">{total_purchase_quantity}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-sm font-medium">Products</CardDescription>
            <CardTitle className="text-4xl">{products?.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-sm font-medium">Contact</CardDescription>
            <CardTitle className="text-xl">{supplier?.contact || 'NIL'}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supplier Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
          <h1 className="text-2xl font-bold tracking-tight">{supplier?.name || 'NIL'}</h1>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <p>{supplier?.address || 'NIL'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Products supplied by {supplier?.name || 'NIL'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead>Total Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((product:any , i:any) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{product.product_name}</TableCell>
                  <TableCell>{product.unit_cost ? formatCurrency(product.unit_cost) : 'NIL'}</TableCell>
                  <TableCell>{product.orders.length}</TableCell>
                  <TableCell>
                    {product.orders ? formatCurrency(product.orders.reduce((sum:any, order:any) => sum + order.outsourced_items.total_price, 0)) : 'NIL'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>The most recent orders from this supplier</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.flatMap((product:any) =>
                product?.orders?.map((order:any,i:any) => (
                  <TableRow key={`${product._id}-${order._id}`}>
                    <TableCell className="font-medium">{order._id.slice(-6)}</TableCell>
                    <TableCell>{formatDate(order.order_date)}</TableCell>
                    <TableCell>{order.outsourced_items.name}</TableCell>
                    <TableCell>{order.outsourced_items.quantity}</TableCell>
                    <TableCell>{order?.outsourced_items?.total_price ? formatCurrency(order.outsourced_items.total_price) : 'NIL'}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default SupplierOverview