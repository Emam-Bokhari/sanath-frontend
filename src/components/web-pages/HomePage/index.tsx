import HeroSection from './HeroSecton'
import PropertiesNearYou from './PropertiesNearYou'
import MarketplaceSection from './MarketplaceSection'
import PopularLocations from './PopularLocations'
import WhyMyHome from './WhyMyHome'
import Testimonials from './Testimonials'
import AppBanner from './AppBanner'

export default function HomePage({ data }: { data?: any; }) {
    return (
        <div className='flex flex-col'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8 pt-4'>
                <HeroSection />
            </div>
            <PropertiesNearYou data={data} />
            <MarketplaceSection />
            <PopularLocations />
            <WhyMyHome />
            <Testimonials />
            <AppBanner />
        </div>
    )
}