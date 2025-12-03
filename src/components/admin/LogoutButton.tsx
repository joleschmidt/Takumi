'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin-login')
    router.refresh()
  }

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      className="border-black hover:bg-black hover:text-white"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Abmelden
    </Button>
  )
}

