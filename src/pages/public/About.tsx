import React from 'react';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Features from '../../components/Features';
import ProjectStats from '../../components/ProjectStats';
import TrustedPartners from '../../components/TrustedPartners';
import { useContent } from '../../contexts/ContentContext';

export default function About() {
  const { getContent } = useContent();
  const aboutContent = getContent('about_content');

  return (
    <>
      <SEO title="من نحن | شركة زجاج الرياض" description="تعرف على شركة زجاج الرياض، خبراء تركيب الزجاج والواجهات." />
      <Navbar />
      <main className="pt-20 min-h-screen">
        <div className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              {aboutContent?.body ? (
                <div className="prose prose-lg mx-auto text-gray-600" dangerouslySetInnerHTML={{ __html: aboutContent.body }} />
              ) : (
                <>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-6">عن شركة زجاج الرياض</h1>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    نحن شركة رائدة في مجال توريد وتركيب الزجاج في المملكة العربية السعودية. بفضل خبرتنا الممتدة لسنوات، نقدم حلولاً زجاجية متكاملة تلبي أرقى المعايير الهندسية والجمالية للمشاريع السكنية والتجارية.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        <Features />
        <ProjectStats />
        <TrustedPartners />
      </main>
      <Footer />
    </>
  );
}