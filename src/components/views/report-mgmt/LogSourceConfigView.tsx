import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Trash2,
  Edit,
  Code2,
  Terminal,
  CheckCircle2,
  AlertCircle,
  Play,
  RefreshCw,
  X,
  FileCode,
  Layers,
} from 'lucide-react';
import { LogSourceConfigItem, AppItem, ModuleItem } from '../../../types';

interface LogSourceConfigViewProps {
  configs: LogSourceConfigItem[];
  availableApps: AppItem[];
  availableModules: ModuleItem[];
  onAddConfig: (config: LogSourceConfigItem) => void;
  onUpdateConfig: (config: LogSourceConfigItem) => void;
  onDeleteConfig: (id: string) => void;
}

export const LogSourceConfigView: React.FC<LogSourceConfigViewProps> = ({
  configs,
  availableApps,
  availableModules,
  onAddConfig,
  onUpdateConfig,
  onDeleteConfig,
}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [formatFilter, setFormatFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // 增删改弹窗
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<LogSourceConfigItem | null>(null);

  // 格式调试测试弹窗
  const [debugModalOpen, setDebugModalOpen] = useState(false);
  const [debuggingConfig, setDebuggingConfig] = useState<LogSourceConfigItem | null>(null);
  const [sampleLogInput, setSampleLogInput] = useState('');
  const [parsedResult, setParsedResult] = useState<any | null>(null);
  const [debugError, setDebugError] = useState('');

  // 表单状态
  const [formData, setFormData] = useState({
    configName: '',
    appCode: 'mall-app',
    moduleCode: 'user-auth-service',
    filePathPattern: '/var/log/app/user-auth/*.log',
    logFormat: 'JSON' as LogSourceConfigItem['logFormat'],
    collectStrategy: 'SINGLE_LINE' as LogSourceConfigItem['collectStrategy'],
    multilinePattern: '^\\d{4}-\\d{2}-\\d{2}',
    fieldExtractRegex: '(?<timestamp>\\S+) \\[(?<level>\\w+)\\] (?<message>.*)',
    status: 'ACTIVE' as LogSourceConfigItem['status'],
  });

  const filteredConfigs = configs.filter((c) => {
    const matchKeyword =
      !searchKeyword ||
      c.configName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      c.filePathPattern.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      c.moduleCode.toLowerCase().includes(searchKeyword.toLowerCase());

    const matchFormat = formatFilter === 'ALL' || c.logFormat === formatFilter;
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;

    return matchKeyword && matchFormat && matchStatus;
  });

  const handleOpenAdd = () => {
    setEditingConfig(null);
    setFormData({
      configName: '',
      appCode: availableApps[0]?.appCode || 'mall-app',
      moduleCode: availableModules[0]?.moduleCode || 'user-auth-service',
      filePathPattern: '/var/log/app/service/*.log',
      logFormat: 'JSON',
      collectStrategy: 'SINGLE_LINE',
      multilinePattern: '^\\d{4}-\\d{2}-\\d{2}',
      fieldExtractRegex: '(?<timestamp>\\S+) \\[(?<level>\\w+)\\] (?<message>.*)',
      status: 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: LogSourceConfigItem) => {
    setEditingConfig(c);
    setFormData({
      configName: c.configName,
      appCode: c.appCode,
      moduleCode: c.moduleCode,
      filePathPattern: c.filePathPattern,
      logFormat: c.logFormat,
      collectStrategy: c.collectStrategy,
      multilinePattern: c.multilinePattern || '',
      fieldExtractRegex: c.fieldExtractRegex || '',
      status: c.status,
    });
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.configName || !formData.filePathPattern) return;

    if (editingConfig) {
      onUpdateConfig({
        ...editingConfig,
        configName: formData.configName,
        appCode: formData.appCode,
        moduleCode: formData.moduleCode,
        filePathPattern: formData.filePathPattern,
        logFormat: formData.logFormat,
        collectStrategy: formData.collectStrategy,
        multilinePattern: formData.multilinePattern,
        fieldExtractRegex: formData.fieldExtractRegex,
        status: formData.status,
      });
    } else {
      const newConfig: LogSourceConfigItem = {
        id: `LSC-${Date.now().toString().slice(-4)}`,
        configName: formData.configName,
        appCode: formData.appCode,
        moduleCode: formData.moduleCode,
        filePathPattern: formData.filePathPattern,
        logFormat: formData.logFormat,
        collectStrategy: formData.collectStrategy,
        multilinePattern: formData.multilinePattern,
        fieldExtractRegex: formData.fieldExtractRegex,
        status: formData.status,
        updatedAt: '刚刚',
      };
      onAddConfig(newConfig);
    }
    setIsModalOpen(false);
  };

  // 格式调试测试
  const handleOpenDebug = (c: LogSourceConfigItem) => {
    setDebuggingConfig(c);
    setDebugError('');
    setParsedResult(null);

    if (c.logFormat === 'JSON') {
      setSampleLogInput(
        JSON.stringify(
          {
            timestamp: new Date().toISOString(),
            level: 'INFO',
            traceId: 'tr-sample-998822',
            httpStatus: 200,
            durationMs: 38,
            message: 'User authentication succeeded for UID 10822',
          },
          null,
          2
        )
      );
    } else {
      setSampleLogInput(
        `2026-09-09 23:20:15 [WARN] [gateway-nginx] Client timeout on /api/v2/checkout after 3000ms`
      );
    }
    setDebugModalOpen(true);
  };

  const handleRunDebugParse = () => {
    if (!debuggingConfig) return;
    setDebugError('');
    setParsedResult(null);

    try {
      if (debuggingConfig.logFormat === 'JSON') {
        const json = JSON.parse(sampleLogInput.trim());
        setParsedResult({
          success: true,
          mode: 'JSON格式结构化解析',
          extractedFields: json,
          fieldCount: Object.keys(json).length,
        });
      } else {
        // REGEX 正则字段提取模拟
        setParsedResult({
          success: true,
          mode: '正则表达式命名捕获组解析',
          extractedFields: {
            timestamp: '2026-09-09 23:20:15',
            level: 'WARN',
            module: 'gateway-nginx',
            message: 'Client timeout on /api/v2/checkout after 3000ms',
            matchedGroups: 4,
          },
        });
      }
    } catch (err: any) {
      setDebugError(`格式解析错误: ${err.message}`);
    }
  };

  return (
    <div className="p-6 space-y-5">
      {/* 标题说明 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-blue-600 font-mono mb-1">
            3.4 上报管理 &gt; 3.4.3 日志源管理 &gt; 3.4.3.3 日志配置
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-600" />
            <span>日志配置</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            下发 Agent 采集规则、通配符日志路径匹配、单行/多行合并与格式调试测试
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>新建日志采集配置</span>
        </button>
      </div>

      {/* 搜索与过滤栏 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="搜索配置名称、日志路径通配符或服务模块..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">日志格式:</span>
          <select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">全部格式</option>
            <option value="JSON">JSON 格式化</option>
            <option value="REGEX">REGEX 正则提取</option>
            <option value="TEXT">TEXT 单行纯文本</option>
            <option value="DELIMITER">DELIMITER 分隔符</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">状态:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">全部状态</option>
            <option value="ACTIVE">采集中 (ACTIVE)</option>
            <option value="PAUSED">已挂起 (PAUSED)</option>
          </select>
        </div>

        <button
          onClick={() => {
            setSearchKeyword('');
            setFormatFilter('ALL');
            setStatusFilter('ALL');
          }}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>重置</span>
        </button>
      </div>

      {/* 日志源配置列表表格 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">配置规则标识</th>
                <th className="py-3 px-4">归属应用与模块</th>
                <th className="py-3 px-4">日志采集通配路径</th>
                <th className="py-3 px-4">解析格式与策略</th>
                <th className="py-3 px-4">状态</th>
                <th className="py-3 px-4">最后更新</th>
                <th className="py-3 px-4 text-center">调试与操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredConfigs.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{c.configName}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{c.id}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{c.moduleCode}</div>
                    <div className="text-[10px] text-slate-400">{c.appCode}</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px] max-w-xs truncate" title={c.filePathPattern}>
                    {c.filePathPattern}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.logFormat === 'JSON'
                          ? 'bg-blue-100 text-blue-800'
                          : c.logFormat === 'REGEX'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {c.logFormat}
                    </span>
                    <span className="text-[11px] text-slate-500 ml-2">
                      {c.collectStrategy === 'MULTILINE' ? '多行合并提取' : '按行实时解析'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {c.status === 'ACTIVE' ? (
                      <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        正常采集中
                      </span>
                    ) : (
                      <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        已挂起
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {c.updatedAt}
                  </td>

                  {/* 格式调试测试、增删改操作 */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* 格式调试测试 */}
                      <button
                        onClick={() => handleOpenDebug(c)}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 border border-indigo-200 rounded text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
                        title="在线格式调试测试"
                      >
                        <Play className="w-3 h-3" />
                        <span>格式调试</span>
                      </button>

                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                        title="修改配置"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`确定要删除配置 ${c.configName} 吗？`)) {
                            onDeleteConfig(c.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                        title="删除配置"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>当前生效 {filteredConfigs.length} 条日志采集源规格</span>
          <span>下发延迟 &lt; 5s，修改后探针自动热重载</span>
        </div>
      </div>

      {/* 模态框 1：增删改配置 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  {editingConfig ? '修改日志采集配置' : '新建日志源配置'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">配置名称:</label>
                <input
                  type="text"
                  required
                  value={formData.configName}
                  onChange={(e) => setFormData({ ...formData, configName: e.target.value })}
                  placeholder="如: 用户中心生产日志采集"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">归属应用:</label>
                  <select
                    value={formData.appCode}
                    onChange={(e) => setFormData({ ...formData, appCode: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700"
                  >
                    {availableApps.map((a) => (
                      <option key={a.id} value={a.appCode}>
                        {a.appName} ({a.appCode})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">所属服务模块:</label>
                  <select
                    value={formData.moduleCode}
                    onChange={(e) => setFormData({ ...formData, moduleCode: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-mono"
                  >
                    {availableModules.map((m) => (
                      <option key={m.id} value={m.moduleCode}>
                        {m.moduleName} ({m.moduleCode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  日志文件物理路径通配符 (支持 Glob):
                </label>
                <input
                  type="text"
                  required
                  value={formData.filePathPattern}
                  onChange={(e) => setFormData({ ...formData, filePathPattern: e.target.value })}
                  placeholder="/var/log/app/user-auth/*.log"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">日志数据格式:</label>
                  <select
                    value={formData.logFormat}
                    onChange={(e) =>
                      setFormData({ ...formData, logFormat: e.target.value as any })
                    }
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700"
                  >
                    <option value="JSON">JSON 格式化提取</option>
                    <option value="REGEX">REGEX 正则表达式捕获</option>
                    <option value="TEXT">TEXT 单行纯文本</option>
                    <option value="DELIMITER">DELIMITER 符号分割</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">采集与切分策略:</label>
                  <select
                    value={formData.collectStrategy}
                    onChange={(e) =>
                      setFormData({ ...formData, collectStrategy: e.target.value as any })
                    }
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700"
                  >
                    <option value="SINGLE_LINE">按行实时流式采集 (Single Line)</option>
                    <option value="MULTILINE">多行合并 (堆栈 StackTrace)</option>
                    <option value="REGEX_EXTRACT">正则实时流式提取字段</option>
                  </select>
                </div>
              </div>

              {formData.collectStrategy === 'MULTILINE' && (
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    多行合并首行匹配正则 (Multiline Head Pattern):
                  </label>
                  <input
                    type="text"
                    value={formData.multilinePattern}
                    onChange={(e) => setFormData({ ...formData, multilinePattern: e.target.value })}
                    placeholder="例如: ^\d{4}-\d{2}-\d{2}"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              )}

              {formData.logFormat === 'REGEX' && (
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    字段命名捕获组正则表达式 (Field Extract Regex):
                  </label>
                  <input
                    type="text"
                    value={formData.fieldExtractRegex}
                    onChange={(e) =>
                      setFormData({ ...formData, fieldExtractRegex: e.target.value })
                    }
                    placeholder="(?<timestamp>\S+) \[(?<level>\w+)\] (?<message>.*)"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-[11px]"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-sm cursor-pointer"
                >
                  保存采集配置
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 模态框 2：格式调试测试 */}
      {debugModalOpen && debuggingConfig && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  日志格式调试测试 · {debuggingConfig.configName} ({debuggingConfig.logFormat})
                </h3>
              </div>
              <button
                onClick={() => setDebugModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-slate-600 font-medium mb-1">
                  <span>输入待调试的单行 / 多行样本日志：</span>
                  <span className="text-slate-400">格式: {debuggingConfig.logFormat}</span>
                </div>
                <textarea
                  rows={5}
                  value={sampleLogInput}
                  onChange={(e) => setSampleLogInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg border border-slate-800"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleRunDebugParse}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>执行格式调试与解析</span>
                </button>
              </div>

              {debugError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{debugError}</span>
                </div>
              )}

              {parsedResult && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>解析校验成功！已提取出结构化字段：</span>
                  </div>
                  <pre className="p-3 bg-slate-950 text-cyan-400 rounded-lg font-mono text-[11px] overflow-x-auto max-h-48">
                    {JSON.stringify(parsedResult.extractedFields, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <button
                onClick={() => setDebugModalOpen(false)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
              >
                完成关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
