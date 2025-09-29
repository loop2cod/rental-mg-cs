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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { withAuth } from "@/components/Middleware/withAuth"
import { useUser } from "@/context/UserContext"
import { useRouter } from "next/navigation"
import { API_ENDPOINTS } from "@/lib/apiEndpoints"
import { post, get, put } from "@/utilities/AxiosInterceptor"
import { UserPlus, Users, Trash2, KeyRound } from "lucide-react"
import { useEffect, useState } from "react"

type ResponseType = {
  success: boolean
  data?: any
  message?: string
}

type StaffUser = {
  _id: string
  name: string
  mobile: string
  user_role: string
  created_at: string
}

const AdminSettingsPage = () => {
  const { user, loading } = useUser();
  const router = useRouter();
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<StaffUser | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [resetPasswordData, setResetPasswordData] = useState({
    newPassword: '',
    confirmNewPassword: '',
  });

  // Handle authorization (authentication is handled by withAuth HOC)
  useEffect(() => {
    if (!loading && user && user.role !== 'admin') {
      // Redirect to dashboard if not admin
      router.push('/momenz-dashboard');
    }
  }, [user, loading, router]);

  const fetchStaffUsers = async () => {
    setIsLoading(true);
    try {
      const response = await get<ResponseType>('/api/v1/admin/staff-users', {
        withCredentials: true,
      });
      if (response.success) {
        setStaffUsers(response.data.users || []);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch staff users",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to fetch staff users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && user?.role === 'admin') {
      fetchStaffUsers();
    }
  }, [user, loading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResetPasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResetPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.mobile.trim()) {
      toast({
        title: "Validation Error",
        description: "Mobile number is required",
        variant: "destructive",
      });
      return false;
    }
    if (formData.mobile.length !== 10) {
      toast({
        title: "Validation Error",
        description: "Mobile number must be 10 digits",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.password) {
      toast({
        title: "Validation Error",
        description: "Password is required",
        variant: "destructive",
      });
      return false;
    }
    if (formData.password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateResetPasswordForm = () => {
    if (!resetPasswordData.newPassword) {
      toast({
        title: "Validation Error",
        description: "New password is required",
        variant: "destructive",
      });
      return false;
    }
    if (resetPasswordData.newPassword.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return false;
    }
    if (resetPasswordData.newPassword !== resetPasswordData.confirmNewPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
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
      const response = await post<ResponseType>('/api/v1/admin/create-staff', {
        name: formData.name,
        mobile: formData.mobile,
        password: formData.password,
        user_role: 'staff'
      }, {
        withCredentials: true,
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Staff user created successfully",
        });
        setIsDialogOpen(false);
        setFormData({
          name: '',
          mobile: '',
          password: '',
          confirmPassword: '',
        });
        fetchStaffUsers();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create staff user",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to create staff user",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateResetPasswordForm() || !selectedUser) return;

    setIsLoading(true);
    try {
      const response = await put<ResponseType>(`/api/v1/admin/reset-password/${selectedUser._id}`, {
        newPassword: resetPasswordData.newPassword,
      }, {
        withCredentials: true,
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Password reset successfully",
        });
        setIsResetPasswordDialogOpen(false);
        setSelectedUser(null);
        setResetPasswordData({
          newPassword: '',
          confirmNewPassword: '',
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to reset password",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openResetPasswordDialog = (user: StaffUser) => {
    setSelectedUser(user);
    setIsResetPasswordDialogOpen(true);
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
                  <BreadcrumbPage>Admin Settings</BreadcrumbPage>
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
                    <Users className="h-5 w-5" />
                    Staff User Management
                  </CardTitle>
                  <CardDescription>
                    Manage staff users who can access the system
                  </CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Staff User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create New Staff User</DialogTitle>
                      <DialogDescription>
                        Add a new staff user to the system. They will be able to access all staff features.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="col-span-3"
                            placeholder="Enter full name"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="mobile" className="text-right">
                            Mobile
                          </Label>
                          <Input
                            id="mobile"
                            name="mobile"
                            type="tel"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            className="col-span-3"
                            placeholder="Enter mobile number"
                            maxLength={10}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="password" className="text-right">
                            Password
                          </Label>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="col-span-3"
                            placeholder="Enter password"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="confirmPassword" className="text-right">
                            Confirm
                          </Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="col-span-3"
                            placeholder="Confirm password"
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Creating..." : "Create Staff User"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Reset Password Dialog */}
                <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Reset Password</DialogTitle>
                      <DialogDescription>
                        Reset password for {selectedUser?.name} ({selectedUser?.mobile})
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleResetPassword}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="newPassword" className="text-right">
                            New Password
                          </Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={resetPasswordData.newPassword}
                            onChange={handleResetPasswordInputChange}
                            className="col-span-3"
                            placeholder="Enter new password"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="confirmNewPassword" className="text-right">
                            Confirm
                          </Label>
                          <Input
                            id="confirmNewPassword"
                            name="confirmNewPassword"
                            type="password"
                            value={resetPasswordData.confirmNewPassword}
                            onChange={handleResetPasswordInputChange}
                            className="col-span-3"
                            placeholder="Confirm new password"
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsResetPasswordDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Resetting..." : "Reset Password"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Loading staff users...
                      </TableCell>
                    </TableRow>
                  ) : staffUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No staff users found. Create the first staff user to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    staffUsers.map((staff) => (
                      <TableRow key={staff._id}>
                        <TableCell className="font-medium">{staff.name}</TableCell>
                        <TableCell>{staff.mobile}</TableCell>
                        <TableCell className="capitalize">{staff.user_role}</TableCell>
                        <TableCell>{new Date(staff.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => openResetPasswordDialog(staff)}
                              className="text-blue-600"
                            >
                              <KeyRound className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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

export default withAuth(AdminSettingsPage);