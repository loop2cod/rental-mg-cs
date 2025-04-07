'use client'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { post } from "@/utilities/AxiosInterceptor"
import { API_ENDPOINTS } from "@/lib/apiEndpoints"
import { cn } from "@/lib/utils"
import { Loader2Icon } from "lucide-react"
import { toast } from "../ui/use-toast"
import { Textarea } from "../ui/textarea"

type ResponseType = {
  success: boolean;
  data?: any;
  message?: string;
}

const AddSupplierOnPage = () => {
  const [open, setOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contact: "",
    address: "",
    status: "Active"
  });

  const [errors, setErrors] = useState({
    name: "",
    contact: "",
  });

  const [loading, setLoading] = useState({
    addSupplier: false,
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      contact: "",
    };

    if (!newSupplier.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!newSupplier.contact.trim()) {
      newErrors.contact = "Contact is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddSupplier = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(prev => ({ ...prev, addSupplier: true }));
    
    try {
      const response = await post<ResponseType>(
        API_ENDPOINTS.SUPPLIERS.CREATE,
        newSupplier,
        { withCredentials: true }
      );

      if (response.success) {
        toast({
          title: "Success",
          description: "Supplier added successfully",
        });
        setNewSupplier({
          name: "",
          contact: "",
          address: "",
          status: "Active"
        });
        setOpen(false);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to add supplier",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to add supplier",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, addSupplier: false }));
    }
  };

  const handleCancel = () => {
    setOpen(false);
    // Clear errors when canceling
    setErrors({
      name: "",
      contact: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <Button>
              Add New Supplier
            </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Supplier</DialogTitle>
          <DialogDescription>
            Please fill out this form to add a new supplier.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="name" className="mb-2">Name *</Label>
            <Input
              id="name"
              value={newSupplier.name}
              onChange={(e) => {
                setNewSupplier({...newSupplier, name: e.target.value});
                if (errors.name) {
                  setErrors({...errors, name: ""});
                }
              }}
              placeholder="Supplier name"
              disabled={loading.addSupplier}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="contact" className="mb-2">Contact *</Label>
            <Input
              id="contact"
              value={newSupplier.contact}
              onChange={(e) => {
                setNewSupplier({...newSupplier, contact: e.target.value});
                if (errors.contact) {
                  setErrors({...errors, contact: ""});
                }
              }}
              placeholder="Phone number"
              disabled={loading.addSupplier}
            />
            {errors.contact && (
              <p className="text-xs text-destructive">{errors.contact}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={newSupplier.address}
              onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
              placeholder="Full address"
              rows={3}
              disabled={loading.addSupplier}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button"
            variant="outline" 
            onClick={handleCancel}
            disabled={loading.addSupplier}
          >
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={handleAddSupplier}
            disabled={loading.addSupplier}
          >
            {loading.addSupplier ? (
              <span className="flex items-center gap-2">
                <Loader2Icon className="animate-spin h-4 w-4"/>
                Saving...
              </span>
            ) : "Save Supplier"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSupplierOnPage;