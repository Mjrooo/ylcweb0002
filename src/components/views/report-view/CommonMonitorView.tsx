import React, { useState } from 'react';
import {
  Eye,
  Calendar,
  TrendingUp,
  Activity,
  LogIn,
  CheckCircle,
  AlertCircle,
  Clock,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { COMMON_VIEW_DATA } from '../../../mockData';

export const CommonMonitorView: React.FC = () => {
  const [timeRange, setTimeRange] = useState('TODAY');
  const data = COMMON_VIEW_DATA;

  return (
    <div className="p-6 space-y-5">
      {/* 标题说明 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-blue-600 font-mono mb-1">
            上报查看 &gt; 视图查看 &gt; 监控系统-常用
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyan-600" />
            <span>监控系统-常用</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            聚合全局高频关键指标视图，涵盖跨周期时间段筛选、日志写入量吞吐、登录校验及CGI请求成功率
          </p>
        </div>

        {/* 时间段筛选器 */}
        <div className="flex items-center gap-2 bg-white p-2 border border-slate-200 rounded-xl shadow-xs text-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">时间段筛选:</span>
          <div className="flex bg-slate-100 p-0.5 rounded-lg">
            <button
              onClick={() => setTimeRange('TODAY')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                timeRange === 'TODAY'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              今日 (Today)
            </button>
            <button
              onClick={() => setTimeRange('7D')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                timeRange === '7D'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              近 7 天
            </button>
            <button
              onClick={() => setTimeRange('30D')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                timeRange === '30D'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              近 30 天
            </button>
          </div>
        </div>
      </div>

      {/* 核心看板汇总 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 text-xs block">今日日志写入量</span>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">2,325 万条</div>
          <span className="text-xs text-blue-600 font-medium">折合 6.24 GB 压缩存储</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 text-xs block">登录校验成功数</span>
          <div className="text-xl font-bold font-mono text-emerald-600 mt-1">87,450 次</div>
          <span className="text-xs text-slate-500">认证通过率 98.9%</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 text-xs block">CGI 接口吞吐峰值</span>
          <div className="text-xl font-bold font-mono text-cyan-600 mt-1">24,500 QPS</div>
          <span className="text-xs text-slate-500">晚高峰 20:00 达到</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 text-xs block">CGI 综合成功率</span>
          <div className="text-xl font-bold font-mono text-emerald-600 mt-1">99.62%</div>
          <span className="text-xs text-emerald-600 font-medium">达到 SLA 四个九标准</span>
        </div>
      </div>

      {/* 常用图表 1：日志写入量走势 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              日志写入量趋势（条数与体积复合视图）
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-blue-600 font-medium">■ 写入条数 (千条)</span>
            <span className="text-cyan-500 font-medium">● 数据写入量 (MB)</span>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data.logIngestTrends} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" unit="k" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" unit="MB" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar yAxisId="left" dataKey="countK" name="写入条数(k)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="mbVolume" name="写入容量(MB)" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 常用图表 2：登录及CGI请求走势 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <LogIn className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              用户登录认证与CGI请求QPS走势
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-emerald-600 font-medium">● 登录成功次数</span>
            <span className="text-rose-500 font-medium">● 登录失败次数</span>
            <span className="text-purple-600 font-medium">▲ CGI QPS</span>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data.loginAndCgiRequests} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="login" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="qps" orientation="right" unit="qps" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area yAxisId="login" type="monotone" dataKey="loginSuccess" name="登录成功" fill="#d1fae5" stroke="#10b981" />
              <Line yAxisId="login" type="monotone" dataKey="loginFail" name="登录失败" stroke="#ef4444" strokeWidth={2} />
              <Line yAxisId="qps" type="monotone" dataKey="cgiQps" name="CGI请求吞吐" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
