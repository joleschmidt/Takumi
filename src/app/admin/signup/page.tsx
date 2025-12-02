'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AdminSignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein.')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein.')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'admin' // Set admin role in user metadata
          }
        }
      })

      if (signupError) {
        setError(signupError.message)
        setLoading(false)
        return
      }

      if (data.user) {
        setSuccess(true)
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/admin/login')
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#F2F0EA] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white border-2 border-black p-8 text-center">
            <h1 className="text-4xl font-oswald font-bold uppercase tracking-tighter mb-4">
              Erfolgreich registriert!
            </h1>
            <p className="text-muted-foreground mb-6">
              Ihr Konto wurde erstellt. Sie werden zur Anmeldeseite weitergeleitet...
            </p>
            <Link href="/admin/login">
              <Button className="bg-black text-white hover:bg-[#6B7F59] uppercase tracking-widest font-bold">
                Jetzt anmelden
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F2F0EA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link 
          href="/admin/login" 
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Anmeldung
        </Link>

        <div className="bg-white border-2 border-black p-8">
          <h1 className="text-4xl font-oswald font-bold uppercase tracking-tighter mb-2">
            Admin Registrierung
          </h1>
          <p className="text-muted-foreground mb-8">
            Erstellen Sie ein neues Admin-Konto.
          </p>

          {error && (
            <div className="bg-red-50 border-2 border-red-500 text-red-700 p-4 mb-6">
              <p className="font-bold">Fehler:</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
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
                minLength={6}
                className="bg-white border-black"
                placeholder="Mindestens 6 Zeichen"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-bold uppercase tracking-widest mb-2 block">
                Passwort bestätigen
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="bg-white border-black"
                placeholder="Passwort wiederholen"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white hover:bg-[#6B7F59] uppercase tracking-widest font-bold py-6 text-lg"
            >
              {loading ? 'Wird registriert...' : 'Registrieren'}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-black/10">
            <p className="text-sm text-center text-muted-foreground">
              Bereits ein Konto?{' '}
              <Link href="/admin/login" className="font-bold hover:text-black transition-colors">
                Jetzt anmelden
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

