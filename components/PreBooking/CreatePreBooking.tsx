"use client"

import type React from "react"
import { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DatePicker } from "../ui/date-picker"
import { useToast } from "../ui/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "../ui/badge"
import { Trash2 } from "lucide-react"
import DroppableBookingItems from "./DroppableBookkingItems"
import { ProductList } from "./ProductList"
import { TimePicker } from "../ui/TimePicker"
import { post } from "@/utilities/AxiosInterceptor"
import { API_ENDPOINTS } from "@/lib/apiEndpoints"
import { Loader2 } from "lucide-react"
import { convertTo24HourFormat } from "@/lib/commonFunctions"


interface ApiResponseType {
  success: boolean;
  data?: any;
  message?: string;
  errors?: any;
}

// Initial data from the JSON
const initialData = {
  user_name: "John Doel op",
  user_phone: "9876543210",
  user_proof_type: "aadhar",
  user_proof_id: "123456789012",
  from_date: "2025-03-20",
  to_date: "2025-03-25",
  from_time: "10:00",
  to_time: "12:00",
  booking_date: "2025-03-18",
  booking_items: [
    {
      product_id: "67d4734da2d0768131a5424c",
      name: "Bheem",
      price: 101,
      quantity: 2,
      total_price: 202,
      from_date: "2025-03-20",
      to_date: "2025-03-25",
      from_time: "10:00",
      to_time: "12:00",
    },
    {
      product_id: "67d473d8a2d0768131a54255",
      name: "Product A",
      price: 100,
      quantity: 1,
      total_price: 100,
      from_date: "2025-03-20",
      to_date: "2025-03-25",
      from_time: "10:00",
      to_time: "12:00",
    },
  ],
  total_quantity: 3,
  amount_paid: 150,
  total_amount: 302.0,
  payment_method: "cash",
}

