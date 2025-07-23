import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MarketTrend } from '../../types';

interface PriceChartProps {
  data: MarketTrend[];
}

export const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  const formatPrice = (value: number) => {
    return `€${(value / 1000).toFixed(0)}k`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Market Trends</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatPrice} />
            <Tooltip 
              formatter={(value: number, name: string) => [
                name === 'avgPrice' ? formatPrice(value) : 
                name === 'rentPrice' ? `€${value}` : value,
                name === 'avgPrice' ? 'Avg Sale Price' :
                name === 'rentPrice' ? 'Avg Rent Price' : 'Volume'
              ]}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="avgPrice" 
              stroke="#3B82F6" 
              strokeWidth={2}
              name="Avg Sale Price"
            />
            <Line 
              type="monotone" 
              dataKey="rentPrice" 
              stroke="#10B981" 
              strokeWidth={2}
              name="Avg Rent Price"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};