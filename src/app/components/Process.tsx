'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';
import { Check } from 'lucide-react';

type ProcessItem = {
  id: number;
  title: string;
  description: string;
  steps: string[];
};

const processes: ProcessItem[] = [
  {
    id: 1,
    title: 'Textile Sensor Design',
    description:
      'We begin by designing custom textile sensors specifically for your industry and use case, selecting appropriate conductive materials and sensor types.',
    steps: [
      'Industry-specific requirement analysis',
      'Sensor type and material selection',
      'Prototype sensor development',
      'Initial testing and calibration',
    ],
  },
  {
    id: 2,
    title: 'Garment Integration',
    description:
      'Our engineering team seamlessly integrates sensors into clothing and footwear while maintaining comfort, durability, and washability.',
    steps: [
      'Ergonomic placement optimization',
      'Non-intrusive integration techniques',
      'Durability and washability testing',
      'Comfort and user experience validation',
    ],
  },
  {
    id: 3,
    title: 'AI & Data Analytics',
    description:
      'We develop specialized algorithms that transform textile sensor data into actionable insights unique to your industry requirements.',
    steps: [
      'Industry-specific algorithm development',
      'ML model training with domain data',
      'Real-time analytics implementation',
      'Insight delivery optimization',
    ],
  },
  {
    id: 4,
    title: 'Production & Certification',
    description:
      'We handle manufacturing, quality control, and ensure all textile sensor products meet relevant industry standards and certifications.',
    steps: [
      'Textile manufacturing partner selection',
      'Quality assurance processes',
      'Industry-specific certification procurement',
      'Initial production supervision',
    ],
  },
  {
    id: 5,
    title: 'Deployment & Support',
    description:
      'We provide comprehensive training, implementation assistance, and ongoing support to ensure successful adoption and continuous improvement.',
    steps: [
      'User training and onboarding',
      'Data interpretation guidance',
      'Performance monitoring',
      'Continuous improvement iterations',
    ],
  },
];

const Process: React.FC = () => {
  const [activeProcess, setActiveProcess] = useState<number>(1);
  const containerRef = useRef<HTMLElement | null>(null);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const tickingRef = useRef(false);
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll -> determine closest section to viewport center (throttled via rAF)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const viewportCenter = window.innerHeight / 2;
        let closestIndex: number | null = null;
        let minDistance = Infinity;

        sectionRefs.current.forEach((section, index) => {
          if (!section) return;
          const rect = section.getBoundingClientRect();
          const sectionCenter = rect.top + rect.height / 2;
          const dist = Math.abs(sectionCenter - viewportCenter);
          if (dist < minDistance) {
            minDistance = dist;
            closestIndex = index;
          }
        });

        if (closestIndex !== null && activeProcess !== closestIndex + 1) {
          setActiveProcess(closestIndex + 1);
        }

        tickingRef.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // run once to initialize active section
    setTimeout(handleScroll, 50);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // no deps so it attaches once

  // IntersectionObserver for fade-in of each section
  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            (entry.target as HTMLElement).style.opacity = '1';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const handleNavigate = (id: number) => {
    setActiveProcess(id);
    const el = document.getElementById(`process-${id}`);
    if (!el) return;

    // smooth scroll but wrapped in rAF to avoid layout jank
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  return (
    <section id="process" className="bg-white py-16" ref={containerRef}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Development Process</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We follow a structured approach to developing textile sensor solutions that ensures quality,
            reliability, and performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Navigation */}
          <aside className="md:col-span-4 lg:col-span-3" aria-label="Process navigation">
            <div className="sticky top-24 space-y-2">
              {processes.map((process) => {
                const isActive = activeProcess === process.id;
                const isCompleted = activeProcess > process.id;
                return (
                  <button
                    key={process.id}
                    onClick={() => handleNavigate(process.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleNavigate(process.id);
                      }
                    }}
                    aria-current={isActive ? 'step' : undefined}
                    className={cn(
                      'w-full text-left p-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2',
                      isActive ? 'bg-gray-100 shadow-sm' : 'hover:bg-gray-50'
                    )}
                  >
                    <div className="flex items-center">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-all flex-shrink-0',
                          isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                        )}
                        aria-hidden
                      >
                        {isCompleted ? <Check className="h-5 w-5" /> : <span className="text-sm">{process.id}</span>}
                      </div>

                      <span className={cn('font-medium', isActive ? 'text-gray-900' : 'text-gray-600')}>
                        {process.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Details */}
          <div className="md:col-span-8 lg:col-span-9">
            <div className="space-y-16">
              {processes.map((process, idx) => (
                <article
                  id={`process-${process.id}`}
                  key={process.id}
                  ref={(el) => (sectionRefs.current[idx] = el)}
                  className="scroll-mt-24 transition-all duration-500 opacity-0"
                >
                  <h3 className="text-2xl font-bold mb-4">{process.title}</h3>
                  <p className="text-gray-700 mb-6">{process.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {process.steps.map((step, sidx) => (
                      <div key={sidx} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3 text-sm">
                            {sidx + 1}
                          </div>
                          <span className="text-sm text-gray-800">{step}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
