import AdminSidebar from "@/components/admin/AdminSidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Database } from "@/types/supabase";

type UserRole = Database["public"]["Enums"]["user_role"];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .returns<{ role: UserRole | null }[]>()
    .single();

  if (!profile || profile.role !== "super_admin") redirect("/dashboard");

  return (
    <div className="flex h-screen bg-[#080b14] overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
