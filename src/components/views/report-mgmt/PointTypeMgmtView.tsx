import React, { useState, useEffect } from 'react';
import {
  Layers,
  Search,
  Plus,
  Trash2,
  Edit,
  RotateCcw,
  Check,
  X,
  Activity,
  Server,
  AlertCircle,
  Tag,
  Clock,
  ArrowRight,
  Shield,
  Filter,
} from 'lucide-react';
import { PointTypeItem, MonitorPointItem } from '../../../types';

interface PointTypeMgmtViewProps {
  types: PointTypeItem[];
  points?: MonitorPointItem[];
  onAddType: (type: PointTypeItem) => void;
  onUpdateType: (type: PointTypeItem) => void;
  onDeleteType: (id: string) => void;
}

export const PointTypeMgmtView: React.FC<PointTypeMgmtViewProps> = ({
  types,
  points = [],
  onAddType,
  onUpdateType,
  onDeleteType,
}) => {
  // 当前选中的监控点类型
  const [selectedType, setSelectedType] = useState<PointTypeItem>(types[0] || {
    id: 'TYP-001',
    typeCode: 'CPU_USAGE',
    typeName: 'CPU使用率监控',
    unit: '%',
    aggregation: 'AVG',
    isSystem: true,
    description: '服务器主机及容器级CPU综合占用百分比',
    pointCount: 14,
  });

  // 中间选中的特定监控点
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  // 搜索关键字（左侧类型搜索）
  const [searchKeyword, setSearchKeyword] = useState('');
  // 中间监控点搜索
  const [pointSearchKeyword, setPointSearchKeyword] = useState('');

  // 右侧表单模式：'VIEW' | 'EDIT' | 'CREATE'
  const [formMode, setFormMode] = useState<'VIEW' | 'EDIT' | 'CREATE'>('EDIT');

  // 表单数据
  const [formData, setFormData] = useState({
    typeCode: selectedType?.typeCode || '',
    typeName: selectedType?.typeName || '',
    unit: selectedType?.unit || '',
    aggregation: selectedType?.aggregation || 'AVG',
    description: selectedType?.description || '',
    isSystem: selectedType?.isSystem || false,
  });

  // 提示信息
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // 联动更新表单初始值
  useEffect(() => {
    if (selectedType && formMode !== 'CREATE') {
      setFormData({
        typeCode: selectedType.typeCode,
        typeName: selectedType.typeName,
        unit: selectedType.unit,
        aggregation: selectedType.aggregation || 'AVG',
        description: selectedType.description || '',
        isSystem: selectedType.isSystem ?? false,
      });
    }
  }, [selectedType, formMode]);

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // 左侧过滤后的类型
  const filteredTypes = types.filter((t) => {
    return (
      !searchKeyword ||
      t.typeCode.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      t.typeName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchKeyword.toLowerCase()))
    );
  });

  // 中间区域：当前指定监控点类型下的特定监控点列表
  const currentPoints = points.filter((p) => p.typeCode === selectedType.typeCode);
  const filteredCurrentPoints = currentPoints.filter((p) => {
    if (!pointSearchKeyword) return true;
    const matchId = (p.pointId || p.pointCode || '').toLowerCase().includes(pointSearchKeyword.toLowerCase());
    const matchName = (p.pointName || '').toLowerCase().includes(pointSearchKeyword.toLowerCase());
    const matchModule = (p.module || p.targetModule || '').toLowerCase().includes(pointSearchKeyword.toLowerCase());
    return matchId || matchName || matchModule;
  });

  // 点击左侧选择监控点类型
  const handleSelectType = (type: PointTypeItem) => {
    setSelectedType(type);
    setSelectedPointId(null);
    setFormMode('EDIT');
  };

  // 点击中间区域指定监控点类型的特定监控点，即可对监控点类型信息进行编辑
  const handleSelectPoint = (point: MonitorPointItem) => {
    setSelectedPointId(point.pointId || point.pointCode || point.id);
    setFormMode('EDIT');
    showNotification(`已选定特定监控点 [${point.pointId || point.pointCode}]，正在编辑所属类型 [${selectedType.typeName}]`);
  };

  // 右侧提供：添加功能
  const handleStartAdd = () => {
    setFormMode('CREATE');
    setSelectedPointId(null);
    setFormData({
      typeCode: `CUSTOM_${Date.now().toString().slice(-4)}`,
      typeName: '',
      unit: '',
      aggregation: 'AVG',
      description: '',
      isSystem: false,
    });
    showNotification('进入新增监控点类型模式，请在右侧输入内容');
  };

  // 右侧提供：修改功能
  const handleStartEdit = () => {
    setFormMode('EDIT');
    showNotification(`进入修改模式：正在编辑 [${selectedType.typeName}]`);
  };

  // 右侧提供：删除功能
  const handleDeleteCurrentType = () => {
    if (selectedType.isSystem) {
      alert(`[${selectedType.typeName}] 为系统内置监控点类型，受保护禁止删除！`);
      return;
    }
    if (window.confirm(`确定删除监控点类型【${selectedType.typeName} (${selectedType.typeCode})】吗？关联监控点可能失效。`)) {
      onDeleteType(selectedType.id);
      showNotification(`已成功删除监控点类型 [${selectedType.typeName}]`);
      const remaining = types.filter((t) => t.id !== selectedType.id);
      if (remaining.length > 0) {
        setSelectedType(remaining[0]);
        setFormMode('EDIT');
      }
    }
  };

  // 右侧提供：重填操作
  const handleResetForm = () => {
    if (formMode === 'CREATE') {
      setFormData({
        typeCode: `CUSTOM_${Date.now().toString().slice(-4)}`,
        typeName: '',
        unit: '',
        aggregation: 'AVG',
        description: '',
        isSystem: false,
      });
      showNotification('表单已重填清空');
    } else {
      setFormData({
        typeCode: selectedType.typeCode,
        typeName: selectedType.typeName,
        unit: selectedType.unit,
        aggregation: selectedType.aggregation || 'AVG',
        description: selectedType.description || '',
        isSystem: selectedType.isSystem ?? false,
      });
      showNotification('表单已恢复为初始数据');
    }
  };

  // 右侧提供：取消操作
  const handleCancelForm = () => {
    setFormMode('VIEW');
    setFormData({
      typeCode: selectedType.typeCode,
      typeName: selectedType.typeName,
      unit: selectedType.unit,
      aggregation: selectedType.aggregation || 'AVG',
      description: selectedType.description || '',
      isSystem: selectedType.isSystem ?? false,
    });
    showNotification('已取消当前输入修改');
  };

  // 右侧提供：提交操作
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.typeCode.trim() || !formData.typeName.trim()) {
      alert('请完整填写监控点类型编码与类型名称！');
      return;
    }

    if (formMode === 'CREATE') {
      const newType: PointTypeItem = {
        id: `TYP-${Date.now().toString().slice(-4)}`,
        typeCode: formData.typeCode.trim().toUpperCase(),
        typeName: formData.typeName.trim(),
        unit: formData.unit.trim() || '次',
        aggregation: formData.aggregation as any,
        isSystem: formData.isSystem,
        description: formData.description.trim(),
        pointCount: 0,
      };
      onAddType(newType);
      setSelectedType(newType);
      setFormMode('EDIT');
      showNotification(`新监控点类型 [${newType.typeName}] 添加成功！`);
    } else {
      const updated: PointTypeItem = {
        ...selectedType,
        typeCode: formData.typeCode.trim(),
        typeName: formData.typeName.trim(),
        unit: formData.unit.trim(),
        aggregation: formData.aggregation as any,
        isSystem: formData.isSystem,
        description: formData.description.trim(),
      };
      onUpdateType(updated);
      setSelectedType(updated);
      setFormMode('EDIT');
      showNotification(`监控点类型 [${updated.typeName}] 修改并保存成功！`);
    }
  };

  return (
    <div className="p-6 space-y-4">
      {/* 头部导航与说明 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold text-blue-600 font-mono mb-0.5">
            上报管理 &gt; 监控点管理 &gt; 监控点类型管理
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <span>监控点类型管理</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            该模块用于管理监控点类型，右侧区域支持修改监控点类型的内容信息。点击中间区域指定监控点类型的特定监控点，即可对监控点类型信息进行编辑。当中间选定特定监控点类型时，右侧提供添加、删除、修改功能。在信息输入过程中，用户可以随时进行重填、提交或取消操作。
          </p>
        </div>

        {actionNotice && (
          <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs flex items-center gap-1.5 shadow-xs animate-fade-in">
            <Check className="w-3.5 h-3.5 text-blue-600" />
            <span>{actionNotice}</span>
          </div>
        )}
      </div>

      {/* 主工作区：左中右三栏联动布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start min-h-[620px]">
        {/* 左侧区域：监控点类型列表 (占 3 列) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-full max-h-[680px]">
          <div className="p-3.5 border-b border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                <span>监控点类型列表</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                共 {filteredTypes.length} 项
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="搜索类型编码/名称..."
                className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar p-1.5">
            {filteredTypes.map((t) => {
              const isSelected = selectedType.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => handleSelectType(t)}
                  className={`p-3 rounded-lg cursor-pointer transition-all mb-1 ${
                    isSelected
                      ? 'bg-blue-50 border border-blue-200 shadow-xs text-blue-950'
                      : 'hover:bg-slate-50 border border-transparent text-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold font-mono text-slate-900 flex items-center gap-1.5">
                        <span className={isSelected ? 'text-blue-700' : 'text-slate-800'}>
                          {t.typeName}
                        </span>
                        {t.isSystem && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-500 border border-slate-200">
                            内置
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {t.typeCode}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                      单位: {t.unit || '无'}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>算子: {t.aggregation || 'AVG'}</span>
                    <span className="font-mono text-blue-600 font-semibold">
                      {points.filter((p) => p.typeCode === t.typeCode).length} 个监控点
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 中间区域：指定监控点类型的特定监控点 (占 5 列) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-full max-h-[680px]">
          <div className="p-3.5 border-b border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-600" />
                  <span>中间区域：[{selectedType.typeName}] 下的特定监控点</span>
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  点击下方指定监控点，右侧立即加载并对监控点类型进行编辑
                </p>
              </div>
              <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-semibold border border-blue-200">
                {currentPoints.length} 个实例
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={pointSearchKeyword}
                onChange={(e) => setPointSearchKeyword(e.target.value)}
                placeholder="搜索监控点ID/名称/所属微服务..."
                className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar p-2">
            {filteredCurrentPoints.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p>该监控点类型暂未绑定特定监控点</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  可在右侧点击【修改】编辑类型参数，或前往「监控点管理」添加新点
                </p>
              </div>
            ) : (
              filteredCurrentPoints.map((point) => {
                const pid = point.pointId || point.pointCode || point.id;
                const isPointSelected = selectedPointId === pid;
                return (
                  <div
                    key={point.id || pid}
                    onClick={() => handleSelectPoint(point)}
                    className={`p-3 rounded-lg cursor-pointer transition-all mb-1.5 border ${
                      isPointSelected
                        ? 'bg-blue-50 border-blue-300 shadow-xs'
                        : 'hover:bg-slate-50 border-slate-200/80 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded">
                            {pid}
                          </span>
                          <span className="text-xs font-semibold text-slate-900">
                            {point.pointName}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                          <span>所属: {point.app || point.targetApp || '商城业务'}</span>
                          <span>&bull;</span>
                          <span className="font-mono">{point.module || point.targetModule}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          采集周期: {point.period || `${point.intervalSec || 60}s`}
                        </span>
                        {point.latestValue !== undefined && (
                          <div className="text-[11px] font-mono text-slate-700 font-bold mt-1">
                            实时: {point.latestValue} {point.unit || selectedType.unit}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 line-clamp-1">
                        {point.description || '无具体描述'}
                      </span>
                      <span className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-0.5 shrink-0">
                        <span>点击编辑类型</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 右侧区域：支持修改监控点类型的内容信息，提供添加、删除、修改与重填、提交、取消 (占 4 列) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-full">
          {/* 右侧区域顶部：功能操作按钮栏 (添加、删除、修改) */}
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/70 rounded-t-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Edit className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  右侧区域：{formMode === 'CREATE' ? '新增监控点类型' : '修改监控点类型信息'}
                </span>
              </span>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                  formMode === 'CREATE'
                    ? 'bg-emerald-100 text-emerald-800'
                    : formMode === 'EDIT'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {formMode === 'CREATE' ? '新增模式' : formMode === 'EDIT' ? '编辑模式' : '浏览模式'}
              </span>
            </div>

            {/* 当中间选定特定监控点类型时，右侧提供添加、删除、修改功能 */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleStartAdd}
                className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-50 text-blue-600 border border-blue-200 hover:border-blue-400 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all shadow-2xs cursor-pointer"
                title="添加新监控点类型"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>添加类型</span>
              </button>

              <button
                type="button"
                onClick={handleStartEdit}
                className="flex-1 py-1.5 px-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all shadow-2xs cursor-pointer"
                title="进入修改编辑模式"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>修改类型</span>
              </button>

              <button
                type="button"
                onClick={handleDeleteCurrentType}
                disabled={selectedType.isSystem}
                className={`py-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all shadow-2xs ${
                  selectedType.isSystem
                    ? 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed'
                    : 'bg-white hover:bg-red-50 text-rose-600 border border-rose-200 hover:border-rose-400 cursor-pointer'
                }`}
                title={selectedType.isSystem ? '系统内置类型不可删除' : '删除当前选定类型'}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>删除</span>
              </button>
            </div>
          </div>

          {/* 表单输入区域：支持修改监控点类型的内容信息 */}
          <form onSubmit={handleSubmitForm} className="p-4 space-y-3.5 flex-1 flex flex-col justify-between text-xs">
            <div className="space-y-3">
              {/* 类型编码 */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  监控点类型编码 (Type Code): <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.typeCode}
                  onChange={(e) => setFormData({ ...formData, typeCode: e.target.value.toUpperCase() })}
                  placeholder="例如: CPU_USAGE, MEM_CONSUME"
                  disabled={formMode === 'VIEW' || (formMode === 'EDIT' && selectedType.isSystem)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono focus:outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>

              {/* 类型名称 */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  监控点类型名称 (Type Name): <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.typeName}
                  onChange={(e) => setFormData({ ...formData, typeName: e.target.value })}
                  placeholder="例如: CPU使用率监控、TCP连接状态统计"
                  disabled={formMode === 'VIEW'}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 disabled:bg-slate-100"
                />
              </div>

              {/* 度量单位与聚合算子 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">度量单位 (Unit):</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="%, ms, 个, QPS"
                    disabled={formMode === 'VIEW'}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-800 focus:outline-none focus:border-blue-500 disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">聚合算子 (Aggregation):</label>
                  <select
                    value={formData.aggregation}
                    onChange={(e) => setFormData({ ...formData, aggregation: e.target.value as any })}
                    disabled={formMode === 'VIEW'}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono focus:outline-none focus:border-blue-500 disabled:bg-slate-100"
                  >
                    <option value="AVG">AVG (均值)</option>
                    <option value="SUM">SUM (累加)</option>
                    <option value="MAX">MAX (峰值)</option>
                    <option value="MIN">MIN (最小值)</option>
                    <option value="COUNT">COUNT (计数)</option>
                  </select>
                </div>
              </div>

              {/* 描述信息 */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">监控点类型描述说明:</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="说明该监控点类型的指标统计逻辑、上报采样方式..."
                  disabled={formMode === 'VIEW'}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 disabled:bg-slate-100 resize-none"
                />
              </div>

              {/* 系统保护标记 */}
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block text-xs">系统内置保护</span>
                  <span className="text-slate-400 text-[10px]">内置核心类型不可被随意删除</span>
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isSystem}
                    disabled={formMode === 'VIEW'}
                    onChange={(e) => setFormData({ ...formData, isSystem: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700 font-medium text-xs">设为内置</span>
                </label>
              </div>
            </div>

            {/* 在信息输入过程中，用户可以随时进行重填、提交或取消操作 */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-medium flex items-center gap-1 transition-colors cursor-pointer"
                title="取消当前输入"
              >
                <X className="w-3.5 h-3.5" />
                <span>取消</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  title="重填清空输入信息"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>重填</span>
                </button>

                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                  title="提交并保存监控点类型信息"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>提交</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
