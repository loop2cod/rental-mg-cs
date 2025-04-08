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

interface DispatchModalProps {
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

export function DispatchModal({ open, onOpenChange, orderId, items, onSuccess }: DispatchModalProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState<string>(format(new Date(), 'HH:mm'))
  const [quantities, setQuantities] = useState<Record<string, number>>(
    items.reduce((acc, item) => ({ ...acc, [item.id]: item.maxQuantity }), {})
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

  const handleDispatch = async () => {
    setLoading(true)
    try {
      const dispatchData = items
        .filter(item => quantities[item.id] > 0)
        .map(item => ({
          [item.type === 'product' ? 'product_id' : 'out_product_id']: item.id,
          quantity: quantities[item.id],
          dispatch_date: format(date || new Date(), 'yyyy-MM-dd'),
          dispatch_time: time
        }))

      if (dispatchData.length === 0) {
        toast({
          title: "Error",
          description: "Please select at least one item to dispatch",
          variant: "destructive"
        })
        return
      }

      const response = await post<ResponseType>(API_ENDPOINTS.ORDER.DISPATCH, {
        order_id: orderId,
        dispatch_data: dispatchData
      }, { withCredentials: true })

      if (response.success) {
        toast({
          title: "Success",
          description: "Items dispatched successfully"
        })
        onSuccess()
        onOpenChange(false)
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to dispatch items",
          variant: "destructive"
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to dispatch items",
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
          <DialogTitle>Dispatch Items</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Items to Dispatch</h4>
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
            onClick={handleDispatch} 
            disabled={loading}
          >
            {loading ? "Dispatching..." : "Dispatch Items"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}