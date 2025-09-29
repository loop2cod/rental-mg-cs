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
import { get, put, del } from "@/utilities/AxiosInterceptor"
import { Plus, Eye, Edit, Trash2, History, Search } from "lucide-react"
import { useEffect, useState } from "react"

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

const PurchaseHistoryPage = () => {
  const { user, loading } = useUser();
  const router = useRouter();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Handle authorization (authentication is handled by withAuth HOC)
  useEffect(() => {
    if (!loading && user && user.role !== 'admin') {
      router.push('/momenz-dashboard');
    }
  }, [user, loading, router]);

  const fetchPurchases = async (page: number = 1, limit: number = 10, search: string = "") => {
    setIsLoading(true);
    try {
      const response = await get<ResponseType>(API_ENDPOINTS.PURCHASE.LIST, {
        params: { page, limit, search },
        withCredentials: true,
      });
      if (response.success) {
        setPurchases(response.data.purchases);
        setTotalPages(response.data?.pagination?.totalPages);
        setTotalCount(response.data?.pagination?.totalItems);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch purchases",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to fetch purchases",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && user?.role === 'admin') {
      fetchPurchases(currentPage, itemsPerPage, searchTerm);
    }
  }, [currentPage, itemsPerPage, searchTerm, user, loading]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = async (purchaseId: string, newStatus: string) => {
    try {
      const response = await put<ResponseType>(`${API_ENDPOINTS.PURCHASE.UPDATE_STATUS}/${purchaseId}/status`, {
        status: newStatus
      }, {
        withCredentials: true,
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Purchase status updated successfully",
        });
        fetchPurchases(currentPage, itemsPerPage, searchTerm);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update status",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (purchaseId: string) => {
    if (!confirm("Are you sure you want to delete this purchase?")) return;

    try {
      const response = await del<ResponseType>(`${API_ENDPOINTS.PURCHASE.DELETE}/${purchaseId}`, {
        withCredentials: true,
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Purchase deleted successfully",
        });
        fetchPurchases(currentPage, itemsPerPage, searchTerm);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete purchase",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to delete purchase",
        variant: "destructive",
      });
    }
  };

  const viewPurchaseDetails = (purchase: Purchase) => {
    router.push(`/admin/purchase/details/${purchase._id}`);
  };

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
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
                  <BreadcrumbPage>Purchase History</BreadcrumbPage>
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
                    <History className="h-5 w-5" />
                    Purchase History
                  </CardTitle>
                  <CardDescription>
                    View and manage all purchase records
                  </CardDescription>
                </div>
                <Button onClick={() => router.push('/admin/purchase/add')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Purchase
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filters */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by supplier, invoice, or product..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10"
                  />
                </div>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => handlePageSizeChange(Number(value))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Purchases Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading purchases...
                      </TableCell>
                    </TableRow>
                  ) : purchases.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No purchases found. Add your first purchase to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    purchases.map((purchase) => (
                      <TableRow key={purchase._id}>
                        <TableCell className="font-medium">{purchase.supplier_name}</TableCell>
                        <TableCell>{purchase.invoice_number || 'N/A'}</TableCell>
                        <TableCell>{new Date(purchase.purchase_date).toLocaleDateString()}</TableCell>
                        <TableCell>₹{purchase.total_amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Select
                            value={purchase.status}
                            onValueChange={(value) => handleStatusChange(purchase._id, value)}
                          >
                            <SelectTrigger className="w-28">
                              <Badge className={getStatusColor(purchase.status)}>
                                {purchase.status}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="received">Received</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{purchase.created_by.name}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => viewPurchaseDetails(purchase)}
                              className="text-blue-600"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(purchase._id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} purchases
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default withAuth(PurchaseHistoryPage);