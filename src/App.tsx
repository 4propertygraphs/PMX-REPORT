import React, { useState } from 'react';
import { Header } from './components/Layout/Header';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Properties } from './components/Properties/Properties';
import { ReportGenerator } from './components/Reports/ReportGenerator';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'properties':
        return <Properties />;
      case 'reports':
        return <ReportGenerator />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <Layout>
        {renderContent()}
      </Layout>
    </div>
  );
}

export default App;