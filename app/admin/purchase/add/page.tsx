'use client';

import { AdminSidebar } from "@/components/RoleBased/AdminSidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { withAuth } from "@/components/Middleware/withAuth"
import { useUser } from "@/context/UserContext"
import { useRouter } from "next/navigation"
import { API_ENDPOINTS } from "@/lib/apiEndpoints"
import { post } from "@/utilities/AxiosInterceptor"
import { Plus, Trash2, ShoppingCart, Upload, Download } from "lucide-react"
import { useEffect, useState } from "react"

type ResponseType = {
  success: boolean
  data?: any
  message?: string
}

type PurchaseItem = {
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
}

const AddPurchasePage = () => {
  const { user, loading } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [formData, setFormData] = useState({
    supplier_name: '',
    supplier_contact: '',
    invoice_number: '',
    purchase_date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [items, setItems] = useState<PurchaseItem[]>([
    { product_name: '', quantity: 1, unit_price: 0, total_price: 0 }
  ]);

  // Handle authorization (authentication is handled by withAuth HOC)
  useEffect(() => {
    if (!loading && user && user.role !== 'admin') {
      router.push('/momenz-dashboard');
    }
  }, [user, loading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index: number, field: keyof PurchaseItem, value: string | number) => {
    setItems(prev => {
      const newItems = [...prev];
      
      if (field === 'product_name') {
        newItems[index] = {
          ...newItems[index],
          [field]: value
        };
      } else {
        // Handle numeric fields - allow empty string for user to clear and type
        const numericValue = value === '' ? 0 : Number(value);
        newItems[index] = {
          ...newItems[index],
          [field]: numericValue
        };
        
        // Calculate total price automatically
        if (field === 'quantity' || field === 'unit_price') {
          newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
        }
      }
      
      return newItems;
    });
  };

  const addItem = () => {
    setItems(prev => [...prev, { product_name: '', quantity: 1, unit_price: 0, total_price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const getTotalAmount = () => {
    return items.reduce((sum, item) => sum + item.total_price, 0);
  };

  const validateForm = () => {
    if (!formData.supplier_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Supplier name is required",
        variant: "destructive",
      });
      return false;
    }

    if (items.some(item => !item.product_name.trim())) {
      toast({
        title: "Validation Error",
        description: "All items must have a product name",
        variant: "destructive",
      });
      return false;
    }

    if (items.some(item => item.quantity <= 0 || item.unit_price < 0)) {
      toast({
        title: "Validation Error",
        description: "All items must have valid quantity and price",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const purchaseData = {
        ...formData,
        items,
        total_amount: getTotalAmount(),
      };

      const response = await post<ResponseType>(API_ENDPOINTS.PURCHASE.ADD, purchaseData, {
        withCredentials: true,
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Purchase added successfully",
        });
        router.push('/admin/purchase/history');
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to add purchase",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to add purchase",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadExcelTemplate = () => {
    try {
      // Create sample data for template - Shows 1 supplier with multiple invoices
      const templateData = [
        // ABC Suppliers - Invoice INV-001 (Multiple items)
        {
          supplier_name: 'ABC Suppliers',
          supplier_contact: '+91 9876543210',
          invoice_number: 'INV-001',
          purchase_date: '2024-01-15',
          product_name: 'Laptop Dell',
          quantity: 2,
          unit_price: 45000.00,
          notes: 'Electronics purchase'
        },
        {
          supplier_name: 'ABC Suppliers',
          supplier_contact: '+91 9876543210',
          invoice_number: 'INV-001',
          purchase_date: '2024-01-15',
          product_name: 'Mouse Wireless',
          quantity: 5,
          unit_price: 800.00,
          notes: 'Electronics purchase'
        },
        // ABC Suppliers - Invoice INV-002 (Different items)
        {
          supplier_name: 'ABC Suppliers',
          supplier_contact: '+91 9876543210',
          invoice_number: 'INV-002',
          purchase_date: '2024-01-20',
          product_name: 'Office Chair',
          quantity: 10,
          unit_price: 3500.00,
          notes: 'Furniture purchase'
        },
        {
          supplier_name: 'ABC Suppliers',
          supplier_contact: '+91 9876543210',
          invoice_number: 'INV-002',
          purchase_date: '2024-01-20',
          product_name: 'Desk Lamp',
          quantity: 15,
          unit_price: 1200.00,
          notes: 'Furniture purchase'
        },
        // Different Supplier Example
        {
          supplier_name: 'XYZ Traders',
          supplier_contact: '+91 8765432109',
          invoice_number: 'XYZ-101',
          purchase_date: '2024-01-18',
          product_name: 'Printer Paper',
          quantity: 50,
          unit_price: 120.00,
          notes: 'Stationery supplies'
        }
      ];

      // Create Excel file using dynamic import
      import('xlsx').then(({ utils, writeFile }) => {
        const ws = utils.json_to_sheet(templateData);
        
        // Set column widths
        ws['!cols'] = [
          { wch: 20 }, // supplier_name
          { wch: 15 }, // supplier_contact
          { wch: 15 }, // invoice_number
          { wch: 12 }, // purchase_date
          { wch: 20 }, // product_name
          { wch: 10 }, // quantity
          { wch: 12 }, // unit_price
          { wch: 20 }  // notes
        ];

        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Purchase Template');
        writeFile(wb, 'purchase_template.xlsx');
        
        toast({
          title: "Success",
          description: "Excel template downloaded successfully",
        });
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download template",
        variant: "destructive",
      });
    }
  };

  const handleExcelUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsBulkUploading(true);
    try {
      const { read, utils } = await import('xlsx');
      
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet);

      // Process and group data by supplier and invoice
      const purchasesMap = new Map();
      
      jsonData.forEach((row: any) => {
        const key = `${row.supplier_name}_${row.invoice_number || 'no-invoice'}_${row.purchase_date}`;
        
        if (!purchasesMap.has(key)) {
          purchasesMap.set(key, {
            supplier_name: row.supplier_name,
            supplier_contact: row.supplier_contact || '',
            invoice_number: row.invoice_number || '',
            purchase_date: row.purchase_date,
            notes: row.notes || '',
            items: []
          });
        }
        
        purchasesMap.get(key).items.push({
          product_name: row.product_name,
          quantity: Number(row.quantity) || 0,
          unit_price: Number(row.unit_price) || 0,
          total_price: (Number(row.quantity) || 0) * (Number(row.unit_price) || 0)
        });
      });

      const purchases = Array.from(purchasesMap.values());
      
      const response = await post<ResponseType>(API_ENDPOINTS.PURCHASE.BULK_UPLOAD, { purchases }, {
        withCredentials: true,
      });

      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Bulk upload completed successfully",
        });
        router.push('/admin/purchase/history');
      } else {
        toast({
          title: "Error", 
          description: response.message || "Failed to upload purchases",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process Excel file",
        variant: "destructive",
      });
    } finally {
      setIsBulkUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  // Show loading spinner while checking user data
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Don't render anything if user data is not loaded or user is not admin (will be redirected)
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Add Purchase</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Add New Purchase
                  </CardTitle>
                  <CardDescription>
                    Record a new purchase from a supplier or upload multiple purchases via Excel
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={downloadExcelTemplate}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Template
                  </Button>
                  <div className="relative">
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={isBulkUploading}
                      className="flex items-center gap-2"
                      onClick={() => document.getElementById('excel-upload')?.click()}
                    >
                      <Upload className="h-4 w-4" />
                      {isBulkUploading ? 'Uploading...' : 'Bulk Upload Excel'}
                    </Button>
                    <input
                      id="excel-upload"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleExcelUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Supplier Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Supplier Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="supplier_name">Supplier Name *</Label>
                      <Input
                        id="supplier_name"
                        name="supplier_name"
                        value={formData.supplier_name}
                        onChange={handleInputChange}
                        placeholder="Enter supplier name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="supplier_contact">Supplier Contact</Label>
                      <Input
                        id="supplier_contact"
                        name="supplier_contact"
                        value={formData.supplier_contact}
                        onChange={handleInputChange}
                        placeholder="Enter contact information"
                      />
                    </div>
                    <div>
                      <Label htmlFor="invoice_number">Invoice Number</Label>
                      <Input
                        id="invoice_number"
                        name="invoice_number"
                        value={formData.invoice_number}
                        onChange={handleInputChange}
                        placeholder="Enter invoice number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="purchase_date">Purchase Date *</Label>
                      <Input
                        id="purchase_date"
                        name="purchase_date"
                        type="date"
                        value={formData.purchase_date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Purchase Items */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Purchase Items</CardTitle>
                      <Button type="button" onClick={addItem} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product Name</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead>Total Price</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Input
                                value={item.product_name}
                                onChange={(e) => handleItemChange(index, 'product_name', e.target.value)}
                                placeholder="Product name"
                                required
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity === 0 ? '' : item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                placeholder="1"
                                required
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.unit_price === 0 ? '' : item.unit_price}
                                onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                                placeholder="0.00"
                                required
                              />
                            </TableCell>
                            <TableCell>
                              ₹{item.total_price.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(index)}
                                disabled={items.length === 1}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="mt-4 text-right">
                      <div className="text-lg font-semibold">
                        Total Amount: ₹{getTotalAmount().toFixed(2)}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Enter any additional notes or comments"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Buttons */}
                <div className="flex gap-4 justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => router.push('/admin/purchase/history')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Adding Purchase..." : "Add Purchase"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default withAuth(AddPurchasePage);