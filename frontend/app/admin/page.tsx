import React from "react";
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const stats = [
  { name: "Total Users", value: "2,543", icon: Users, change: "+12.5%", trending: "up" },
  { name: "Total Orders", value: "1,205", icon: ShoppingBag, change: "+8.2%", trending: "up" },
  { name: "Revenue", value: "$45,231", icon: DollarSign, change: "-2.4%", trending: "down" },
  { name: "Growth", value: "24.3%", icon: TrendingUp, change: "+4.1%", trending: "up" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard Overview</h1>
        <p className="text-neutral-500 text-sm mt-1">Welcome back, here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="p-6 bg-white/50 rounded-2xl border border-neutral-200/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-xl bg-neutral-100 text-black">
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                stat.trending === 'up' 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                {stat.trending === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm text-neutral-500 font-medium">{stat.name}</p>
              <h3 className="text-2xl font-bold text-neutral-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-neutral-900">Recent Transactions</h3>
            <button className="text-xs text-indigo-600 hover:underline">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-xs text-neutral-500 uppercase border-b border-neutral-100">
                <tr>
                  <th className="pb-3 pr-4">Order ID</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm text-neutral-600">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b border-neutral-50 last:border-0">
                    <td className="py-4 pr-4">#ORD-00{i}</td>
                    <td className="py-4 pr-4 font-medium text-neutral-900">Customer Name</td>
                    <td className="py-4 pr-4">
                      <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs">
                        Completed
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-right font-medium text-neutral-900">$120.00</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm">
          <h3 className="font-bold text-neutral-900 mb-6">Popular Products</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-neutral-100 flex-shrink-0 animate-pulse"></div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-900 truncate">Premium Product {i}</p>
                  <p className="text-xs text-neutral-500">224 sales</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-neutral-900">$45.00</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-sm font-semibold transition-colors">
            Manage Inventory
          </button>
        </div>
      </div>
    </div>
  );
}
