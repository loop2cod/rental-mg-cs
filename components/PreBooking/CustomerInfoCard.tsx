// components/view-pre-booking/CustomerInfoCard.tsx
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const CustomerInfoCard = ({ customer }: { customer: any }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Name</p>
          <p className="font-medium">{customer.name}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Phone</p>
          <p className="font-medium">{customer.mobile}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">ID Proof Type</p>
          <p className="font-medium">{customer.proof_type || "Not provided"}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">ID Proof Number</p>
          <p className="font-medium">{customer.proof_id || "Not provided"}</p>
        </div>
      </CardContent>
    </Card>
  )
}