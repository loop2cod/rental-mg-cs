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
import { Trash2, Search, Check } from "lucide-react"
import DroppableBookingItems from "./DroppableBookkingItems"
import { ProductList } from "./ProductList"
import { Loader2 } from "lucide-react"
import { convertTo24HourFormat } from "@/lib/commonFunctions"
import { post } from "@/utilities/AxiosInterceptor"
import { API_ENDPOINTS } from "@/lib/apiEndpoints"
import { CustomerInfoForm } from "./CustomerInfoForm"
import { BookingDetailsForm } from "./BookingDetailsForm"
import { Input } from "../ui/input"
import { BookingItemsTable } from "./BookingItemsTable"
import { PaymentSummary } from "./PaymentSummary"
import { OutsourcedProductsSection } from "./OutsourcedProductsSection"
import { useRouter } from "next/navigation"


interface ApiResponseType {
  success: boolean;
  data?: any;
  message?: string;
  errors?: any;
}

const emptyInitialData = {
  user_name: "",
  user_phone: "",
  user_secondary_mobile: "",
  user_proof_type: "aadhar",
  user_proof_id: "",
  from_date: new Date().toISOString().split('T')[0],
  to_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  from_time: "10:00 AM",
  to_time: "12:00 PM",
  booking_date: new Date().toISOString().split('T')[0],
  address: "",
  booking_items: [],
  outsourced_items: [], // Add this line
  total_quantity: 0,
  no_of_days: 1,
  amount_paid: 0,
  sub_total: 0,
  discount: 0,
  total_amount: 0,
  payment_method: "cash",
}

