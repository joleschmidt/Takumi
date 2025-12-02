'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      if (data.user) {
        // Check if user is admin
        const userRole = data.user.user_metadata?.role
        if (userRole === 'admin') {
          router.push('/admin')
          router.refresh()
        } else {
          // Check profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single()

          if (profile?.role === 'admin') {
            router.push('/admin')
            router.refresh()
          } else {
            setError('Sie haben keine Admin-Berechtigung.')
            await supabase.auth.signOut()
            setLoading(false)
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F2F0EA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Website
        </Link>

        <div className="bg-white border-2 border-black p-8">
          <h1 className="text-4xl font-oswald font-bold uppercase tracking-tighter mb-2">
            Admin Login
          </h1>
          <p className="text-muted-foreground mb-8">
            Melden Sie sich an, um auf das Admin-Panel zuzugreifen.
          </p>

          {error && (
            <div className="bg-red-50 border-2 border-red-500 text-red-700 p-4 mb-6">
              <p className="font-bold">Fehler:</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-sm font-bold uppercase tracking-widest mb-2 block">
                E-Mail
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white border-black"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-bold uppercase tracking-widest mb-2 block">
                Passwort
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white border-black"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white hover:bg-[#6B7F59] uppercase tracking-widest font-bold py-6 text-lg"
            >
              {loading ? 'Wird angemeldet...' : 'Anmelden'}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-black/10">
            <p className="text-sm text-center text-muted-foreground">
              Noch kein Konto?{' '}
              <Link href="/admin/signup" className="font-bold hover:text-black transition-colors">
                Jetzt registrieren
              </Link>
            </p>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Sie benötigen Admin-Berechtigung, um sich anzumelden.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

