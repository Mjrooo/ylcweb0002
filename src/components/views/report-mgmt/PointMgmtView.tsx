import React, { useState } from 'react';
import {
  Activity,
  Search,
  Plus,
  UploadCloud,
  Trash2,
  Edit,
  Eye,
  RefreshCw,
  X,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  LineChart,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { MonitorPointItem, PointTypeItem } from '../../../types';

interface PointMgmtViewProps {
  points: MonitorPointItem[];
  types: PointTypeItem[];
  onAddPoint: (point: MonitorPointItem) => void;
  onUpdatePoint: (point: MonitorPointItem) => void;
  onDeletePoint: (id: string) => void;
  onBatchImport: (points: MonitorPointItem[]) => void;
}

export const PointMgmtView: React.FC<PointMgmtViewProps> = ({
  points,
  types,
  onAddPoint,
  onUpdatePoint,
  onDeletePoint,
  onBatchImport,
}) => {
  // 精准搜索状态：支持通过输入监控点类型或监控点ID进行精准搜索
  const [searchPointId, setSearchPointId] = useState('');
  const [searchTypeCode, setSearchTypeCode] = useState('');

  // 弹窗状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPoint, setEditingPoint] = useState<MonitorPointItem | null>(null);
  const [detailPoint, setDetailPoint] = useState<MonitorPointItem | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    pointId: '',
    pointName: '',
    typeCode: types[0]?.typeCode || 'CPU_USAGE',
    typeName: types[0]?.typeName || 'CPU使用率监控',
    period: '60s',
    dataType: '瞬时值 (GAUGE)',
    valueType: '百分比 (%)',
    chartType: '折线图 (Line)',
    description: '',
    app: '商城业务中心 (mall-app)',
    module: 'user-auth-service',
    status: 'ENABLED' as 'ENABLED' | 'DISABLED',
  });

  // 过滤逻辑：支持通过输入监控点类型或监控点ID进行精准搜索
  const filteredPoints = points.filter((p) => {
    const pid = (p.pointId || p.pointCode || p.id).toLowerCase();
    const tcode = (p.typeCode || '').toLowerCase();
    const tname = (p.typeName || '').toLowerCase();

    const matchId = !searchPointId.trim() || pid.includes(searchPointId.trim().toLowerCase());
    const matchType =
      !searchTypeCode.trim() ||
      tcode.includes(searchTypeCode.trim().toLowerCase()) ||
      tname.includes(searchTypeCode.trim().toLowerCase());

    return matchId && matchType;
  });

  const handleOpenAdd = () => {
    setEditingPoint(null);
    const defaultType = types[0] || { typeCode: 'CPU_USAGE', typeName: 'CPU使用率监控' };
    setFormData({
      pointId: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
      pointName: '',
      typeCode: defaultType.typeCode,
      typeName: defaultType.typeName,
      period: '60s',
      dataType: '瞬时值 (GAUGE)',
      valueType: '百分比 (%)',
      chartType: '折线图 (Line)',
      description: '',
      app: '商城业务中心 (mall-app)',
      module: 'user-auth-service',
      status: 'ENABLED',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: MonitorPointItem) => {
    setEditingPoint(p);
    setFormData({
      pointId: p.pointId || p.pointCode || p.id,
      pointName: p.pointName,
      typeCode: p.typeCode,
      typeName: p.typeName,
      period: p.period || `${p.intervalSec || 60}s`,
      dataType: p.dataType || '瞬时值 (GAUGE)',
      valueType: p.valueType || '百分比 (%)',
      chartType: p.chartType || '折线图 (Line)',
      description: p.description || '',
      app: p.app || p.targetApp || '商城业务中心 (mall-app)',
      module: p.module || p.targetModule || 'user-auth-service',
      status: p.status === 'DISABLED' ? 'DISABLED' : 'ENABLED',
    });
    setIsModalOpen(true);
  };

  const handleTypeChange = (selectedCode: string) => {
    const found = types.find((t) => t.typeCode === selectedCode);
    setFormData({
      ...formData,
      typeCode: selectedCode,
      typeName: found ? found.typeName : selectedCode,
    });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pointId.trim() || !formData.pointName.trim()) {
      alert('请填写完整的监控点ID与监控点名称！');
      return;
    }

    if (editingPoint) {
      onUpdatePoint({
        ...editingPoint,
        pointId: formData.pointId.trim(),
        pointCode: formData.pointId.trim(),
        pointName: formData.pointName.trim(),
        typeCode: formData.typeCode,
        typeName: formData.typeName,
        period: formData.period,
        intervalSec: parseInt(formData.period) || 60,
        dataType: formData.dataType,
        valueType: formData.valueType,
        chartType: formData.chartType,
        description: formData.description.trim(),
        app: formData.app,
        targetApp: formData.app,
        module: formData.module,
        targetModule: formData.module,
        status: formData.status,
      });
    } else {
      const newPoint: MonitorPointItem = {
        id: `MP-${Date.now().toString().slice(-4)}`,
        pointId: formData.pointId.trim(),
        pointCode: formData.pointId.trim(),
        pointName: formData.pointName.trim(),
        typeCode: formData.typeCode,
        typeName: formData.typeName,
        period: formData.period,
        intervalSec: parseInt(formData.period) || 60,
        dataType: formData.dataType,
        valueType: formData.valueType,
        chartType: formData.chartType,
        description: formData.description.trim(),
        app: formData.app,
        targetApp: formData.app,
        module: formData.module,
        targetModule: formData.module,
        status: formData.status,
        createdTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
        creator: '当前用户',
        latestValue: 0,
      };
      onAddPoint(newPoint);
    }
    setIsModalOpen(false);
  };

  // 批量导入处理
  const handleBatchImportSubmit = () => {
    setImportError(null);
    setImportSuccessMsg(null);
    try {
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('导入内容必须为包含监控点对象的非空 JSON 数组！');
      }

      const importedList: MonitorPointItem[] = parsed.map((item, idx) => ({
        id: `IMP-${Date.now()}-${idx}`,
        pointId: item.pointId || item.pointCode || `PT-${Math.floor(2000 + Math.random() * 8000)}`,
        pointCode: item.pointId || item.pointCode || `PT-${Math.floor(2000 + Math.random() * 8000)}`,
        pointName: item.pointName || `批量导入监控点-${idx + 1}`,
        typeCode: item.typeCode || 'CPU_USAGE',
        typeName: item.typeName || 'CPU使用率监控',
        period: item.period || '60s',
        intervalSec: parseInt(item.period) || 60,
        dataType: item.dataType || '瞬时值 (GAUGE)',
        valueType: item.valueType || '百分比 (%)',
        chartType: item.chartType || '折线图 (Line)',
        description: item.description || '批量导入的监控指标项',
        app: item.app || '商城业务中心',
        targetApp: item.app || '商城业务中心',
        module: item.module || 'user-auth-service',
        targetModule: item.module || 'user-auth-service',
        status: item.status || 'ENABLED',
        createdTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
        creator: '批量导入',
      }));

      onBatchImport(importedList);
      setImportSuccessMsg(`成功批量导入 ${importedList.length} 个监控点数据！`);
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportSuccessMsg(null);
        setImportText('');
      }, 1200);
    } catch (err: any) {
      setImportError(err.message || 'JSON 解析失败，请检查数据格式是否正确');
    }
  };

  const handleLoadSampleImport = () => {
    const sample = [
      {
        pointId: 'PT-NET-BYTES-IN',
        pointName: '网卡入流量突增监控',
        typeCode: 'TCP_CONN_STATS',
        typeName: 'TCP连接状态统计',
        period: '10s',
        dataType: '累计值 (COUNTER)',
        valueType: '整数 (Integer)',
        chartType: '面积图 (Area)',
        description: '监控网卡入方向字节数与带宽使用率峰值',
        app: '公共网关体系',
        module: 'api-proxy-nginx',
      },
      {
        pointId: 'PT-REDIS-CONN-POOL',
        pointName: 'Redis连接池活跃等待',
        typeCode: 'MEM_CONSUME',
        typeName: '内存占用率',
        period: '5s',
        dataType: '瞬时值 (GAUGE)',
        valueType: '整数 (Integer)',
        chartType: '折线图 (Line)',
        description: '监测高并发下缓存客户端连接池溢出风险',
        app: '商城业务中心',
        module: 'order-pay-gateway',
      },
    ];
    setImportText(JSON.stringify(sample, null, 2));
  };

  return (
    <div className="p-6 space-y-4">
      {/* 头部标题与模块说明 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold text-blue-600 font-mono mb-0.5">
            上报管理 &gt; 监控点管理 &gt; 监控点管理
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span>监控点管理</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            该模块用于查看所有监控点的数据内容。用户可以对监控点进行添加、删除、修改、批量导入和查看详情等操作。同时，还支持通过输入监控点类型或监控点ID进行精准搜索，方便快速定位到目标监控点。
          </p>
        </div>

        {/* 顶部操作按钮 */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5 text-slate-600" />
            <span>批量导入</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>添加监控点</span>
          </button>
        </div>
      </div>

      {/* 精准搜索过滤栏 */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3 text-xs">
        {/* 输入监控点ID进行精准搜索 */}
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <span className="text-slate-600 font-medium whitespace-nowrap">监控点ID:</span>
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="输入监控点ID精准搜索 (如 PT-CPU-001)..."
              value={searchPointId}
              onChange={(e) => setSearchPointId(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>

        {/* 输入监控点类型进行精准搜索 */}
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <span className="text-slate-600 font-medium whitespace-nowrap">监控点类型:</span>
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="输入监控点类型代码或名称 (如 CPU_USAGE)..."
              value={searchTypeCode}
              onChange={(e) => setSearchTypeCode(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>

        {/* 快捷类型下拉辅助 */}
        <div className="flex items-center gap-1.5">
          <select
            value={searchTypeCode}
            onChange={(e) => setSearchTypeCode(e.target.value === 'ALL' ? '' : e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">快捷选择类型</option>
            {types.map((t) => (
              <option key={t.id} value={t.typeCode}>
                {t.typeName} ({t.typeCode})
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearchPointId('');
              setSearchTypeCode('');
            }}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>重置</span>
          </button>
        </div>
      </div>

      {/* 监控点数据内容列表呈现 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3.5 whitespace-nowrap">监控点ID</th>
                <th className="py-3 px-3.5 whitespace-nowrap">监控点名称</th>
                <th className="py-3 px-3.5 whitespace-nowrap">监控点类型</th>
                <th className="py-3 px-3.5 whitespace-nowrap">统计周期</th>
                <th className="py-3 px-3.5 whitespace-nowrap">数据类型</th>
                <th className="py-3 px-3.5 whitespace-nowrap">值类型</th>
                <th className="py-3 px-3.5 whitespace-nowrap">图表类型</th>
                <th className="py-3 px-3.5 min-w-[180px]">监控点描述</th>
                <th className="py-3 px-3.5 whitespace-nowrap text-center">详情</th>
                <th className="py-3 px-3.5 whitespace-nowrap text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPoints.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-slate-400">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                    未搜索到符合条件的监控点数据
                  </td>
                </tr>
              ) : (
                filteredPoints.map((p) => {
                  const pid = p.pointId || p.pointCode || p.id;
                  return (
                    <tr key={p.id || pid} className="hover:bg-slate-50/80 transition-colors">
                      {/* 1. 监控点ID */}
                      <td className="py-3 px-3.5 font-mono font-bold text-blue-700 whitespace-nowrap">
                        {pid}
                      </td>

                      {/* 2. 监控点名称 */}
                      <td className="py-3 px-3.5 font-medium text-slate-900 whitespace-nowrap">
                        {p.pointName}
                      </td>

                      {/* 3. 监控点类型 */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-slate-100 text-slate-800 border border-slate-200">
                          <span>{p.typeCode}</span>
                        </span>
                      </td>

                      {/* 4. 统计周期 */}
                      <td className="py-3 px-3.5 font-mono text-slate-700 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                          {p.period || `${p.intervalSec || 60}s`}
                        </span>
                      </td>

                      {/* 5. 数据类型 */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="text-slate-700">{p.dataType || '瞬时值 (GAUGE)'}</span>
                      </td>

                      {/* 6. 值类型 */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="text-slate-700">{p.valueType || '百分比 (%)'}</span>
                      </td>

                      {/* 7. 图表类型 */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-slate-800 font-medium">
                          {p.chartType?.includes('面积') ? (
                            <Activity className="w-3.5 h-3.5 text-indigo-500" />
                          ) : p.chartType?.includes('柱状') ? (
                            <BarChart2 className="w-3.5 h-3.5 text-amber-500" />
                          ) : (
                            <LineChart className="w-3.5 h-3.5 text-blue-500" />
                          )}
                          <span>{p.chartType || '折线图 (Line)'}</span>
                        </span>
                      </td>

                      {/* 8. 监控点描述 */}
                      <td className="py-3 px-3.5 text-slate-500 max-w-xs truncate" title={p.description}>
                        {p.description || '无具体说明'}
                      </td>

                      {/* 9. 查看详情 */}
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        <button
                          onClick={() => setDetailPoint(p)}
                          className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded font-medium text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>查看详情</span>
                        </button>
                      </td>

                      {/* 10. 操作 (修改 / 删除) */}
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                            title="修改监控点"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`确认删除监控点【${p.pointName} (${pid})】吗？`)) {
                                onDeletePoint(p.id || pid);
                              }
                            }}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="删除监控点"
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

        {/* 底部信息栏 */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>共找到 {filteredPoints.length} 个监控点条目</span>
          <span className="font-mono text-[11px]">精准搜索支持监控点类型 / ID 全量检索</span>
        </div>
      </div>

      {/* 查看详情模态弹窗 */}
      {detailPoint && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">监控点详细配置内容</h3>
                  <p className="text-[11px] font-mono text-slate-400">
                    ID: {detailPoint.pointId || detailPoint.pointCode || detailPoint.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDetailPoint(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">监控点名称</span>
                <span className="font-bold text-slate-800 text-sm">{detailPoint.pointName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">监控点类型</span>
                <span className="font-bold text-blue-700 font-mono">
                  {detailPoint.typeName} ({detailPoint.typeCode})
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">统计周期</span>
                <span className="font-mono text-slate-800 font-semibold">
                  {detailPoint.period || `${detailPoint.intervalSec || 60}s`}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">数据类型</span>
                <span className="text-slate-800 font-medium">
                  {detailPoint.dataType || '瞬时值 (GAUGE)'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">值类型</span>
                <span className="text-slate-800 font-medium">
                  {detailPoint.valueType || '百分比 (%)'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">图表类型</span>
                <span className="text-slate-800 font-medium">
                  {detailPoint.chartType || '折线图 (Line)'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <span className="text-slate-400 block mb-1">监控点描述说明</span>
              <p className="text-slate-700 leading-relaxed">
                {detailPoint.description || '暂无详细描述说明'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-500 pt-1">
              <div>所属业务中心: {detailPoint.app || detailPoint.targetApp || '商城微服务'}</div>
              <div>绑定微服务模块: {detailPoint.module || detailPoint.targetModule || '核心服务'}</div>
              <div>创建时间: {detailPoint.createdTime || '2026-09-08'}</div>
              <div>创建人: {detailPoint.creator || '系统管理员'}</div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setDetailPoint(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 添加 / 修改监控点模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>{editingPoint ? '修改监控点' : '添加新监控点'}</span>
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
                    监控点ID: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pointId}
                    onChange={(e) => setFormData({ ...formData, pointId: e.target.value })}
                    placeholder="如 PT-CPU-001"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    监控点名称: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pointName}
                    onChange={(e) => setFormData({ ...formData, pointName: e.target.value })}
                    placeholder="如 CPU使用率突增监控"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">监控点类型:</label>
                  <select
                    value={formData.typeCode}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                  >
                    {types.map((t) => (
                      <option key={t.id} value={t.typeCode}>
                        {t.typeName} ({t.typeCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">统计周期:</label>
                  <select
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                  >
                    <option value="5s">5秒 (5s)</option>
                    <option value="10s">10秒 (10s)</option>
                    <option value="15s">15秒 (15s)</option>
                    <option value="30s">30秒 (30s)</option>
                    <option value="60s">60秒 (60s)</option>
                    <option value="300s">300秒 (5分钟)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">数据类型:</label>
                  <select
                    value={formData.dataType}
                    onChange={(e) => setFormData({ ...formData, dataType: e.target.value })}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="瞬时值 (GAUGE)">瞬时值 (GAUGE)</option>
                    <option value="原始值 (RAW)">原始值 (RAW)</option>
                    <option value="累计值 (COUNTER)">累计值 (COUNTER)</option>
                    <option value="差值 (DELTA)">差值 (DELTA)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">值类型:</label>
                  <select
                    value={formData.valueType}
                    onChange={(e) => setFormData({ ...formData, valueType: e.target.value })}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="百分比 (%)">百分比 (%)</option>
                    <option value="整数 (Integer)">整数 (Integer)</option>
                    <option value="浮点数 (Float)">浮点数 (Float)</option>
                    <option value="毫秒 (ms)">毫秒 (ms)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">图表类型:</label>
                  <select
                    value={formData.chartType}
                    onChange={(e) => setFormData({ ...formData, chartType: e.target.value })}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="折线图 (Line)">折线图 (Line)</option>
                    <option value="面积图 (Area)">面积图 (Area)</option>
                    <option value="柱状图 (Bar)">柱状图 (Bar)</option>
                    <option value="仪表盘 (Gauge)">仪表盘 (Gauge)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">监控点描述:</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="监控点的采样意图及业务度量说明..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                />
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
                  确定保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 批量导入模态框 */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">批量导入监控点</h3>
                  <p className="text-[11px] text-slate-400">支持以 JSON 数组形式批量录入监控点</p>
                </div>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-700">粘贴 JSON 数组配置数据：</label>
                <button
                  type="button"
                  onClick={handleLoadSampleImport}
                  className="text-blue-600 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>加载示例模板</span>
                </button>
              </div>

              <textarea
                rows={9}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder='[\n  {\n    "pointId": "PT-NEW-01",\n    "pointName": "网络入包速率",\n    "typeCode": "TCP_CONN_STATS",\n    "period": "10s",\n    "dataType": "累计值 (COUNTER)",\n    "valueType": "整数 (Integer)",\n    "chartType": "折线图 (Line)",\n    "description": "说明..."\n  }\n]'
                className="w-full p-3 font-mono text-[11px] bg-slate-900 text-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
              />

              {importError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              {importSuccessMsg && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{importSuccessMsg}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleBatchImportSubmit}
                className="px-5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium shadow-xs cursor-pointer"
              >
                确认导入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
