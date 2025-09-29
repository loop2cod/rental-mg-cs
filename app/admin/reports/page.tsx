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
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { withAuth } from "@/components/Middleware/withAuth"
import { useUser } from "@/context/UserContext"
import { useRouter } from "next/navigation"
import { 
  FileText, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Building2,
  Download,
  BarChart3,
  Calendar,
} from "lucide-react"
import { useEffect } from "react"

const ReportsPage = () => {
  const { user, loading } = useUser();
  const router = useRouter();

  // Handle authorization
  useEffect(() => {
    if (!loading && user && user.role !== 'admin') {
      router.push('/momenz-dashboard');
    }
  }, [user, loading, router]);

  const reportCategories = [
    {
      title: "Purchase Reports",
      description: "Detailed analysis of all purchase transactions, supplier performance, and buying trends",
      icon: ShoppingCart,
      url: "/admin/reports/purchases",
      color: "bg-blue-100 text-blue-700",
      features: ["Purchase summaries", "Supplier analysis", "Status tracking", "Excel & PDF exports"],
      available: true
    },
    {
      title: "Inventory Reports",
      description: "Product catalog, categories, and inventory management overview",
      icon: Package,
      url: "/admin/reports/inventory",
      color: "bg-purple-100 text-purple-700",
      features: ["Product listings", "Category breakdown", "Stock overview", "Excel exports"],
      available: true
    },
    {
      title: "Supplier Reports",
      description: "Supplier directory, contact information, and basic supplier analytics",
      icon: Building2,
      url: "/admin/reports/suppliers",
      color: "bg-orange-100 text-orange-700",
      features: ["Supplier directory", "Contact details", "Overview metrics", "PDF exports"],
      available: true
    }
  ];

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
                  <BreadcrumbPage>Reports & Analytics</BreadcrumbPage>
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
                    <BarChart3 className="h-5 w-5" />
                    Reports & Analytics Dashboard
                  </CardTitle>
                  <CardDescription>
                    Comprehensive business intelligence and reporting suite for data-driven decisions
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground">
                    Last updated: {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Purchase Records</p>
                    <p className="text-2xl font-bold">Available</p>
                    <p className="text-xs text-muted-foreground">View detailed analysis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Package className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Inventory Data</p>
                    <p className="text-2xl font-bold">Available</p>
                    <p className="text-xs text-muted-foreground">Products & categories</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Supplier Directory</p>
                    <p className="text-2xl font-bold">Available</p>
                    <p className="text-xs text-muted-foreground">Complete supplier list</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reportCategories.map((category) => (
              <Card key={category.title} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${category.color}`}>
                        <category.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {category.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Key Features:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {category.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-current rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => router.push(category.url)}
                        className="flex-1"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Reports
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => router.push(category.url)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>
                All reports support multiple export formats for maximum flexibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <FileText className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="font-medium">PDF Reports</p>
                    <p className="text-sm text-muted-foreground">Professional formatted documents</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Package className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium">Excel Exports</p>
                    <p className="text-sm text-muted-foreground">Detailed data for analysis</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium">Interactive Charts</p>
                    <p className="text-sm text-muted-foreground">Visual data representation</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default withAuth(ReportsPage);