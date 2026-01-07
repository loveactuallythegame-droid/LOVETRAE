import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <nav className="row" style={{ justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
        <div className="row" style={{ gap: 12, alignItems: 'center' }}>
          <img src="/api/logo" alt="Love Actually Logo" width={40} height={40} style={{ borderRadius: 8 }} />
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/games">Game CMS</Link>
          <Link href="/admin/users">Users</Link>
          <Link href="/admin/prompts">Prompts</Link>
          <Link href="/admin/analytics">Analytics</Link>
          <Link href="/admin/notifications">Notifications</Link>
        </div>
        <Link href="/account/subscription">Subscription</Link>
      </nav>
      {children}
    </div>
  );
}
