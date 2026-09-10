import React, { useState } from 'react';
import {
  FolderTree,
  FileCode,
  Search,
  ArrowRight,
  Download,
  HardDrive,
  Clock,
  Layers,
  FileArchive,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { LogFileItem, MenuId } from '../../../types';

interface LogFileListViewProps {
  files: LogFileItem[];
  onJumpToHistoryLog: (app: string, module: string, ip: string) => void;
}

export const LogFileListView: React.FC<LogFileListViewProps> = ({
  files,
  onJumpToHistoryLog,
}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [appFilter, setAppFilter] = useState('ALL');

  const filteredFiles = files.filter((file) => {
    const matchApp = appFilter === 'ALL' || file.app.includes(appFilter);
    const matchKeyword =
      !searchKeyword ||
      file.fileName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      file.filePath.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      file.machineIp.includes(searchKeyword) ||
      file.module.toLowerCase().includes(searchKeyword.toLowerCase());

    return matchApp && matchKeyword;
  });

  return (
    <div className="p-6 space-y-5">
      {/* 模块标题与说明 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-blue-600 font-mono mb-1">
            上报查看 &gt; 日志查看 &gt; 日志文件列表
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-sky-600" />
            <span>日志文件列表</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            聚合服务器各磁盘挂载路径下的日志文件元数据，支持文件级审计与快捷跳转历史日志
          </p>
        </div>

        <div className="text-xs text-slate-500">
          已纳管归档日志文件：<strong className="text-slate-800">{files.length} 个</strong>
        </div>
      </div>

      {/* 筛选条 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="搜索日志文件名、物理路径或节点IP..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">应用系统:</span>
          <select
            value={appFilter}
            onChange={(e) => setAppFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">全部应用</option>
            <option value="mall-app">商城业务中心</option>
            <option value="gateway-core">公共网关体系</option>
            <option value="billing-srv">财务计费系统</option>
          </select>
        </div>

        <button
          onClick={() => {
            setSearchKeyword('');
            setAppFilter('ALL');
          }}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>重置</span>
        </button>
      </div>

      {/* 日志文件卡片列表 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">日志文件名</th>
                <th className="py-3 px-4">物理绝对路径</th>
                <th className="py-3 px-4">所属应用 / 模块</th>
                <th className="py-3 px-4">宿主节点IP</th>
                <th className="py-3 px-4">文件大小</th>
                <th className="py-3 px-4">估算行数</th>
                <th className="py-3 px-4">最后更新时间</th>
                <th className="py-3 px-4 text-center">快捷操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredFiles.map((file) => (
                <tr key={file.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      {file.isCompressed ? (
                        <FileArchive className="w-4 h-4 text-amber-500 shrink-0" />
                      ) : (
                        <FileCode className="w-4 h-4 text-blue-500 shrink-0" />
                      )}
                      <span className="font-semibold text-slate-800 text-xs">
                        {file.fileName}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 text-[11px] max-w-xs truncate" title={file.filePath}>
                    {file.filePath}
                  </td>

                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-medium text-slate-800 text-xs">{file.module}</div>
                    <div className="text-[10px] text-slate-400">{file.app}</div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 text-[11px] font-semibold">
                    {file.machineIp}
                  </td>

                  <td className="py-3.5 px-4 text-slate-800 font-bold">
                    {file.fileSizeStr}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                    {file.lineCount.toLocaleString()} 行
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                    {file.lastModified}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {/* 快捷跳转历史日志 */}
                    <button
                      onClick={() => onJumpToHistoryLog(file.app, file.module, file.machineIp)}
                      title="携带此文件上下文参数快捷跳转到「3.3.2.2 历史日志查看」进行精准探查"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 border border-blue-200 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer shadow-xs"
                    >
                      <span>快捷跳转历史日志</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between font-sans">
          <span>展示当前在管的 {filteredFiles.length} 个核心日志文件</span>
          <span>系统每日 02:00 自动执行 gzip 轮转归档</span>
        </div>
      </div>
    </div>
  );
};