const CreatePreBooking = ({
  products,
  fetchProducts,
  loading,
}: any) => {
  const navigate = useRouter()
  const [formData, setFormData] = useState(emptyInitialData)
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date(formData.from_date))
  const [toDate, setToDate] = useState<Date | undefined>(new Date(formData.to_date))
  const [bookingDate, setBookingDate] = useState<Date | undefined>(new Date(formData.booking_date))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const isMobile = useIsMobile()
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [outsourcedItems, setOutsourcedItems] = useState<any[]>([])

  const filteredProducts = products.filter((product: any) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems: any = [...formData.booking_items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    if (field === "price" || field === "quantity" || field === "no_of_days") {
      const price = field === "price" ? value : updatedItems[index].price
      const quantity = field === "quantity" ? value : updatedItems[index].quantity
      const days = field === "no_of_days" ? value : updatedItems[index].no_of_days || formData.no_of_days
      updatedItems[index].total_price = price * quantity * days
      if (field === "no_of_days") {
        updatedItems[index].no_of_days = days
      }
    }

    setFormData((prev) => ({
      ...prev,
      booking_items: updatedItems,
      total_quantity: updatedItems.reduce((sum: any, item: any) => sum + Number(item.quantity), 0),
      total_amount: updatedItems.reduce((sum: any, item: any) => sum + Number(item.total_price), 0),
    }))
  }

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
    const updatedItems = formData.booking_items.filter((_, i) => i !== index)
    setFormData((prev) => ({
      ...prev,
      booking_items: updatedItems,
      total_quantity: updatedItems.reduce((sum, item: any) => sum + Number(item.quantity), 0),
      total_amount: updatedItems.reduce((sum, item: any) => sum + Number(item.total_price), 0),
    }))
  }

  const addProductToBooking = (product: any) => {
    const existingItemIndex = formData.booking_items.findIndex((item: any) => item.name === product.name)

    if (existingItemIndex >= 0) {
      const updatedItems: any = [...formData.booking_items]
      updatedItems[existingItemIndex].quantity += 1
      updatedItems[existingItemIndex].total_price =
        updatedItems[existingItemIndex].price * updatedItems[existingItemIndex].quantity

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
        no_of_days: formData.no_of_days, // Add this line
        total_price: product.unit_cost * Number(formData?.no_of_days), // Multiply by days
        from_date: formData.from_date,
        to_date: formData.to_date,
        from_time: formData.from_time,
        to_time: formData.to_time,
      }

      setFormData((prev: any) => {
        const updatedItems = [...prev.booking_items, newItem]
        return {
          ...prev,
          booking_items: updatedItems,
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
    // Validate customer information
    if (!formData.user_name || !formData.user_phone) {
      toast({
        title: "Validation Error",
        description: "Please fill all customer information fields",
        variant: "destructive",
      })
      return false
    }
    if(!fromDate){
      toast({
        title: "Validation Error",
        description: "Please select a from date",
        variant: "destructive",
      })
      return false;
    }
    if(!toDate){
      toast({
        title: "Validation Error",
        description: "Please select a to date",
        variant: "destructive",
      })
      return false;
    }
    // Validate phone number is exactly 10 digits
    const phoneRegex = /^\d{10}$/
    if (!phoneRegex.test(formData.user_phone)) {
      toast({
        title: "Validation Error",
        description: "Phone number must be exactly 10 digits",
        variant: "destructive",
      })
      return false
    }

    // Validate at least one booking item or outsourced item
    if (formData.booking_items.length === 0 && formData.outsourced_items.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one booking item or outsourced item",
        variant: "destructive",
      })
      return false
    }

    // Validate number of days is at least 1
    if (formData.no_of_days < 1) {
      toast({
        title: "Validation Error",
        description: "Number of days must be at least 1",
        variant: "destructive",
      })
      return false
    }

    // Additional validation for booking items if they exist
    if (formData.booking_items.length > 0) {
      for (const item of formData.booking_items as any) {
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

    // Additional validation for outsourced items if they exist
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
    e.preventDefault();
  
    if (!validateForm()) return;
  
    // Calculate final amounts
    const bookingItemsTotal = formData.booking_items?.reduce(
      (sum: number, item: any) => sum + Number(item.total_price || 0), 
      0
    ) || 0;
  
    const outsourcedItemsTotal = formData.outsourced_items?.reduce(
      (sum: number, item: any) => sum + (Number(item.price || 0) * Number(item.quantity || 0) * Number(item.no_of_days || 1)), 
      0
    ) || 0;
  
    const subtotal = bookingItemsTotal + outsourcedItemsTotal;
    const discount = Number(formData.discount) || 0;
    const total_amount = subtotal - discount;
  
    // Validate total amount is not negative
    if (total_amount < 0) {
      toast({
        title: "Validation Error",
        description: "Total amount cannot be negative after discount",
        variant: "destructive",
      });
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const fromDateAdjusted = new Date(fromDate!.getTime() - (fromDate!.getTimezoneOffset() * 60000))
      const toDateAdjusted = new Date(toDate!.getTime() - (toDate!.getTimezoneOffset() * 60000))

      const formattedData = {
        ...formData,
        from_date: fromDateAdjusted.toISOString().split('T')[0],
        to_date: toDateAdjusted.toISOString().split('T')[0],
        from_time: formData.from_time.replace(/\s+(AM|PM)$/i, ''),
        to_time: formData.to_time.replace(/\s+(AM|PM)$/i, ''),
        outsourced_items: outsourcedItems,
        sub_total: subtotal,
        discount,
        total_amount,
      };
  
      const response = await post<ApiResponseType>(
        API_ENDPOINTS.BOOKING.CREATE,
        formattedData,
        { withCredentials: true }
      );
  
      if (response.success) {
        toast({
          title: "Booking created",
          description: "Your booking has been created successfully",
        });
        // Reset form
        setFormData(emptyInitialData)
        setOutsourcedItems([])
        navigate.push('/list-pre-bookings')
      } else {
        toast({
          title: "Error",
          description: response.message || response.errors[0].msg || "Failed to create booking",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.log(error)
      toast({
        title: "Error",
        description: error.response?.data?.errors[0].msg || error.response?.data?.message || "Failed to create booking",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <DndProvider backend={dndBackend}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-1 md:px-4">
        <div className="lg:col-span-2">
          <Card className="py-0">
            <ScrollArea className="h-[92vh] py-4">
              <CardHeader>
                <CardTitle className="text-2xl">Create Pre-Booking</CardTitle>
                <CardDescription>Enter customer and booking details</CardDescription>
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
                  handleNoOfDaysChange={handleNoOfDaysChange} // Add this prop
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
                                    ₹{product.unit_cost} • {product.quantity} available
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

                  <DroppableBookingItems onDrop={addProductToBooking}>
                    <BookingItemsTable
                      bookingItems={formData.booking_items}
                      handleItemChange={handleItemChange}
                      removeItem={removeItem}
                    />
                  </DroppableBookingItems>
                </div>
                <OutsourcedProductsSection
                  formData={formData}
                  outsourcedItems={outsourcedItems}
                  setOutsourcedItems={setOutsourcedItems}
                  setFormData={setFormData}
                />

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <PaymentSummary
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button"
                onClick={()=>{
                  navigate.push('/list-pre-bookings')
                }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} onClick={handleSubmit}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Booking"}
                </Button>
              </CardFooter>
            </ScrollArea>
          </Card>
        </div>

        <div className="lg:col-span-1 w-full">
          <ProductList products={products} loading={loading} onAddToBooking={addProductToBooking} />
        </div>
      </div>
    </DndProvider>
  )
}

export default CreatePreBooking