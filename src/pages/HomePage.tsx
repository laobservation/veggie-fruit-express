import React from 'react';
import Hero from '@/components/Hero';
import CategoryBanner from '@/components/CategoryBanner';
import CallToAction from '@/components/CallToAction';

const HomePage: React.FC = () => {
  return (
    <div>
      <Hero />
      <CategoryBanner category="fruit" />
      <CategoryBanner category="vegetable" />
      <CallToAction />
    </div>
  );
};

export default HomePage;
