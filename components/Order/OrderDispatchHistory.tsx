import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format, parse } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DispatchItem {
  _id: string
  quantity: number
  dispatch_date: string
  dispatch_time: string
  status: 'dispatched' | 'returned'
}

interface OrderDispatchHistoryProps {
  dispatchItems: DispatchItem[]
  title?: string
}

export function OrderDispatchHistory({ 
  dispatchItems,
  title = "Dispatch History"
}: OrderDispatchHistoryProps) {
  const dispatchedItems = dispatchItems.filter(item => item.status === 'dispatched')
  const returnedItems = dispatchItems.filter(item => item.status === 'returned')

  return (
    <Card className="shadow-none !border-none rounded-none">
      <CardContent className="p-0">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-between items-center px-4 pt-2">
            <div className="text-sm font-medium">{title}</div>
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs h-6">All</TabsTrigger>
              <TabsTrigger value="dispatched" className="text-xs h-6">Dispatched</TabsTrigger>
              <TabsTrigger value="returned" className="text-xs h-6">Returned</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all">
            <DispatchTable items={dispatchItems} />
          </TabsContent>
          <TabsContent value="dispatched">
            <DispatchTable items={dispatchedItems} emptyMessage="No dispatched items found" />
          </TabsContent>
          <TabsContent value="returned">
            <DispatchTable items={returnedItems} emptyMessage="No returned items found" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function DispatchTable({ items, emptyMessage = "No items found" }: { items: DispatchItem[], emptyMessage?: string }) {
  return (
    <div className="rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Quantity</TableHead>
            <TableHead>Dispatch Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length > 0 ? (
            items.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  {format(new Date(item.dispatch_date), "PPP")} at {item?.dispatch_time ? format(parse(item?.dispatch_time, "HH:mm", new Date()), "hh:mm a") : "-"}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={item.status === 'dispatched' ? 'default' : 'secondary'}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}