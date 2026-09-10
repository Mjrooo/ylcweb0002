import React, { useState } from 'react';
import {
  Table,
  Server,
  Activity,
  Cpu,
  HardDrive,
  Network,
  RefreshCw,
  Clock,
  Layers,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { LINUX_RESOURCE_DATA } from '../../../mockData';

export const LinuxResourceView: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState('10.24.12.88');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const data = LINUX_RESOURCE_DATA;

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 400);
  };

  return (
    <div className="p-6 space-y-5">
      {/* 标题说明 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-blue-600 font-mono mb-1">
            上报查看 &gt; 插件实时表格 &gt; Linux基础资源监控
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Table className="w-5 h-5 text-amber-600" />
            <span>Linux基础资源监控</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            采集自 Linux 监控探针插件，实时汇总系统概况、内存结构、TCP/UDP连接状态及磁盘IO
          </p>
        </div>

        {/* 节点选择与刷新 */}
        <div className="flex items-center gap-3 bg-white p-2 border border-slate-200 rounded-xl shadow-xs text-xs">
          <span className="text-slate-500 font-medium">目标主机:</span>
          <select
            value={selectedNode}
            onChange={(e) => setSelectedNode(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono focus:outline-none focus:border-blue-500"
          >
            <option value="10.24.12.88">10.24.12.88 (sh-mall-auth-01)</option>
            <option value="10.24.12.89">10.24.12.89 (sh-mall-auth-02)</option>
            <option value="10.24.14.12">10.24.14.12 (bj-gateway-nginx-01)</option>
            <option value="10.24.12.90">10.24.12.90 (gz-pay-gateway-01)</option>
            <option value="10.24.16.55">10.24.16.55 (sh-data-collector-01)</option>
          </select>

          <button
            onClick={handleManualRefresh}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-1 font-medium transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>拉取最新探针</span>
          </button>
        </div>
      </div>

      {/* 1. 系统概况卡片 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Cpu className="w-4.5 h-4.5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">系统概况 (System Overview)</h3>
          </div>
          <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
            Host: {data.systemOverview.hostname}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <span className="text-slate-400 block mb-1">操作系统与内核：</span>
            <span className="font-semibold text-slate-800 break-all">{data.systemOverview.os}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <span className="text-slate-400 block mb-1">连续运行时间 (Uptime)：</span>
            <span className="font-semibold text-slate-800 font-mono">{data.systemOverview.uptime}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <span className="text-slate-400 block mb-1">平均负载 (1m / 5m / 15m)：</span>
            <span className="font-bold text-amber-600 font-mono text-sm">
              {data.systemOverview.loadAvg['1m']} / {data.systemOverview.loadAvg['5m']} / {data.systemOverview.loadAvg['15m']}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <span className="text-slate-400 block mb-1">CPU核数 / 进程数：</span>
            <span className="font-semibold text-slate-800 font-mono">
              {data.systemOverview.cpuCount} Cores · {data.systemOverview.totalProcesses} 进程 ({data.systemOverview.runningProcesses} 运行)
            </span>
          </div>
        </div>
      </div>

      {/* 2. 内存监控实时表格 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">内存架构与使用率实时表格</h3>
          </div>
          <span className="text-slate-500 text-[11px]">物理内存总量: 64.00 GB</span>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold">
            <tr>
              <th className="py-2.5 px-4">内存分类</th>
              <th className="py-2.5 px-4">总容量</th>
              <th className="py-2.5 px-4">已使用 / 占比</th>
              <th className="py-2.5 px-4">空闲可用 (Free)</th>
              <th className="py-2.5 px-4">共享内存 (Shared)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {data.memoryTable.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-sans font-semibold text-slate-800">{row.type}</td>
                <td className="py-3 px-4 text-slate-700">{row.size}</td>
                <td className="py-3 px-4 font-bold text-blue-600">{row.used}</td>
                <td className="py-3 px-4 text-emerald-600">{row.free}</td>
                <td className="py-3 px-4 text-slate-500">{row.shared}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 内存 Top 进程 */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <div className="font-semibold text-slate-700 text-xs mb-2">
            内存消耗 Top 进程快照:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {data.topProcesses.map((proc) => (
              <div key={proc.pid} className="bg-white p-2.5 rounded border border-slate-200 flex items-center justify-between font-mono text-[11px]">
                <div>
                  <span className="font-bold text-slate-800">PID {proc.pid}</span>
                  <span className="text-slate-400 ml-2">({proc.user})</span>
                  <div className="text-slate-600 font-sans text-xs truncate max-w-xs mt-0.5">{proc.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-blue-600 font-bold">MEM {proc.mem}</div>
                  <div className="text-slate-500">CPU {proc.cpu}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. TCP/UDP 网络连接状态表格 & 4. 磁盘IO表格 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
        {/* TCP/UDP 状态 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">TCP / UDP 网络套接字状态</h3>
            </div>
            <span className="text-[11px] text-slate-500">聚合统计</span>
          </div>

          <table className="w-full text-left font-mono">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-4">协议</th>
                <th className="py-2.5 px-4">连接状态 (State)</th>
                <th className="py-2.5 px-4">当前套接字数</th>
                <th className="py-2.5 px-4 font-sans">状态说明</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.tcpUdpStats.map((stat, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-slate-700">{stat.proto}</td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold text-[11px]">
                      {stat.state}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-bold text-blue-600">{stat.count.toLocaleString()}</td>
                  <td className="py-2.5 px-4 font-sans text-slate-500 text-[11px]">{stat.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 磁盘IO实时监控表 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-cyan-600" />
              <h3 className="font-bold text-slate-900 text-sm">磁盘分区与IO读写吞吐</h3>
            </div>
            <span className="text-[11px] text-slate-500">实时延迟 (await)</span>
          </div>

          <table className="w-full text-left font-mono">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-3">挂载点</th>
                <th className="py-2.5 px-3">使用率</th>
                <th className="py-2.5 px-3">IOPS (读/写)</th>
                <th className="py-2.5 px-3">吞吐 (读/写)</th>
                <th className="py-2.5 px-3">延迟</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {data.diskIoTable.map((disk, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-800">{disk.mount}</span>
                    <div className="text-[10px] text-slate-400 font-sans">{disk.device}</div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 font-semibold">{disk.used}</td>
                  <td className="py-2.5 px-3 text-slate-600">{disk.readIops} / {disk.writeIops}</td>
                  <td className="py-2.5 px-3 text-blue-600">{disk.readMb} / {disk.writeMb}</td>
                  <td className="py-2.5 px-3">
                    <span className={disk.awaitMs > 50 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                      {disk.awaitMs} ms
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
