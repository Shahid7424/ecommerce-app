import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../lib/auth";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/admin-login");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((session.user as any)?.role !== "admin") redirect("/");

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar
        userName={session.user?.name || "Admin"}
        userEmail={session.user?.email || ""}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}