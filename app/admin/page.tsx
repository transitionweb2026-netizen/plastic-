import { isAuthenticated, usingDevPassword } from "@/lib/cms/auth";
import Dashboard from "@/components/admin/Dashboard";
import LoginForm from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

/** SEO CMS entry: login gate, then the dashboard. */
export default async function AdminPage() {
  const authed = await isAuthenticated();
  if (!authed) return <LoginForm devPassword={usingDevPassword()} />;
  return <Dashboard />;
}
