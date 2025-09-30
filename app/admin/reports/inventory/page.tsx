'use client';

import { AdminSidebar } from "@/components/RoleBased/AdminSidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { withAuth } from "@/components/Middleware/withAuth"
import { useUser } from "@/context/UserContext"
import { useRouter } from "next/navigation"
import { API_ENDPOINTS } from "@/lib/apiEndpoints"
import { get } from "@/utilities/AxiosInterceptor"
import { 
  Package, 
  Download, 
  FileText, 
  Filter,
  Grid,
  Tag,
  Search,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"

type Product = {
  _id: string
  product_name: string
  product_description?: string
  product_category: {
    _id: string
    name: string
  }
  product_price: number
  available_quantity: number
  total_quantity: number
  createdAt: string
  updatedAt: string
}

type Category = {
  _id: string
  name: string
  description?: string
  createdAt: string
}

type ResponseType = {
  success: boolean
  data?: any
  message?: string
}

const InventoryReportsPage = () => {
  const { user, loading } = useUser();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Summary stats
  const [summaryStats, setSummaryStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalInventoryValue: 0,
    availableItems: 0,
    outOfStockItems: 0,
    lowStockItems: 0,
  });

  // Handle authorization
  useEffect(() => {
    if (!loading && user && user.role !== 'admin') {
      router.push('/momenz-dashboard');
    }
  }, [user, loading, router]);

  const getNumericValue = (value: unknown) => {
    const numeric = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
  };

  const formatCurrency = (value: unknown) => {
    return getNumericValue(value).toLocaleString();
  };

  const calculateSummaryStats = useCallback((productData: Product[]) => {
    const totalProducts = productData.length;
    const totalCategories = [...new Set(productData.map(p => p.product_category?._id))].filter(Boolean).length;
    const totalInventoryValue = productData.reduce((sum, p) => sum + (getNumericValue(p.product_price) * getNumericValue(p.total_quantity)), 0);
    const availableItems = productData.reduce((sum, p) => sum + getNumericValue(p.available_quantity), 0);
    const outOfStockItems = productData.filter(p => getNumericValue(p.available_quantity) === 0).length;
    const lowStockItems = productData.filter(p => {
      const quantity = getNumericValue(p.available_quantity);
      return quantity > 0 && quantity < 5;
    }).length;

    setSummaryStats({
      totalProducts,
      totalCategories,
      totalInventoryValue,
      availableItems,
      outOfStockItems,
      lowStockItems,
    });
  }, []);

  const fetchInventoryData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('categoryId', selectedCategory);

      const response = await get<ResponseType>(`/api/v1/reports/inventory?${params}`, {
        withCredentials: true,
      });

      if (response.success && response.data) {
        const reportData = response.data;
        
        // Transform new API response to match existing component structure
        const transformedProducts = reportData.productInventory?.map((item: any) => ({
          _id: item.productId,
          product_name: item.productName,
          product_description: item.productCode,
          product_category: {
            _id: item.categoryId || 'uncategorized',
            name: item.categoryName || 'Uncategorized'
          },
          product_price: item.unitCost,
          available_quantity: item.availableQuantity,
          total_quantity: item.totalQuantity,
          createdAt: item.updatedAt,
          updatedAt: item.updatedAt
        })) || [];

        setProducts(transformedProducts);
        
        // Set summary stats from API response
        const summary = reportData.summary || {};
        setSummaryStats({
          totalProducts: summary.totalProducts || 0,
          totalCategories: reportData.categoryBreakdown?.length || 0,
          totalInventoryValue: summary.totalValue || 0,
          availableItems: summary.totalAvailable || 0,
          outOfStockItems: summary.outOfStockItems || 0,
          lowStockItems: summary.lowStockItems || 0,
        });

        // Set categories from category breakdown
        const categoryData = reportData.categoryBreakdown?.map((cat: any) => ({
          _id: cat._id,
          name: cat.categoryName || 'Uncategorized',
          createdAt: new Date().toISOString()
        })) || [];
        setCategories(categoryData);

      } else {
        // Fallback to old API
        const productsResponse = await get<ResponseType>(API_ENDPOINTS.INVENTORY.GET_ALL_WITH_QUANTITY, {
          withCredentials: true,
        });

        const categoriesResponse = await get<ResponseType>(API_ENDPOINTS.CATEGORY.GET_ALL, {
          withCredentials: true,
        });

        if (productsResponse.success) {
          const productData = productsResponse.data || [];
          setProducts(productData);
          calculateSummaryStats(productData);
        }

        if (categoriesResponse.success) {
          const categoryData = categoriesResponse.data || [];
          setCategories(categoryData);
        }
      }

    } catch (error: any) {
      console.log('Inventory fetch error:', error);
      toast({
        title: "Info",
        description: "Unable to fetch inventory data from server",
      });
    } finally {
      setIsLoading(false);
    }
  }, [calculateSummaryStats, selectedCategory]);

  const getFilteredProducts = () => {
    const normalizedSearch = searchTerm.toLowerCase();

    return products.filter(product => {
      const productName = (product.product_name || '').toLowerCase();
      const productDescription = (product.product_description || '').toLowerCase();

      const matchesSearch = productName.includes(normalizedSearch) ||
                            productDescription.includes(normalizedSearch);
      
      const matchesCategory = selectedCategory === 'all' || 
                             product.product_category?._id === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  };

  const exportToExcel = async () => {
    try {
      const { utils, writeFile } = await import('xlsx');
      
      const filteredProducts = getFilteredProducts();
      
      // Prepare data for Excel
      const excelData = filteredProducts.map((product, index) => {
        const price = getNumericValue(product.product_price);
        const totalQty = getNumericValue(product.total_quantity);
        const availableQty = getNumericValue(product.available_quantity);

        return {
          'S.No.': index + 1,
          'Product Name': product.product_name,
          'Description': product.product_description || 'N/A',
          'Category': product.product_category?.name || 'Uncategorized',
          'Price (₹)': price,
          'Total Quantity': totalQty,
          'Available Quantity': availableQty,
          'Stock Value (₹)': price * totalQty,
          'Status': availableQty === 0 ? 'Out of Stock' : 
                    availableQty < 5 ? 'Low Stock' : 'In Stock',
        };
      });

      // Create summary sheet
      const summaryData = [
        { 'Metric': 'Total Products', 'Value': summaryStats.totalProducts },
        { 'Metric': 'Total Categories', 'Value': summaryStats.totalCategories },
        { 'Metric': 'Total Inventory Value', 'Value': `₹${summaryStats.totalInventoryValue.toLocaleString()}` },
        { 'Metric': 'Available Items', 'Value': summaryStats.availableItems },
        { 'Metric': 'Out of Stock Items', 'Value': summaryStats.outOfStockItems },
        { 'Metric': 'Low Stock Items', 'Value': summaryStats.lowStockItems },
      ];

      // Category breakdown
      const categoryBreakdown = categories.map(category => {
        const categoryProducts = products.filter(p => p.product_category?._id === category._id);
        const categoryValue = categoryProducts.reduce((sum, p) => sum + (getNumericValue(p.product_price) * getNumericValue(p.total_quantity)), 0);
        return {
          'Category': category.name,
          'Products': categoryProducts.length,
          'Total Value': `₹${categoryValue.toLocaleString()}`,
        };
      });

      const wb = utils.book_new();
      
      // Add sheets
      const wsSummary = utils.json_to_sheet(summaryData);
      const wsProducts = utils.json_to_sheet(excelData);
      const wsCategories = utils.json_to_sheet(categoryBreakdown);
      
      utils.book_append_sheet(wb, wsSummary, 'Summary');
      utils.book_append_sheet(wb, wsProducts, 'Products');
      utils.book_append_sheet(wb, wsCategories, 'Categories');
      
      const fileName = `Inventory_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
      writeFile(wb, fileName);
      
      toast({
        title: "Success",
        description: "Excel report downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export Excel report",
        variant: "destructive",
      });
    }
  };

  const exportToPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;
      
      const pdf = new jsPDF('p', 'mm', 'a4'); // Explicit A4 format
      const pageWidth = pdf.internal.pageSize.width; // 210mm
      const pageHeight = pdf.internal.pageSize.height; // 297mm
      const margin = 15;
      const tableWidth = pageWidth - (margin * 2); // 180mm available width
      
      // Simple header - Tally style
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('MOMENZ RENTAL MANAGEMENT', margin, 15);
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('INVENTORY STATEMENT', margin, 25);
      
      // Date and filter info in single line
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      const today = new Date().toLocaleDateString('en-IN');
      const categoryFilter = selectedCategory !== 'all' ? 
        `Category: ${categories.find(c => c._id === selectedCategory)?.name || 'Selected'}` : 
        'All Categories';
      pdf.text(`${categoryFilter} | As on: ${today}`, margin, 32);
      
      // Summary in single compact line
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      const summaryLine = `Total Products: ${summaryStats.totalProducts} | Value: Rs.${summaryStats.totalInventoryValue.toLocaleString('en-IN')} | In Stock: ${summaryStats.availableItems} | Out of Stock: ${summaryStats.outOfStockItems} | Low Stock: ${summaryStats.lowStockItems}`;
      pdf.text(summaryLine, margin, 40);
      
      // Horizontal line
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.line(margin, 46, pageWidth - margin, 46);
      
      // Product table - compact Tally style
      const filteredProducts = getFilteredProducts();
      const maxProducts = 50; // More products in compact view
      const productsToShow = filteredProducts.slice(0, maxProducts);
      
      const productTableData = productsToShow.map((product, index) => {
        const availableQty = getNumericValue(product.available_quantity);
        const totalQty = getNumericValue(product.total_quantity);
        const price = getNumericValue(product.product_price);
        const value = (availableQty * price);
        const productName = product.product_name.length > 35 ? product.product_name.substring(0, 35) + '..' : product.product_name;
        const categoryName = (product.product_category?.name || 'N/A').length > 12 ? 
          (product.product_category?.name || 'N/A').substring(0, 18) + '..' : 
          (product.product_category?.name || 'N/A');
        const stockStatus = availableQty === 0 ? 'Out' : availableQty < 5 ? 'Low' : 'OK';
        
        return [
          (index + 1).toString(),
          productName,
          categoryName,
          totalQty.toString(),
          availableQty.toString(),
          price.toFixed(0),
          value.toFixed(0),
          stockStatus
        ];
      });

      autoTable(pdf, {
        head: [['#', 'Product Name', 'Category', 'Total', 'Avail', 'Rate', 'Value', 'Status']],
        body: productTableData,
        startY: 50,
        margin: { left: margin, right: margin },
        tableWidth: 'auto',
        styles: { 
          fontSize: 7,
          cellPadding: 1.5,
          lineColor: [0, 0, 0],
          lineWidth: 0.25,
          textColor: [0, 0, 0],
          valign: 'middle',
          overflow: 'linebreak',
          minCellHeight: 4
        },
        headStyles: { 
          fillColor: [240, 240, 240],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          fontSize: 7,
          cellPadding: 2,
          halign: 'center',
          valign: 'middle',
          minCellHeight: 6
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 8 },   // # - 8mm
          1: { halign: 'left', cellWidth: 65 },    // Product Name - 65mm (main content)
          2: { halign: 'left', cellWidth: 29 },    // Category - 25mm
          3: { halign: 'right', cellWidth: 12 },   // Total Qty - 12mm
          4: { halign: 'right', cellWidth: 12 },   // Available - 12mm
          5: { halign: 'right', cellWidth: 18 },   // Rate - 18mm
          6: { halign: 'right', cellWidth: 22 },   // Value - 22mm
          7: { halign: 'center', cellWidth: 14 }    // Status - 8mm
        },
        tableLineColor: [0, 0, 0],
        tableLineWidth: 0.25,
        didParseCell: function(data) {
          // Simple status indication
          if (data.column.index === 7) {
            const status = data.cell.text[0];
            if (status === 'Out') {
              data.cell.styles.fontStyle = 'bold';
            }
          }
          // Ensure proper text wrapping for product names
          if (data.column.index === 1) {
            data.cell.styles.overflow = 'linebreak';
          }
        }
      });

      // Summary totals at bottom - Tally style
      const finalY = (pdf as any).lastAutoTable.finalY + 5;
      
      // Calculate total value
      const totalValue = filteredProducts.slice(0, maxProducts).reduce((sum, product) => {
        const availableQty = getNumericValue(product.available_quantity);
        const price = getNumericValue(product.product_price);
        return sum + (availableQty * price);
      }, 0);
      
      // Total line
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.line(margin, finalY, pageWidth - margin, finalY);
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`TOTAL PRODUCTS: ${summaryStats.totalProducts}`, margin, finalY + 8);
      pdf.text(`TOTAL INVENTORY VALUE: Rs.${summaryStats.totalInventoryValue.toLocaleString('en-IN')}`, pageWidth - margin - 70, finalY + 8);
      
      // Status breakdown in compact format
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`In Stock: ${summaryStats.availableItems} | Out of Stock: ${summaryStats.outOfStockItems} | Low Stock: ${summaryStats.lowStockItems}`, margin, finalY + 16);
      
      if (filteredProducts.length > maxProducts) {
        pdf.text(`[Showing ${maxProducts} of ${filteredProducts.length} products]`, margin, finalY + 24);
      }
      
      // Simple footer
      pdf.setFontSize(7);
      pdf.setTextColor(100, 100, 100);
      
      const fileName = `Inventory_Statement_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast({
        title: "Success",
        description: "Inventory statement downloaded successfully",
      });
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast({
        title: "Error",
        description: "Failed to export inventory statement",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!loading && user?.role === 'admin') {
      fetchInventoryData();
    }
  }, [user, loading, fetchInventoryData]);

  const getStockStatus = (product: Product) => {
    const quantity = getNumericValue(product.available_quantity);
    if (quantity === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (quantity < 5) return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  // Show loading spinner while checking user data
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Don't render anything if user data is not loaded or user is not admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
        </div>
      </div>
    );
  }

  const filteredProducts = getFilteredProducts();

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
                  <BreadcrumbLink href="/admin/reports">Reports</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Inventory Reports</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Inventory Reports
                  </CardTitle>
                  <CardDescription>
                    Product catalog, stock levels, and inventory management overview
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={exportToExcel} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Excel
                  </Button>
                  <Button onClick={exportToPDF}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Package className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Products</p>
                    <p className="text-2xl font-bold">{summaryStats.totalProducts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Grid className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Categories</p>
                    <p className="text-2xl font-bold">{summaryStats.totalCategories}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Inventory Value</p>
                    <p className="text-2xl font-bold">₹{summaryStats.totalInventoryValue.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stock Status Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Available Items</p>
                    <p className="text-xl font-bold text-green-600">{summaryStats.availableItems}</p>
                  </div>
                  <Package className="h-6 w-6 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Low Stock</p>
                    <p className="text-xl font-bold text-yellow-600">{summaryStats.lowStockItems}</p>
                  </div>
                  <Package className="h-6 w-6 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Out of Stock</p>
                    <p className="text-xl font-bold text-red-600">{summaryStats.outOfStockItems}</p>
                  </div>
                  <Package className="h-6 w-6 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="search">Search Products</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={() => {setSearchTerm(''); setSelectedCategory('all');}} variant="outline" className="w-full">
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>
                {isLoading ? "Loading..." : `${filteredProducts.length} products found`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Available</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading inventory data...
                      </TableCell>
                    </TableRow>
                  ) : filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No products found matching the filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => {
                      const stockStatus = getStockStatus(product);
                      const priceDisplay = formatCurrency(product.product_price);
                      const availableQty = getNumericValue(product.available_quantity);
                      const totalQty = getNumericValue(product.total_quantity);
                      return (
                        <TableRow key={product._id}>
                          <TableCell className="font-medium">{product.product_name}</TableCell>
                          <TableCell>{product.product_category?.name || 'Uncategorized'}</TableCell>
                          <TableCell className="text-right">₹{priceDisplay}</TableCell>
                          <TableCell className="text-right">{availableQty}</TableCell>
                          <TableCell className="text-right">{totalQty}</TableCell>
                          <TableCell>
                            <Badge className={stockStatus.color}>
                              {stockStatus.text}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default withAuth(InventoryReportsPage);
