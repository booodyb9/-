import React from 'react';
import { useParams } from 'react-router-dom';
import { useContent } from '../../contexts/ContentContext';
import { safeParseJson } from '../../lib/safeJson';
import type { PortfolioProject } from '../dashboard/types';
import ProjectDetails from './ProjectDetails';
import NotFound from './NotFound';

export default function VisibleProjectRoute() {
  const { slug } = useParams();
  const { getContent, loading } = useContent();
  const content = getContent('premium_portfolio_projects');

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#0284C7] border-t-transparent rounded-full animate-spin" /></div>;
  }

  const projects = safeParseJson<PortfolioProject[]>(content?.body, []);
  const project = projects.find((item) => (item.slug === slug || item.id === slug) && !item.isHidden);
  if (!project) return <NotFound />;

  return <ProjectDetails />;
}
