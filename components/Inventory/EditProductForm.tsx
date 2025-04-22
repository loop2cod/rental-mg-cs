"use client"

import React, { useState, useRef, useEffect, useLayoutEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Trash2, Plus, X, ImageIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "../ui/use-toast"
import { API_ENDPOINTS } from "@/lib/apiEndpoints"
import { get, put, del } from "@/utilities/AxiosInterceptor"
import { Progress } from "@/components/ui/progress"

// Define validation schema using Zod
const formSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    unit_cost: z.string().min(1, "Unit cost is required").regex(/^\d+(\.\d{1,2})?$/, "Invalid unit cost"),
    quantity: z.string().min(1, "Quantity is required").regex(/^\d+$/, "Invalid quantity"),
    category: z.string().min(1, "Category is required"),
    description: z.string().min(1, "Description is required"),
})

interface ResponseType {
    success: boolean;
    data?: any;
    message?: string;
}

export default function EditProductForm({ categories, productId }: { categories: any, productId: any }) {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [images, setImages] = useState<{url: string; key: string}[]>([])
    const [features, setFeatures] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }])
    const [loading, setLoading] = useState(false) // Loading state
    const [productCategoryName, setProductCategoryName] = useState<string>("") // Store product's category name
    const [uploadingImages, setUploadingImages] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0) // Track upload progress
    const [deletingImageIndex, setDeletingImageIndex] = useState<number | null>(null) // Track which image is being deleted

    // Initialize the form using useForm with Zod resolver
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            unit_cost: "",
            quantity: "",
            category: "",
            description: "",
        },
    })

    // Fetch product data and populate the form
    useLayoutEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await get<ResponseType>(
                    API_ENDPOINTS.INVENTORY.GET_BY_ID.replace(":id", productId),
                    { withCredentials: true }
                );
                if (response.success) {
                    const product = response.data;

                    // Ensure category_id exists and has an _id property
                    const categoryId = product.category_id?._id || "";

                    // Set the product's category name
                    setProductCategoryName(product.category_id?.name || "");

                    // Set default values for the form
                    form.reset({
                        name: product.name,
                        unit_cost: product.unit_cost.toString(), // Convert number to string
                        quantity: product.quantity.toString(), // Convert number to string
                        category: categoryId, // Use the extracted category ID
                        description: product.description,
                    });

                    // Convert features object to array of key-value pairs
                    const featuresArray = Object.entries(product.features).map(([key, value]) => ({
                        key,
                        value: value as string,
                    }));
                    setFeatures(featuresArray.length > 0 ? featuresArray : [{ key: "", value: "" }]);

                    // Filter out invalid image paths and set only valid URLs
                    const validImages = product.images
                        .filter((image: string) => image.startsWith("http"))
                        .map((image: string) => ({ url: image, key: image.split('/').pop() || '' }));
                    setImages(validImages);
                } else {
                    toast({
                        title: "Error",
                        description: response.message || "Failed to fetch product",
                        variant: "destructive",
                    });
                }
            } catch (error: any) {
                toast({
                    title: "Error",
                    description:
                        error.response?.data?.message || error.message || "Failed to fetch product",
                    variant: "destructive",
                });
            }
        };

        fetchProduct();
    }, [productId, form]);

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        if (loading) return; // Prevent multiple submissions
        setLoading(true); // Start loading

        try {
            // Prepare JSON data
            const validFeatures = features
                .filter((f) => f.key && f.value)
                .reduce((acc, f) => {
                    acc[f.key] = f.value;
                    return acc;
                }, {} as Record<string, string>);

            const jsonData = {
                name: data.name,
                unit_cost: data.unit_cost,
                quantity: data.quantity, 
                category_id: data.category,
                description: data.description,
                features: validFeatures,
                images: images.map(img => img.url)
            };

            // Send the request
            const response = await put<ResponseType>(
                API_ENDPOINTS.INVENTORY.UPDATE.replace(":id", productId),
                jsonData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.success) {
                toast({
                    title: "Product updated",
                    description: `${data.name} has been updated.`,
                });
                router.push("/list-inventory");
            } else {
                toast({
                    title: "Error", 
                    description: response.message || "Failed to update product",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description:
                    error.response?.data?.message || error.message || "Failed to update product",
                variant: "destructive", 
            });
        } finally {
            setLoading(false); // End loading
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setUploadingImages(true);
            setUploadProgress(0);
            
            try {
                const files = Array.from(e.target.files);
                const newImages = [...images];
                
                for (const file of files) {
                    // Get presigned URL
                    const response = await get<ResponseType>(
                        API_ENDPOINTS.FILE.GET_URL,
                        { 
                            withCredentials: true,
                            params: {
                                fileName: file.name,
                                fileType: file.type
                            }
                        }
                    );
                    
                    if (!response.success || !response.data) {
                        throw new Error("Failed to get upload URL");
                    }
                    
                    const { uploadURL, publicURL } = response.data;
                    
                    // Upload with progress tracking
                    const xhr = new XMLHttpRequest();
                    xhr.upload.addEventListener('progress', (event) => {
                        if (event.lengthComputable) {
                            const percentComplete = Math.round((event.loaded / event.total) * 100);
                            setUploadProgress(percentComplete);
                        }
                    });
                    
                    await new Promise((resolve, reject) => {
                        xhr.onload = () => {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                resolve(xhr.response);
                            } else {
                                reject(new Error(`Upload failed with status ${xhr.status}`));
                            }
                        };
                        xhr.onerror = () => reject(new Error('Upload failed'));
                        xhr.open('PUT', uploadURL, true);
                        xhr.setRequestHeader('Content-Type', file.type);
                        xhr.send(file);
                    });
                    
                    newImages.push({ url: publicURL, key: file.name });
                }
                
                setImages(newImages);
                setUploadProgress(0);
                
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                
                toast({
                    title: "Upload successful",
                    description: `${files.length} image(s) uploaded successfully.`,
                });
            } catch (error: any) {
                toast({
                    title: "Upload failed",
                    description: error.message || "Failed to upload images",
                    variant: "destructive",
                });
            } finally {
                setUploadingImages(false);
            }
        }
    }

    const removeImage = async (index: number, url: string) => {
        try {
            setDeletingImageIndex(index); // Track which image is being deleted
            
            // Delete the file from R2 bucket
            await del<ResponseType>(
                API_ENDPOINTS.FILE.DELETE,
                { 
                    withCredentials: true,
                    data: { fileUrl: url }
                }
            );
            
            // Remove from state
            const newImages = [...images];
            newImages.splice(index, 1);
            setImages(newImages);
            
            toast({
                title: "Image removed",
                description: "Image has been deleted successfully.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete image",
                variant: "destructive",
            });
        } finally {
            setDeletingImageIndex(null); // Reset deleting state
        }
    }

    const addFeatureField = () => {
        setFeatures([...features, { key: "", value: "" }])
    }

    const updateFeatureField = (index: number, field: "key" | "value", value: string) => {
        const updatedFeatures = [...features]
        updatedFeatures[index][field] = value
        setFeatures(updatedFeatures)
    }

    const removeFeatureField = (index: number) => {
        if (features.length > 1) {
            const updatedFeatures = [...features]
            updatedFeatures.splice(index, 1)
            setFeatures(updatedFeatures)
        }
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                name="name"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter product name" {...field} disabled={loading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="unit_cost"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unit Cost</FormLabel>
                                        <FormControl>
                                            <Input placeholder="0.00" type="number" step="0.01" min="0" {...field} disabled={loading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                name="quantity"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantity</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter quantity" type="number" min="0" {...field} disabled={loading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="category"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue
                                                        placeholder={
                                                            productCategoryName ||
                                                            categories.find((category: any) => category._id === field.value)?.name ||
                                                            "Select a category"
                                                        }
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories?.map((category: any) => (
                                                    <SelectItem key={category._id} value={category._id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            name="description"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter product description" className="resize-none" {...field} disabled={loading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div>
                            <FormLabel>Features</FormLabel>
                            <FormDescription>Add key-value pairs for product features</FormDescription>
                            <div className="space-y-3 mt-2">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex gap-3">
                                        <Input
                                            placeholder="Feature name"
                                            value={feature.key}
                                            onChange={(e) => updateFeatureField(index, "key", e.target.value)}
                                            className="flex-1"
                                            disabled={loading}
                                        />
                                        <Input
                                            placeholder="Feature value"
                                            value={feature.value}
                                            onChange={(e) => updateFeatureField(index, "value", e.target.value)}
                                            className="flex-1"
                                            disabled={loading}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeFeatureField(index)}
                                            disabled={loading}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addFeatureField}
                                    className="mt-2"
                                    disabled={loading}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Feature
                                </Button>
                            </div>
                        </div>

                        <div>
                            <FormLabel>Product Images</FormLabel>
                            <FormDescription>Upload images of your product (max 5 images)</FormDescription>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
                                {images.map((image, index) => (
                                    <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                                        <img
                                            src={image.url || "/placeHolder.jpg"}
                                            alt={`Product image ${index + 1}`}
                                            className="object-cover"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-1 right-1 h-6 w-6"
                                            onClick={() => removeImage(index, image.url)}
                                            disabled={loading || uploadingImages || deletingImageIndex === index}
                                        >
                                            {deletingImageIndex === index ? (
                                                <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
                                            ) : (
                                                <X className="h-3 w-3" />
                                            )}
                                        </Button>
                                    </div>
                                ))}

                                {images.length < 5 && (
                                    <div
                                        className={`border border-dashed rounded-md flex flex-col items-center justify-center p-4 aspect-square ${uploadingImages ? 'opacity-50' : 'cursor-pointer hover:bg-muted/50'} transition-colors`}
                                        onClick={() => !uploadingImages && fileInputRef.current?.click()}
                                    >
                                        {uploadingImages ? (
                                            <div className="mt-2 space-y-1">
                                                <p className="text-xs">Uploading...</p>
                                                <Progress value={uploadProgress} className="h-2" />
                                            </div>
                                        ) : (
                                            <>
                                                <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                                                <p className="text-sm text-muted-foreground text-center">Click to upload</p>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            disabled={loading || uploadingImages}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={loading || uploadingImages || deletingImageIndex !== null}>
                                {loading ? "Updating..." : "Update Product"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}