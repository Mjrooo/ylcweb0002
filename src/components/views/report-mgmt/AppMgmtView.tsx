import React, { useState } from 'react';
import {
  Boxes,
  Search,
  Plus,
  Trash2,
  Edit,
  Layers,
  CheckCircle2,
  RefreshCw,
  X,
  Globe,
  Clock,
} from 'lucide-react';
import { AppItem } from '../../../types';

interface AppMgmtViewProps {
  apps: AppItem[];
  onAddApp: (app: AppItem) => void;
  onUpdateApp: (app: AppItem) => void;
  onDeleteApp: (id: string) => void;
}

export const AppMgmtView: React.FC<AppMgmtViewProps> = ({
  apps,
  onAddApp,
  onUpdateApp,
  onDeleteApp,
}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppItem | null>(null);

  const [formData, setFormData] = useState({
    appCode: '',
    appName: '',
    owner: '',
    domain: '',
    description: '',
    status: 'ACTIVE' as AppItem['status'],
  });

  const filteredApps = apps.filter((a) => {
    const matchKeyword =
      !searchKeyword ||
      a.appCode.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      a.appName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      a.owner.toLowerCase().includes(searchKeyword.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;

    return matchKeyword && matchStatus;
  });

  const handleOpenAdd = () => {
    setEditingApp(null);
    setFormData({
      appCode: `app-${Math.floor(100 + Math.random() * 900)}`,
      appName: '',
      owner: '运维技术部-DevOps组',
      domain: '电商支付中心',
      description: '',
      status: 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (app: AppItem) => {
    setEditingApp(app);
    setFormData({
      appCode: app.appCode,
      appName: app.appName,
      owner: app.owner,
      domain: app.domain,
      description: app.description,
      status: app.status,
    });
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.appCode || !formData.appName) return;

    if (editingApp) {
      onUpdateApp({
        ...editingApp,
        appCode: formData.appCode,
        appName: formData.appName,
        owner: formData.owner,
        domain: formData.domain,
        description: formData.description,
        status: formData.status,
      });
    } else {
      const newApp: AppItem = {
        id: `APP-${Date.now().toString().slice(-4)}`,
        appCode: formData.appCode,
        appName: formData.appName,
        owner: formData.owner,
        domain: formData.domain,
        description: formData.description,
        status: formData.status,
        moduleCount: 0,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      onAddApp(newApp);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-5">
      {/* 标题说明 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-blue-600 font-mono mb-1">
            3.4 上报管理 &gt; 3.4.3 日志源管理 &gt; 3.4.3.1 应用管理
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-indigo-600" />
            <span>应用管理</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            维护全局系统应用资产目录，支持按ID与名称检索、应用归属团队分配及基础增删改
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>新建应用</span>
        </button>
      </div>

      {/* 搜索与状态过滤 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="搜索应用ID、应用名称或负责人..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">状态:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">全部状态</option>
            <option value="ACTIVE">正常在线 (ACTIVE)</option>
            <option value="ARCHIVED">归档冻结 (ARCHIVED)</option>
          </select>
        </div>

        <button
          onClick={() => {
            setSearchKeyword('');
            setStatusFilter('ALL');
          }}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>重置</span>
        </button>
      </div>

      {/* 应用表格 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">应用标识 (App Code)</th>
                <th className="py-3 px-4">应用全称</th>
                <th className="py-3 px-4">业务域</th>
                <th className="py-3 px-4">负责技术团队</th>
                <th className="py-3 px-4">关联微服务模块</th>
                <th className="py-3 px-4">创建日期</th>
                <th className="py-3 px-4">运行状态</th>
                <th className="py-3 px-4 text-center">增删改操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                    {a.appCode}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{a.appName}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{a.description}</div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {a.domain}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">
                    {a.owner}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {a.moduleCount} 个模块
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {a.createdAt}
                  </td>

                  <td className="py-3.5 px-4">
                    {a.status === 'ACTIVE' ? (
                      <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        ACTIVE 正常
                      </span>
                    ) : (
                      <span className="text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        ARCHIVED
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(a)}
                        className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                        title="修改应用信息"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`确定要删除应用 ${a.appName} (${a.appCode}) 吗？`)) {
                            onDeleteApp(a.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                        title="删除应用"
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
          <span>当前注册管理 {filteredApps.length} 个应用系统</span>
          <span>统一纳管于公司微服务服务治理平台体系</span>
        </div>
      </div>

      {/* 模态框：添加 / 编辑应用 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  {editingApp ? '修改应用资产' : '注册新建应用'}
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
                  <label className="block text-slate-600 font-medium mb-1">应用标识 (App Code):</label>
                  <input
                    type="text"
                    required
                    value={formData.appCode}
                    onChange={(e) => setFormData({ ...formData, appCode: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">应用全称 (App Name):</label>
                  <input
                    type="text"
                    required
                    value={formData.appName}
                    onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
                    placeholder="如: 商城业务中心"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">所属业务域:</label>
                  <input
                    type="text"
                    required
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">负责人 / 技术团队:</label>
                  <input
                    type="text"
                    required
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">应用描述与业务边界:</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="说明此应用的核心功能以及上下游依赖关系..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">运行状态:</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700"
                >
                  <option value="ACTIVE">ACTIVE 正常接入</option>
                  <option value="ARCHIVED">ARCHIVED 归档停用</option>
                </select>
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
                  保存应用
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
