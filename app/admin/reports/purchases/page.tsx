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
  ShoppingCart, 
  Download, 
  FileText, 
  Calendar,
  Filter,
  TrendingUp,
  DollarSign,
  Package,
  Building2,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"

type Purchase = {
  _id: string
  supplier_name: string
  supplier_contact?: string
  purchase_date: string
  invoice_number?: string
  total_amount: number
  status: 'pending' | 'received' | 'cancelled'
  items: Array<{
    product_name: string
    quantity: number
    unit_price: number
    total_price: number
  }>
  notes?: string
  created_by: {
    name: string
  }
  createdAt: string
}

type ResponseType = {
  success: boolean
  data?: any
  message?: string
}

const PurchaseReportsPage = () => {
  const { user, loading } = useUser();
  const router = useRouter();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Set default dates: 1st of current month to current date
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const [dateFrom, setDateFrom] = useState(firstOfMonth.toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(today.toISOString().split('T')[0]);
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [suppliers, setSuppliers] = useState<string[]>([]);
  
  // Summary stats
  const [summaryStats, setSummaryStats] = useState({
    totalPurchases: 0,
    totalAmount: 0,
    averageOrderValue: 0,
    topSupplier: "",
    pendingOrders: 0,
    receivedOrders: 0,
    cancelledOrders: 0,
  });

  // Handle authorization
  useEffect(() => {
    if (!loading && user && user.role !== 'admin') {
      router.push('/momenz-dashboard');
    }
  }, [user, loading, router]);

  const calculateSummaryStats = useCallback((purchaseData: Purchase[]) => {
    const totalPurchases = purchaseData.length;
    const totalAmount = purchaseData.reduce((sum, p) => sum + p.total_amount, 0);
    const averageOrderValue = totalPurchases > 0 ? totalAmount / totalPurchases : 0;
    
    const pendingOrders = purchaseData.filter(p => p.status === 'pending').length;
    const receivedOrders = purchaseData.filter(p => p.status === 'received').length;
    const cancelledOrders = purchaseData.filter(p => p.status === 'cancelled').length;
    
    const supplierAmounts = purchaseData.reduce((acc, p) => {
      acc[p.supplier_name] = (acc[p.supplier_name] || 0) + p.total_amount;
      return acc;
    }, {} as Record<string, number>);
    
    const topSupplier = Object.keys(supplierAmounts).reduce((a, b) => 
      supplierAmounts[a] > supplierAmounts[b] ? a : b, ""
    );

    setSummaryStats({
      totalPurchases,
      totalAmount,
      averageOrderValue,
      topSupplier,
      pendingOrders,
      receivedOrders,
      cancelledOrders,
    });
  }, []);

  const fetchPurchases = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append('startDate', dateFrom);
      if (dateTo) params.append('endDate', dateTo);
      if (selectedStatus && selectedStatus !== 'all') params.append('status', selectedStatus);

      const response = await get<ResponseType>(`/api/v1/reports/purchase?${params.toString()}`, {
        withCredentials: true,
      });

      if (response.success && response.data) {
        // Use actual purchase data from the API
        const reportData = response.data;
        
        // Map the actual purchase transactions
        const actualPurchases = reportData.recentTransactions?.map((purchase: any) => ({
          _id: purchase._id,
          supplier_name: purchase.supplier_name,
          supplier_contact: purchase.supplier_contact,
          purchase_date: purchase.purchase_date,
          invoice_number: purchase.invoice_number,
          total_amount: purchase.total_amount,
          status: purchase.status, // pending, received, cancelled
          items: purchase.items || [],
          created_by: { name: purchase.created_by?.name || 'Admin' },
          createdAt: purchase.createdAt,
          notes: purchase.notes
        })) || [];

        setPurchases(actualPurchases);
        
        // Set summary stats from purchase API response
        const purchaseSummary = reportData.summary || {};
        
        setSummaryStats({
          totalPurchases: purchaseSummary.totalPurchases || 0,
          totalAmount: purchaseSummary.totalAmount || 0,
          averageOrderValue: purchaseSummary.avgPurchaseValue || 0,
          topSupplier: reportData.topSuppliers?.[0]?.supplierName || 'N/A',
          pendingOrders: reportData.statusBreakdown?.find((s: any) => s._id === 'pending')?.count || 0,
          receivedOrders: reportData.statusBreakdown?.find((s: any) => s._id === 'received')?.count || 0,
          cancelledOrders: reportData.statusBreakdown?.find((s: any) => s._id === 'cancelled')?.count || 0,
        });
        
        // Extract unique suppliers from actual purchase data
        const uniqueSuppliers: any = Array.from(new Set(actualPurchases.map((p: any) => p.supplier_name)));
        setSuppliers(uniqueSuppliers);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch purchase reports",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch purchase reports",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [calculateSummaryStats, dateFrom, dateTo, selectedSupplier, selectedStatus]);

  const exportToExcel = async () => {
    try {
      const { utils, writeFile } = await import('xlsx');
      
      // Prepare data for Excel
      const excelData = purchases.map((purchase, index) => ({
        'S.No.': index + 1,
        'Date': new Date(purchase.purchase_date).toLocaleDateString('en-IN'),
        'Supplier': purchase.supplier_name,
        'Contact': purchase.supplier_contact || 'N/A',
        'Invoice No': purchase.invoice_number || 'N/A',
        'Status': purchase.status.toUpperCase(),
        'Total Amount': purchase.total_amount,
        'Items Count': purchase.items.length,
        'Created By': purchase.created_by.name,
        'Notes': purchase.notes || 'N/A'
      }));

      // Create summary sheet
      const summaryData = [
        { 'Metric': 'Total Purchases', 'Value': summaryStats.totalPurchases },
        { 'Metric': 'Total Amount', 'Value': `₹${summaryStats.totalAmount.toLocaleString()}` },
        { 'Metric': 'Average Order Value', 'Value': `₹${summaryStats.averageOrderValue.toLocaleString()}` },
        { 'Metric': 'Top Supplier', 'Value': summaryStats.topSupplier },
        { 'Metric': 'Pending Orders', 'Value': summaryStats.pendingOrders },
        { 'Metric': 'Received Orders', 'Value': summaryStats.receivedOrders },
        { 'Metric': 'Cancelled Orders', 'Value': summaryStats.cancelledOrders },
      ];

      // Create item-wise detail sheet
      const itemDetails = purchases.flatMap((purchase, pIndex) =>
        purchase.items.map((item, iIndex) => ({
          'Purchase No': pIndex + 1,
          'Date': new Date(purchase.purchase_date).toLocaleDateString('en-IN'),
          'Supplier': purchase.supplier_name,
          'Invoice No': purchase.invoice_number || 'N/A',
          'Product Name': item.product_name,
          'Quantity': item.quantity,
          'Unit Price': item.unit_price,
          'Total Price': item.total_price,
        }))
      );

      const wb = utils.book_new();
      
      // Add sheets
      const wsSummary = utils.json_to_sheet(summaryData);
      const wsPurchases = utils.json_to_sheet(excelData);
      const wsItems = utils.json_to_sheet(itemDetails);
      
      utils.book_append_sheet(wb, wsSummary, 'Summary');
      utils.book_append_sheet(wb, wsPurchases, 'Purchases');
      utils.book_append_sheet(wb, wsItems, 'Item Details');
      
      // Set column widths
      wsPurchases['!cols'] = [
        { wch: 8 }, { wch: 12 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, 
        { wch: 10 }, { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 20 }
      ];
      
      const fileName = `Purchase_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
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
      pdf.text('PURCHASE REGISTER', margin, 25);
      
      // Date and filter info in single line
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      const today = new Date().toLocaleDateString('en-IN');
      const dateRange = (dateFrom || dateTo) ? 
        `Period: ${dateFrom ? new Date(dateFrom).toLocaleDateString('en-IN') : 'All'} to ${dateTo ? new Date(dateTo).toLocaleDateString('en-IN') : 'All'}` : 
        'All Periods';
      pdf.text(`${dateRange} | Generated: ${today}`, margin, 32);
      
      // Summary in single compact line
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      const summaryLine = `Total: ${summaryStats.totalPurchases} Purchases | Amount: Rs.${summaryStats.totalAmount.toLocaleString('en-IN')} | Pending: ${summaryStats.pendingOrders} | Received: ${summaryStats.receivedOrders} | Cancelled: ${summaryStats.cancelledOrders}`;
      pdf.text(summaryLine, margin, 40);
      
      // Horizontal line
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.line(margin, 46, pageWidth - margin, 46);
      
      // Purchase table - compact Tally style
      const maxPurchases = 45; // More purchases in compact view
      const purchasesToShow = purchases.slice(0, maxPurchases);
      
      const purchaseTableData = purchasesToShow.map((purchase, index) => {
        const date = new Date(purchase.purchase_date || purchase.createdAt).toLocaleDateString('en-IN');
        const supplierName = purchase.supplier_name.length > 25 ? purchase.supplier_name.substring(0, 25) + '..' : purchase.supplier_name;
        const invoice = purchase.invoice_number || '-';
        const status = purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1);
        const amount = purchase.total_amount.toLocaleString('en-IN');
        
        return [
          (index + 1).toString(),
          date,
          supplierName,
          invoice,
          status,
          amount
        ];
      });

      autoTable(pdf, {
        head: [['#', 'Date', 'Supplier Name', 'Invoice No.', 'Status', 'Amount (Rs.)']],
        body: purchaseTableData,
        startY: 50,
        margin: { left: margin, right: margin },
        tableWidth: tableWidth,
        styles: { 
          fontSize: 9,
          cellPadding: 3,
          lineColor: [0, 0, 0],
          lineWidth: 0.3,
          textColor: [0, 0, 0],
          valign: 'middle',
          overflow: 'linebreak'
        },
        headStyles: { 
          fillColor: [240, 240, 240],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          fontSize: 9,
          cellPadding: 4,
          halign: 'center',
          valign: 'middle'
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 15 }, // # - 15mm
          1: { halign: 'center', cellWidth: 25 }, // Date - 25mm
          2: { halign: 'left', cellWidth: 65 },   // Supplier - 65mm
          3: { halign: 'center', cellWidth: 28 }, // Invoice - 28mm
          4: { halign: 'center', cellWidth: 22 }, // Status - 22mm
          5: { halign: 'right', cellWidth: 25 }   // Amount - 25mm
        },
        tableLineColor: [0, 0, 0],
        tableLineWidth: 0.3,
        didParseCell: function(data) {
          // Simple status indication without colors
          if (data.column.index === 4) {
            const status = data.cell.text[0];
            if (status === 'Cancelled') {
              data.cell.styles.fontStyle = 'bold';
            }
          }
        }
      });

      // Summary totals at bottom - Tally style
      const finalY = (pdf as any).lastAutoTable.finalY + 5;
      
      // Total line
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.line(margin, finalY, pageWidth - margin, finalY);
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`TOTAL PURCHASES: ${summaryStats.totalPurchases}`, margin, finalY + 8);
      pdf.text(`TOTAL AMOUNT: Rs.${summaryStats.totalAmount.toLocaleString('en-IN')}`, pageWidth - margin - 60, finalY + 8);
      
      // Status breakdown in compact format
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Pending: ${summaryStats.pendingOrders} | Received: ${summaryStats.receivedOrders} | Cancelled: ${summaryStats.cancelledOrders}`, margin, finalY + 16);
      
      if (purchases.length > maxPurchases) {
        pdf.text(`[Showing ${maxPurchases} of ${purchases.length} records]`, margin, finalY + 24);
      }
      
      // Simple footer
      pdf.setFontSize(7);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Generated by MOMENZ System', margin, pageHeight - 10);
      pdf.text(`Page 1`, pageWidth - margin - 15, pageHeight - 10);
      
      const fileName = `Purchase_Register_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast({
        title: "Success",
        description: "Purchase register downloaded successfully",
      });
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast({
        title: "Error",
        description: "Failed to export purchase register",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!loading && user?.role === 'admin') {
      fetchPurchases();
    }
  }, [user, loading, fetchPurchases]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
                  <BreadcrumbPage>Purchase Reports</BreadcrumbPage>
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
                    <ShoppingCart className="h-5 w-5" />
                    Purchase Reports
                  </CardTitle>
                  <CardDescription>
                    Comprehensive analysis of all purchase transactions and supplier performance
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Purchases</p>
                    <p className="text-2xl font-bold">{summaryStats.totalPurchases}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">₹{summaryStats.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Order Value</p>
                    <p className="text-2xl font-bold">₹{Math.round(summaryStats.averageOrderValue).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Top Supplier</p>
                    <p className="text-lg font-bold truncate">{summaryStats.topSupplier || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Orders</p>
                    <p className="text-xl font-bold text-yellow-600">{summaryStats.pendingOrders}</p>
                  </div>
                  <Package className="h-6 w-6 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Received Orders</p>
                    <p className="text-xl font-bold text-green-600">{summaryStats.receivedOrders}</p>
                  </div>
                  <Package className="h-6 w-6 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Cancelled Orders</p>
                    <p className="text-xl font-bold text-red-600">{summaryStats.cancelledOrders}</p>
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="dateFrom">From Date</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dateTo">To Date</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Supplier</Label>
                  <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Suppliers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Suppliers</SelectItem>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier} value={supplier}>
                          {supplier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchases Table */}
          <Card>
            <CardHeader>
              <CardTitle>Purchase Details</CardTitle>
              <CardDescription>
                {isLoading ? "Loading..." : `${purchases.length} purchases found`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading purchases...
                      </TableCell>
                    </TableRow>
                  ) : purchases.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No purchases found matching the filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    purchases.map((purchase) => (
                      <TableRow key={purchase._id}>
                        <TableCell>
                          {new Date(purchase.purchase_date).toLocaleDateString('en-IN')}
                        </TableCell>
                        <TableCell className="font-medium">{purchase.supplier_name}</TableCell>
                        <TableCell>{purchase.invoice_number || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(purchase.status)}>
                            {purchase.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{purchase.items.length}</TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{purchase.total_amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
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

export default withAuth(PurchaseReportsPage);
