import AdminHeader from "@/components/admin/AdminHeader";
import { createAdminClient } from "@/lib/supabase/server";
import PlanManager from "@/components/admin/PlanManager";
import { Plus } from "lucide-react";
import type { Database } from "@/types/supabase";

export default async function AdminPlansPage() {
  const admin = await createAdminClient();
  const { data: plans } = await admin
    .from("subscription_plans")
    .select("*")
    .order("sort_order", { ascending: true })
    .returns<Database["public"]["Tables"]["subscription_plans"]["Row"][]>();

  return (
    <div>
      <AdminHeader
        title="Subscription Plans"
        subtitle="Create and manage pricing plans for your tenants"
        breadcrumb="Platform Management"
        action={
          <button id="open-create-plan" className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Create Plan
          </button>
        }
      />
      <PlanManager initialPlans={plans ?? []} />
    </div>
  );
}