const CreatePreBooking = ({
  products = [
    {
      _id: "67d473d8a2d0768131a54255",
      name: "Product A",
      image: "/placeHolder.jpg",
      unit_cost: 100,
      quantity: 10,
    },
    {
      _id: "67d56904382e70d8b6f3122a",
      name: "Product Aewrr",
      image: "/placeHolder.jpg",
      unit_cost: 100,
      quantity: 10,
    },
    {
      _id: "67d5693b382e70d8b6f3122f",
      name: "Product Aewrrsa",
      image: "/placeHolder.jpg",
      unit_cost: 100,
      quantity: 10,
    },
  ],
  fetchProducts,
  loading,
}: any) => {
  const [formData, setFormData] = useState(initialData)
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date(initialData.from_date))
  const [toDate, setToDate] = useState<Date | undefined>(new Date(initialData.to_date))
  const [bookingDate, setBookingDate] = useState<Date | undefined>(new Date(initialData.booking_date))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const isMobile = useIsMobile()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...formData.booking_items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    // Recalculate total price if price or quantity changes
    if (field === "price" || field === "quantity") {
      const price = field === "price" ? value : updatedItems[index].price
      const quantity = field === "quantity" ? value : updatedItems[index].quantity
      updatedItems[index].total_price = price * quantity
    }

    setFormData((prev) => ({
      ...prev,
      booking_items: updatedItems,
      total_quantity: updatedItems.reduce((sum, item) => sum + Number(item.quantity), 0),
      total_amount: updatedItems.reduce((sum, item) => sum + Number(item.total_price), 0),
    }))
  }

  const removeItem = (index: number) => {
    const updatedItems = formData.booking_items.filter((_, i) => i !== index)
    setFormData((prev) => ({
      ...prev,
      booking_items: updatedItems,
      total_quantity: updatedItems.reduce((sum, item) => sum + Number(item.quantity), 0),
      total_amount: updatedItems.reduce((sum, item) => sum + Number(item.total_price), 0),
    }))
  }

  const addProductToBooking = (product: any) => {
    console.log(product)
    // Check if product already exists in booking items
    const existingItemIndex = formData.booking_items.findIndex((item) => item.name === product.name)

    if (existingItemIndex >= 0) {
      // Update quantity if product already exists
      const updatedItems = [...formData.booking_items]
      updatedItems[existingItemIndex].quantity += 1
      updatedItems[existingItemIndex].total_price =
        updatedItems[existingItemIndex].price * updatedItems[existingItemIndex].quantity

      setFormData((prev) => ({
        ...prev,
        booking_items: updatedItems,
        total_quantity: updatedItems.reduce((sum, item) => sum + Number(item.quantity), 0),
        total_amount: updatedItems.reduce((sum, item) => sum + Number(item.total_price), 0),
      }))

      toast({
        title: "Item quantity updated",
        description: `${product.name} quantity increased`,
      })
    } else {
      console.log(product)
      // Add new product to booking items
      const newItem = {
        product_id: product._id,
        name: product.name,
        price: product.unit_cost,
        quantity: 1,
        total_price: product.unit_cost,
        from_date: formData.from_date,
        to_date: formData.to_date,
        from_time: formData.from_time,
        to_time: formData.to_time,
      }

      setFormData((prev) => {
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
    if (!formData.user_name || !formData.user_phone || !formData.user_proof_type || !formData.user_proof_id) {
      toast({
        title: "Validation Error",
        description: "Please fill all customer information fields",
        variant: "destructive",
      })
      return false
    }

    if (formData.booking_items.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one booking item",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setIsSubmitting(true);
  
    try {
      // Convert times to 24-hour format
      const formattedData = {
        ...formData,
        from_time: convertTo24HourFormat(formData.from_time),
        to_time: convertTo24HourFormat(formData.to_time),
      };
  
      const response = await post<ApiResponseType>(
        API_ENDPOINTS.BOOKING.CREATE,
        formattedData,
        {
          withCredentials: true,
        }
      );
  
    if(response.success){
      toast({
        title: "Booking created",
        description: "Your booking has been created successfully",
      });
    }
      else{
        toast({
          title: "Error",
          description: response.errors.msg || "Failed to create booking. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error:any) {
      console.log(error)
      toast({
        title: "Error",
        description:  error.response?.data?.message || error.response?.data?.errors[0]?.msg || error.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Choose the appropriate backend based on device
  const dndBackend = HTML5Backend

  return (
    <DndProvider backend={dndBackend}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-2 md:px-4">
        <div className="lg:col-span-2">
          <Card className="py-0">
            <ScrollArea className="h-[92vh] py-4">
              <CardHeader>
                <CardTitle className="text-2xl">Create Pre-Booking</CardTitle>
                <CardDescription>Enter customer and booking details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Customer Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="user_name">Customer Name</Label>
                      <Input
                        id="user_name"
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user_phone">Phone Number</Label>
                      <Input
                        id="user_phone"
                        name="user_phone"
                        value={formData.user_phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user_proof_type">ID Proof Type</Label>
                      <Select
                        value={formData.user_proof_type}
                        onValueChange={(value) => handleSelectChange("user_proof_type", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aadhar">Aadhar Card</SelectItem>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="driving_license">Driving License</SelectItem>
                          <SelectItem value="voter_id">Voter ID</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user_proof_id">ID Number</Label>
                      <Input
                        id="user_proof_id"
                        name="user_proof_id"
                        value={formData.user_proof_id}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Booking Details */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Booking Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                    <div className="mb-4 space-y-2">
                      <Label>Booking Date</Label>
                      <DatePicker setDate={setBookingDate} date={bookingDate} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2">
                    <div className="space-y-2">
                      <Label>From Date</Label>
                      <DatePicker setDate={setFromDate} date={fromDate} />
                    </div>
                    <div className="space-y-2">
                      <Label>To Date</Label>
                      <DatePicker setDate={setToDate} date={toDate} />
                    </div>
                    <div className="space-y-2">
                      <Label>From Time</Label>
                      <TimePicker
                        value={formData.from_time}
                        onChange={(value: any) => setFormData((prev) => ({ ...prev, from_time: value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>To Time</Label>
                      <TimePicker
                        value={formData.to_time}
                        onChange={(value: any) => setFormData((prev) => ({ ...prev, to_time: value }))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Booking Items */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Booking Items</h3>
                    <Badge variant="outline" className="bg-primary/5">
                      Drag products here
                    </Badge>
                  </div>

                  <DroppableBookingItems onDrop={addProductToBooking}>
                    <ScrollArea className="h-[300px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item Name</TableHead>
                            <TableHead className="w-[100px]">Price</TableHead>
                            <TableHead className="w-[80px]">Qty</TableHead>
                            <TableHead className="w-[120px]">Total</TableHead>
                            <TableHead className="w-[60px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formData.booking_items.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                Drag and drop products here or click Add on a product
                              </TableCell>
                            </TableRow>
                          ) : (
                            formData.booking_items.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <Input
                                    value={item.name}
                                    onChange={(e) => handleItemChange(index, "name", e.target.value)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    value={item.price}
                                    onChange={(e) => handleItemChange(index, "price", (e.target.value))}
                                    disabled
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, "quantity", (e.target.value))}
                                  />
                                </TableCell>
                                <TableCell className="font-medium">₹{(item.total_price || 0).toFixed(2)}</TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </DroppableBookingItems>
                </div>

                <Separator />

                {/* Payment Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Payment Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Items:</span>
                        <span>{formData.total_quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Amount:</span>
                        <span>₹{formData.total_amount.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <Label htmlFor="payment_method">Payment Method</Label>
                        <Select
                          value={formData.payment_method}
                          onValueChange={(value) => handleSelectChange("payment_method", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="card">Card</SelectItem>
                            <SelectItem value="upi">UPI</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="amount_paid">Amount Paid</Label>
                        <Input
                          id="amount_paid"
                          name="amount_paid"
                          type="number"
                          value={formData.amount_paid}
                          onChange={(e) =>
                            handleInputChange({
                              target: {
                                name: "amount_paid",
                                value: Number(e.target.value),
                              },
                            } as any)
                          }
                        />
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Balance:</span>
                        <span>₹{(formData.total_amount - formData.amount_paid).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} onClick={handleSubmit}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Booking"}
                </Button>
              </CardFooter>
            </ScrollArea>
          </Card>
        </div>

        {/* Products Panel - Collapsible on mobile */}
        <div className="lg:col-span-1 w-full">
          <ProductList products={products} loading={loading} onAddToBooking={addProductToBooking} />
        </div>
      </div>
    </DndProvider>
  )
}

export default CreatePreBooking