import { AdminShell } from '@/components/layout/AdminShell';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
    return <AdminShell role="SUPERADMIN">{children}</AdminShell>;
}
