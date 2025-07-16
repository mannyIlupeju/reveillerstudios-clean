import Script from 'next/script';
import React from 'react';

export default function Privacy() {
  return (
    <main className="max-w-4xl mx-auto my-10 px-4 py-10 text-neutral-800 h-[80vh] overflow-y-auto">
      <h1 className="text-3xl font-bold mb-4">Please click the link to view our Privacy and Cookie policy</h1>
      <p className="text-sm text-gray-500 mb-8">Effective Date: {new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',          
        day: 'numeric',   
      })}</p> 
      <a
        href="https://www.iubenda.com/privacy-policy/80169055"
        className="iubenda-white iubenda-noiframe iubenda-embed iubenda-noiframe underline"
        title="Privacy Policy"
      >
        Privacy & Cookie Policy for Reveillerstudios.
      </a>
      <Script
        strategy="afterInteractive"
        src="https://cdn.iubenda.com/iubenda.js"
      />
    </main>
  );
}

