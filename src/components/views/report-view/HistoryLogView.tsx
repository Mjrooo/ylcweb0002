import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Code,
  AlertCircle,
  Clock,
  Layers,
  FileDown,
  X,
} from 'lucide-react';
import { LogItem } from '../../../types';

interface HistoryLogViewProps {
  logs: LogItem[];
  prefilledApp?: string;
  prefilledModule?: string;
  prefilledIp?: string;
}

export const HistoryLogView: React.FC<HistoryLogViewProps> = ({
  logs,
  prefilledApp,
  prefilledModule,
  prefilledIp,
}) => {
  const [timeRange, setTimeRange] = useState('TODAY');
  const [appFilter, setAppFilter] = useState(prefilledApp || 'ALL');
  const [moduleFilter, setModuleFilter] = useState(prefilledModule || 'ALL');
  const [ipFilter, setIpFilter] = useState(prefilledIp || 'ALL');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [exactTraceId, setExactTraceId] = useState('');
  const [keyword, setKeyword] = useState('');
  const [httpStatusFilter, setHttpStatusFilter] = useState('ALL');

  // 历史参数查看详情
  const [inspectLog, setInspectLog] = useState<LogItem | null>(null);

  // 同步外部传入的快捷跳转参数
  useEffect(() => {
    if (prefilledApp) setAppFilter(prefilledApp);
    if (prefilledModule) setModuleFilter(prefilledModule);
    if (prefilledIp) setIpFilter(prefilledIp);
  }, [prefilledApp, prefilledModule, prefilledIp]);

  // 精准检索过滤
  const filteredLogs = logs.filter((log) => {
    if (appFilter !== 'ALL' && !log.app.includes(appFilter)) return false;
    if (moduleFilter !== 'ALL' && log.module !== moduleFilter) return false;
    if (ipFilter !== 'ALL' && log.machineIp !== ipFilter) return false;
    if (levelFilter !== 'ALL' && log.level !== levelFilter) return false;
    if (httpStatusFilter !== 'ALL' && log.httpStatus.toString() !== httpStatusFilter) return false;
    if (exactTraceId.trim() && !log.traceId.toLowerCase().includes(exactTraceId.trim().toLowerCase())) return false;
    if (
      keyword.trim() &&
      !log.message.toLowerCase().includes(keyword.trim().toLowerCase())
    )
      return false;

    return true;
  });

  const handleExport = (format: 'TXT' | 'CSV') => {
    const exportData = filteredLogs.map((l) => ({
      timestamp: l.timestamp,
      app: l.app,
      module: l.module,
      level: l.level,
      ip: l.machineIp,
      traceId: l.traceId,
      message: l.message,
      durationMs: l.durationMs,
      httpStatus: l.httpStatus,
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit_logs_history_${new Date().toISOString().slice(0, 10)}.${format.toLowerCase()}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-5">
      {/* 模块标题与说明 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-blue-600 font-mono mb-1">
            上报查看 &gt; 日志查看 &gt; 历史日志查看
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>历史日志查看</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            支持指定时间范围、TraceID全链路匹配、HTTP状态码与历史参数明细探查
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('CSV')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>导出 CSV 报表</span>
          </button>
          <button
            onClick={() => handleExport('TXT')}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出原始日志</span>
          </button>
        </div>
      </div>

      {/* 多条件精准搜索卡片 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-slate-500 font-medium mb-1">时间范围 (Time Range):</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="1H">最近 1 小时</option>
              <option value="TODAY">今日全天 (00:00 - 24:00)</option>
              <option value="3D">最近 3 天</option>
              <option value="7D">最近 7 天历史日志</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">精确 TraceID 搜索:</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="例如: tr-c8f9210-9941a8"
                value={exactTraceId}
                onChange={(e) => setExactTraceId(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">所属服务模块:</label>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">全部模块</option>
              <option value="user-auth-service">user-auth-service (认证服务)</option>
              <option value="order-pay-gateway">order-pay-gateway (支付网关)</option>
              <option value="api-proxy-nginx">api-proxy-nginx (入口代理)</option>
              <option value="log-collector-agent">log-collector-agent (采集Agent)</option>
              <option value="billing-calc-job">billing-calc-job (计费跑批)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">日志级别 / 状态码:</label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">全部级别</option>
                <option value="ERROR">ERROR 错误</option>
                <option value="WARN">WARN 警告</option>
                <option value="INFO">INFO</option>
                <option value="DEBUG">DEBUG</option>
              </select>

              <select
                value={httpStatusFilter}
                onChange={(e) => setHttpStatusFilter(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500 font-mono"
              >
                <option value="ALL">HTTP状态码</option>
                <option value="200">200 OK</option>
                <option value="401">401 Unauthorized</option>
                <option value="500">500 Server Error</option>
                <option value="504">504 Gateway Timeout</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <div className="flex-1 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="搜索日志关键字、SQL语句、异常类名或上下文参数..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => {
              setAppFilter('ALL');
              setModuleFilter('ALL');
              setIpFilter('ALL');
              setLevelFilter('ALL');
              setExactTraceId('');
              setKeyword('');
              setHttpStatusFilter('ALL');
            }}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>重置所有检索条件</span>
          </button>
        </div>
      </div>

      {/* 历史日志表格 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">产生时间戳</th>
                <th className="py-3 px-4">级别</th>
                <th className="py-3 px-4">状态码</th>
                <th className="py-3 px-4">应用 / 模块</th>
                <th className="py-3 px-4">节点IP</th>
                <th className="py-3 px-4">全链路 TraceID</th>
                <th className="py-3 px-4">耗时</th>
                <th className="py-3 px-4">日志内容摘要</th>
                <th className="py-3 px-4 text-center">历史参数查看</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 font-sans">
                    <AlertCircle className="w-7 h-7 mx-auto text-slate-300 mb-2" />
                    <span>未检索到匹配的历史日志记录</span>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-600 text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.level === 'ERROR'
                            ? 'bg-rose-100 text-rose-800'
                            : log.level === 'WARN'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {log.level}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold">
                      <span
                        className={
                          log.httpStatus >= 500
                            ? 'text-rose-600'
                            : log.httpStatus >= 400
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }
                      >
                        {log.httpStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-sans">
                      <div className="font-semibold text-slate-800 text-xs">{log.module}</div>
                      <div className="text-[10px] text-slate-400">{log.app}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-700 text-[11px]">{log.machineIp}</td>

                    <td className="py-3 px-4 text-blue-600 underline text-[11px]">
                      {log.traceId}
                    </td>

                    <td className="py-3 px-4 text-slate-600 text-[11px]">{log.durationMs}ms</td>

                    <td className="py-3 px-4 font-sans text-slate-700 max-w-xs truncate" title={log.message}>
                      {log.message}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setInspectLog(log)}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded font-sans text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        查看历史参数
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-sans">
          <span>当前命中历史记录：{filteredLogs.length} 条</span>
          <span>存储策略：热日志保留 30 天，温存储保留 180 天</span>
        </div>
      </div>

      {/* 历史参数查看模态弹窗 */}
      {inspectLog && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">3.3.2.2 历史参数详细上下文</h3>
              </div>
              <button
                onClick={() => setInspectLog(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 font-sans">TraceID：</span>
                  <span className="text-blue-600 font-bold">{inspectLog.traceId}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">HTTP 状态：</span>
                  <span className="font-bold text-slate-800">{inspectLog.httpStatus}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">服务模块：</span>
                  <span className="text-slate-800 font-sans">{inspectLog.module}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">执行耗时：</span>
                  <span className="text-emerald-600">{inspectLog.durationMs} 毫秒</span>
                </div>
              </div>

              <div>
                <span className="block text-slate-600 font-semibold mb-1">原始日志内容 (Log Message)：</span>
                <div className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs break-all">
                  {inspectLog.message}
                </div>
              </div>

              <div>
                <span className="block text-slate-600 font-semibold mb-1">历史请求上下文参数 (Request Payload & Headers)：</span>
                <pre className="p-3 bg-slate-950 text-emerald-400 rounded-lg font-mono text-[11px] overflow-x-auto">
                  {JSON.stringify(inspectLog.params || {}, null, 2)}
                </pre>
              </div>

              {inspectLog.stackTrace && (
                <div>
                  <span className="block text-rose-600 font-semibold mb-1">异常调用堆栈 (Stack Trace)：</span>
                  <pre className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-lg font-mono text-[10px] overflow-x-auto whitespace-pre-wrap">
                    {inspectLog.stackTrace}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setInspectLog(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
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
