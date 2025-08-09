'use client';

import { useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Projects from '../components/Project';
import WhyWrlds from '../components/WhyWrlds';
import BlogPreview from '../components/BlogPreview';
import SEO from '../components/SEO';

const IndexPage = () => {
  // Fix any duplicate #contact IDs when the page loads
  useEffect(() => {
    if (typeof document === 'undefined') return; // SSR safety

    const contactElements = document.querySelectorAll<HTMLElement>('[id="contact"]');
    if (contactElements.length > 1) {
      // Rename all except the first
      contactElements.forEach((el, idx) => {
        if (idx > 0) {
          el.id = `contact-footer-${idx}`;
        }
      });
    }
  }, []);

  return (
    <PageLayout>
      <SEO
        title="WRLDS - Smart Textile Technology"
        description="WRLDS Technologies: Pioneering smart engineering solutions with textile sensors for sports, safety, and performance monitoring."
        imageUrl="/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png"
        keywords={[
          'smart textiles',
          'wearable technology',
          'textile sensors',
          'sports tech',
          'safety monitoring',
          'performance analytics',
          'manufacturing',
        ]}
      />
      <Hero />
      <Features />
      <WhyWrlds />
      <Projects />
      <BlogPreview />
    </PageLayout>
  );
};

export default IndexPage;
