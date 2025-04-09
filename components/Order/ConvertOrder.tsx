"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "../ui/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "../ui/badge"
import { Trash2, Search, Check, Rss } from "lucide-react"
import { Loader2 } from "lucide-react"
import { convertTo24HourFormat } from "@/lib/commonFunctions"
import { post, get, put } from "@/utilities/AxiosInterceptor"
import { API_ENDPOINTS } from "@/lib/apiEndpoints"
import { Input } from "../ui/input"
import { useRouter } from "next/navigation"
import { CustomerInfoForm } from "../PreBooking/CustomerInfoForm"
import { BookingDetailsForm } from "../PreBooking/BookingDetailsForm"
import DroppableOrderItems from "./DroppableOrderItems"
import {OrderItemsTable} from "./OrderItemsTable"
import { OutsourcedProductsSection } from "../PreBooking/OutsourcedProductsSection"
import { PaymentSummary } from "../PreBooking/PaymentSummary"
import {OrderProductList} from "./OrderProductList"

interface ApiResponseType {
  success: boolean;
  data?: any;
  message?: string;
  errors?: any;
}

const ConvertOrder = ({
  products,
  fetchProducts,
  loading,
  bookingId
}: any) => {
  const navigate = useRouter()
  const { toast } = useToast()
  const isMobile = useIsMobile()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const emptyInitialData = {
    user_name: "",
    user_phone: "",
    user_proof_type: "aadhar",
    user_proof_id: "",
    from_date: new Date().toISOString().split('T')[0],
    to_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    from_time: "10:00",
    to_time: "12:00",
    order_date: new Date().toISOString().split('T')[0],
    address: "",
    order_items: [],
    outsourced_items: [],
    total_quantity: 0,
    no_of_days: 1,
    amount_paid: 0,
    sub_total: 0,
    discount: 0,
    total_amount: 0,
    payment_method: "cash",
  }

  const [formData, setFormData] = useState(emptyInitialData)
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date(formData.from_date))
  const [toDate, setToDate] = useState<Date | undefined>(new Date(formData.to_date))
  const [bookingDate, setBookingDate] = useState<Date | undefined>(new Date(formData.order_date))
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [outsourcedItems, setOutsourcedItems] = useState<any[]>([])

  const filteredProducts = products.filter((product: any) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await get<ApiResponseType>(
          `${API_ENDPOINTS.BOOKING.GET_BY_ID}/${bookingId}`,
          { withCredentials: true }
        )
  
        if (response.success && response.data) {
          const booking = response.data
          const noOfDays = booking?.no_of_days || 1
  
          const bookingItems = booking.booking_items.map((item: any) => ({
            ...item,
            no_of_days: noOfDays,
            total_price: item.price * item.quantity * noOfDays
          }))
  
          const outsourcedItems = (booking.outsourced_items || []).map((item: any) => ({
            ...item,
            no_of_days: noOfDays,
            total_price: item.price * item.quantity * noOfDays
          }))
  
          const sub_total = [
            ...bookingItems,
            ...outsourcedItems
          ].reduce((sum, item) => sum + Number(item.total_price), 0)
  
          const total_amount = sub_total - (Number(booking.discount) || 0)
  
          setFormData({
            user_name: booking.user_id.name,
            user_phone: booking.user_id.mobile,
            user_proof_type: booking.user_id.proof_type,
            user_proof_id: booking.user_id.proof_id,
            from_date: booking.from_date.split('T')[0],
            to_date: booking.to_date.split('T')[0],
            from_time: booking.from_time,
            to_time: booking.to_time,
            order_date: booking.booking_date.split('T')[0],
            address: booking.address,
            order_items: bookingItems,
            outsourced_items: outsourcedItems,
            total_quantity: [
              ...bookingItems,
              ...outsourcedItems
            ].reduce((sum, item) => sum + Number(item.quantity), 0),
            no_of_days: booking.no_of_days || noOfDays,
            sub_total,
            discount: booking.discount || 0,
            amount_paid: booking.amount_paid || 0,
            total_amount,
            payment_method: booking.payment_method || "cash",
          })
  
          setOutsourcedItems(outsourcedItems)
          setFromDate(new Date(booking.from_date))
          setToDate(new Date(booking.to_date))
          setBookingDate(new Date(booking.booking_date))
        }
      } catch (error) {
        // Error handling
      } finally {
        setIsLoading(false)
      }
    }
  
    if (bookingId) {
      fetchBookingDetails()
    }
  }, [bookingId, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    // Ensure we're working with a number for quantity, price, and days
    const numericValue = field === "quantity" || field === "price" || field === "no_of_days" 
      ? Number(value) 
      : value;
  
    setFormData((prev) => {
      // Create a new copy of the order items array
      const updatedItems:any = [...prev.order_items];
      
      // Update the specific field for the item at the given index
      updatedItems[index] = { 
        ...updatedItems[index], 
        [field]: numericValue 
      };
  
      // Recalculate totals if price, quantity, or days changed
      if (field === "price" || field === "quantity" || field === "no_of_days") {
        const price = field === "price" ? numericValue : updatedItems[index].price;
        const quantity = field === "quantity" ? numericValue : updatedItems[index].quantity;
        const days = field === "no_of_days" ? numericValue : (updatedItems[index].no_of_days || prev.no_of_days);
        
        updatedItems[index].total_price = price * quantity * days;
        
        if (field === "no_of_days") {
          updatedItems[index].no_of_days = days;
        }
      }
  
      // Calculate new totals
      const total_quantity = updatedItems.reduce((sum: any, item: any) => sum + Number(item.quantity), 0);
      const total_amount = updatedItems.reduce((sum: any, item: any) => sum + Number(item.total_price), 0);
  
      return {
        ...prev,
        order_items: updatedItems,
        total_quantity,
        total_amount,
      };
    });
  };

  const handleNoOfDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const days = Number(e.target.value)
    setFormData((prev: any) => {
      const updatedItems = prev.booking_items.map((item: any) => ({
        ...item,
        no_of_days: days,
        total_price: item.price * item.quantity * days
      }))

      return {
        ...prev,
        no_of_days: days,
        booking_items: updatedItems,
        total_amount: updatedItems.reduce((sum: any, item: any) => sum + Number(item.total_price), 0),
      }
    })
  }

  const removeItem = (index: number) => {
    const updatedItems = formData.order_items.filter((_, i) => i !== index)
    setFormData((prev) => ({
      ...prev,
      booking_items: updatedItems,
      total_quantity: updatedItems.reduce((sum, item: any) => sum + Number(item.quantity), 0),
      total_amount: updatedItems.reduce((sum, item: any) => sum + Number(item.total_price), 0),
    }))
  }

  const addProductToBooking = (product: any) => {
    const existingItemIndex = formData.order_items.findIndex((item: any) => item.name === product.name)

    if (existingItemIndex >= 0) {
      const updatedItems: any = [...formData.order_items]
      updatedItems[existingItemIndex].quantity += 1
      updatedItems[existingItemIndex].total_price =
        updatedItems[existingItemIndex].price * updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].no_of_days

      setFormData((prev) => ({
        ...prev,
        booking_items: updatedItems,
        total_quantity: updatedItems.reduce((sum: any, item: any) => sum + Number(item.quantity), 0),
        total_amount: updatedItems.reduce((sum: any, item: any) => sum + Number(item.total_price), 0),
      }))

      toast({
        title: "Item quantity updated",
        description: `${product.name} quantity increased`,
      })
    } else {
      const newItem = {
        product_id: product._id,
        name: product.name,
        price: product.unit_cost,
        quantity: 1,
        available_quantity: product.available_quantity,
        no_of_days: formData.no_of_days,
        total_price: product.unit_cost * formData.no_of_days,
        from_date: formData.from_date,
        to_date: formData.to_date,
        from_time: formData.from_time,
        to_time: formData.to_time,
      }

      setFormData((prev: any) => {
        const updatedItems = [...prev.order_items, newItem]
        return {
          ...prev,
          order_items: updatedItems,
          total_quantity: updatedItems.reduce((sum, item) => sum + Number(item.quantity), 0),
          total_amount: updatedItems.reduce((sum, item) => sum + Number(item.total_price), 0),
        }
      })

      toast({
        title: "Item added",
        description: `${product.name} added to booking`,
      })
    }
  }

  const validateForm = () => {
    if (!formData.user_name || !formData.user_phone) {
      toast({
        title: "Validation Error",
        description: "Please fill all customer information fields",
        variant: "destructive",
      })
      return false
    }
  
    const phoneRegex = /^\d{10}$/
    if (!phoneRegex.test(formData.user_phone)) {
      toast({
        title: "Validation Error",
        description: "Phone number must be exactly 10 digits",
        variant: "destructive",
      })
      return false
    }
  
    if (formData.order_items.length === 0 && formData.outsourced_items.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one booking item or outsourced item",
        variant: "destructive",
      })
      return false
    }
  
    if (formData.no_of_days < 1) {
      toast({
        title: "Validation Error",
        description: "Number of days must be at least 1",
        variant: "destructive",
      })
      return false
    }
  
    if (formData.order_items.length > 0) {
      for (const item of formData.order_items as any) {
        if (item.quantity < 1) {
          toast({
            title: "Validation Error",
            description: `Quantity for ${item.name} must be at least 1`,
            variant: "destructive",
          })
          return false
        }
        if (item.quantity > (item.available_quantity || 0)) {
          toast({
            title: "Validation Error",
            description: `Quantity for ${item.name} exceeds available stock (${item.available_quantity || 0})`,
            variant: "destructive",
          })
          return false
        }
        if (item.price <= 0) {
          toast({
            title: "Validation Error",
            description: `Price for ${item.name} must be greater than 0`,
            variant: "destructive",
          })
          return false
        }
        if (item.no_of_days < 1) {
          toast({
            title: "Validation Error",
            description: `Days for ${item.name} must be at least 1`,
            variant: "destructive",
          })
          return false
        }
      }
    }
  
    if (formData.outsourced_items.length > 0) {
      for (const item of formData.outsourced_items as any) {
        if (!item.name || !item.price || !item.quantity) {
          toast({
            title: "Validation Error",
            description: "Please fill all fields for outsourced items",
            variant: "destructive",
          })
          return false
        }
        if (item.quantity < 1) {
          toast({
            title: "Validation Error",
            description: `Quantity for ${item.name} must be at least 1`,
            variant: "destructive",
          })
          return false
        }
        if (item.price <= 0) {
          toast({
            title: "Validation Error",
            description: `Price for ${item.name} must be greater than 0`,
            variant: "destructive",
          })
          return false
        }
      }
    }
  
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    if (!validateForm()) return
  
    // Calculate final amounts including both booking and outsourced items
    const sub_total = [
      ...formData.order_items,
      ...formData.outsourced_items
    ].reduce((sum, item:any) => sum + Number(item.total_price || item.price * item.quantity * (item.no_of_days || formData.no_of_days)), 0)
    
    const discount = Number(formData.discount) || 0
    const total_amount = sub_total - discount
  
    setIsSubmitting(true)
  
    try {
      const formattedData = {
        ...formData,
        booking_id: bookingId,
        from_time: convertTo24HourFormat(formData.from_time),
        to_time: convertTo24HourFormat(formData.to_time),
        outsourced_items: outsourcedItems,
        sub_total,
        discount,
        total_amount,
        total_quantity: [
          ...formData.order_items,
          ...formData.outsourced_items
        ].reduce((sum, item:any) => sum + Number(item.quantity), 0)
      }
  
      const response = await post<ApiResponseType>(
        `${API_ENDPOINTS.ORDER.CREATE}`,
        formattedData,
        { withCredentials: true }
      )
  
      if (response.success) {
        toast({
          title: "Order created",
          description: "Your order has been created successfully",
        })
        navigate.push('/list-orders')
      } else {
        toast({
          title: "Error",
          description: response.errors?.msg || "Failed to update order",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update order",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex(prev =>
        prev < filteredProducts.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0))
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault()
      addProductToBooking(filteredProducts[highlightedIndex])
      setSearchTerm("")
      setHighlightedIndex(-1)
      if (inputRef.current) inputRef.current.focus()
    } else if (e.key === "Escape") {
      setIsSearchFocused(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const dndBackend = HTML5Backend

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <DndProvider backend={dndBackend}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-1 md:px-4">
        <div className="lg:col-span-2">
          <Card className="py-0">
            <ScrollArea className="h-[92vh] py-4">
              <CardHeader>
                <CardTitle className="text-2xl">Make Order</CardTitle>
                <CardDescription>Make an order for the booking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <CustomerInfoForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSelectChange={handleSelectChange}
                />

                <Separator />

                <BookingDetailsForm
                  formData={formData}
                  fromDate={fromDate}
                  setFromDate={setFromDate}
                  toDate={toDate}
                  setToDate={setToDate}
                  bookingDate={bookingDate}
                  setBookingDate={setBookingDate}
                  setFormData={setFormData}
                  handleNoOfDaysChange={handleNoOfDaysChange}
                />

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Booking Items</h3>
                    <Badge variant="outline" className="bg-primary/5">
                      Drag products here or search below
                    </Badge>
                  </div>

                  <div className="relative mb-4" ref={searchRef}>
                    <div className="relative">
                      <Input
                        ref={inputRef}
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onKeyDown={handleKeyDown}
                        className="pr-10"
                      />
                      <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>

                    {isSearchFocused && searchTerm && (
                      <div className="absolute z-10 mt-1 w-full bg-popover shadow-lg rounded-md border border-border max-h-60 overflow-auto">
                        {filteredProducts.length === 0 ? (
                          <div className="p-4 text-sm text-muted-foreground">
                            No products found
                          </div>
                        ) : (
                          <ul>
                            {filteredProducts.map((product: any, index: number) => (
                              <li
                                key={product._id}
                                className={`px-4 py-2 cursor-pointer flex items-center justify-between ${highlightedIndex === index
                                    ? "bg-accent"
                                    : "hover:bg-accent/50"
                                  }`}
                                onClick={() => {
                                  addProductToBooking(product)
                                  setSearchTerm("")
                                  setIsSearchFocused(false)
                                }}
                                onMouseEnter={() => setHighlightedIndex(index)}
                              >
                                <div>
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    ₹{product.unit_cost} • {product.available_quantity} available
                                  </div>
                                </div>
                                {highlightedIndex === index && (
                                  <Check className="h-4 w-4 text-primary" />
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>

                  <DroppableOrderItems onDrop={addProductToBooking}>
                    <OrderItemsTable
                      bookingItems={formData.order_items}
                      handleItemChange={handleItemChange}
                      removeItem={removeItem}
                    />
                  </DroppableOrderItems>
                </div>

                <OutsourcedProductsSection
  formData={formData}
  outsourcedItems={outsourcedItems}
  setOutsourcedItems={(items:any) => {
    setOutsourcedItems(items)
    setFormData((prev:any) => ({
      ...prev,
      outsourced_items: items,
      total_quantity: [
        ...prev.order_items,
        ...items
      ].reduce((sum, item) => sum + Number(item.quantity), 0),
      total_amount: [
        ...prev.order_items,
        ...items
      ].reduce((sum, item) => sum + Number(item.total_price || item.price * item.quantity * (item.no_of_days || prev.no_of_days)), 0) - Number(prev.discount || 0)
    }))
  }}
  setFormData={setFormData}
/>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PaymentSummary
  formData={{
    ...formData,
    // Calculate subtotal including both booking and outsourced items
    sub_total: [
      ...formData.order_items,
      ...formData.outsourced_items
    ].reduce((sum, item:any) => sum + Number(item.total_price || item.price * item.quantity * (item.no_of_days || formData.no_of_days)), 0),
    // Ensure total_amount is calculated correctly
    total_amount: [
      ...formData.order_items,
      ...formData.outsourced_items
    ].reduce((sum, item:any) => sum + Number(item.total_price || item.price * item.quantity * (item.no_of_days || formData.no_of_days)), 0) - Number(formData.discount || 0)
  }}
  handleInputChange={handleInputChange}
  handleSelectChange={handleSelectChange}
/>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => navigate.push('/list-pre-bookings')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} onClick={handleSubmit}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Make Order"}
                </Button>
              </CardFooter>
            </ScrollArea>
          </Card>
        </div>

        <div className="lg:col-span-1 w-full">
          <OrderProductList products={products} loading={loading} onAddToBooking={addProductToBooking} />
        </div>
      </div>
    </DndProvider>
  )
}

export default ConvertOrder


