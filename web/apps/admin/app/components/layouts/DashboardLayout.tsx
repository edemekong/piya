import { Outlet } from "@remix-run/react";
import { useAdminAuthRedirect } from "@/utils/use-admin-auth-redirect";
import { Sidebar } from "./Sidebar";

export function DashboardLayout() {
  const authStatus = useAdminAuthRedirect("require-auth");

  if (authStatus !== "ready") return null;

  return (
    <main className="min-h-screen bg-background text-[#2F4B4F]">
      <div className="flex min-h-screen">
        <Sidebar />
        <section className="flex min-w-0 flex-1 px-8 py-8 lg:px-14">
          <div className="mx-auto w-full max-w-web">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
}
