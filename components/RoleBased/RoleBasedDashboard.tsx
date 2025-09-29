'use client';

import React from 'react';
import { useUser } from '@/context/UserContext';
import Spinner from '@/components/Spinner';
import StaffDashboard from './StaffDashboard';
import AdminDashboard from './AdminDashboard';

const RoleBasedDashboard: React.FC = () => {
  const { user, loading } = useUser();

  // Since this component is wrapped with withAuth, we know the user is authenticated
  // We just need to wait for user data to load and determine the role
  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    // This shouldn't happen if withAuth is working correctly, but just in case
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading user data...</h2>
          <Spinner />
        </div>
      </div>
    );
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'staff':
      return <StaffDashboard />;
    default:
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        </div>
      );
  }
};

export default RoleBasedDashboard;