import Header from "@/components/dashboard/Header";
import WebsiteBuilderClient from "@/components/agents/WebsiteBuilderClient";
import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentTenantId } from "@/lib/tenant-keys";
import { Plus } from "lucide-react";

export default async function WebsiteBuilderPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const tenantId = user ? await getCurrentTenantId(user.id) : null;

  const admin = await createAdminClient();

  const { data: websites } = tenantId
    ? await admin
        .from("website_builder_projects")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false })
        .returns<{
          id: string; tenant_id: string; name: string; subdomain: string | null;
          custom_domain: string | null; template_id: string | null;
          is_published: boolean | null; published_at: string | null;
          created_at: string | null; updated_at: string | null;
        }[]>()
    : { data: [] };

  return (
    <div>
      <Header
        title="AI Website Builder"
        subtitle="Build and manage websites with AI"
        action={
          <button className="btn-primary text-sm py-2 px-4">
            <Plus className="w-4 h-4" />
            New Website
          </button>
        }
      />
      {tenantId && (
        <WebsiteBuilderClient
          tenantId={tenantId}
          initialWebsites={websites ?? []}
        />
      )}
    </div>
  );
}
