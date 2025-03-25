import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen  text-black">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6 text-center shadow-lg">
        <h1 className="text-4xl font-bold">Pharmaceutical Blockchain Solution</h1>
        <p className="mt-2">Ensuring Drug Authenticity and Supply Chain Integrity</p>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-8">
        {/* Problem Statement Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Problem Statement</h2>
          <p className="text-lg leading-relaxed">
            The pharmaceutical industry faces a critical challenge with counterfeit drugs infiltrating the supply chain,
            jeopardizing patient safety and undermining industry trust. This project aims to develop a Blockchain-based
            system integrated with Smart Contracts to provide a secure, transparent, and automated solution for tracking
            pharmaceutical products and ensuring compliance with regulatory standards.
          </p>
        </section>

        {/* Project Domain Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Project Domain</h2>
          <p className="text-lg leading-relaxed">
            Blockchain is a decentralized ledger technology ensuring transparency and security without a central
            authority. This project leverages Blockchain and Smart Contracts to automate processes and provide
            tamper-proof tracking for pharmaceutical products across the supply chain.
          </p>
        </section>

        {/* Objectives Section */}
        <section >
          <h2 className="text-3xl font-semibold mb-4">Objectives</h2>
          <ul className="list-disc list-inside text-lg leading-relaxed space-y-2">
            <li>Develop a Blockchain solution for real-time pharmaceutical supply chain tracking and drug verification.</li>
            <li>Integrate Smart Contracts to automate compliance with healthcare regulations.</li>
            <li>Enhance transparency and accountability through an immutable Blockchain ledger.</li>
          </ul>
        </section>

    
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white p-4 text-center">
        &copy; {new Date().getFullYear()} Pharmaceutical Blockchain Solution. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;
