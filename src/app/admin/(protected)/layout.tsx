import { AdminLogoutButton } from "./logout-button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <span className="font-bold">Admin Sirkus Waterplay</span>
          <AdminLogoutButton />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
