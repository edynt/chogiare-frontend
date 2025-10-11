import { Header } from '@/components/layout/Header'
import { ProfileContent } from '@/components/profile/ProfileContent'
import { Footer } from '@/components/layout/Footer'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ProfileContent />
      </main>
      <Footer />
    </div>
  )
}
