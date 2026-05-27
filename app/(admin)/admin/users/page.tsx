import AdminHeader from "@/components/admin/AdminHeader";
import { createAdminClient } from "@/lib/supabase/server";
import UserManager from "@/components/admin/UserManager";

export default async function AdminUsersPage() {
  const admin = await createAdminClient();
  const { data: users } = await admin
    .from("profiles")
    .select("id, first_name, last_name, role, is_active, last_seen, tenant_id, tenants(name)")
    .order("created_at", { ascending: false })
    .returns<{
      id: string;
      first_name: string | null;
      last_name: string | null;
      role: string | null;
      is_active: boolean | null;
      last_seen: string | null;
      tenant_id: string | null;
      tenants: { name: string } | null;
    }[]>();

  return (
    <div>
      <AdminHeader
        title="Users"
        subtitle="Manage all users across every tenant account"
        breadcrumb="Platform Management"
      />
      <UserManager initialUsers={users ?? []} />
    </div>
  );
}
