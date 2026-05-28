import Header from "@/components/dashboard/Header";
import CRMClient from "@/components/agents/CRMClient";
import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentTenantId } from "@/lib/tenant-keys";
import { UserPlus } from "lucide-react";

export default async function CRMPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const tenantId = user ? await getCurrentTenantId(user.id) : null;

  const admin = await createAdminClient();

  const { data: contacts } = tenantId
    ? await admin
        .from("crm_contacts")
        .select("id, tenant_id, first_name, last_name, company, email, phone, status, source, tags, last_contact_at, created_at")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false })
        .limit(200)
        .returns<{
          id: string; tenant_id: string; first_name: string | null;
          last_name: string | null; company: string | null; email: string | null;
          phone: string | null; status: string | null; source: string | null;
          tags: string[] | null; last_contact_at: string | null; created_at: string | null;
        }[]>()
    : { data: [] };

  const { data: deals } = tenantId
    ? await admin
        .from("crm_deals")
        .select("id, tenant_id, title, value, stage, probability, contact_id, created_at")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false })
        .limit(200)
        .returns<{
          id: string; tenant_id: string; title: string; value: number | null;
          stage: string | null; probability: number | null; contact_id: string | null;
          created_at: string | null;
        }[]>()
    : { data: [] };

  return (
    <div>
      <Header
        title="AI CRM"
        subtitle="Manage contacts, deals, and customer relationships"
        action={
          <button className="btn-primary text-sm py-2 px-4">
            <UserPlus className="w-4 h-4" />
            Add Contact
          </button>
        }
      />
      {tenantId && (
        <CRMClient
          tenantId={tenantId}
          initialContacts={contacts ?? []}
          initialDeals={deals ?? []}
        />
      )}
    </div>
  );
}
