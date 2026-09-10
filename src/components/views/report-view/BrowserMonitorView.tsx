import React, { useState } from 'react';
import {
  LineChart as LineChartIcon,
  Globe,
  Monitor,
  Clock,
  Compass,
  Zap,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { BROWSER_MONITOR_DATA } from '../../../mockData';

export const BrowserMonitorView: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('TODAY');
  const data = BROWSER_MONITOR_DATA;

  const COLORS = ['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="p-6 space-y-5">
      {/* 标题说明 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-blue-600 font-mono mb-1">
            上报查看 &gt; 插件图表 &gt; 浏览器端监控
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <LineChartIcon className="w-5 h-5 text-purple-600" />
            <span>浏览器端监控</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            采集自前端用户浏览器探针，提供操作系统、浏览器内核与版本占比、地域分布及API调用分位数耗时
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white p-2 border border-slate-200 rounded-xl shadow-xs text-xs">
          <span className="text-slate-500 font-medium">统计区间:</span>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="TODAY">今日实时 (00:00 - 至今)</option>
            <option value="YESTERDAY">昨天全天</option>
            <option value="7D">近 7 天聚合统计</option>
          </select>
        </div>
      </div>

      {/* 第一行：OS类型分布 & 浏览器类型/版本 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* OS类型分布 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">操作系统类型占比 (OS Types)</h3>
            </div>
            <span className="text-xs text-slate-400">环形分布图</span>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.osDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {data.osDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(val: number) => [`${val}%`, '访客占比']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
            {data.osDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-slate-600">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                ></span>
                <span className="truncate">{item.name}</span>
                <span className="font-bold text-slate-800 ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 浏览器类型与版本 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">浏览器类型与主流版本 (Browser Versions)</h3>
            </div>
            <span className="text-xs text-slate-400">总样本: 243.2 万</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.browserVersions} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis unit="%" tick={{ fontSize: 11 }} />
                <RechartsTooltip formatter={(val: number) => [`${val}%`, '市场份额']} />
                <Bar dataKey="share" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>Chrome/Edge Chromium 内核占比超过 70.5%</span>
            <span>适配建议：优先保证现代 Web 标准</span>
          </div>
        </div>
      </div>

      {/* 第二行：访客地域 & API调用耗时 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 访客地域分布 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">访客地域分布 (Top Regions)</h3>
            </div>
            <span className="text-xs text-slate-400">IP地理库智能解析</span>
          </div>

          <div className="space-y-2.5 py-1">
            {data.geoDistribution.map((geo, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{geo.region}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-500">{geo.visitors.toLocaleString()} 人次</span>
                    <span className="font-bold text-emerald-600">{geo.percentage}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: geo.percentage }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API调用耗时等 (P50, P90, P99) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <h3 className="font-bold text-slate-900 text-sm">API调用分位数耗时趋势 (Latency Percentiles)</h3>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-blue-500 font-bold">P50</span>
              <span className="text-amber-500 font-bold">P90</span>
              <span className="text-rose-500 font-bold">P99</span>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.apiLatencyTimeline} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis unit="ms" tick={{ fontSize: 11 }} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="p50" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="P50中位数" />
                <Line type="monotone" dataKey="p90" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="P90耗时" />
                <Line type="monotone" dataKey="p99" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} name="P99长尾耗时" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>夜间高峰时段 P99 达到 890ms (重点关注慢接口)</span>
            <span className="text-emerald-600 font-medium">常规时段 P50 保持 &lt; 50ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
