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
  Building2, 
  Download, 
  FileText, 
  Search,
  Phone,
  Users,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"

type Supplier = {
  _id: string
  name: string
  contact_person?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  gst_number?: string
  createdAt: string
  updatedAt: string
}

type ResponseType = {
  success: boolean
  data?: any
  message?: string
}

const SuppliersReportsPage = () => {
  const { user, loading } = useUser();
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Summary stats
  const [summaryStats, setSummaryStats] = useState({
    totalSuppliers: 0,
    totalPurchases: 0,
    totalAmount: 0,
    suppliersWithContact: 0,
  });

  // Handle authorization
  useEffect(() => {
    if (!loading && user && user.role !== 'admin') {
      router.push('/momenz-dashboard');
    }
  }, [user, loading, router]);

  const calculateSummaryStats = useCallback((supplierData: Supplier[]) => {
    const totalSuppliers = supplierData.length;
    const totalPurchases = supplierData.reduce((sum, s) => sum + (s.totalPurchases || 0), 0);
    const totalAmount = supplierData.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
    const suppliersWithContact = supplierData.filter(s => s.phone || s.supplierContact).length;

    setSummaryStats({
      totalSuppliers,
      totalPurchases,
      totalAmount,
      suppliersWithContact,
    });
  }, []);

  const fetchSuppliersData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await get<ResponseType>(`http://localhost:5000/api/v1/reports/supplier`, {
        withCredentials: true,
      });

      if (response.success && response.data) {
        const reportData = response.data;
        
        // Transform new API response to match existing component structure
        const transformedSuppliers = reportData.suppliers?.map((supplier: any) => ({
          _id: supplier._id || supplier.supplierName,
          name: supplier.supplierName || supplier.name || 'Unknown Supplier',
          supplierName: supplier.supplierName || supplier.name || 'Unknown Supplier',
          contact_person: supplier.supplierName || supplier.name || 'Unknown',
          phone: supplier.supplierContact || supplier.contact || '',
          email: supplier.supplierContact || supplier.contact || '',
          supplierContact: supplier.supplierContact || supplier.contact || '',
          address: supplier.address || '',
          city: supplier.address?.split(',')[0] || '', 
          state: supplier.address?.split(',')[1]?.trim() || '',
          pincode: '',
          gst_number: '',
          totalPurchases: supplier.totalPurchases || 0,
          totalAmount: supplier.totalAmount || 0,
          avgPurchaseValue: supplier.avgPurchaseValue || 0,
          lastPurchaseDate: supplier.lastPurchaseDate,
          firstPurchaseDate: supplier.firstPurchaseDate,
          createdAt: supplier.createdAt || supplier.firstPurchaseDate,
          updatedAt: supplier.updatedAt || supplier.lastPurchaseDate
        })) || [];

        setSuppliers(transformedSuppliers);
        
        // Set summary stats from API response
        const summary = reportData.summary || {};
        setSummaryStats({
          totalSuppliers: summary.uniqueSuppliers || summary.totalSuppliers || 0,
          totalPurchases: summary.totalPurchases || 0,
          totalAmount: summary.totalAmount || 0,
          suppliersWithContact: summary.suppliersWithContactCount || 0,
        });

      } else {
        // Fallback to old API
        const fallbackResponse = await get<ResponseType>(API_ENDPOINTS.SUPPLIERS.GET_ALL, {
          withCredentials: true,
        });

        if (fallbackResponse.success) {
          const supplierData = fallbackResponse.data || [];
          setSuppliers(supplierData);
          calculateSummaryStats(supplierData);
        } else {
          toast({
            title: "Warning",
            description: "Could not fetch suppliers data",
            variant: "destructive",
          });
        }
      }

    } catch (error: any) {
      console.log('Suppliers fetch error:', error);
      toast({
        title: "Info",
        description: "Unable to fetch suppliers data from server",
      });
    } finally {
      setIsLoading(false);
    }
  }, [calculateSummaryStats]);

  const getFilteredSuppliers = () => {
    return suppliers.filter(supplier => {
      const name = supplier.name || supplier.supplierName || '';
      const contactPerson = supplier.contact_person || '';
      const email = supplier.email || supplier.supplierContact || '';
      const phone = supplier.phone || supplier.supplierContact || '';
      const city = supplier.city || '';
      
      return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.includes(searchTerm) ||
        city.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  const exportToExcel = async () => {
    try {
      const { utils, writeFile } = await import('xlsx');
      
      const filteredSuppliers = getFilteredSuppliers();
      
      // Prepare data for Excel
      const excelData = filteredSuppliers.map((supplier, index) => ({
        'S.No.': index + 1,
        'Supplier Name': supplier.name,
        'Contact': supplier.phone || supplier.supplierContact || 'N/A',
        'Total Purchases': supplier.totalPurchases || 0,
        'Total Amount': supplier.totalAmount || 0,
        'Last Purchase': supplier.lastPurchaseDate ? new Date(supplier.lastPurchaseDate).toLocaleDateString('en-IN') : 'N/A',
      }));

      // Create summary sheet
      const summaryData = [
        { 'Metric': 'Total Suppliers', 'Value': summaryStats.totalSuppliers },
        { 'Metric': 'Total Purchases', 'Value': summaryStats.totalPurchases },
        { 'Metric': 'Total Amount', 'Value': summaryStats.totalAmount },
        { 'Metric': 'Suppliers with Contact', 'Value': summaryStats.suppliersWithContact },
      ];

      // Top suppliers breakdown
      const topSuppliers = suppliers
        .filter(s => s.totalAmount > 0)
        .sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0))
        .slice(0, 10)
        .map(supplier => ({
          'Supplier Name': supplier.name,
          'Total Purchases': supplier.totalPurchases || 0,
          'Total Amount': supplier.totalAmount || 0,
          'Last Purchase': supplier.lastPurchaseDate ? new Date(supplier.lastPurchaseDate).toLocaleDateString('en-IN') : 'N/A',
        }));

      const wb = utils.book_new();
      
      // Add sheets
      const wsSummary = utils.json_to_sheet(summaryData);
      const wsSuppliers = utils.json_to_sheet(excelData);
      const wsTop = utils.json_to_sheet(topSuppliers);
      
      utils.book_append_sheet(wb, wsSummary, 'Summary');
      utils.book_append_sheet(wb, wsSuppliers, 'All Suppliers');
      utils.book_append_sheet(wb, wsTop, 'Top Suppliers');
      
      const fileName = `Suppliers_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
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
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const margin = 20;
      const tableWidth = pageWidth - (margin * 2);
      
      // Title - properly centered
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      const title = 'SUPPLIER STATEMENT';
      const titleWidth = pdf.getTextWidth(title);
      const titleX = (pageWidth - titleWidth) / 2;
      pdf.text(title, titleX, 25);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const dateText = `Date: ${new Date().toLocaleDateString('en-IN')}`;
      const dateWidth = pdf.getTextWidth(dateText);
      const dateX = (pageWidth - dateWidth) / 2;
      pdf.text(dateText, dateX, 32);
      
      // Summary section
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SUMMARY', margin, 45);
      
      const summaryTableData = [
        ['Total Suppliers', summaryStats.totalSuppliers.toString()],
        ['Total Purchases', summaryStats.totalPurchases.toString()],
        ['Total Amount', `Rs.${summaryStats.totalAmount.toLocaleString('en-IN')}`],
        ['With Contact Info', summaryStats.suppliersWithContact.toString()],
      ];

      autoTable(pdf, {
        head: [['Metric', 'Value']],
        body: summaryTableData,
        startY: 50,
        margin: { left: margin, right: margin },
        tableWidth: tableWidth,
        styles: { 
          fontSize: 9,
          cellPadding: 3
        },
        headStyles: { 
          fillColor: [240, 240, 240],
          textColor: [0, 0, 0],
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: tableWidth * 0.6 },
          1: { cellWidth: tableWidth * 0.4, halign: 'right' }
        }
      });

      // Supplier details
      const finalY = (pdf as any).lastAutoTable.finalY + 15;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SUPPLIER DETAILS', margin, finalY);

      const filteredSuppliers = getFilteredSuppliers();
      const supplierTableData = filteredSuppliers.map((supplier, index) => [
        (index + 1).toString(),
        supplier.name || 'N/A',
        supplier.phone || supplier.supplierContact || 'N/A',
        (supplier.totalPurchases || 0).toString(),
        `Rs.${(supplier.totalAmount || 0).toLocaleString('en-IN')}`,
        supplier.lastPurchaseDate ? new Date(supplier.lastPurchaseDate).toLocaleDateString('en-IN') : 'N/A',
      ]);

      autoTable(pdf, {
        head: [['S.No.', 'Supplier Name', 'Contact', 'Purchases', 'Amount', 'Last Purchase']],
        body: supplierTableData,
        startY: finalY + 5,
        margin: { left: margin, right: margin },
        tableWidth: tableWidth,
        styles: { 
          fontSize: 8,
          cellPadding: 2
        },
        headStyles: { 
          fillColor: [240, 240, 240],
          textColor: [0, 0, 0],
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: 15, halign: 'center' },
          1: { cellWidth: 50 },
          2: { cellWidth: 35 },
          3: { cellWidth: 25, halign: 'center' },
          4: { cellWidth: 40, halign: 'center' },
          5: { cellWidth: 25, halign: 'center' }
        }
      });

      if (filteredSuppliers.length > 20) {
        const noteY = (pdf as any).lastAutoTable.finalY + 10;
        pdf.setFontSize(10);
        pdf.text(`Note: Showing first 20 suppliers. Total: ${filteredSuppliers.length}`, 20, noteY);
      }
      
      pdf.save(`Suppliers_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "Success",
        description: "PDF report downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export PDF report",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!loading && user?.role === 'admin') {
      fetchSuppliersData();
    }
  }, [user, loading, fetchSuppliersData]);

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

  const filteredSuppliers = getFilteredSuppliers();

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
                  <BreadcrumbPage>Supplier Reports</BreadcrumbPage>
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
                    <Building2 className="h-5 w-5" />
                    Supplier Reports
                  </CardTitle>
                  <CardDescription>
                    Complete supplier directory with purchase analytics
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
                  <Building2 className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Suppliers</p>
                    <p className="text-2xl font-bold">{summaryStats.totalSuppliers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-8 w-8 text-blue-600" />
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
                  <Building2 className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">Rs.{summaryStats.totalAmount.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">With Contact</p>
                    <p className="text-2xl font-bold">{summaryStats.suppliersWithContact}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search Suppliers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search by supplier name or contact</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search suppliers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button onClick={() => setSearchTerm('')} variant="outline">
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suppliers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Supplier Directory</CardTitle>
              <CardDescription>
                {isLoading ? "Loading..." : `${filteredSuppliers.length} suppliers found`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-center">Total Purchases</TableHead>
                    <TableHead className="text-center">Total Amount</TableHead>
                    <TableHead>Last Purchase</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Loading suppliers data...
                      </TableCell>
                    </TableRow>
                  ) : filteredSuppliers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No suppliers found matching the search criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSuppliers.map((supplier) => (
                      <TableRow key={supplier._id}>
                        <TableCell className="font-medium">{supplier.name}</TableCell>
                        <TableCell>
                          {supplier.phone || supplier.supplierContact ? (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {supplier.phone || supplier.supplierContact}
                            </div>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {supplier.totalPurchases || 0}
                        </TableCell>
                        <TableCell className="text-center">
                          Rs.{(supplier.totalAmount || 0).toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell>
                          {supplier.lastPurchaseDate ? 
                            new Date(supplier.lastPurchaseDate).toLocaleDateString('en-IN') : 
                            'N/A'
                          }
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

export default withAuth(SuppliersReportsPage);
