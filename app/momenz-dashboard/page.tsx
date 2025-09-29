'use client'
import { withAuth } from "@/components/Middleware/withAuth"
import dynamic from 'next/dynamic'
import Spinner from '@/components/Spinner'

const RoleBasedDashboard = dynamic(
  () => import("@/components/RoleBased/RoleBasedDashboard"),
  { 
    ssr: false,
    loading: () => <Spinner />
  }
)

const Page = () => {
  return <RoleBasedDashboard />
}

export default withAuth(Page)