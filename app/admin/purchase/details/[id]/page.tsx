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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useRouter, useParams } from "next/navigation"
import { API_ENDPOINTS } from "@/lib/apiEndpoints"
import { get } from "@/utilities/AxiosInterceptor"
import { ArrowLeft, Download, FileText, Printer, Calendar, User, Phone, Hash, Package } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { useReactToPrint } from "react-to-print"

type ResponseType = {
  success: boolean
  data?: any
  message?: string
}

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

const PurchaseDetailsPage = () => {
  const { user, loading } = useUser();
  const router = useRouter();
  const params = useParams();
  const purchaseId = params.id as string;
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Purchase-${purchase?.invoice_number || purchase?._id}`,
  });

  // Handle authorization
  useEffect(() => {
    if (!loading && user && user.role !== 'admin') {
      router.push('/momenz-dashboard');
    }
  }, [user, loading, router]);

  const fetchPurchaseDetails = async () => {
    setIsLoading(true);
    try {
      const response = await get<ResponseType>(`${API_ENDPOINTS.PURCHASE.GET_BY_ID}/${purchaseId}`, {
        withCredentials: true,
      });
      if (response.success) {
        setPurchase(response.data.purchase);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch purchase details",
          variant: "destructive",
        });
        router.push('/admin/purchase/history');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to fetch purchase details",
        variant: "destructive",
      });
      router.push('/admin/purchase/history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && user?.role === 'admin' && purchaseId) {
      fetchPurchaseDetails();
    }
  }, [user, loading, purchaseId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadPDF = async () => {
    try {
      // Import jsPDF dynamically
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;
      
      if (!purchase) return;

      const pdf = new jsPDF();
      
      // Simple Header
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('MOMENZ RENTAL MANAGEMENT', 105, 25, { align: 'center' });
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Purchase Invoice', 105, 35, { align: 'center' });
      
      // Add a simple line
      pdf.line(20, 45, 190, 45);
      
      // Purchase Details - Simple layout
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      // Left side
      pdf.text('Invoice No:', 20, 60);
      pdf.text(purchase.invoice_number || 'N/A', 55, 60);
      
      pdf.text('Date:', 20, 70);
      pdf.text(new Date(purchase.purchase_date).toLocaleDateString('en-IN'), 55, 70);
      
      pdf.text('Status:', 20, 80);
      pdf.text(purchase.status.toUpperCase(), 55, 80);
      
      // Right side
      pdf.text('Supplier:', 120, 60);
      pdf.text(purchase.supplier_name, 145, 60);
      
      pdf.text('Contact:', 120, 70);
      pdf.text(purchase.supplier_contact || 'N/A', 145, 70);
      
      pdf.text('Created By:', 120, 80);
      pdf.text(purchase.created_by.name, 145, 80);
      
      // Items table - Simple styling
      const tableColumns = ['S.No.', 'Product Name', 'Qty', 'Rate (₹)', 'Amount (₹)'];
      const tableRows = purchase.items.map((item, index) => [
        (index + 1).toString(),
        item.product_name,
        item.quantity.toString(),
        item.unit_price.toFixed(2),
        item.total_price.toFixed(2)
      ]);
      
      // Add total row
      tableRows.push([
        '',
        '',
        '',
        'Total:',
        purchase.total_amount.toFixed(2)
      ]);

      autoTable(pdf, {
        head: [tableColumns],
        body: tableRows,
        startY: 95,
        styles: {
          fontSize: 9,
          cellPadding: 3,
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          lineWidth: 0.5,
        },
        alternateRowStyles: {
          fillColor: [250, 250, 250],
        },
        didParseCell: (data) => {
          if (data.row.index === tableRows.length - 1) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [240, 240, 240];
          }
        }
      });
      
      // Notes - Simple
      if (purchase.notes) {
        const finalY = (pdf as any).lastAutoTable.finalY + 15;
        pdf.setFont('helvetica', 'bold');
        pdf.text('Notes:', 20, finalY);
        pdf.setFont('helvetica', 'normal');
        const splitNotes = pdf.splitTextToSize(purchase.notes, 170);
        pdf.text(splitNotes, 20, finalY + 8);
      }
      
      // Simple Footer
      const pageHeight = pdf.internal.pageSize.height;
      pdf.line(20, pageHeight - 25, 190, pageHeight - 25);
      pdf.setFontSize(8);
      pdf.text('This is a computer generated invoice', 105, pageHeight - 15, { align: 'center' });
      pdf.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 105, pageHeight - 8, { align: 'center' });
      
      // Save the PDF
      pdf.save(`Purchase-${purchase.invoice_number || purchase._id}.pdf`);
      
      toast({
        title: "Success",
        description: "PDF downloaded successfully",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  // Show loading spinner while checking user data
  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Don't render anything if user data is not loaded or user is not admin
  if (!user || user.role !== 'admin' || !purchase) {
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
                  <BreadcrumbPage>Purchase Details</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/purchase/history')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to History
            </Button>
            <div className="flex gap-2">
              <Button onClick={handlePrint} variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button onClick={downloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>

          {/* Printable Content */}
          <div ref={printRef} className="bg-white print:shadow-none">
            <div className="print:p-8 print:m-0">
              {/* Header - Clean and Simple */}
              <div className="text-center mb-8 print:mb-6">
                <h1 className="text-2xl font-bold mb-2 print:text-xl">MOMENZ RENTAL MANAGEMENT</h1>
                <h2 className="text-lg font-semibold text-gray-600 print:text-base">Purchase Invoice</h2>
                <hr className="my-4 print:my-3" />
              </div>

              {/* Purchase Info - Simple Layout */}
              <div className="grid grid-cols-2 gap-8 mb-6 print:gap-4 print:mb-4">
                <div className="space-y-2 print:space-y-1">
                  <div className="flex">
                    <span className="font-medium w-32 print:w-24">Invoice No:</span>
                    <span>{purchase.invoice_number || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32 print:w-24">Date:</span>
                    <span>{new Date(purchase.purchase_date).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32 print:w-24">Status:</span>
                    <span className="uppercase font-medium">{purchase.status}</span>
                  </div>
                </div>
                
                <div className="space-y-2 print:space-y-1">
                  <div className="flex">
                    <span className="font-medium w-32 print:w-24">Supplier:</span>
                    <span>{purchase.supplier_name}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32 print:w-24">Contact:</span>
                    <span>{purchase.supplier_contact || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32 print:w-24">Created By:</span>
                    <span>{purchase.created_by.name}</span>
                  </div>
                </div>
              </div>

              <hr className="mb-6 print:mb-4" />

              {/* Items Table - Clean and Simple */}
              <div className="mb-6 print:mb-4">
                <h3 className="text-lg font-semibold mb-4 print:text-base print:mb-3">Purchase Items</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-800">
                      <th className="text-left py-2 px-1 font-semibold">S.No.</th>
                      <th className="text-left py-2 px-1 font-semibold">Product Name</th>
                      <th className="text-right py-2 px-1 font-semibold">Qty</th>
                      <th className="text-right py-2 px-1 font-semibold">Rate (₹)</th>
                      <th className="text-right py-2 px-1 font-semibold">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchase.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-300">
                        <td className="py-2 px-1">{index + 1}</td>
                        <td className="py-2 px-1">{item.product_name}</td>
                        <td className="py-2 px-1 text-right">{item.quantity}</td>
                        <td className="py-2 px-1 text-right">{item.unit_price.toFixed(2)}</td>
                        <td className="py-2 px-1 text-right">{item.total_price.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-gray-800">
                      <td colSpan={4} className="py-3 px-1 font-bold text-lg">Total Amount</td>
                      <td className="py-3 px-1 text-right font-bold text-lg">₹{purchase.total_amount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Notes - Simple */}
              {purchase.notes && (
                <div className="mb-6 print:mb-4">
                  <hr className="mb-4 print:mb-3" />
                  <div>
                    <h4 className="font-semibold mb-2">Notes:</h4>
                    <p className="text-sm">{purchase.notes}</p>
                  </div>
                </div>
              )}

              {/* Footer - Simple */}
              <hr className="mt-8 print:mt-6" />
              <div className="text-center text-xs text-gray-500 pt-4 print:pt-3">
                <p>This is a computer generated invoice</p>
                <p>Generated on: {new Date().toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          <style jsx global>{`
            @media print {
              @page {
                margin: 0.5in;
                size: A4;
              }
              
              body {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              
              .print\\:shadow-none {
                box-shadow: none !important;
              }
              
              .print\\:p-8 {
                padding: 2rem !important;
              }
              
              .print\\:m-0 {
                margin: 0 !important;
              }
              
              .print\\:mb-6 {
                margin-bottom: 1.5rem !important;
              }
              
              .print\\:mb-4 {
                margin-bottom: 1rem !important;
              }
              
              .print\\:mb-3 {
                margin-bottom: 0.75rem !important;
              }
              
              .print\\:my-3 {
                margin-top: 0.75rem !important;
                margin-bottom: 0.75rem !important;
              }
              
              .print\\:gap-4 {
                gap: 1rem !important;
              }
              
              .print\\:space-y-1 > * + * {
                margin-top: 0.25rem !important;
              }
              
              .print\\:text-xl {
                font-size: 1.25rem !important;
              }
              
              .print\\:text-base {
                font-size: 1rem !important;
              }
              
              .print\\:w-24 {
                width: 6rem !important;
              }
              
              .print\\:pt-3 {
                padding-top: 0.75rem !important;
              }
              
              .print\\:mt-6 {
                margin-top: 1.5rem !important;
              }
              
              /* Hide non-essential elements during print */
              button, .no-print {
                display: none !important;
              }
            }
          `}</style>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default withAuth(PurchaseDetailsPage);