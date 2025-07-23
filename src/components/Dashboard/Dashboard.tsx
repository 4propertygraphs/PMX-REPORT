import React from 'react';
import { Home, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { PriceChart } from './PriceChart';
import { useApi } from '../../hooks/useApi';
import { apiService } from '../../services/api';

export const Dashboard: React.FC = () => {
  const { data: trends, loading: trendsLoading } = useApi(() => apiService.getMarketTrends());
  const { data: countyData, loading: countyLoading } = useApi(() => apiService.getCountyAnalytics());

  if (trendsLoading || countyLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Calculate metrics from data
  const latestTrend = trends?.[trends.length - 1];
  const previousTrend = trends?.[trends.length - 2];
  
  const priceChange = latestTrend && previousTrend 
    ? ((latestTrend.avgPrice - previousTrend.avgPrice) / previousTrend.avgPrice * 100).toFixed(1)
    : '0';

  const totalProperties = Object.values(countyData || {}).reduce((total, county) => {
    return total + Object.values(county).reduce((countyTotal, bedData) => {
      return countyTotal + bedData.count;
    }, 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Market Overview</h2>
        <p className="mt-1 text-sm text-gray-600">
          Key metrics and trends for the Irish property market
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Average Price"
          value={`€${latestTrend ? (latestTrend.avgPrice / 1000).toFixed(0) : '0'}k`}
          change={`${priceChange}%`}
          changeType={parseFloat(priceChange) >= 0 ? 'positive' : 'negative'}
          icon={DollarSign}
        />
        <MetricCard
          title="Monthly Volume"
          value={latestTrend?.volume.toString() || '0'}
          icon={BarChart3}
        />
        <MetricCard
          title="Total Properties"
          value={totalProperties.toLocaleString()}
          icon={Home}
        />
        <MetricCard
          title="Avg Rent"
          value={`€${latestTrend?.rentPrice || 0}`}
          icon={TrendingUp}
        />
      </div>

      {trends && <PriceChart data={trends} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Counties by Volume</h3>
          <div className="space-y-3">
            {Object.entries(countyData || {}).slice(0, 5).map(([county, data]) => {
              const totalCount = Object.values(data).reduce((sum, bedData) => sum + bedData.count, 0);
              return (
                <div key={county} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">{county}</span>
                  <span className="text-sm text-gray-600">{totalCount} properties</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Market Insights</h3>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              • Property prices have shown steady growth across most counties
            </div>
            <div className="text-sm text-gray-600">
              • Dublin remains the most active market with highest prices
            </div>
            <div className="text-sm text-gray-600">
              • Rental market shows strong demand in urban areas
            </div>
            <div className="text-sm text-gray-600">
              • 3-bedroom properties are the most popular segment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};