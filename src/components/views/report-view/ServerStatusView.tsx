import React, { useState } from 'react';
import {
  Server,
  Calendar,
  HardDrive,
  Cpu,
  Layers,
  Activity,
  Clock,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { SERVER_STATUS_DATA } from '../../../mockData';

export const ServerStatusView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('2026-09-09');
  const [selectedServer, setSelectedServer] = useState('VM-SHANGHAI-PROD-01');
  const data = SERVER_STATUS_DATA;

  return (
    <div className="p-6 space-y-5">
      {/* 标题说明 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-blue-600 font-mono mb-1">
            上报查看 &gt; 服务器查看 &gt; 服务器运行状态
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-5 h-5 text-teal-600" />
            <span>服务器运行状态</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            按指定日期细粒度分析服务器节点运行状态，涵盖磁盘写入速率、虚拟内存(vmem)换页存取及访问延迟走势
          </p>
        </div>

        {/* 指定日期与服务器切换选择 */}
        <div className="flex flex-wrap items-center gap-3 bg-white p-2 border border-slate-200 rounded-xl shadow-xs text-xs">
          <div className="flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">服务器:</span>
            <select
              value={selectedServer}
              onChange={(e) => setSelectedServer(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono focus:outline-none focus:border-blue-500"
            >
              <option value="VM-SHANGHAI-PROD-01">VM-SHANGHAI-PROD-01 (10.24.12.88)</option>
              <option value="VM-SHANGHAI-PROD-02">VM-SHANGHAI-PROD-02 (10.24.12.89)</option>
              <option value="VM-BEIJING-GATEWAY-01">VM-BEIJING-GATEWAY-01 (10.24.14.12)</option>
              <option value="VM-GUANGZHOU-PAY-01">VM-GUANGZHOU-PAY-01 (10.24.12.90)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">指定日期:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 节点硬件与当前运行快照 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-400 block mb-1">节点名称与IP</span>
          <span className="font-bold text-slate-900 font-mono text-sm">sh-mall-auth-01</span>
          <span className="text-[11px] text-slate-500 block">10.24.12.88 (内网)</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-1">磁盘写入峰值 (数据盘)</span>
          <span className="font-bold text-teal-600 font-mono text-sm">144.5 MB/s</span>
          <span className="text-[11px] text-slate-500 block">晚高峰 21:00 日志归档触发</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-1">虚拟内存换页速率 (Page In/Out)</span>
          <span className="font-bold text-indigo-600 font-mono text-sm">850 / 1980 ops/s</span>
          <span className="text-[11px] text-slate-500 block">vmem分页状态良好</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-1">内存平均存取延迟</span>
          <span className="font-bold text-emerald-600 font-mono text-sm">3.4 ms</span>
          <span className="text-[11px] text-emerald-600 block">未发生严重Swap抖动</span>
        </div>
      </div>

      {/* 图表 1：磁盘写入量趋势图 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              磁盘写入吞吐量走势（系统盘 /dev/nvme0n1 vs 数据盘 /dev/nvme1n1）
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-blue-500 font-medium">● 系统盘 nvme0 (MB/s)</span>
            <span className="text-teal-600 font-medium">● 数据盘 nvme1 (MB/s)</span>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data.diskWriteTrends} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis unit="MB/s" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="diskNvme1" name="数据盘写入量" fill="#ccfbf1" stroke="#0d9488" strokeWidth={2} />
              <Line type="monotone" dataKey="diskNvme0" name="系统盘写入量" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 图表 2：vmem存取及延迟等图表 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              虚拟内存 (vmem) 换页速率与存取延迟走势
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-blue-500 font-medium">● Page In 速率</span>
            <span className="text-purple-600 font-medium">● Page Out 速率</span>
            <span className="text-rose-500 font-medium">▲ 存取延迟 (ms)</span>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data.vmemAndLatencyTrends} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="ops" unit="op/s" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="latency" orientation="right" unit="ms" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line yAxisId="ops" type="monotone" dataKey="pageInRate" name="Page In速率" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              <Line yAxisId="ops" type="monotone" dataKey="pageOutRate" name="Page Out速率" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
              <Line yAxisId="latency" type="monotone" dataKey="accessLatencyMs" name="存取延迟(ms)" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
