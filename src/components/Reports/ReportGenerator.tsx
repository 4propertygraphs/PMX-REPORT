import React, { useState } from 'react';
import { Download, FileText, BarChart3, TrendingUp } from 'lucide-react';
import { apiService } from '../../services/api';
import { Report } from '../../types';

const counties = [
  'All Counties', 'Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford', 'Kerry', 
  'Mayo', 'Donegal', 'Wicklow', 'Meath', 'Kildare', 'Wexford', 'Clare', 'Tipperary', 'Kilkenny'
];

const reportTypes = [
  { id: 'market-overview', name: 'Market Overview', icon: BarChart3, description: 'Comprehensive market analysis' },
  { id: 'price-trends', name: 'Price Trends', icon: TrendingUp, description: 'Price movement analysis' },
  { id: 'county-comparison', name: 'County Comparison', icon: FileText, description: 'Compare different counties' },
];

const dateRanges = [
  'Last 3 months',
  'Last 6 months',
  'Last 12 months',
  'Last 2 years',
  'Custom range'
];

export const ReportGenerator: React.FC = () => {
  const [selectedType, setSelectedType] = useState('market-overview');
  const [selectedCounty, setSelectedCounty] = useState('All Counties');
  const [selectedDateRange, setSelectedDateRange] = useState('Last 12 months');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<Report | null>(null);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const report = await apiService.generateReport(
        selectedType,
        selectedCounty === 'All Counties' ? undefined : selectedCounty,
        selectedDateRange
      );
      setGeneratedReport(report);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = () => {
    if (!generatedReport) return;

    const reportContent = `
Property Market Report
Generated: ${new Date(generatedReport.generatedAt).toLocaleDateString()}
Type: ${generatedReport.type}
County: ${generatedReport.county}
Date Range: ${generatedReport.dateRange}

SUMMARY
Total Properties: ${generatedReport.data.summary.totalProperties.toLocaleString()}
Average Price: €${generatedReport.data.summary.avgPrice.toLocaleString()}
Price Change: ${generatedReport.data.summary.priceChange}

KEY INSIGHTS
${generatedReport.data.insights.map(insight => `• ${insight}`).join('\n')}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `property-report-${generatedReport.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Report Generator</h2>
        <p className="mt-1 text-sm text-gray-600">
          Generate custom property market reports
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Report Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <div className="space-y-2">
                  {reportTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <label key={type.id} className="flex items-center">
                        <input
                          type="radio"
                          name="reportType"
                          value={type.id}
                          checked={selectedType === type.id}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <div className="ml-3 flex items-center">
                          <Icon className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{type.name}</div>
                            <div className="text-xs text-gray-500">{type.description}</div>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  County
                </label>
                <select
                  value={selectedCounty}
                  onChange={(e) => setSelectedCounty(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {counties.map((county) => (
                    <option key={county} value={county}>
                      {county}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <select
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {dateRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div>
          {generatedReport ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">Generated Report</h3>
                <button
                  onClick={handleDownloadReport}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">Type:</span>
                    <div className="text-gray-900 capitalize">{generatedReport.type.replace('-', ' ')}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">County:</span>
                    <div className="text-gray-900">{generatedReport.county}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Date Range:</span>
                    <div className="text-gray-900">{generatedReport.dateRange}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Generated:</span>
                    <div className="text-gray-900">
                      {new Date(generatedReport.generatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Properties:</span>
                      <span className="font-medium">{generatedReport.data.summary.totalProperties.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Average Price:</span>
                      <span className="font-medium">€{generatedReport.data.summary.avgPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Price Change:</span>
                      <span className="font-medium text-green-600">{generatedReport.data.summary.priceChange}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Key Insights</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {generatedReport.data.insights.map((insight, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No report generated</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configure your report settings and click "Generate Report" to create a custom market analysis.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};