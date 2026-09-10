import React, { useState } from 'react';
import {
  Layers,
  Search,
  Plus,
  Trash2,
  Edit,
  Filter,
  RefreshCw,
  X,
  Server,
  Code2,
} from 'lucide-react';
import { ModuleItem, AppItem } from '../../../types';

interface ModuleMgmtViewProps {
  modules: ModuleItem[];
  availableApps: AppItem[];
  onAddModule: (mod: ModuleItem) => void;
  onUpdateModule: (mod: ModuleItem) => void;
  onDeleteModule: (id: string) => void;
}

export const ModuleMgmtView: React.FC<ModuleMgmtViewProps> = ({
  modules,
  availableApps,
  onAddModule,
  onUpdateModule,
  onDeleteModule,
}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedAppFilter, setSelectedAppFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuleItem | null>(null);

  const [formData, setFormData] = useState({
    moduleCode: '',
    moduleName: '',
    appCode: availableApps[0]?.appCode || 'mall-app',
    appName: availableApps[0]?.appName || '商城业务中心',
    lang: 'Go 1.22' as ModuleItem['lang'],
    description: '',
    status: 'ACTIVE' as ModuleItem['status'],
  });

  const filteredModules = modules.filter((m) => {
    const matchKeyword =
      !searchKeyword ||
      m.moduleCode.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      m.moduleName.toLowerCase().includes(searchKeyword.toLowerCase());

    const matchApp = selectedAppFilter === 'ALL' || m.appCode === selectedAppFilter;

    return matchKeyword && matchApp;
  });

  const handleOpenAdd = () => {
    setEditingModule(null);
    setFormData({
      moduleCode: `srv-mod-${Math.floor(100 + Math.random() * 900)}`,
      moduleName: '',
      appCode: availableApps[0]?.appCode || 'mall-app',
      appName: availableApps[0]?.appName || '商城业务中心',
      lang: 'Go 1.22',
      description: '',
      status: 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: ModuleItem) => {
    setEditingModule(m);
    setFormData({
      moduleCode: m.moduleCode,
      moduleName: m.moduleName,
      appCode: m.appCode,
      appName: m.appName,
      lang: m.lang,
      description: m.description,
      status: m.status,
    });
    setIsModalOpen(true);
  };

  const handleAppChange = (appCode: string) => {
    const app = availableApps.find((a) => a.appCode === appCode);
    setFormData({
      ...formData,
      appCode,
      appName: app?.appName || appCode,
    });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.moduleCode || !formData.moduleName) return;

    if (editingModule) {
      onUpdateModule({
        ...editingModule,
        moduleCode: formData.moduleCode,
        moduleName: formData.moduleName,
        appCode: formData.appCode,
        appName: formData.appName,
        lang: formData.lang,
        description: formData.description,
        status: formData.status,
      });
    } else {
      const newModule: ModuleItem = {
        id: `MOD-${Date.now().toString().slice(-4)}`,
        moduleCode: formData.moduleCode,
        moduleName: formData.moduleName,
        appCode: formData.appCode,
        appName: formData.appName,
        lang: formData.lang,
        hostCount: 2,
        description: formData.description,
        status: formData.status,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      onAddModule(newModule);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-5">
      {/* 标题说明 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-blue-600 font-mono mb-1">
            3.4 上报管理 &gt; 3.4.3 日志源管理 &gt; 3.4.3.2 模块管理
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-600" />
            <span>模块管理</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            管理各业务应用下属的微服务组件模块、技术栈分类与容器节点部署概况
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>添加服务模块</span>
        </button>
      </div>

      {/* 搜索与所属应用筛选 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="搜索模块标识、模块名称..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* 所属应用筛选 */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">所属应用筛选:</span>
          <select
            value={selectedAppFilter}
            onChange={(e) => setSelectedAppFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">全部所属应用</option>
            {availableApps.map((a) => (
              <option key={a.id} value={a.appCode}>
                {a.appName} ({a.appCode})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            setSearchKeyword('');
            setSelectedAppFilter('ALL');
          }}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>重置</span>
        </button>
      </div>

      {/* 模块列表表格 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">模块标识 (Module Code)</th>
                <th className="py-3 px-4">模块业务名称</th>
                <th className="py-3 px-4">归属应用 (App)</th>
                <th className="py-3 px-4">开发语言 / 运行时</th>
                <th className="py-3 px-4">部署节点数</th>
                <th className="py-3 px-4">创建时间</th>
                <th className="py-3 px-4">状态</th>
                <th className="py-3 px-4 text-center">增删改操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredModules.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                    {m.moduleCode}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800">{m.moduleName}</span>
                    <div className="text-[11px] text-slate-400 mt-0.5">{m.description}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-slate-800 font-medium">{m.appName}</span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {m.appCode}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] font-medium">
                      {m.lang}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-800 font-bold">
                    {m.hostCount} 节点
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {m.createdAt}
                  </td>

                  <td className="py-3.5 px-4">
                    {m.status === 'ACTIVE' ? (
                      <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        ACTIVE 正常
                      </span>
                    ) : (
                      <span className="text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        DISABLED
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(m)}
                        className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                        title="修改模块配置"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`确定要删除服务模块 ${m.moduleName} (${m.moduleCode}) 吗？`)) {
                            onDeleteModule(m.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                        title="删除模块"
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
          <span>共管理 {filteredModules.length} 个服务模块单元</span>
          <span>与服务发现 Registry 实时保持心跳同步</span>
        </div>
      </div>

      {/* 模态框：添加 / 编辑模块 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  {editingModule ? '修改服务模块' : '添加新服务模块'}
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">模块标识 (Code):</label>
                  <input
                    type="text"
                    required
                    value={formData.moduleCode}
                    onChange={(e) => setFormData({ ...formData, moduleCode: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">模块业务名称:</label>
                  <input
                    type="text"
                    required
                    value={formData.moduleName}
                    onChange={(e) => setFormData({ ...formData, moduleName: e.target.value })}
                    placeholder="如: 用户认证服务"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">所属应用:</label>
                  <select
                    value={formData.appCode}
                    onChange={(e) => handleAppChange(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500"
                  >
                    {availableApps.map((a) => (
                      <option key={a.id} value={a.appCode}>
                        {a.appName} ({a.appCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">技术栈 / 运行时:</label>
                  <select
                    value={formData.lang}
                    onChange={(e) => setFormData({ ...formData, lang: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700"
                  >
                    <option value="Go 1.22">Go 1.22 (高并发微服务)</option>
                    <option value="Java 21 / SpringBoot">Java 21 / SpringBoot (业务系统)</option>
                    <option value="Node.js 20 / NestJS">Node.js 20 / NestJS (BFF网关)</option>
                    <option value="Python 3.11 / FastAPI">Python 3.11 / FastAPI (计算算法)</option>
                    <option value="Nginx / C">Nginx / C (反向代理)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">模块职责说明:</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="说明该模块的核心微服务边界与对外暴露契约..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

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
                  保存模块
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
