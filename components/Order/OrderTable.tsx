'use client'
import React, { useMemo } from 'react'
import { ColumnDef, DataTable } from '../ui/data-table';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Button } from '../ui/button';
import { Edit, View } from 'lucide-react';
import { formatCurrency } from '@/lib/commonFunctions'
import { Badge } from '../ui/badge';
import { format } from 'date-fns';

const OrderTable = ({
    onSearch,
    isLoading,
    orders,
    currentPage,
    totalPages,
    totalCount,
    onPageChange,
    onPageSizeChange,
}: any) => {
    const router = useRouter();

    const columns: ColumnDef<any>[] = useMemo(() => [
       {
             id: "from_date",
             header: "From Date",
             accessorKey: "from_date",
             cell: (item) => {
               const fromDate = format(new Date(item.from_date), "MMM dd, yyyy");
               return (
                 <div className="text-sm">
                   <span className="block">{fromDate}</span>
                   <span className="text-xs text-gray-500">{item.from_time}</span>
                 </div>
               );
             },
             sortable: true,
             searchable: false,
           },
           {
             id: "to_date",
             header: "To Date",
             accessorKey: "to_date",
             cell: (item) => {
               const toDate = format(new Date(item.to_date), "MMM dd, yyyy");
               return (
                 <div className="text-sm">
                   <span className="block">{toDate}</span>
                   <span className="text-xs text-gray-500">{item.to_time}</span>
                 </div>
               );
             },
             sortable: true,
             searchable: false,
           },
              {
            id: "user",
            header: "Customer",
            accessorKey: "user.name",
            sortable: true,
            searchable: true,
            cell: (item) => (
                <div>
                    <div className="font-medium">{item.user.name}</div>
                    <div className="text-sm text-gray-500">{item.user.mobile}</div>
                </div>
            ),
        },
        {
            id: "items",
            header: "Items",
            cell: (item) => (
                <div>
                    <div className="font-medium">Products: {item.order_items.reduce((sum: number, item: any) => sum + item.quantity, 0)}</div>
                    <div className="text-sm">Outsourced: {item.outsourced_items.reduce((sum: number, item: any) => sum + item.quantity, 0)}</div>
                </div>
            ),
            sortable: false,
        },
        {
            id: "amount",
            header: "Amount",
            accessorKey: "total_amount",
            cell: (item) => formatCurrency(item?.total_amount),
            sortable: true,
        },
          {
                id: "amount_paid",
                header: "Paid",
                accessorKey: "amount_paid",
                cell: (item) => (
                  <span className="text-sm font-medium">{formatCurrency(item.amount_paid)}</span>
                ),
                sortable: true,
                searchable: false,
              },
        {
            id: "status",
            header: "Status",
            accessorKey: "status",
            cell: (item) => {
                const status = item?.status;
                let variant: "default" | "destructive" | "outline" | "secondary" = "outline";
                
                if (status === "Pending") variant = "outline";
                else if (status === "inreturn") variant = "secondary";
                // Add more status variants as needed
                
                return <Badge variant={variant}>{status}</Badge>;
            },
            sortable: true,
        },
        {
            id: "order_date",
            header: "Order Date",
            accessorKey: "order_date",
            cell: (item) => new Date(item?.order_date).toLocaleDateString(),
            sortable: true,
        },
        {
            id: "actions",
            header: "Actions",
            cell: (item) => (
                <div className="flex justify-start gap-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-gray-100"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/order/details/${item._id}`);
                                    }}
                                >
                                    <View className="h-4 w-4" />
                                    <span className="sr-only">View</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>View Order</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-gray-100"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/order/update/${item._id}`);
                                    }}
                                >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Edit Order</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            ),
            sortable: false,
            searchable: false,
        },
    ], [router]);

    return (
        <div className="px-2 md:px-4 lg:px-6">
            <DataTable
                itemsPerPageOptions={[5, 10, 20, 50, 100]}
                isLoading={isLoading}
                data={orders}
                columns={columns}
                serialNumber={true}
                showSearchBar={true}
                showPdfExport={true}
                showExcelExport={true}
                showPagination={true}
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                onSearch={onSearch}
            />
        </div>
    );
};

export default OrderTable;