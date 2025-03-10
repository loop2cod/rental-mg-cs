import React from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


const page = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-secondary/40  p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
      <div className={cn("flex flex-col gap-6",)}>
      <Card className="overflow-hidden py-0">
        <CardContent className="grid p-0 md:grid-cols-2">
      <div className='min-h-[50vh] flex items-center justify-center'>
      <form className="p-6 md:p-8">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your Alis rental management
                </p>
              </div>
              <div className="grid gap-1">
                <Label htmlFor="username">Username</Label>
                <Input
                className='border border-primary'
                  id="username"
                  type="username"
                  placeholder="m@examp"
                  required
                />
              </div>
              <div className="grid gap-1">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input className='border border-primary' id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
      </div>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/loginbf.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
      </div>
    </div>
  )
}

export default page