import AboutSection from './AboutSection'
import MissionSection from './MissionSection'
import VisionSection from './VisionSection'

const AboutPage = ({ about }: { about?: any }) => {
    const displayContent = typeof about === 'string' ? about : about?.content || "No content yet.";
    return (
        <div>
            <AboutSection about={displayContent} />
            <MissionSection />
            <VisionSection />
        </div>
    )
}

export default AboutPage;