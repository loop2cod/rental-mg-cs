import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {  CheckCircle, Clock, IndianRupee, Package} from "lucide-react"
import Section2 from "@/components/Dashboard/Section2"
import Section1 from "@/components/Dashboard/Section1"


export default function Home() {
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
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-2 pt-0">
        <div className="flex-col md:flex">
  <Tabs defaultValue="overview" className="space-y-4">
    <TabsList>
      <TabsTrigger value="overview">Overview</TabsTrigger>
    </TabsList>
    <TabsContent value="overview" className="space-y-4">
      {/* Grid layout for cards */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue Card */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">
              Total Revenue
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-primary dark:text-secondary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-base md:text-2xl font-bold">₹45,231.89</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              <span className="text-primary dark:text-secondary-foreground">+20.1%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">
              Pre-Bookings
            </CardTitle>
            <Clock className="h-4 w-4 text-primary dark:text-secondary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-base md:text-2xl font-bold">+2350</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
            <span className="text-primary dark:text-secondary-foreground">+180.1%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Confirmed Bookings</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary dark:text-secondary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-base md:text-2xl font-bold">+12,234</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
            <span className="text-primary dark:text-secondary-foreground">+19%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">
              Stock Availability
            </CardTitle>
            <Package className="h-4 w-4 text-primary dark:text-secondary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-base md:text-2xl font-bold">+573</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
            <span className="text-primary dark:text-secondary-foreground">+201</span> since last hour
            </p>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  </Tabs>
</div>
<Section1/>
        <Section2/>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
