import React from 'react'
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const Authorised = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-1">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Authorized Access</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="default">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Already  Authorized</AlertTitle>
            <AlertDescription>
              You have successfully gained authorisation.
            </AlertDescription>
          </Alert>
          <p className="mt-4 text-muted-foreground text-center">
            Feel free to explore further or proceed with your current actions.
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

export default Authorised
