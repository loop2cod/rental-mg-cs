import React from 'react'
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const Unauthorised = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-1">
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Unauthorized Access</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have the necessary permissions to view this page.
          </AlertDescription>
        </Alert>
        <p className="mt-4 text-muted-foreground text-center">
          If you believe this is an error, please contact your administrator or try logging in again.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center space-x-4">
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
        <Button onClick={() => window.location.href = "/"}>
          Home
        </Button>
      </CardFooter>
    </Card>
  </div>
  )
}

export default Unauthorised
