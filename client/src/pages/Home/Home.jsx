import "./Home.css";

import Hero from "../../components/Hero/Hero";
import About from "../../components/About/About";
import WhyChooseUs from "../../components/WhyChooseUs/WhyChooseUs";
import ServicesPreview from "../../components/ServicesPreview/ServicesPreview";
import TestimonialsPreview from "../../components/TestimonialsPreview/TestimonialsPreview";
import CTA from "../../components/CTA/CTA";
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