import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface DispatchItem {
  _id: string
  quantity: number
  dispatch_date: string
  dispatch_time: string
  status: string
}

interface OrderDispatchHistoryProps {
  dispatchItems: DispatchItem[]
  title?: string
}

export function OrderDispatchHistory({ 
  dispatchItems,
  title = "Dispatch History"
}: OrderDispatchHistoryProps) {
  return (
    <Card className="shadow-none border-0">
      <CardContent className="p-0">
        <div className="text-sm font-medium mb-2 px-2">{title}</div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quantity</TableHead>
                <TableHead>Dispatch Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dispatchItems.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    {format(new Date(item.dispatch_date), "PPP")} at {item.dispatch_time}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}