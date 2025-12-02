import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/supabase-server'
import Link from 'next/link'
import { Package, FileText } from 'lucide-react'
import { LogoutButton } from '@/components/admin/LogoutButton'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await isAdmin()

  if (!admin) {
    redirect('/admin-login')
  }

  return (
    <div className="min-h-screen bg-[#F2F0EA]">
      {/* Admin Header */}
      <header className="border-b border-black/10 bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="text-2xl font-oswald font-bold uppercase tracking-tighter">
                Takumi Admin
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link 
                  href="/admin/produkte" 
                  className="text-sm font-bold uppercase tracking-widest hover:text-[#6B7F59] transition-colors flex items-center gap-2"
                >
                  <Package className="h-4 w-4" />
                  Produkte
                </Link>
                <Link 
                  href="/admin/artikel" 
                  className="text-sm font-bold uppercase tracking-widest hover:text-[#6B7F59] transition-colors flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Artikel
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="text-sm font-medium hover:text-[#6B7F59] transition-colors"
              >
                Zur Website
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

