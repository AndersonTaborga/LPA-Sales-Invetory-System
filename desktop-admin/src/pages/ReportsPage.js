import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const DateInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #5a6fd8;
  }

  &.secondary {
    background: #f1f2f6;
    color: #333;
    
    &:hover {
      background: #ddd;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #eee;
  text-align: center;
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;

  &.users {
    background: #e8f4fd;
    color: #1e88e5;
  }

  &.products {
    background: #e8f5e8;
    color: #2ed573;
  }

  &.sales {
    background: #fff3e0;
    color: #ffa502;
  }

  &.revenue {
    background: #f3e5f5;
    color: #9c27b0;
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const StatChange = styled.div`
  font-size: 0.8rem;
  margin-top: 0.5rem;

  &.positive {
    color: #2ed573;
  }

  &.negative {
    color: #ff4757;
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #eee;
`;

const ChartTitle = styled.h3`
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
`;

const SimpleChart = styled.div`
  height: 300px;
  display: flex;
  align-items: end;
  justify-content: space-around;
  padding: 1rem 0;
  border-bottom: 2px solid #eee;
  position: relative;
`;

const ChartBar = styled.div`
  background: #667eea;
  width: 40px;
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: all 0.3s;

  &:hover {
    background: #5a6fd8;
  }
`;

const ChartLabel = styled.div`
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  color: #666;
`;

const ChartValue = styled.div`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  color: #333;
  font-weight: 500;
`;

const PieChart = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin: 0 auto 2rem;
  background: conic-gradient(
    #667eea 0deg 120deg,
    #2ed573 120deg 240deg,
    #ffa502 240deg 300deg,
    #ff4757 300deg 360deg
  );
  position: relative;
`;

const PieCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #333;
`;

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LegendColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
`;

const TableCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #eee;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #f8f9fa;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #eee;

  &:hover {
    background: #f8f9fa;
  }
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #eee;
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #666;
`;

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('last30days');
  const [reportType, setReportType] = useState('overview');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Mock data for demonstration
  const [stats, setStats] = useState({
    totalUsers: { value: 1247, change: 12.5 },
    totalProducts: { value: 89, change: -2.1 },
    totalSales: { value: 3456, change: 8.7 },
    totalRevenue: { value: 45678, change: 15.3 }
  });

  const [chartData] = useState([
    { label: 'Jan', value: 120 },
    { label: 'Feb', value: 190 },
    { label: 'Mar', value: 300 },
    { label: 'Apr', value: 500 },
    { label: 'May', value: 200 },
    { label: 'Jun', value: 300 },
    { label: 'Jul', value: 450 }
  ]);

  const [topProducts] = useState([
    { name: 'Product A', sales: 234, revenue: 12340 },
    { name: 'Product B', sales: 189, revenue: 9450 },
    { name: 'Product C', sales: 156, revenue: 7800 },
    { name: 'Product D', sales: 134, revenue: 6700 },
    { name: 'Product E', sales: 98, revenue: 4900 }
  ]);

  const maxValue = Math.max(...chartData.map(item => item.value));

  const generateReport = () => {
    // Here you would make the call to generate the report
    alert('Report generated! (Functionality will be implemented)');
  };

  const exportReport = () => {
    // Here you would export the report
    alert('Report exported! (Functionality will be implemented)');
  };

  return (
    <Container>
      <Title>Reports and Analytics</Title>

      <FilterContainer>
        <Select 
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
        >
          <option value="overview">Overview</option>
          <option value="users">Users</option>
          <option value="products">Products</option>
          <option value="sales">Sales</option>
        </Select>

        <Select 
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="last7days">Last 7 days</option>
          <option value="last30days">Last 30 days</option>
          <option value="last90days">Last 90 days</option>
          <option value="custom">Custom period</option>
        </Select>

        {dateRange === 'custom' && (
          <>
            <DateInput
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start date"
            />
            <DateInput
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End date"
            />
          </>
        )}

        <Button onClick={generateReport}>Generate Report</Button>
        <Button className="secondary" onClick={exportReport}>Export</Button>
      </FilterContainer>

      <StatsGrid>
        <StatCard>
          <StatIcon className="users">👥</StatIcon>
          <StatValue>{stats.totalUsers.value.toLocaleString()}</StatValue>
          <StatLabel>Total Users</StatLabel>
          <StatChange className={stats.totalUsers.change > 0 ? 'positive' : 'negative'}>
            {stats.totalUsers.change > 0 ? '+' : ''}{stats.totalUsers.change}% vs previous month
          </StatChange>
        </StatCard>

        <StatCard>
          <StatIcon className="products">📦</StatIcon>
          <StatValue>{stats.totalProducts.value}</StatValue>
          <StatLabel>Total Products</StatLabel>
          <StatChange className={stats.totalProducts.change > 0 ? 'positive' : 'negative'}>
            {stats.totalProducts.change > 0 ? '+' : ''}{stats.totalProducts.change}% vs previous month
          </StatChange>
        </StatCard>

        <StatCard>
          <StatIcon className="sales">🛒</StatIcon>
          <StatValue>{stats.totalSales.value.toLocaleString()}</StatValue>
          <StatLabel>Total Sales</StatLabel>
          <StatChange className={stats.totalSales.change > 0 ? 'positive' : 'negative'}>
            {stats.totalSales.change > 0 ? '+' : ''}{stats.totalSales.change}% vs previous month
          </StatChange>
        </StatCard>

        <StatCard>
          <StatIcon className="revenue">💰</StatIcon>
          <StatValue>$ {stats.totalRevenue.value.toLocaleString()}</StatValue>
          <StatLabel>Total Revenue</StatLabel>
          <StatChange className={stats.totalRevenue.change > 0 ? 'positive' : 'negative'}>
            {stats.totalRevenue.change > 0 ? '+' : ''}{stats.totalRevenue.change}% vs previous month
          </StatChange>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>Sales by Month</ChartTitle>
          <SimpleChart>
            {chartData.map((item, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <ChartBar 
                  style={{ 
                    height: `${(item.value / maxValue) * 250}px` 
                  }}
                >
                  <ChartValue>{item.value}</ChartValue>
                </ChartBar>
                <ChartLabel>{item.label}</ChartLabel>
              </div>
            ))}
          </SimpleChart>
        </ChartCard>

        <ChartCard>
          <ChartTitle>Distribution by Category</ChartTitle>
          <PieChart>
            <PieCenter>100%</PieCenter>
          </PieChart>
          <Legend>
            <LegendItem>
              <LegendColor style={{ background: '#667eea' }} />
              <span>Electronics (33%)</span>
            </LegendItem>
            <LegendItem>
              <LegendColor style={{ background: '#2ed573' }} />
              <span>Clothing (33%)</span>
            </LegendItem>
            <LegendItem>
              <LegendColor style={{ background: '#ffa502' }} />
              <span>Home (17%)</span>
            </LegendItem>
            <LegendItem>
              <LegendColor style={{ background: '#ff4757' }} />
              <span>Others (17%)</span>
            </LegendItem>
          </Legend>
        </ChartCard>
      </ChartsGrid>

      <TableCard>
        <ChartTitle style={{ margin: '0 0 1rem 2rem', paddingTop: '2rem' }}>
          Top 5 Best Selling Products
        </ChartTitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Product</TableHeaderCell>
              <TableHeaderCell>Sales</TableHeaderCell>
              <TableHeaderCell>Revenue</TableHeaderCell>
              <TableHeaderCell>Share</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {topProducts.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sales}</TableCell>
                <TableCell>$ {product.revenue.toLocaleString()}</TableCell>
                <TableCell>
                  {((product.sales / topProducts.reduce((sum, p) => sum + p.sales, 0)) * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableCard>
    </Container>
  );
} 