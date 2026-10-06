import Navbar from '../components/Navbar/Navbar.jsx'
import Hero from '../components/Hero/Hero.jsx'
import Trust from '../components/Trust/Trust.jsx'
import Products from '../components/Products/Products.jsx'
import ExploreMore from '../components/ExploreMore/ExploreMore.jsx'
import FeaturedOffers from '../components/FeaturedOffers/FeaturedOffers.jsx'
import SocialProof from '../components/SocialProof/SocialProof.jsx'
import AppDownload from '../components/AppDownload/AppDownload.jsx'
import HelpSupport from '../components/HelpSupport/HelpSupport.jsx'
import Footer from '../components/Footer/Footer.jsx'

function LandingPage() {
  return (
    <div className="bg-background text-text-primary">
      <div className="flex min-h-svh flex-col">
        <Navbar />
        <Hero />
      </div>
      <main>
        <Trust />
        <Products />
        <ExploreMore />
        <FeaturedOffers />
        <SocialProof />
        <AppDownload />
        <HelpSupport />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
