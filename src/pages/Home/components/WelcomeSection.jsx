import React from 'react';
import { Card } from '@components/ui';
import { Package, ShoppingBag, Heart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import userService from '@/services/userService';

const WelcomeSection = ({ user }) => {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['buyerStats'],
    queryFn: async () => {
      const response = await userService.getMyStats();
      return response.data;
    }
  });
  const stats = [
    {
      id: 1,
      label: 'ACTIVE ORDERS',
      value: isLoading ? '...' : statsData?.activeOrders || '0',
      icon: Package,
      iconColor: 'bg-blue-500/10 text-blue-500' // Using blue as in the screenshot for box icon
    },
    {
      id: 2,
      label: 'TOTAL PURCHASES',
      value: isLoading ? '...' : statsData?.totalPurchases || '0',
      icon: ShoppingBag,
      iconColor: 'bg-green-500/10 text-green-500' // Using green for bag
    },
    {
      id: 3,
      label: 'SAVED ITEMS',
      value: isLoading ? '...' : statsData?.savedItems || '0',
      icon: Heart,
      iconColor: 'bg-red-500/10 text-red-500' // Using red for heart
    }
  ];

  return (
    <section className="bg-background pt-8 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="bg-card border border-border rounded-xl p-8 md:p-12">
          <p className="text-[#D4A017] text-xs font-bold tracking-wider mb-2 uppercase">
            Authenticated Collector
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Welcome back, <span className="text-[#D4A017]">{user?.fullName || 'Collector'}</span>
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div 
              key={stat.id}
              className="bg-card border border-border rounded-xl p-6 flex flex-col justify-between min-h-[140px] hover:border-white/20 transition-colors cursor-default"
            >
              <div className={`w-10 h-10 rounded-lg ${stat.iconColor} flex items-center justify-center mb-4`}>
                <stat.icon size={20} />
              </div>
              
              <div>
                <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
