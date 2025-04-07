'use client'
import { AppSidebar } from "@/components/app-sidebar"
import { withAuth } from "@/components/Middleware/withAuth"
import AddSupplierOnPage from "@/components/Supplier/AddSupplierOnPage"
import SupplierTable from "@/components/Supplier/SupplierTable"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { API_ENDPOINTS } from "@/lib/apiEndpoints"
import { get, post, put } from "@/utilities/AxiosInterceptor"
import { Loader2Icon } from "lucide-react"
import { useEffect, useState } from "react"

interface ResponseType {
  success: boolean;
  data?: any;
  message?: string;
}

const Page = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [supplierForm, setSupplierForm] = useState({
    _id: "",
    name: "",
    contact: "",
    address: "",
    status: "Active"
  });

  const [errors, setErrors] = useState({
    name: "",
    contact: "",
  });

  const fetchSuppliers = async (page: number = 1, limit: number = 10, search: string = "") => {
    setIsLoading(true);
    try {
      const response = await get<ResponseType>(API_ENDPOINTS.SUPPLIERS.LIST_WITH_PAGINATION, {
        params: { page, limit, search },
        withCredentials: true,
      });
      if (response.success) {
        setSuppliers(response.data.suppliers);
        setTotalPages(response.data?.pagination?.totalPages);
        setTotalCount(response.data?.pagination?.totalItems);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch Suppliers",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to fetch Suppliers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers(currentPage, itemsPerPage, searchTerm);
  }, [currentPage, itemsPerPage, searchTerm]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      contact: "",
    };

    if (!supplierForm.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!supplierForm.contact.trim()) {
      newErrors.contact = "Contact is required";
      isValid = false;
    }
console.log(newErrors)
    setErrors(newErrors);
    return isValid;
  };


  const handleEditSupplier = async () => {
    if (!supplierForm?._id || !validateForm()) return;

    setFormLoading(true);
    try {
      const response = await put<ResponseType>(
        `${API_ENDPOINTS.SUPPLIERS.UPDATE}/${supplierForm?._id}`,
        supplierForm,
        { withCredentials: true }
      );

      if (response.success) {
        toast({
          title: "Success",
          description: "Supplier updated successfully",
        });
        resetForm();
        setIsEditDialogOpen(false);
        fetchSuppliers(currentPage, itemsPerPage, searchTerm);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update supplier",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.log(error)
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to update supplier",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setSupplierForm({
      _id: "",
      name: "",
      contact: "",
      address: "",
      status: "Active"
    });
    setErrors({
      name: "",
      contact: "",
    });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };


  const openEditDialog = (item: any) => {
    setSupplierForm({
      _id: item?._id,
      name: item?.name,
      contact: item?.contact,
      address: item?.address,
      status: item?.status || "Active"
    });
    setIsEditDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>View Suppliers</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">
          <div className="flex justify-end mb-4">
            <AddSupplierOnPage/>
          </div>

          <SupplierTable
            onSearch={handleSearch}
            isLoading={isLoading}
            suppliers={suppliers}
            onEdit={openEditDialog}
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </SidebarInset>

      {/* Edit Supplier Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>
              Update the supplier information below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={supplierForm.name}
                onChange={(e) => {
                  setSupplierForm({...supplierForm, name: e.target.value});
                  if (errors.name) setErrors({...errors, name: ""});
                }}
                placeholder="Supplier name"
                disabled={formLoading}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-contact">Contact *</Label>
              <Input
                id="edit-contact"
                value={supplierForm.contact}
                onChange={(e) => {
                  setSupplierForm({...supplierForm, contact: e.target.value});
                  if (errors.contact) setErrors({...errors, contact: ""});
                }}
                placeholder="Phone number"
                disabled={formLoading}
              />
              {errors.contact && <p className="text-sm text-destructive">{errors.contact}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Textarea
                id="edit-address"
                value={supplierForm.address}
                onChange={(e) => setSupplierForm({...supplierForm, address: e.target.value})}
                placeholder="Full address"
                rows={3}
                disabled={formLoading}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => {
                setIsEditDialogOpen(false);
                resetForm();
              }}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={handleEditSupplier}
              disabled={formLoading}
            >
              {formLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2Icon className="animate-spin h-4 w-4"/>
                  Updating...
                </span>
              ) : "Update Supplier"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default withAuth(Page);