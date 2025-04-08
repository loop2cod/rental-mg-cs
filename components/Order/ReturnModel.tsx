'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { post } from "@/utilities/AxiosInterceptor"
import { toast } from "@/components/ui/use-toast"
import { API_ENDPOINTS } from "@/lib/apiEndpoints"

interface ReturnModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId: string
  items: Array<{
    id: string
    name: string
    type: 'product' | 'outsourced'
    maxQuantity: number
  }>
  onSuccess: () => void
}

interface ResponseType {
  success: boolean;
  data?: any;
  message?: string;
}

export function ReturnModal({ open, onOpenChange, orderId, items, onSuccess }: ReturnModalProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState<string>(format(new Date(), 'HH:mm'))
  const [quantities, setQuantities] = useState<Record<string, number>>(
    items.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {})
  )
  const [loading, setLoading] = useState(false)

  const handleQuantityChange = (id: string, value: string) => {
    const numValue = parseInt(value) || 0
    const item = items.find(i => i.id === id)
    setQuantities(prev => ({
      ...prev,
      [id]: Math.min(Math.max(numValue, 0), item?.maxQuantity || 0)
    }))
  }

  const handleReturn = async () => {
    setLoading(true)
    try {
      const returnData = items
        .filter(item => quantities[item.id] > 0)
        .map(item => ({
          [item.type === 'product' ? 'product_id' : 'out_product_id']: item.id,
          quantity: quantities[item.id],
          return_date: format(date || new Date(), 'yyyy-MM-dd'),
          return_time: time
        }))

      if (returnData.length === 0) {
        toast({
          title: "Error",
          description: "Please select at least one item to return",
          variant: "destructive"
        })
        return
      }

      const response = await post<ResponseType>(API_ENDPOINTS.ORDER.RETURN, {
        order_id: orderId,
        return_data: returnData
      }, { withCredentials: true })

      if (response.success) {
        toast({
          title: "Success",
          description: "Items returned successfully"
        })
        onSuccess()
        onOpenChange(false)
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to return items",
          variant: "destructive"
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to return items",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Return Items</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Items to Return</h4>
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="grid grid-cols-2 items-center gap-4">
                  <Label className="text-right">
                    {item.name} ({item.type})
                  </Label>
                  <div className="col-span-1 flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      max={item.maxQuantity}
                      value={quantities[item.id] || 0}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      className="w-full"
                    />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      / {item.maxQuantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleReturn} 
            disabled={loading}
          >
            {loading ? "Returning..." : "Return Items"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}