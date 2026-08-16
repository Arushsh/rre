import React from 'react';
import AIHub from '../components/AIHub';
import AIPhotoPay from '../components/AIPhotoPay';
import AIFeatures from '../components/AIFeatures';

const AIHubPage = () => {
  return (
    <div className="min-h-screen bg-[#000000] pt-20">
      <AIHub />
      <AIFeatures />
      <AIPhotoPay />
    </div>
  );
};

export default AIHubPage;
