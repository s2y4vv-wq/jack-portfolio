import HeroSection from './sections/HeroSection';
import MarqueeSection from './sections/MarqueeSection';
import AboutSection from './sections/AboutSection';
import ProjectsSection from './sections/ProjectsSection';
import CustomCursor from './components/CustomCursor';
import SplineBackground from './components/SplineBackground';

export default function App() {
  return (
    <div style={{ overflowX: 'clip' }}>
      <SplineBackground />
      <CustomCursor />
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ProjectsSection />
    </div>
  );
}
