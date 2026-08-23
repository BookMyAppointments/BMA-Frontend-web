import { AdminShell } from '@/components/layout/AdminShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <AdminShell role="ADMIN">{children}</AdminShell>;
}
