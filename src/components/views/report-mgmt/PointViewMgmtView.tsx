import React, { useState } from 'react';
import {
  LayoutGrid,
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  RefreshCw,
  X,
  Server,
  Activity,
  Calendar,
  User,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  LineChart,
  PieChart,
} from 'lucide-react';
import { PointViewItem, MonitorPointItem } from '../../../types';

interface PointViewMgmtViewProps {
  views: PointViewItem[];
  availablePoints: MonitorPointItem[];
  onAddView: (view: PointViewItem) => void;
  onUpdateView: (view: PointViewItem) => void;
  onDeleteView: (id: string) => void;
}

export const PointViewMgmtView: React.FC<PointViewMgmtViewProps> = ({
  views,
  availablePoints,
  onAddView,
  onUpdateView,
  onDeleteView,
}) => {
  // 精准搜索状态：用户可通过输入视图ID或关键字，快速精准搜索对应的监控点视图
  const [searchViewId, setSearchViewId] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 弹窗状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingView, setEditingView] = useState<PointViewItem | null>(null);
  const [previewView, setPreviewView] = useState<PointViewItem | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    viewId: '',
    viewName: '',
    boundMachine: '',
    description: '',
    creator: 'admin (超级管理员)',
    pointIds: [] as string[],
    chartType: 'LINE' as PointViewItem['chartType'],
    refreshIntervalSeconds: 30,
  });

  // 搜索过滤逻辑
  const filteredViews = views.filter((v) => {
    const vid = (v.viewId || v.viewCode || v.id).toLowerCase();
    const vname = (v.viewName || '').toLowerCase();
    const vdesc = (v.description || '').toLowerCase();
    const vmachine = (v.boundMachine || (v.boundMachines ? v.boundMachines.join(', ') : '')).toLowerCase();

    const matchId = !searchViewId.trim() || vid.includes(searchViewId.trim().toLowerCase());
    const matchKeyword =
      !searchKeyword.trim() ||
      vname.includes(searchKeyword.trim().toLowerCase()) ||
      vdesc.includes(searchKeyword.trim().toLowerCase()) ||
      vmachine.includes(searchKeyword.trim().toLowerCase());

    return matchId && matchKeyword;
  });

  const handleOpenAdd = () => {
    setEditingView(null);
    setFormData({
      viewId: `VIEW-${Math.floor(100 + Math.random() * 900)}`,
      viewName: '',
      boundMachine: '10.24.12.88, 10.24.12.89',
      description: '',
      creator: 'admin (超级管理员)',
      pointIds: availablePoints.slice(0, 3).map((p) => p.pointId || p.pointCode || p.id),
      chartType: 'LINE',
      refreshIntervalSeconds: 30,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: PointViewItem) => {
    setEditingView(v);
    setFormData({
      viewId: v.viewId || v.viewCode || v.id,
      viewName: v.viewName,
      boundMachine: v.boundMachine || (v.boundMachines ? v.boundMachines.join(', ') : ''),
      description: v.description,
      creator: v.creator || 'admin',
      pointIds: v.pointIds || v.points || [],
      chartType: v.chartType || 'LINE',
      refreshIntervalSeconds: v.refreshIntervalSeconds || 30,
    });
    setIsModalOpen(true);
  };

  const handleTogglePoint = (pointId: string) => {
    setFormData((prev) => {
      const exists = prev.pointIds.includes(pointId);
      return {
        ...prev,
        pointIds: exists ? prev.pointIds.filter((id) => id !== pointId) : [...prev.pointIds, pointId],
      };
    });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.viewId.trim() || !formData.viewName.trim()) {
      alert('请完整填写视图ID与视图名称！');
      return;
    }

    if (editingView) {
      onUpdateView({
        ...editingView,
        viewId: formData.viewId.trim(),
        viewCode: formData.viewId.trim(),
        viewName: formData.viewName.trim(),
        boundMachine: formData.boundMachine.trim(),
        boundMachines: formData.boundMachine.split(',').map((s) => s.trim()).filter(Boolean),
        description: formData.description.trim(),
        pointIds: formData.pointIds,
        points: formData.pointIds,
        pointCount: formData.pointIds.length,
        chartType: formData.chartType,
        refreshIntervalSeconds: formData.refreshIntervalSeconds,
      });
    } else {
      const nowStr = new Date().toISOString().slice(0, 16).replace('T', ' ');
      const newView: PointViewItem = {
        id: `PV-${Date.now().toString().slice(-4)}`,
        viewId: formData.viewId.trim(),
        viewCode: formData.viewId.trim(),
        viewName: formData.viewName.trim(),
        boundMachine: formData.boundMachine.trim() || '未指定机器',
        boundMachines: formData.boundMachine.split(',').map((s) => s.trim()).filter(Boolean),
        description: formData.description.trim(),
        creator: formData.creator || 'admin (超级管理员)',
        createdTime: nowStr,
        pointIds: formData.pointIds,
        points: formData.pointIds,
        pointCount: formData.pointIds.length,
        chartType: formData.chartType,
        refreshIntervalSeconds: formData.refreshIntervalSeconds,
        updatedTime: nowStr,
        updatedAt: nowStr,
      };
      onAddView(newView);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-4">
      {/* 头部标题与模块说明 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold text-blue-600 font-mono mb-0.5">
            上报管理 &gt; 监控点管理 &gt; 监控点视图管理
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-blue-600" />
            <span>监控点视图管理</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            该模块支持查看监控点视图，并允许进行添加、删除和修改操作。用户可通过输入视图ID或关键字，快速精准搜索对应的监控点视图。视图内容以列表形式展示，包含视图ID、名称、绑定机器、描述、添加者及添加时间等信息，便于用户管理和查看。
          </p>
        </div>

        {/* 顶部操作栏 */}
        <div>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>添加监控点视图</span>
          </button>
        </div>
      </div>

      {/* 精准搜索过滤栏 */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3 text-xs">
        {/* 输入视图ID精准搜索 */}
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <span className="text-slate-600 font-medium whitespace-nowrap">视图ID:</span>
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="输入视图ID精准搜索 (如 VIEW-CORE-AUTH)..."
              value={searchViewId}
              onChange={(e) => setSearchViewId(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>

        {/* 输入关键字精准搜索 */}
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <span className="text-slate-600 font-medium whitespace-nowrap">关键字:</span>
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="输入名称/描述/绑定机器IP关键字..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <button
          onClick={() => {
            setSearchViewId('');
            setSearchKeyword('');
          }}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>重置</span>
        </button>
      </div>

      {/* 视图内容以列表形式展示 (Table) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3.5 whitespace-nowrap">视图ID</th>
                <th className="py-3 px-3.5 whitespace-nowrap">名称</th>
                <th className="py-3 px-3.5 whitespace-nowrap">绑定机器</th>
                <th className="py-3 px-3.5 min-w-[200px]">描述</th>
                <th className="py-3 px-3.5 whitespace-nowrap">添加者</th>
                <th className="py-3 px-3.5 whitespace-nowrap">添加时间</th>
                <th className="py-3 px-3.5 whitespace-nowrap text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredViews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                    未找到符合条件的监控点视图
                  </td>
                </tr>
              ) : (
                filteredViews.map((v) => {
                  const vid = v.viewId || v.viewCode || v.id;
                  const boundMachineStr = v.boundMachine || (v.boundMachines ? v.boundMachines.join(', ') : '未指定机器');
                  const creatorStr = v.creator || 'admin';
                  const createdTimeStr = v.createdTime || v.updatedTime || '2026-09-08 16:30';

                  return (
                    <tr key={v.id || vid} className="hover:bg-slate-50/80 transition-colors">
                      {/* 1. 视图ID */}
                      <td className="py-3 px-3.5 font-mono font-bold text-blue-700 whitespace-nowrap">
                        <span className="bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {vid}
                        </span>
                      </td>

                      {/* 2. 名称 */}
                      <td className="py-3 px-3.5 font-medium text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <LayoutGrid className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{v.viewName}</span>
                        </div>
                      </td>

                      {/* 3. 绑定机器 */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-700 font-mono">
                          <Server className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[200px]" title={boundMachineStr}>
                            {boundMachineStr}
                          </span>
                        </div>
                      </td>

                      {/* 4. 描述 */}
                      <td className="py-3 px-3.5 text-slate-500 max-w-sm truncate" title={v.description}>
                        {v.description || '无描述说明'}
                      </td>

                      {/* 5. 添加者 */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-slate-700">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{creatorStr}</span>
                        </span>
                      </td>

                      {/* 6. 添加时间 */}
                      <td className="py-3 px-3.5 font-mono text-slate-500 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{createdTimeStr}</span>
                        </span>
                      </td>

                      {/* 7. 操作 (查看/修改/删除) */}
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setPreviewView(v)}
                            className="px-2 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded font-medium text-[11px] inline-flex items-center gap-1 cursor-pointer"
                            title="预览视图大盘"
                          >
                            <Eye className="w-3 h-3" />
                            <span>查看</span>
                          </button>

                          <button
                            onClick={() => handleOpenEdit(v)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                            title="修改视图"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`确认删除监控点视图【${v.viewName} (${vid})】吗？`)) {
                                onDeleteView(v.id || vid);
                              }
                            }}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="删除视图"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 底部条目统计 */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>共找到 {filteredViews.length} 个监控点视图</span>
          <span className="font-mono text-[11px]">列表已按规范呈现：视图ID、名称、绑定机器、描述、添加者、添加时间</span>
        </div>
      </div>

      {/* 视图大盘预览弹窗 */}
      {previewView && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{previewView.viewName}</h3>
                  <p className="text-[11px] font-mono text-slate-400">
                    视图ID: {previewView.viewId || previewView.viewCode} | 绑定机器: {previewView.boundMachine || '10.24.12.88'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewView(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              {previewView.description || '无具体说明'}
            </p>

            {/* 模拟绑定的监控指标走势 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {(previewView.pointIds || ['PT-CPU-001', 'PT-MEM-003']).map((pid, idx) => {
                const pt = availablePoints.find((p) => (p.pointId || p.pointCode || p.id) === pid);
                return (
                  <div key={pid} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        {pt ? pt.pointName : `监控指标项 ${pid}`}
                      </span>
                      <span className="font-mono text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                        {pid}
                      </span>
                    </div>

                    <div className="h-20 flex items-end gap-1.5 pt-4 px-2 bg-white rounded-lg border border-slate-100">
                      {[32, 45, 60, 48, 72, 85, 68, 54, 76, 62, 58, 80].map((val, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 rounded-t transition-all"
                          style={{ height: `${val}%` }}
                          title={`采样点 ${i + 1}: ${val}%`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>实时采集周期: 10s</span>
                      <span className="text-slate-600 font-mono font-medium">当前值: 80%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setPreviewView(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
              >
                关闭预览
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 添加 / 修改视图模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-blue-600" />
                <span>{editingView ? '修改监控点视图' : '添加监控点视图'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    视图ID: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.viewId}
                    onChange={(e) => setFormData({ ...formData, viewId: e.target.value })}
                    placeholder="如 VIEW-CORE-AUTH"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    视图名称: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.viewName}
                    onChange={(e) => setFormData({ ...formData, viewName: e.target.value })}
                    placeholder="如 用户认证集群全景大屏"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">绑定机器 (IP或主机名):</label>
                <input
                  type="text"
                  value={formData.boundMachine}
                  onChange={(e) => setFormData({ ...formData, boundMachine: e.target.value })}
                  placeholder="例如: 10.24.12.88, 10.24.12.89 (多台逗号分隔)"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">视图描述说明:</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="说明该监控点视图的监控链路与展示目的..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">关联监控点 (多选):</label>
                <div className="max-h-32 overflow-y-auto bg-slate-50 p-2 rounded-lg border border-slate-200 divide-y divide-slate-100">
                  {availablePoints.map((p) => {
                    const pid = p.pointId || p.pointCode || p.id;
                    const isChecked = formData.pointIds.includes(pid);
                    return (
                      <label key={pid} className="flex items-center justify-between py-1.5 px-1 cursor-pointer hover:bg-slate-100 rounded">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleTogglePoint(pid)}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="font-mono text-slate-700">{pid}</span>
                          <span className="text-slate-800">{p.pointName}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{p.typeCode}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-sm cursor-pointer"
                >
                  保存视图
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
