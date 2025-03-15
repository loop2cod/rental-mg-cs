'use client';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Cookies from 'js-cookie';
import { useToast } from '@/components/ui/use-toast';
import Authorised from '@/components/Middleware/Authorised';
import { API_ENDPOINTS } from '@/lib/apiEndpoints';
import { useRouter, useSearchParams } from 'next/navigation';
import { post } from '@/utilities/AxiosInterceptor';
import Spinner from '@/components/Spinner';
import axios from 'axios';

interface AuthResponse {
  success: boolean;
  data?: any;
  message?: string;
  sessionOut?: boolean;
}

const Page = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const [ok, setOk] = useState<boolean | null>(null);
  const [mobile, setMobile] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const checkAuth = async () => {
    try {
      const response = await axios.post(`${apiUrl}${API_ENDPOINTS.AUTH.VERIFY}`, {}, { withCredentials: true });
      if (response?.data?.success) {
        setOk(true);
      } else {
        setOk(false);
      }
    } catch (error: any) {
      if (error.response?.status === 400 && error.response?.data?.sessionOut === true) {
        setOk(false);
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.message || error.message || 'Failed to verify authentication',
          variant: 'destructive',
        });
        setOk(false);
      }
    }
  };

  useLayoutEffect(() => {
    checkAuth();
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mobile) {
      toast({
        title: 'Error',
        description: 'Mobile number is required',
        variant: 'destructive',
      });
      return;
    }

    if (!password) {
      toast({
        title: 'Error',
        description: 'Password is required',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        { mobile, password },
        { withCredentials: true }
      );

      if (response.success) {
        console.log('done')
        const redirectTo = redirect ? decodeURIComponent(redirect) : '/';
        router.push(redirectTo);
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Something went wrong',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const toastData = Cookies.get('toastMessage');

    if (toastData) {
      const parsedToast = JSON.parse(toastData);
      toast({
        variant: 'destructive',
        title: parsedToast.message,
        description: parsedToast.description,
      });
      Cookies.remove('toastMessage');
    }
  }, [toast]);

  if (ok) return <Authorised />;
  if (ok === null) return <Spinner/>;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-secondary/40 p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn('flex flex-col gap-6')}>
          <Card className="overflow-hidden py-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <div className="min-h-[50vh] flex items-center justify-center">
                <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-2xl font-bold">Welcome back</h1>
                      <p className="text-balance text-muted-foreground">Login to your Alis rental management</p>
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input
                        className="border border-primary"
                        id="mobile"
                        type="tel"
                        placeholder="Mobile with 91"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
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
                      <Input
                        className="border border-primary"
                        id="password"
                        type="password"
                        placeholder='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Logging in...' : 'Login'}
                    </Button>
                  </div>
                </form>
              </div>
              <div className="relative hidden bg-muted md:block">
                <img
                  src="/loginbf.jpg"
                  alt="Login Background"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8]"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;