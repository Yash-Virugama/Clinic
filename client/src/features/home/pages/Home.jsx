import Hero from "../components/Hero";
import About from "../components/About";
import WhyChooseUs from "../components/WhyChooseUs";
import ServicesPreview from "../components/ServicesPreview";
import TestimonialsPreview from "../components/TestimonialsPreview";
import CTA from "../components/CTA";
import { useEffect } from "react";

const Home = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Hero />
      <About />
      <WhyChooseUs />
      <ServicesPreview />
      <TestimonialsPreview />
      <CTA />
    </>
  );
};

export default Home;