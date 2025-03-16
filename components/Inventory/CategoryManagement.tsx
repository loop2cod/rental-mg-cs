"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, Plus, Check, X, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "../ui/use-toast"
import { API_ENDPOINTS } from "@/lib/apiEndpoints"
import { del, post, put } from "@/utilities/AxiosInterceptor"

interface Category {
  _id: string
  name: string
}

interface CategoryManagementProps {
  categories: Category[]
  fetchCategories: any
}

interface ResponseType {
  success: boolean
  data?: any
  message?: string
}

export default function CategoryManagement({ categories: initialCategories, fetchCategories }: CategoryManagementProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [newCategory, setNewCategory] = useState("")
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [loading, setLoading] = useState(false) // Loading state

  useEffect(() => {
    setCategories(initialCategories)
  }, [initialCategories])

  const handleAddCategory = async () => {
    if (newCategory.trim() && !loading) {
      setLoading(true) // Start loading
      try {
        const response = await post<ResponseType>(
          API_ENDPOINTS.CATEGORY.CREATE,
          { name: newCategory },
          { withCredentials: true }
        )

        if (response.success) {
          setNewCategory("")
          toast({
            title: "Category added",
            description: `${newCategory} has been added to your categories.`,
          })
          fetchCategories()
        } else {
          toast({
            title: "Error",
            description: response.message || "Something went wrong",
            variant: "destructive",
          })
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.message || error.message || "Failed to add category.",
          variant: "destructive",
        })
      } finally {
        setLoading(false) // End loading
      }
    }
  }

  const startEditing = (category: Category) => {
    setEditingCategory(category)
  }

  const cancelEditing = () => {
    setEditingCategory(null)
  }

  const saveEditing = async () => {
    if (editingCategory && !loading) {
      setLoading(true) // Start loading
      try {
        const response = await put<ResponseType>(
          API_ENDPOINTS.CATEGORY.UPDATE.replace(":id", editingCategory._id),
          { name: editingCategory.name, description: "" },
          { withCredentials: true }
        )

        if (response.success) {
          fetchCategories()
          setEditingCategory(null)
          toast({
            title: "Category updated",
            description: `Category has been updated successfully.`,
          })
        } else {
          throw new Error("Failed to update category")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update category.",
          variant: "destructive",
        })
      } finally {
        setLoading(false) // End loading
      }
    }
  }

  const confirmDelete = (id: string) => {
    setCategoryToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (categoryToDelete && !loading) {
      setLoading(true) // Start loading
      try {
        const response = await del<ResponseType>(
          API_ENDPOINTS.CATEGORY.DELETE.replace(":id", categoryToDelete),
          { withCredentials: true }
        )

        if (response.success) {
          fetchCategories()
          setCategoryToDelete(null)
          setDeleteDialogOpen(false)
          toast({
            title: "Category deleted",
            description: `Category has been removed from your categories.`,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to delete category",
            variant: "destructive",
          })
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.message || error.message || "Failed to delete category",
          variant: "destructive",
        })
      } finally {
        setLoading(false) // End loading
      }
    }
  }

  return (
    <>
      <Card className="py-4">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl lg:text-2xl font-medium px-2">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="New category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                disabled={loading} // Disable input during loading
              />
              <Button onClick={handleAddCategory} size="icon" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              </Button>
            </div>

            <div className="rounded-md divide-y">
              {categories.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No categories found</div>
              ) : (
                categories.map((category) => (
                  <div key={category._id} className="p-3 flex items-center justify-between">
                    {editingCategory?._id === category._id ? (
                      <div className="flex-1 flex items-center space-x-2">
                        <Input
                          value={editingCategory?.name}
                          onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                          className="flex-1"
                          disabled={loading} // Disable input during loading
                        />
                        <Button onClick={saveEditing} size="icon" variant="ghost" disabled={loading}>
                          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        </Button>
                        <Button onClick={cancelEditing} size="icon" variant="ghost" disabled={loading}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="flex-1">{category.name}</span>
                        <div className="flex space-x-1">
                          <Button onClick={() => startEditing(category)} size="icon" variant="ghost" disabled={loading}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => confirmDelete(category._id)} size="icon" variant="ghost" disabled={loading}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this category. Products in this category will need to be reassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}