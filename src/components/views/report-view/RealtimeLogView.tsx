import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Play,
  Pause,
  Search,
  Filter,
  Trash2,
  Sliders,
  ChevronRight,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Code2,
  Cpu,
  Layers,
  Info,
} from 'lucide-react';
import { LogItem } from '../../../types';

interface RealtimeLogViewProps {
  initialLogs: LogItem[];
}

export const RealtimeLogView: React.FC<RealtimeLogViewProps> = ({ initialLogs }) => {
  const [logs, setLogs] = useState<LogItem[]>(initialLogs);
  const [isStreaming, setIsStreaming] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(3000); // 3s
  const [selectedApp, setSelectedApp] = useState('ALL');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [keyword, setKeyword] = useState('');
  const [machineFilter, setMachineFilter] = useState('ALL');
  const [autoScroll, setAutoScroll] = useState(true);

  // 实时参数查看抽屉
  const [inspectingLog, setInspectingLog] = useState<LogItem | null>(null);

  const logContainerRef = useRef<HTMLDivElement>(null);

  // 模拟流式实时日志流入
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const demoMessages = [
        'Heartbeat telemetry packet validated from agent',
        'Cache hit for user authorization token key=auth_99120',
        'Executing DB query: SELECT count(*) FROM t_order WHERE status = 1',
        'HTTP GET /api/v2/metrics status=200 size=4096B',
        'Worker batch completed 256 messages in 18ms',
        'Kafka producer ack received partition=03 offset=1049281',
      ];

      const levels: LogItem['level'][] = ['INFO', 'INFO', 'DEBUG', 'WARN', 'INFO'];
      const randomLevel = levels[Math.floor(Math.random() * levels.length)];
      const randomMsg = demoMessages[Math.floor(Math.random() * demoMessages.length)];
      const randomTrace = 'tr-' + Math.random().toString(36).substring(2, 8) + '-' + Math.random().toString(36).substring(2, 6);

      const newLog: LogItem = {
        id: 'LOG-' + Math.floor(100000 + Math.random() * 900000),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 23),
        app: '商城业务中心 (mall-app)',
        module: Math.random() > 0.5 ? 'user-auth-service' : 'order-pay-gateway',
        level: randomLevel,
        machineIp: Math.random() > 0.5 ? '10.24.12.88' : '10.24.12.90',
        traceId: randomTrace,
        message: randomMsg,
        durationMs: Math.floor(10 + Math.random() * 80),
        httpStatus: 200,
        params: {
          clientIp: '183.14.132.' + Math.floor(Math.random() * 255),
          workerId: 'worker-0' + Math.floor(1 + Math.random() * 8),
          threadPoolActive: Math.floor(12 + Math.random() * 40),
          runtimeMemMb: 512,
        },
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 150)]);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isStreaming, refreshInterval]);

  // 过滤后的日志
  const filteredLogs = logs.filter((log) => {
    const matchApp = selectedApp === 'ALL' || log.app.includes(selectedApp);
    const matchLevel = selectedLevel === 'ALL' || log.level === selectedLevel;
    const matchMachine = machineFilter === 'ALL' || log.machineIp === machineFilter;
    const matchKeyword =
      !keyword ||
      log.message.toLowerCase().includes(keyword.toLowerCase()) ||
      log.traceId.toLowerCase().includes(keyword.toLowerCase()) ||
      log.module.toLowerCase().includes(keyword.toLowerCase());

    return matchApp && matchLevel && matchMachine && matchKeyword;
  });

  const getLevelColor = (level: LogItem['level']) => {
    switch (level) {
      case 'ERROR':
        return 'text-rose-400 bg-rose-950/50 border-rose-800';
      case 'WARN':
        return 'text-amber-400 bg-amber-950/50 border-amber-800';
      case 'INFO':
        return 'text-emerald-400 bg-emerald-950/50 border-emerald-800';
      case 'DEBUG':
        return 'text-slate-400 bg-slate-800/80 border-slate-700';
    }
  };

  return (
    <div className="p-6 space-y-5">
      {/* 标题说明 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-blue-600 font-mono mb-1">
            上报查看 &gt; 日志查看 &gt; 实时日志查看
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-600" />
            <span>实时日志查看</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            流式捕获节点日志流，提供多条件即时过滤与实时请求参数解析
          </p>
        </div>

        {/* 流式控制工具栏 */}
        <div className="flex items-center gap-3 bg-white p-2 border border-slate-200 rounded-xl shadow-xs">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isStreaming
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            {isStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>暂停流式刷新</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>继续流式刷新</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>速率:</span>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="px-2 py-1 bg-slate-100 rounded text-xs border border-slate-200"
            >
              <option value={1000}>1 秒/次</option>
              <option value={3000}>3 秒/次</option>
              <option value={5000}>5 秒/次</option>
            </select>
          </div>

          <button
            onClick={() => setLogs([])}
            title="清空当前缓冲区日志"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 多条件搜索与筛选栏 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block text-slate-500 font-medium mb-1">所属应用:</label>
          <select
            value={selectedApp}
            onChange={(e) => setSelectedApp(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">全部应用系统</option>
            <option value="mall-app">商城业务中心 (mall-app)</option>
            <option value="gateway-core">公共网关体系 (gateway-core)</option>
            <option value="data-hub">数据智能中台 (data-hub)</option>
            <option value="billing-srv">财务计费系统 (billing-srv)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-500 font-medium mb-1">日志级别:</label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">全部级别 (ALL)</option>
            <option value="ERROR">ERROR 错误</option>
            <option value="WARN">WARN 警告</option>
            <option value="INFO">INFO 信息</option>
            <option value="DEBUG">DEBUG 调试</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-500 font-medium mb-1">节点机器IP:</label>
          <select
            value={machineFilter}
            onChange={(e) => setMachineFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500 font-mono"
          >
            <option value="ALL">全部节点</option>
            <option value="10.24.12.88">10.24.12.88 (Auth-01)</option>
            <option value="10.24.12.89">10.24.12.89 (Auth-02)</option>
            <option value="10.24.14.12">10.24.14.12 (Gateway-01)</option>
            <option value="10.24.12.90">10.24.12.90 (Pay-01)</option>
            <option value="10.24.16.55">10.24.16.55 (Collector-01)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-500 font-medium mb-1">关键词/TraceID:</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="搜索消息、异常、TraceID..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 实时终端视窗风格展示 */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-xl overflow-hidden font-mono text-xs">
        {/* 终端头部状态 */}
        <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            <span className="ml-2 font-semibold text-slate-200">
              Live Stream Tail · 当前缓冲: {filteredLogs.length} 条
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className={`w-2 h-2 rounded-full bg-emerald-400 ${isStreaming ? 'animate-ping' : ''}`}></span>
              {isStreaming ? '流式传输中' : '已暂停'}
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">点击任意日志行查看「实时参数详情」</span>
          </div>
        </div>

        {/* 日志内容滚动列表 */}
        <div
          ref={logContainerRef}
          className="h-[480px] overflow-y-auto p-3 space-y-1.5 custom-scrollbar text-[11px]"
        >
          {filteredLogs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500">
              暂无符合过滤条件的实时日志
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                onClick={() => setInspectingLog(log)}
                className="p-2 rounded bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800/60 hover:border-blue-500/50 cursor-pointer transition-all flex items-start gap-3 group"
              >
                <span className="text-slate-500 shrink-0 select-none">
                  {log.timestamp}
                </span>

                <span
                  className={`px-1.5 py-0.2 rounded border text-[10px] font-bold shrink-0 ${getLevelColor(
                    log.level
                  )}`}
                >
                  {log.level}
                </span>

                <span className="text-cyan-400 shrink-0 font-medium">
                  [{log.module}]
                </span>

                <span className="text-purple-400 shrink-0">
                  {log.machineIp}
                </span>

                <span className="text-blue-400 shrink-0 underline decoration-blue-500/40">
                  {log.traceId}
                </span>

                <span className="text-slate-200 flex-1 break-all group-hover:text-white">
                  {log.message}
                </span>

                <span className="text-slate-500 shrink-0 text-[10px]">
                  {log.durationMs}ms
                </span>

                <div className="shrink-0 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 实时参数查看抽屉模态框 */}
      {inspectingLog && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm">3.3.2.1 实时参数查看面板</h3>
              </div>
              <button
                onClick={() => setInspectingLog(null)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                关闭
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-500">日志单号: </span>
                  <span className="text-slate-200">{inspectingLog.id}</span>
                </div>
                <div>
                  <span className="text-slate-500">时间戳: </span>
                  <span className="text-slate-200">{inspectingLog.timestamp}</span>
                </div>
                <div>
                  <span className="text-slate-500">应用模块: </span>
                  <span className="text-cyan-400">{inspectingLog.module}</span>
                </div>
                <div>
                  <span className="text-slate-500">节点IP: </span>
                  <span className="text-slate-200">{inspectingLog.machineIp}</span>
                </div>
                <div>
                  <span className="text-slate-500">全链路Trace: </span>
                  <span className="text-blue-400">{inspectingLog.traceId}</span>
                </div>
                <div>
                  <span className="text-slate-500">处理耗时: </span>
                  <span className="text-emerald-400">{inspectingLog.durationMs} ms</span>
                </div>
              </div>

              <div>
                <div className="text-slate-400 mb-1 font-sans text-xs">消息内容 (Log Message):</div>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded text-slate-200 break-all">
                  {inspectingLog.message}
                </div>
              </div>

              <div>
                <div className="text-slate-400 mb-1 font-sans text-xs">动态上报参数 (Parsed Context Params):</div>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded text-emerald-400 overflow-x-auto text-[11px]">
                  {JSON.stringify(inspectingLog.params || {}, null, 2)}
                </pre>
              </div>

              {inspectingLog.stackTrace && (
                <div>
                  <div className="text-rose-400 mb-1 font-sans text-xs">异常堆栈 (Stack Trace):</div>
                  <pre className="p-3 bg-rose-950/40 border border-rose-900 rounded text-rose-300 overflow-x-auto text-[10px]">
                    {inspectingLog.stackTrace}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setInspectingLog(null)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
