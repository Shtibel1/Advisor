import Navbar            from '@/components/sections/Navbar'
import HeroSection       from '@/components/sections/HeroSection'
import PainPointsSection from '@/components/sections/PainPointsSection'
import ServicesSection   from '@/components/sections/ServicesSection'
import AboutSection      from '@/components/sections/AboutSection'
import ContactSection    from '@/components/sections/ContactSection'
import Footer            from '@/components/sections/Footer'
import CursorGlow        from '@/components/ui/CursorGlow'

export default function Home() {
  return (
    <div className="font-assistant">
      <CursorGlow />
      <Navbar />
      <main id="main-content">
      <HeroSection />
      <PainPointsSection />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
