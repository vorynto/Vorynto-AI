import Header from "@/components/dashboard/Header";
import SEOClient from "@/components/agents/SEOClient";
import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentTenantId } from "@/lib/tenant-keys";
import { Plus } from "lucide-react";

export default async function SEOPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const tenantId = user ? await getCurrentTenantId(user.id) : null;

  const admin = await createAdminClient();

  const { data: projects } = tenantId
    ? await admin
        .from("seo_projects")
        .select("*")
        .eq("tenant_id", tenantId)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .returns<{
          id: string; tenant_id: string; name: string; website_url: string;
          audit_score: number | null; last_audit_at: string | null;
          target_keywords: string[] | null; is_active: boolean | null;
        }[]>()
    : { data: [] };

  const projectIds = (projects ?? []).map((p) => p.id);
  const { data: keywords } = projectIds.length > 0
    ? await admin
        .from("seo_keywords")
        .select("*")
        .in("project_id", projectIds)
        .returns<{
          id: string; tenant_id: string; project_id: string; keyword: string;
          current_position: number | null; change_7d: number | null;
          monthly_volume: number | null; difficulty: number | null; updated_at: string | null;
        }[]>()
    : { data: [] };

  return (
    <div>
      <Header
        title="AI SEO"
        subtitle="Audit, track, and improve your search rankings"
        action={
          <button className="btn-primary text-sm py-2 px-4">
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        }
      />
      {tenantId && (
        <SEOClient
          tenantId={tenantId}
          initialProjects={projects ?? []}
          initialKeywords={keywords ?? []}
        />
      )}
    </div>
  );
}
