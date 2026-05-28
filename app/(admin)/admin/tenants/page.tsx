import AdminHeader from "@/components/admin/AdminHeader";
import { createAdminClient } from "@/lib/supabase/server";
import TenantManager from "@/components/admin/TenantManager";
import { Plus } from "lucide-react";

export default async function AdminTenantsPage() {
  const admin = await createAdminClient();

  const { data: tenants } = await admin
    .from("tenants")
    .select(`
      id, name, slug, email, phone, country,
      is_active, is_setup_complete, created_at,
      subscriptions(status, subscription_plans(name, slug))
    `)
    .order("created_at", { ascending: false })
    .returns<{
      id: string;
      name: string;
      slug: string;
      email: string | null;
      phone: string | null;
      country: string | null;
      is_active: boolean | null;
      is_setup_complete: boolean | null;
      created_at: string | null;
      subscriptions: {
        status: string | null;
        subscription_plans: { name: string; slug: string } | null;
      }[];
    }[]>();

  return (
    <div>
      <AdminHeader
        title="Clients"
        subtitle="Manage all client company accounts on the platform"
        breadcrumb="Platform Management"
        action={
          <button className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Add Client
          </button>
        }
      />
      <TenantManager initialTenants={tenants ?? []} />
    </div>
  );
}
