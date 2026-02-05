/**
 * Market History Chart Component
 * Displays historical market value using ApexCharts
 */
import { useMemo } from 'react'
import Chart from 'react-apexcharts'

const MarketHistoryChart = ({ 
  data = [], // Array of { date: string, value: number }
  percentageChange = null // e.g., "+12.4% (90D)"
}) => {
  // Generate dummy data if none provided
  const chartData = useMemo(() => {
    if (data.length > 0) {
      return data
    }
    // Generate placeholder data for demo
    const now = new Date()
    return Array.from({ length: 90 }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - (90 - i))
      // Simulate upward trend with some variation
      const baseValue = 150 + (i * 0.5) + (Math.random() * 20 - 10)
      return {
        date: date.toISOString(),
        value: Math.round(baseValue * 100) / 100
      }
    })
  }, [data])

  // Calculate percentage change if not provided
  const displayPercentage = useMemo(() => {
    if (percentageChange) return percentageChange
    if (chartData.length >= 2) {
      const first = chartData[0].value
      const last = chartData[chartData.length - 1].value
      const change = ((last - first) / first) * 100
      return `${change >= 0 ? '+' : ''}${change.toFixed(1)}% (90D)`
    }
    return '+12.4% (90D)'
  }, [percentageChange, chartData])

  // ApexCharts options
  const options = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      sparkline: { enabled: false },
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
    },
    colors: ['#D4A017'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 100]
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    grid: {
      show: false,
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    },
    xaxis: {
      type: 'datetime',
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      show: false,
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      x: {
        format: 'MMM dd, yyyy'
      },
      y: {
        formatter: (val) => `$${val.toFixed(2)}`
      }
    },
    dataLabels: { enabled: false },
  }

  const series = [{
    name: 'Market Value',
    data: chartData.map(item => ({
      x: new Date(item.date).getTime(),
      y: item.value
    }))
  }]

  return (
    <div className="bg-[#111C2E] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Historical Market Value
          </span>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-widest ${
          displayPercentage.startsWith('+') ? 'text-[#34D399]' : 'text-red-400'
        }`}>
          {displayPercentage}
        </span>
      </div>
      
      {/* Chart */}
      <div className="h-24">
        <Chart 
          options={options} 
          series={series} 
          type="area" 
          height="100%" 
          width="100%"
        />
      </div>
    </div>
  )
}

export default MarketHistoryChart
