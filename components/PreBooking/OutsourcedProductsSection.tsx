"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "../ui/use-toast"
import { get, post } from "@/utilities/AxiosInterceptor"
import { API_ENDPOINTS } from "@/lib/apiEndpoints"
import { Textarea } from "../ui/textarea"

interface Supplier {
  _id: string
  name: string
  contact: string
  status: string
}

interface OutsourcedProduct {
  _id: string
  product_name: string
  unit_cost: number
}

interface OutsourcedItem {
  product_id: string
  name: string
  price: number
  quantity: number
  no_of_days: number // Add this
  total_price: number
}

type ResponseType = {
  success: boolean;
  data?: any;
  message?: string;
}

export const OutsourcedProductsSection = ({ 
  formData,
  outsourcedItems,
  setOutsourcedItems,
  setFormData
}: {
  formData: any,
  outsourcedItems: OutsourcedItem[],
  setOutsourcedItems: (items: OutsourcedItem[]) => void,
  setFormData: React.Dispatch<React.SetStateAction<any>>
}) => {
  const { toast } = useToast()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [products, setProducts] = useState<OutsourcedProduct[]>([])
  const [selectedSupplier, setSelectedSupplier] = useState("")
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contact: "",
    address: "",
    status: "Active"
  })
  const [newProduct, setNewProduct] = useState({
    product_name: "",
    unit_cost: 0
  })
  const [showAddSupplier, setShowAddSupplier] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [loading, setLoading] = useState({
    suppliers: false,
    products: false,
    addSupplier: false,
    addProduct: false
  })

  useEffect(() => {
    fetchSuppliers()
  }, [])

  useEffect(() => {
    if (selectedSupplier) {
      fetchProductsBySupplier()
    }
  }, [selectedSupplier])

  const fetchSuppliers = async () => {
    setLoading(prev => ({ ...prev, suppliers: true }))
    try {
      const response = await get<ResponseType>(API_ENDPOINTS.SUPPLIERS.GET_ALL, {
        withCredentials: true,
      })
      if (response.success) {
        setSuppliers(response.data)
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch suppliers",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to fetch suppliers",
        variant: "destructive",
      })
    } finally {
      setLoading(prev => ({ ...prev, suppliers: false }))
    }
  }

  const fetchProductsBySupplier = async () => {
    if (!selectedSupplier) return
    setLoading(prev => ({ ...prev, products: true }))
    try {
      const response = await get<ResponseType>(
        `${API_ENDPOINTS.OUTSOURCED_PRODUCTS.GET_BY_SUPPLIER}/${selectedSupplier}`,
        { withCredentials: true }
      )
      if (response.success) {
        setProducts(response.data)
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch products",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to fetch products",
        variant: "destructive",
      })
    } finally {
      setLoading(prev => ({ ...prev, products: false }))
    }
  }

  const handleAddSupplier = async () => {
    if (!newSupplier.name || !newSupplier.contact) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(prev => ({ ...prev, addSupplier: true }))
    try {
      const response = await post<ResponseType>(
        API_ENDPOINTS.SUPPLIERS.CREATE,
        newSupplier,
        { withCredentials: true }
      )
      if (response.success) {
        setSuppliers(prev => [...prev, response.data])
        setSelectedSupplier(response.data._id)
        setNewSupplier({
          name: "",
          contact: "",
          address: "",
          status: "Active"
        })
        setShowAddSupplier(false)
        toast({
          title: "Success",
          description: "Supplier added successfully",
        })
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to add supplier",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to add supplier",
        variant: "destructive",
      })
    } finally {
      setLoading(prev => ({ ...prev, addSupplier: false }))
    }
  }

  const handleAddProduct = async () => {
    if (!selectedSupplier || !newProduct.product_name || newProduct.unit_cost <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(prev => ({ ...prev, addProduct: true }))
    try {
      const productData = {
        ...newProduct,
        supplier_id: selectedSupplier,
        quantity: 1
      }
      const response = await post<ResponseType>(
        API_ENDPOINTS.OUTSOURCED_PRODUCTS.CREATE,
        productData,
        { withCredentials: true }
      )
      if (response.success) {
        setProducts(prev => [...prev, response.data])
        setNewProduct({
          product_name: "",
          unit_cost: 0
        })
        setShowAddProduct(false)
        toast({
          title: "Success",
          description: "Product added successfully",
        })
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to add product",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to add product",
        variant: "destructive",
      })
    } finally {
      setLoading(prev => ({ ...prev, addProduct: false }))
    }
  }

  const addOutsourcedItem = () => {
    if (!selectedProduct || quantity <= 0) {
      toast({
        title: "Validation Error",
        description: "Please select a product and enter valid quantity",
        variant: "destructive",
      })
      return
    }
  
    const product = products.find(p => p._id === selectedProduct)
    if (!product) return
  
    // Get no_of_days from formData or default to 1
    const no_of_days = formData?.no_of_days || 1
  
    // Check if product already exists in the list
    const existingItemIndex = outsourcedItems.findIndex(
      item => item.product_id === selectedProduct
    )
  
    if (existingItemIndex >= 0) {
      // Update quantity if product already exists
      const updatedItems = [...outsourcedItems]
      updatedItems[existingItemIndex].quantity += quantity
      updatedItems[existingItemIndex].no_of_days = no_of_days // Update days
      updatedItems[existingItemIndex].total_price = 
        updatedItems[existingItemIndex].price * 
        updatedItems[existingItemIndex].quantity * 
        no_of_days // Multiply by days
    
      setOutsourcedItems(updatedItems)
      updateFormDataWithOutsourcedItems(updatedItems)
    
      toast({
        title: "Quantity updated",
        description: `${product.product_name} quantity increased by ${quantity}`,
      })
    } else {
      // Add new item if product doesn't exist
      const newItem: OutsourcedItem = {
        product_id: selectedProduct,
        name: product.product_name,
        price: product.unit_cost,
        quantity: quantity,
        no_of_days: no_of_days, // Add days
        total_price: product.unit_cost * quantity * no_of_days // Multiply by days
      }
    
      setOutsourcedItems([...outsourcedItems, newItem])
      updateFormDataWithOutsourcedItems([...outsourcedItems, newItem])
    
      toast({
        title: "Item added",
        description: `${product.product_name} added to outsourced items`,
      })
    }
  
    setSelectedProduct("")
    setQuantity(1)
  }
  
  // Helper function to update form data
  const updateFormDataWithOutsourcedItems = (items: OutsourcedItem[]) => {
    setFormData((prev: any) => ({
      ...prev,
      outsourced_items: items,
      total_quantity: 
        (prev.booking_items?.reduce((sum: number, item: any) => sum + Number(item.quantity), 0) || 0) +
        items.reduce((sum, item) => sum + Number(item.quantity), 0),
      total_amount: 
        (prev.booking_items?.reduce((sum: number, item: any) => sum + Number(item.total_price), 0) || 0) +
        items.reduce((sum, item) => sum + Number(item.total_price), 0)
    }))
  }

  useEffect(() => {
    if (outsourcedItems.length > 0) {
      const updatedItems = outsourcedItems.map(item => ({
        ...item,
        no_of_days: formData.no_of_days || 1,
        total_price: item.price * item.quantity * (formData.no_of_days || 1)
      }))
      
      setOutsourcedItems(updatedItems)
      updateFormDataWithOutsourcedItems(updatedItems)
    }
  }, [formData?.no_of_days])



  const removeOutsourcedItem = (index: number) => {
    const removedItem = outsourcedItems[index]
    const updatedItems = outsourcedItems.filter((_, i) => i !== index)
    
    setOutsourcedItems(updatedItems)
    setFormData((prev: any) => ({
      ...prev,
      outsourced_items: updatedItems,
      total_quantity: (prev.total_quantity || 0) - removedItem.quantity,
      total_amount: (prev.total_amount || 0) - removedItem.total_price
    }))
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">Outsourced Products</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <Label>Supplier</Label>
          <div className="flex gap-2">
            <Select 
              value={selectedSupplier} 
              onValueChange={setSelectedSupplier}
              disabled={loading.suppliers}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {suppliers.map(supplier => (
                  <SelectItem key={supplier._id} value={supplier._id}>
                    <div className="flex flex-col">
                      <span>{supplier.name}</span>
                      <span className="text-xs text-muted-foreground">{supplier.contact}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              size="icon" 
              variant="outline"
              onClick={() => {
                setShowAddSupplier(!showAddSupplier)
                setShowAddProduct(false)
              }}
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Product</Label>
          <div className="flex gap-2">
            <Select 
              value={selectedProduct} 
              onValueChange={setSelectedProduct}
              disabled={!selectedSupplier || loading.products}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {products.map(product => (
                  <SelectItem key={product._id} value={product._id}>
                    <div className="flex justify-between">
                      <span className="truncate">{product.product_name}</span>
                      <span className="ml-2 font-medium">₹{product.unit_cost}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              size="icon" 
              variant="outline"
              onClick={() => {
                setShowAddProduct(!showAddProduct)
                setShowAddSupplier(false)
              }}
              disabled={!selectedSupplier}
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Quantity</Label>
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-full"
          />
        </div>

        <div className="space-y-2 flex items-end">
          <Button 
            onClick={addOutsourcedItem} 
            className="w-full"
            disabled={!selectedProduct || loading.products}
          >
            Add Item
          </Button>
        </div>
      </div>

      {showAddSupplier && (
        <div className="p-4 rounded-lg border bg-card mb-4">
          <h4 className="font-medium mb-3">Add New Supplier</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={newSupplier.name}
                onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                placeholder="Supplier name"
              />
            </div>
            <div className="space-y-2">
              <Label>Contact *</Label>
              <Input
                value={newSupplier.contact}
                onChange={(e) => setNewSupplier({...newSupplier, contact: e.target.value})}
                placeholder="Phone number"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Address</Label>
              <Textarea
                value={newSupplier.address}
                onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                placeholder="Full address"
                rows={2}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowAddSupplier(false)}
              disabled={loading.addSupplier}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddSupplier}
              disabled={loading.addSupplier}
            >
              {loading.addSupplier ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">↻</span>
                  Saving...
                </span>
              ) : "Save Supplier"}
            </Button>
          </div>
        </div>
      )}

      {showAddProduct && (
        <div className="p-4 rounded-lg border bg-card mb-4">
          <h4 className="font-medium mb-3">Add New Product</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Product Name *</Label>
              <Input
                value={newProduct.product_name}
                onChange={(e) => setNewProduct({...newProduct, product_name: e.target.value})}
                placeholder="Product name"
              />
            </div>
            <div className="space-y-2">
              <Label>Unit Cost *</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={newProduct.unit_cost}
                onChange={(e) => setNewProduct({...newProduct, unit_cost: Number(e.target.value)})}
                placeholder="Price"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowAddProduct(false)}
              disabled={loading.addProduct}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddProduct}
              disabled={loading.addProduct}
            >
              {loading.addProduct ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">↻</span>
                  Saving...
                </span>
              ) : "Save Product"}
            </Button>
          </div>
        </div>
      )}

{outsourcedItems.length > 0 && (
  <div className="border rounded-lg overflow-hidden">
    <div className="p-4 font-medium bg-muted">Outsourced Items</div>
    <div className="divide-y">
      {outsourcedItems.map((item, index) => (
        <div key={index} className="p-4 flex justify-between items-center hover:bg-muted/50">
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{item.name}</div>
            <div className="text-sm text-muted-foreground">
              ₹{item.price.toFixed(2)} × {item.quantity} × {formData.no_of_days} days = ₹{item.total_price.toFixed(2)}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => removeOutsourcedItem(index)}
            className="shrink-0"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  </div>
)}
    </div>
  )
}