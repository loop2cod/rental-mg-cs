"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowRight,
  CalendarIcon,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  IndianRupee,
  Info,
  Package,
  PackageCheck,
  PackageX,
  ShoppingCart,
  Tag,
  Truck,
  TruckIcon,
  XCircle,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { get } from "@/utilities/AxiosInterceptor"
import { API_ENDPOINTS } from "@/lib/apiEndpoints"
import { toast } from "../ui/use-toast"
import { formatCurrency } from "@/lib/commonFunctions"
import { Progress } from "../ui/progress"
import React from 'react'
import { printProductOverview } from "@/components/PdfPrint/printProductOverview"

interface ResponseType {
  success: boolean
  data?: {
    product: {
      _id: string
      name: string
      description: string
      unit_cost: number
      features: {
        color: string
        height: string
        width: string
        [key: string]: string
      }
      reserved_quantity: number
      available_quantity: number
    }
    orders: Array<{
      _id: string
      user_id: string
      address: string
      from_date: string
      to_date: string
      from_time: string
      to_time: string
      order_date: string
      discount: number
      sub_total: number
      total_amount: number
      order_items: {
        product_id: string
        name: string
        price: number
        quantity: number
        total_price: number
        _id: string
      }
      status: string
    }>
  }
  message?: string
}

