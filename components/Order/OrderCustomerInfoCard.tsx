import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const OrderCustomerInfoCard = ({ customer }: { customer: any }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Name</p>
          <p className="font-medium">{customer?.name}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Phone</p>
          <p className="font-medium">{customer?.mobile}</p>
        </div>
      </CardContent>
    </Card>
  )
}