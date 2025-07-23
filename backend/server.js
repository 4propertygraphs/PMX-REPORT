const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json());

// Mock data based on your existing structure
const counties = [
  'Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford', 'Kerry', 'Mayo', 'Donegal',
  'Wicklow', 'Meath', 'Kildare', 'Wexford', 'Clare', 'Tipperary', 'Kilkenny'
];

const regions = {
  'Dublin': ['Dublin City Centre', 'South Dublin', 'North Dublin', 'West Dublin'],
  'Cork': ['Cork City', 'East Cork', 'West Cork', 'North Cork'],
  'Galway': ['Galway City', 'Connemara', 'East Galway', 'Aran Islands']
};

// Generate mock property data
function generateMockProperties(count = 100) {
  const properties = [];
  const marketTypes = ['Residential Sale', 'Residential Rent'];
  
  for (let i = 0; i < count; i++) {
    const county = counties[Math.floor(Math.random() * counties.length)];
    const regionList = regions[county] || [`${county} Central`, `${county} Rural`];
    const region = regionList[Math.floor(Math.random() * regionList.length)];
    const beds = Math.floor(Math.random() * 5) + 1;
    const marketType = marketTypes[Math.floor(Math.random() * marketTypes.length)];
    
    const basePrice = marketType === 'Residential Sale' 
      ? Math.random() * 800000 + 200000 
      : Math.random() * 3000 + 1000;
    
    properties.push({
      id: i + 1,
      county,
      region,
      area: `${region} Area ${Math.floor(Math.random() * 10) + 1}`,
      beds,
      price: Math.round(basePrice),
      marketType,
      rawAddress: `${Math.floor(Math.random() * 999) + 1} ${region} Street, ${county}`,
      saleDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      sqrMetres: Math.floor(Math.random() * 200) + 50,
      pricePerSqrMetres: Math.round(basePrice / (Math.floor(Math.random() * 200) + 50)),
      daysToSell: Math.floor(Math.random() * 180) + 30,
      pageViews: Math.floor(Math.random() * 1000) + 100
    });
  }
  
  return properties;
}

const mockProperties = generateMockProperties(500);

// Generate analytics data
function generateAnalytics() {
  const analytics = {
    county: {},
    region: {},
    rent: {}
  };
  
  counties.forEach(county => {
    for (let beds = 1; beds <= 5; beds++) {
      const countyProps = mockProperties.filter(p => 
        p.county === county && 
        p.beds === beds && 
        p.marketType === 'Residential Sale'
      );
      
      if (countyProps.length > 0) {
        const avgPrice = countyProps.reduce((sum, p) => sum + p.price, 0) / countyProps.length;
        const yoy = (Math.random() - 0.5) * 20; // -10% to +10% YoY change
        
        if (!analytics.county[county]) analytics.county[county] = {};
        analytics.county[county][beds] = {
          avg: Math.round(avgPrice),
          yoy: Math.round(yoy * 100) / 100,
          count: countyProps.length
        };
      }
      
      // Rent data
      const rentProps = mockProperties.filter(p => 
        p.county === county && 
        p.beds === beds && 
        p.marketType === 'Residential Rent'
      );
      
      if (rentProps.length > 0) {
        const avgRent = rentProps.reduce((sum, p) => sum + p.price, 0) / rentProps.length;
        const rentYoy = (Math.random() - 0.3) * 15; // Rent typically increases
        
        if (!analytics.rent[county]) analytics.rent[county] = {};
        analytics.rent[county][beds] = {
          avg: Math.round(avgRent),
          yoy: Math.round(rentYoy * 100) / 100,
          count: rentProps.length
        };
      }
    }
  });
  
  return analytics;
}

const analyticsData = generateAnalytics();

// API Routes
app.get('/api/properties', (req, res) => {
  const { county, beds, marketType, page = 1, limit = 20, search } = req.query;
  
  let filtered = mockProperties;
  
  if (county) {
    filtered = filtered.filter(p => p.county.toLowerCase().includes(county.toLowerCase()));
  }
  
  if (beds) {
    filtered = filtered.filter(p => p.beds === parseInt(beds));
  }
  
  if (marketType) {
    filtered = filtered.filter(p => p.marketType === marketType);
  }
  
  if (search) {
    filtered = filtered.filter(p => 
      p.rawAddress.toLowerCase().includes(search.toLowerCase()) ||
      p.county.toLowerCase().includes(search.toLowerCase()) ||
      p.region.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedResults = filtered.slice(startIndex, endIndex);
  
  res.json({
    properties: paginatedResults,
    total: filtered.length,
    page: parseInt(page),
    totalPages: Math.ceil(filtered.length / limit)
  });
});

app.get('/api/analytics/county', (req, res) => {
  res.json(analyticsData.county);
});

app.get('/api/analytics/rent', (req, res) => {
  res.json(analyticsData.rent);
});

app.get('/api/insights/market-trends', (req, res) => {
  // Generate trend data for the last 12 months
  const trends = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    trends.push({
      month: monthName,
      avgPrice: Math.round(400000 + Math.random() * 100000),
      volume: Math.floor(Math.random() * 500) + 200,
      rentPrice: Math.round(1800 + Math.random() * 400)
    });
  }
  
  res.json(trends);
});

app.get('/api/reports/generate', (req, res) => {
  const { type, county, dateRange } = req.query;
  
  // Generate a sample report
  const report = {
    id: Date.now(),
    type: type || 'market-overview',
    county: county || 'All Counties',
    dateRange: dateRange || 'Last 12 months',
    generatedAt: new Date().toISOString(),
    data: {
      summary: {
        totalProperties: mockProperties.length,
        avgPrice: Math.round(mockProperties.reduce((sum, p) => sum + p.price, 0) / mockProperties.length),
        priceChange: '+5.2%'
      },
      insights: [
        'Property prices have increased by 5.2% year-over-year',
        'Dublin remains the most expensive market',
        'Rental yields are strongest in Cork and Galway'
      ]
    }
  };
  
  res.json(report);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Property Analytics API running on port ${PORT}`);
  console.log(`📊 Mock data loaded: ${mockProperties.length} properties`);
  console.log(`🏠 Counties available: ${counties.join(', ')}`);
});