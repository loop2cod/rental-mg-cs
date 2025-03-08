'use client'

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const NotFound = () => {
  const navigate = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate.push('/');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-secondary/10 px-4 py-12">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Oops! Page not found.
        </h1>
        <p className="mt-4 text-secondary-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <p className="mt-4 text-secondary-foreground">
         Being redirected...
        </p>
      </div>
    </div>
  );
};

export default NotFound;
