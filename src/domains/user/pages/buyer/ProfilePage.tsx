import { Header } from '@shared/components/layout/Header'
import { ProfileContent } from '@user/components/buyer/profile/ProfileContent'
import { Footer } from '@shared/components/layout/Footer'

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