const ProductOverview = ({ pid }: any) => {
  const [loading, setLoading] = useState(true)
  const [productData, setProductData] = useState<any>({})
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)


  const getProductOverview = async () => {
    setLoading(true)
    try {
      const response = await get<ResponseType>(`${API_ENDPOINTS.INVENTORY.OVERVIEW}/${pid}`, {
        withCredentials: true,
      });
      if (response.success) {
        setProductData(response.data)
        setLoading(false)
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch product overview",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to fetch product overview",
        variant: "destructive",
      })
    }finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProductOverview()
  }, [])

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null)
    } else {
      setExpandedOrderId(orderId)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "in-dispatch":
        return <TruckIcon className="h-4 w-4" />
      case "delivered":
        return <CheckCircle2 className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      case "returned":
        return <PackageX className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in-dispatch":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      case "delivered":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "returned":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case "pending":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const formatDateRange = (fromDate: string, toDate: string) => {
    const from = new Date(fromDate)
    const to = new Date(toDate)

    // If same day
    if (from.toDateString() === to.toDateString()) {
      return new Date(fromDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    }

    // If same month and year
    if (from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear()) {
      return `${from.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${to.getDate()}, ${to.getFullYear()}`
    }

    // Different months
    return `${from.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${to.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
  }

  if (loading) {
    return <ProductOverviewSkeleton />
  }



  if (!productData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <p>No product data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { product, orders }:any = productData
  const totalQuantity = product.available_quantity + product.reserved_quantity
  const availablePercentage = (product.available_quantity / totalQuantity) * 100

  // Calculate total ordered quantity
  const totalOrderedQuantity = orders.reduce((total:number, order:any) => total + order.order_items.quantity, 0)

  // Calculate total revenue
  const totalRevenue = orders.reduce((total:number, order:any) => total + order.total_amount, 0)

  return (
    <div className="space-y-6 px-2 md:px-2 lg:px-4">
      <div className="flex justify-end mb-2">
        <Button onClick={() => printProductOverview(productData)}>
          Print PDF
        </Button>
      </div>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Inventory</p>
                <h3 className="text-2xl font-bold mt-1">{totalQuantity} units</h3>
              </div>
              <div className="h-12 w-12  rounded-full flex items-center justify-center">
                <Package className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Available: {product.available_quantity}</span>
                <span>Reserved: {product.reserved_quantity}</span>
              </div>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full">
                      {availablePercentage.toFixed(0)}% Available
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded">
                  <Progress value={availablePercentage} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <h3 className="text-2xl font-bold mt-1">{orders.length}</h3>
              </div>
              <div className="h-12 w-12  rounded-full flex items-center justify-center">
                <ShoppingCart className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Total Quantity Ordered</p>
              <p className="text-lg font-semibold">{totalOrderedQuantity} units</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1">{formatCurrency(totalRevenue||0)}</h3>
              </div>
              <div className="h-12 w-12  rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Unit Price</p>
              <p className="text-lg font-semibold">{formatCurrency(product.unit_cost||0)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
            <PackageCheck className="h-6 w-6" />
            Product Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex justify-center">
              <div className="relative w-full max-w-[250px] aspect-square  rounded-md overflow-hidden flex items-center justify-center">
                <Image
                  src={product.image||'/placeholder.svg?height=250&width=250'}
                  alt={product.name}
                  width={250}
                  height={250}
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 text-center bg-primary text-primary-foreground rounded-b-xl">
                  <p className="text-sm font-medium">{product.name}</p>
                </div>
              </div>
            </div>

            <div className="md:w-2/3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">{product.name}</h2>
                </div>
                <Badge variant="outline" className="w-fit flex items-center gap-1 px-3 py-1 text-base">
                  <Tag className="h-4 w-4" />
                  <span>{formatCurrency(product.unit_cost)}</span>
                </Badge>
              </div>

              <p className="text-muted-foreground mb-6">{product.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className=" p-4 rounded-md">
                  <h3 className="font-medium mb-3 flex items-center gap-2 ">
                    <Info className="h-4 w-4" />
                    Product Specifications
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(product.features).map(([key, value] : any) => (
                      <div key={key} className="flex justify-between text-sm border-b  pb-2">
                        <span className="text-muted-foreground capitalize font-medium">{key}</span>
                        <span className="font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className=" p-4 rounded-md">
                  <h3 className="font-medium mb-3 flex items-center gap-2 ">
                    <ShoppingCart className="h-4 w-4" />
                    Inventory Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm border-b pb-2">
                      <span className="text-muted-foreground font-medium">Available</span>
                      <span className="font-semibold">{product.available_quantity} units</span>
                    </div>
                    <div className="flex justify-between text-sm border-b  pb-2">
                      <span className="text-muted-foreground font-medium">Reserved</span>
                      <span className="font-semibold text-destructive">{product.reserved_quantity} units</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-medium">Total</span>
                      <span className="font-semibold">{totalQuantity} units</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Recent Orders
          </CardTitle>
          <CardDescription>Showing all {orders.length} orders for this product</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>No orders found for this product</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Delivery Period</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order:any) => (
                    <React.Fragment key={order._id}>
                      <TableRow
                        className={` cursor-pointer ${expandedOrderId === order._id ? " border-b-0" : ""}`}
                        onClick={() => toggleOrderDetails(order._id)}
                      >
                        <TableCell className="p-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleOrderDetails(order._id)
                            }}
                          >
                            {expandedOrderId === order._id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="cursor-help underline decoration-dotted underline-offset-2">
                                {order._id.substring(order._id.length - 8)}
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Full ID: {order._id}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          {new Date(order.order_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="font-medium">{order.order_items.quantity}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(order.total_amount)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`flex items-center gap-1 ${getStatusColor(order.status)}`}
                          >
                            {getStatusIcon(order.status)}
                            <span>{order.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                              <span>{formatDateRange(order.from_date, order.to_date)}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>
                                {order.from_time} - {order.to_time}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Expanded Order Details */}
                      {expandedOrderId === order._id && (
                        <TableRow>
                          <TableCell colSpan={7} className="p-0">
                            <div className="border-t border-dashed mx-4 pt-4 pb-2">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                                <div className=" p-4 rounded-md border">
                                  <h3 className="font-medium mb-3 flex items-center gap-2">
                                    <Truck className="h-4 w-4" />
                                    Shipping Information
                                  </h3>
                                  <div className="space-y-4 text-sm">
                                    <div className="p-3 border rounded-md">
                                      <p className="font-medium mb-1">Delivery Address</p>
                                      <p className="text-muted-foreground text-pretty">{order.address}</p>
                                    </div>

                                    <div className="p-3 border rounded-md">
                                      <div className="flex items-center gap-2 mb-2">
                                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Delivery Period</span>
                                      </div>
                                      <div className="flex items-center justify-between text-sm">
                                        <div className="flex flex-col">
                                          <span className="text-xs text-muted-foreground">From</span>
                                          <span>
                                            {new Date(order.from_date).toLocaleDateString("en-US", {
                                              weekday: "short",
                                              month: "short",
                                              day: "numeric",
                                              year: "numeric",
                                            })}
                                          </span>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                        <div className="flex flex-col">
                                          <span className="text-xs text-muted-foreground">To</span>
                                          <span>
                                            {new Date(order.to_date).toLocaleDateString("en-US", {
                                              weekday: "short",
                                              month: "short",
                                              day: "numeric",
                                              year: "numeric",
                                            })}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="p-3 border rounded-md">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Time Window</span>
                                      </div>
                                      <div className="flex items-center justify-between text-sm">
                                        <div className="flex flex-col">
                                          <span className="text-xs text-muted-foreground">From</span>
                                          <span>{order.from_time}</span>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                        <div className="flex flex-col">
                                          <span className="text-xs text-muted-foreground">To</span>
                                          <span>{order.to_time}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="p-4 rounded-md border">
                                  <h3 className="font-medium mb-3 flex items-center gap-2">
                                    <IndianRupee className="h-4 w-4" />
                                    Payment Summary
                                  </h3>
                                  <div className="space-y-3">
                                    <div className="p-3 border rounded-md">
                                      <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">Product</span>
                                        <span className="font-medium">{order.order_items.name}</span>
                                      </div>
                                      <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">Unit Price</span>
                                        <span>{formatCurrency(order.order_items.price)}</span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Quantity</span>
                                        <span>{order.order_items.quantity} units</span>
                                      </div>
                                    </div>

                                    <div className="p-3 border rounded-md">
                                      <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>{formatCurrency(order.sub_total)}</span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Discount</span>
                                        <span>-{formatCurrency(order.discount||0)}</span>
                                      </div>
                                      <Separator className="my-2" />
                                      <div className="flex justify-between font-medium">
                                        <span>Total</span>
                                        <span className="text-lg">{formatCurrency(order.total_amount)}</span>
                                      </div>
                                    </div>

                                    <div className="p-3 borderrounded-md ">
                                      <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Order Date</span>
                                        <span className="font-medium">
                                          {new Date(order.order_date).toLocaleDateString("en-US", {
                                            weekday: "long",
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                          })}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Loading skeleton
const ProductOverviewSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Quick Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32 mt-2" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
              <div className="mt-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product Information Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex justify-center">
              <Skeleton className="w-full max-w-[250px] aspect-square rounded-md" />
            </div>

            <div className="md:w-2/3">
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />

              <Skeleton className="h-4 w-full mb-4" />

              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-md">
                  <Skeleton className="h-5 w-40 mb-4" />
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-md">
                  <Skeleton className="h-5 w-40 mb-4" />
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProductOverview
