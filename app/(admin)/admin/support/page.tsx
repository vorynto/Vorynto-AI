import AdminHeader from "@/components/admin/AdminHeader";
import { createAdminClient } from "@/lib/supabase/server";
import SupportClient from "@/components/admin/SupportClient";

type Ticket = {
  id: string;
  tenant_id: string;
  title: string;
  description: string | null;
  status: "open" | "in_progress" | "resolved" | "closed" | null;
  priority: "low" | "medium" | "high" | "urgent" | null;
  category: string | null;
  created_at: string | null;
  updated_at: string | null;
  assigned_to: string | null;
  resolved_at: string | null;
  tenant_name: string | null;
  tenant_email: string | null;
};

export default async function AdminSupportPage() {
  const admin = await createAdminClient();

  // Load tickets joined with tenant info
  const { data: rawTickets } = await admin
    .from("support_tickets")
    .select(`
      id, tenant_id, title, description, status, priority,
      category, created_at, updated_at, assigned_to, resolved_at,
      tenants(name, email)
    `)
    .order("created_at", { ascending: false })
    .limit(100)
    .returns<{
      id: string;
      tenant_id: string;
      title: string;
      description: string | null;
      status: "open" | "in_progress" | "resolved" | "closed" | null;
      priority: "low" | "medium" | "high" | "urgent" | null;
      category: string | null;
      created_at: string | null;
      updated_at: string | null;
      assigned_to: string | null;
      resolved_at: string | null;
      tenants: { name: string; email: string | null } | null;
    }[]>();

  const tickets: Ticket[] = (rawTickets ?? []).map((t) => ({
    id: t.id,
    tenant_id: t.tenant_id,
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    category: t.category,
    created_at: t.created_at,
    updated_at: t.updated_at,
    assigned_to: t.assigned_to,
    resolved_at: t.resolved_at,
    tenant_name: t.tenants?.name ?? null,
    tenant_email: t.tenants?.email ?? null,
  }));

  return (
    <div>
      <AdminHeader
        title="Support Tickets"
        subtitle="Handle inbound support requests from clients"
        breadcrumb="Platform Management"
      />
      <SupportClient initialTickets={tickets} />
    </div>
  );
}
