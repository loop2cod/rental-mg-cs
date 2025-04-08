import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const OrderCustomerInfoCard = ({ customer }: { customer: any }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Customer Information</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4">
        <div className="space-y-2 text-sm md:text-base">
          <p className="text-muted-foreground">Name</p>
          <p className="font-semibold">{customer?.name}</p>
        </div>
        <div className="space-y-2 text-sm md:text-base">
          <p className="text-muted-foreground">Phone</p>
          <p className="font-semibold">{customer?.mobile}</p>
        </div>
      </CardContent>
    </Card>
  )
}