import type {ReactNode} from 'react'
import {AdminShell} from '@/components/admin-shell'
import {requireAdmin} from '@/lib/site'
export default async function ProtectedAdminLayout({children}:{children:ReactNode}){const {user}=await requireAdmin();return <AdminShell email={user.email||'Administrator'}>{children}</AdminShell>}
