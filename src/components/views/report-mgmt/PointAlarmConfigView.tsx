import React, { useState } from 'react';
import {
  BellRing,
  Search,
  Plus,
  Trash2,
  Edit,
  ShieldAlert,
  ShieldOff,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Server,
  LayoutGrid,
  X,
  Clock,
  Calendar,
  Layers,
  Sliders,
  Check,
} from 'lucide-react';
import { AlarmRuleItem, MonitorPointItem, PointViewItem } from '../../../types';

interface PointAlarmConfigViewProps {
  rules: AlarmRuleItem[];
  availablePoints: MonitorPointItem[];
  availableViews: PointViewItem[];
  onAddRule: (rule: AlarmRuleItem) => void;
  onUpdateRule: (rule: AlarmRuleItem) => void;
  onDeleteRule: (id: string) => void;
  onBatchUpdateStatus: (ids: string[], status: AlarmRuleItem['status']) => void;
  onBatchDelete: (ids: string[]) => void;
}

export const PointAlarmConfigView: React.FC<PointAlarmConfigViewProps> = ({
  rules,
  availablePoints,
  availableViews,
  onAddRule,
  onUpdateRule,
  onDeleteRule,
  onBatchUpdateStatus,
  onBatchDelete,
}) => {
  // 精准搜索状态：用户可借助告警对象、告警类型、告警状态、告警对象ID等信息，高效精准地搜索
  const [searchTargetType, setSearchTargetType] = useState('ALL'); // 告警对象: ALL | 单机 | 视图
  const [searchAlarmType, setSearchAlarmType] = useState('ALL'); // 告警类型
  const [searchAlarmStatus, setSearchAlarmStatus] = useState('ALL'); // 告警状态: ALL | NORMAL | SHIELDED
  const [searchObjectId, setSearchObjectId] = useState(''); // 告警对象ID

  // 批量勾选项
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 弹窗状态
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalType, setAddModalType] = useState<'MACHINE' | 'VIEW'>('MACHINE');
  const [editingRule, setEditingRule] = useState<AlarmRuleItem | null>(null);
  const [isBatchEditModalOpen, setIsBatchEditModalOpen] = useState(false);
  const [isBatchShieldModalOpen, setIsBatchShieldModalOpen] = useState(false);

  // 表单状态
  const [formData, setFormData] = useState({
    pointId: availablePoints[0]?.pointId || availablePoints[0]?.pointCode || 'PT-CPU-001',
    pointName: availablePoints[0]?.pointName || 'CPU使用率突增监控',
    alarmTarget: '单机' as '单机' | '视图',
    targetValue: '10.24.12.88 (上海节点01)',
    alarmType: '阈值上限告警',
    shieldStatus: '未屏蔽' as '未屏蔽' | '已屏蔽',
    shieldUntil: '',
    operator: '>=' as AlarmRuleItem['operator'],
    threshold: 85,
    unit: '%',
    durationMinutes: 3,
    level: 'CRITICAL' as AlarmRuleItem['level'],
  });

  // 批量修改状态
  const [batchFormData, setBatchFormData] = useState({
    level: 'CRITICAL' as AlarmRuleItem['level'],
    threshold: 85,
    durationMinutes: 5,
    alarmType: '阈值上限告警',
  });

  // 过滤检索：借助告警对象、告警类型、告警状态、告警对象ID
  const filteredRules = rules.filter((r) => {
    // 告警对象
    const target = r.alarmTarget || (r.targetType === 'VIEW' ? '视图' : '单机');
    const matchTarget = searchTargetType === 'ALL' || target === searchTargetType;

    // 告警类型
    const atype = r.alarmType || '阈值上限告警';
    const matchType = searchAlarmType === 'ALL' || atype === searchAlarmType;

    // 告警状态 (未屏蔽 / 已屏蔽)
    const isShielded = r.shieldStatus === '已屏蔽' || r.isShielded || r.status === 'SHIELDED';
    let matchStatus = true;
    if (searchAlarmStatus === 'NORMAL') {
      matchStatus = !isShielded;
    } else if (searchAlarmStatus === 'SHIELDED') {
      matchStatus = isShielded;
    }

    // 告警对象ID
    const objId = (r.targetValue || r.targetId || '').toLowerCase();
    const matchObjId = !searchObjectId.trim() || objId.includes(searchObjectId.trim().toLowerCase());

    return matchTarget && matchType && matchStatus && matchObjId;
  });

  // 全选 / 取消全选
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredRules.length && filteredRules.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRules.map((r) => r.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // 打开【添加单机告警】
  const handleOpenAddMachine = () => {
    setEditingRule(null);
    setAddModalType('MACHINE');
    const defaultPoint = availablePoints[0];
    setFormData({
      pointId: defaultPoint?.pointId || defaultPoint?.pointCode || 'PT-CPU-001',
      pointName: defaultPoint?.pointName || 'CPU使用率突增监控',
      alarmTarget: '单机',
      targetValue: '10.24.12.88 (上海节点01)',
      alarmType: '阈值上限告警',
      shieldStatus: '未屏蔽',
      shieldUntil: '',
      operator: '>=',
      threshold: 85,
      unit: defaultPoint?.unit || '%',
      durationMinutes: 3,
      level: 'CRITICAL',
    });
    setIsAddModalOpen(true);
  };

  // 打开【添加视图告警】
  const handleOpenAddView = () => {
    setEditingRule(null);
    setAddModalType('VIEW');
    const defaultPoint = availablePoints[0];
    const defaultView = availableViews[0];
    setFormData({
      pointId: defaultPoint?.pointId || defaultPoint?.pointCode || 'PT-MEM-003',
      pointName: defaultPoint?.pointName || 'JVM老年代内存越界',
      alarmTarget: '视图',
      targetValue: defaultView ? `${defaultView.viewId} (${defaultView.viewName})` : 'VIEW-CORE-AUTH (认证大盘)',
      alarmType: '阈值上限告警',
      shieldStatus: '未屏蔽',
      shieldUntil: '',
      operator: '>=',
      threshold: 80,
      unit: '%',
      durationMinutes: 3,
      level: 'MAJOR',
    });
    setIsAddModalOpen(true);
  };

  // 打开【修改】
  const handleOpenEdit = (r: AlarmRuleItem) => {
    setEditingRule(r);
    const isView = r.alarmTarget === '视图' || r.targetType === 'VIEW';
    setAddModalType(isView ? 'VIEW' : 'MACHINE');
    setFormData({
      pointId: r.pointId || r.pointCode || 'PT-CPU-001',
      pointName: r.pointName || '监控点告警',
      alarmTarget: isView ? '视图' : '单机',
      targetValue: r.targetValue || r.targetName || r.targetId,
      alarmType: r.alarmType || '阈值上限告警',
      shieldStatus: (r.shieldStatus === '已屏蔽' || r.isShielded || r.status === 'SHIELDED') ? '已屏蔽' : '未屏蔽',
      shieldUntil: r.shieldUntil || '',
      operator: r.operator || '>=',
      threshold: r.threshold || 80,
      unit: r.unit || '%',
      durationMinutes: r.durationMinutes || 3,
      level: r.level || 'CRITICAL',
    });
    setIsAddModalOpen(true);
  };

  // 单条屏蔽 / 解除屏蔽切换
  const handleToggleShieldSingle = (r: AlarmRuleItem) => {
    const currentlyShielded = r.shieldStatus === '已屏蔽' || r.isShielded || r.status === 'SHIELDED';
    const updated: AlarmRuleItem = {
      ...r,
      shieldStatus: currentlyShielded ? '未屏蔽' : '已屏蔽',
      isShielded: !currentlyShielded,
      status: currentlyShielded ? 'ACTIVE' : 'SHIELDED',
      shieldUntil: !currentlyShielded ? '2026-09-10 12:00:00' : undefined,
    };
    onUpdateRule(updated);
  };

  // 保存添加 / 修改
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const isShielded = formData.shieldStatus === '已屏蔽';

    if (editingRule) {
      const updated: AlarmRuleItem = {
        ...editingRule,
        pointId: formData.pointId,
        pointCode: formData.pointId,
        pointName: formData.pointName,
        alarmTarget: formData.alarmTarget,
        targetType: formData.alarmTarget === '视图' ? 'VIEW' : 'MACHINE',
        targetValue: formData.targetValue,
        targetId: formData.targetValue.split(' ')[0],
        targetName: formData.targetValue,
        alarmType: formData.alarmType,
        shieldStatus: formData.shieldStatus,
        isShielded,
        status: isShielded ? 'SHIELDED' : 'ACTIVE',
        shieldUntil: isShielded ? (formData.shieldUntil || '2026-09-10 12:00:00') : undefined,
        operator: formData.operator,
        threshold: Number(formData.threshold),
        unit: formData.unit,
        durationMinutes: Number(formData.durationMinutes),
        level: formData.level,
      };
      onUpdateRule(updated);
    } else {
      const newRule: AlarmRuleItem = {
        id: `AC-${Date.now().toString().slice(-4)}`,
        pointId: formData.pointId,
        pointCode: formData.pointId,
        pointName: formData.pointName,
        alarmTarget: formData.alarmTarget,
        targetType: formData.alarmTarget === '视图' ? 'VIEW' : 'MACHINE',
        targetValue: formData.targetValue,
        targetId: formData.targetValue.split(' ')[0],
        targetName: formData.targetValue,
        alarmType: formData.alarmType,
        shieldStatus: formData.shieldStatus,
        isShielded,
        status: isShielded ? 'SHIELDED' : 'ACTIVE',
        shieldUntil: isShielded ? (formData.shieldUntil || '2026-09-10 12:00:00') : undefined,
        operator: formData.operator,
        threshold: Number(formData.threshold),
        unit: formData.unit,
        durationMinutes: Number(formData.durationMinutes),
        durationSeconds: Number(formData.durationMinutes) * 60,
        level: formData.level,
        createdTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        enabled: true,
      };
      onAddRule(newRule);
    }
    setIsAddModalOpen(false);
  };

  // 批量修改执行
  const handleBatchEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    selectedIds.forEach((id) => {
      const found = rules.find((r) => r.id === id);
      if (found) {
        onUpdateRule({
          ...found,
          level: batchFormData.level,
          threshold: Number(batchFormData.threshold),
          durationMinutes: Number(batchFormData.durationMinutes),
          alarmType: batchFormData.alarmType,
        });
      }
    });
    setIsBatchEditModalOpen(false);
    setSelectedIds([]);
  };

  // 批量屏蔽执行
  const handleBatchShield = () => {
    selectedIds.forEach((id) => {
      const found = rules.find((r) => r.id === id);
      if (found) {
        onUpdateRule({
          ...found,
          shieldStatus: '已屏蔽',
          isShielded: true,
          status: 'SHIELDED',
          shieldUntil: '2026-09-10 12:00:00',
        });
      }
    });
    setSelectedIds([]);
  };

  // 批量解除屏蔽执行
  const handleBatchUnshield = () => {
    selectedIds.forEach((id) => {
      const found = rules.find((r) => r.id === id);
      if (found) {
        onUpdateRule({
          ...found,
          shieldStatus: '未屏蔽',
          isShielded: false,
          status: 'ACTIVE',
          shieldUntil: undefined,
        });
      }
    });
    setSelectedIds([]);
  };

  // 批量删除执行
  const handleBatchDelete = () => {
    if (confirm(`确认批量删除已选中的 ${selectedIds.length} 条告警配置吗？`)) {
      onBatchDelete(selectedIds);
      setSelectedIds([]);
    }
  };

  return (
    <div className="p-6 space-y-4">
      {/* 头部标题与模块说明 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold text-blue-600 font-mono mb-0.5">
            上报管理 &gt; 监控点管理 &gt; 监控点告警配置
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BellRing className="w-5 h-5 text-blue-600" />
            <span>监控点告警配置</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            该模块负责管理监控点告警配置，支持执行单机告警、视图告警的添加操作，以及批量修改、屏蔽、解除屏蔽和删除告警配置的操作。用户可借助告警对象、告警类型、告警状态、告警对象ID等信息，高效精准地搜索出对应的监控点告警配置。
          </p>
        </div>

        {/* 顶部添加操作：支持执行单机告警、视图告警的添加操作 */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenAddMachine}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>添加单机告警</span>
          </button>

          <button
            onClick={handleOpenAddView}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>添加视图告警</span>
          </button>
        </div>
      </div>

      {/* 精准搜索区域：用户可借助告警对象、告警类型、告警状态、告警对象ID等信息 */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3 text-xs">
        {/* 告警对象筛选 */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-600 font-medium whitespace-nowrap">告警对象:</span>
          <select
            value={searchTargetType}
            onChange={(e) => setSearchTargetType(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">全部对象</option>
            <option value="单机">单机</option>
            <option value="视图">视图</option>
          </select>
        </div>

        {/* 告警类型筛选 */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-600 font-medium whitespace-nowrap">告警类型:</span>
          <select
            value={searchAlarmType}
            onChange={(e) => setSearchAlarmType(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">全部告警类型</option>
            <option value="阈值上限告警">阈值上限告警</option>
            <option value="异常波动告警">异常波动告警</option>
            <option value="心跳缺失告警">心跳缺失告警</option>
            <option value="连续超时告警">连续超时告警</option>
          </select>
        </div>

        {/* 告警状态筛选 */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-600 font-medium whitespace-nowrap">告警状态:</span>
          <select
            value={searchAlarmStatus}
            onChange={(e) => setSearchAlarmStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">全部状态</option>
            <option value="NORMAL">未屏蔽 (正常)</option>
            <option value="SHIELDED">已屏蔽</option>
          </select>
        </div>

        {/* 告警对象ID输入框精准搜索 */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
          <span className="text-slate-600 font-medium whitespace-nowrap">告警对象ID:</span>
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="输入单机IP (如 10.24.12.88) 或视图ID..."
              value={searchObjectId}
              onChange={(e) => setSearchObjectId(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>

        <button
          onClick={() => {
            setSearchTargetType('ALL');
            setSearchAlarmType('ALL');
            setSearchAlarmStatus('ALL');
            setSearchObjectId('');
          }}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>重置</span>
        </button>
      </div>

      {/* 批量操作控制条 (批量修改、屏蔽、解除屏蔽和删除告警配置) */}
      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">批量操作区:</span>
          <span className="text-slate-500">
            已勾选 <span className="font-bold text-blue-700 font-mono">{selectedIds.length}</span> 项
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* 批量修改 */}
          <button
            onClick={() => setIsBatchEditModalOpen(true)}
            disabled={selectedIds.length === 0}
            className="px-3 py-1 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-blue-700 border border-blue-200 rounded-lg font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Sliders className="w-3 h-3" />
            <span>批量修改</span>
          </button>

          {/* 批量屏蔽 */}
          <button
            onClick={handleBatchShield}
            disabled={selectedIds.length === 0}
            className="px-3 py-1 bg-white hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed text-amber-700 border border-amber-200 rounded-lg font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-3 h-3" />
            <span>屏蔽</span>
          </button>

          {/* 批量解除屏蔽 */}
          <button
            onClick={handleBatchUnshield}
            disabled={selectedIds.length === 0}
            className="px-3 py-1 bg-white hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed text-emerald-700 border border-emerald-200 rounded-lg font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>解除屏蔽</span>
          </button>

          {/* 批量删除 */}
          <button
            onClick={handleBatchDelete}
            disabled={selectedIds.length === 0}
            className="px-3 py-1 bg-white hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed text-rose-600 border border-rose-200 rounded-lg font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>删除</span>
          </button>
        </div>
      </div>

      {/* 监控点告警配置数据列表呈现 (Table) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredRules.length && filteredRules.length > 0}
                    onChange={handleToggleSelectAll}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="py-3 px-3.5 whitespace-nowrap">监控点ID</th>
                <th className="py-3 px-3.5 whitespace-nowrap">监控点名称</th>
                <th className="py-3 px-3.5 whitespace-nowrap">告警对象</th>
                <th className="py-3 px-3.5 whitespace-nowrap">对象值</th>
                <th className="py-3 px-3.5 whitespace-nowrap">告警类型</th>
                <th className="py-3 px-3.5 whitespace-nowrap">屏蔽状态</th>
                <th className="py-3 px-3.5 whitespace-nowrap">添加时间</th>
                <th className="py-3 px-3.5 whitespace-nowrap text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRules.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400">
                    <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                    未搜索到符合条件的监控点告警配置
                  </td>
                </tr>
              ) : (
                filteredRules.map((r) => {
                  const isChecked = selectedIds.includes(r.id);
                  const isShielded = r.shieldStatus === '已屏蔽' || r.isShielded || r.status === 'SHIELDED';
                  const targetStr = r.alarmTarget || (r.targetType === 'VIEW' ? '视图' : '单机');
                  const targetVal = r.targetValue || r.targetName || r.targetId;
                  const pointIdStr = r.pointId || r.pointCode || 'PT-CPU-001';
                  const pointNameStr = r.pointName || r.ruleName || '监控点';
                  const createdTimeStr = r.createdTime || '2026-09-08 10:20:00';
                  const alarmTypeStr = r.alarmType || '阈值上限告警';

                  return (
                    <tr
                      key={r.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isChecked ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelectOne(r.id)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                      </td>

                      {/* 1. 监控点ID */}
                      <td className="py-3 px-3.5 font-mono font-bold text-blue-700 whitespace-nowrap">
                        {pointIdStr}
                      </td>

                      {/* 2. 监控点名称 */}
                      <td className="py-3 px-3.5 font-medium text-slate-900 whitespace-nowrap">
                        {pointNameStr}
                      </td>

                      {/* 3. 告警对象 */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                            targetStr === '视图'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {targetStr === '视图' ? (
                            <LayoutGrid className="w-3 h-3" />
                          ) : (
                            <Server className="w-3 h-3" />
                          )}
                          <span>{targetStr}</span>
                        </span>
                      </td>

                      {/* 4. 对象值 */}
                      <td className="py-3 px-3.5 font-mono text-slate-800 whitespace-nowrap">
                        <span className="font-semibold">{targetVal}</span>
                      </td>

                      {/* 5. 告警类型 */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="text-slate-800 font-medium">{alarmTypeStr}</span>
                        <div className="text-[10px] text-slate-400 font-mono">
                          条件: {r.operator || '>='} {r.threshold} {r.unit}
                        </div>
                      </td>

                      {/* 6. 屏蔽状态 */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        {isShielded ? (
                          <div className="inline-flex flex-col">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <ShieldAlert className="w-3 h-3" />
                              <span>已屏蔽</span>
                            </span>
                            {r.shieldUntil && (
                              <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                                至 {r.shieldUntil}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <ShieldCheck className="w-3 h-3" />
                            <span>未屏蔽</span>
                          </span>
                        )}
                      </td>

                      {/* 7. 添加时间 */}
                      <td className="py-3 px-3.5 font-mono text-slate-500 whitespace-nowrap">
                        {createdTimeStr}
                      </td>

                      {/* 8. 操作 (修改 / 屏蔽 / 删除) */}
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleShieldSingle(r)}
                            className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                              isShielded
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            }`}
                            title={isShielded ? '解除屏蔽' : '屏蔽告警'}
                          >
                            {isShielded ? '解屏' : '屏蔽'}
                          </button>

                          <button
                            onClick={() => handleOpenEdit(r)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                            title="修改告警配置"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`确认删除该监控点告警配置【${pointNameStr}】吗？`)) {
                                onDeleteRule(r.id);
                              }
                            }}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="删除配置"
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
          <span>共找到 {filteredRules.length} 条监控点告警配置</span>
          <span className="font-mono text-[11px]">涵盖列: 监控点ID、名称、告警对象、对象值、告警类型、屏蔽状态、添加时间</span>
        </div>
      </div>

      {/* 单机告警 / 视图告警 添加与修改模态弹窗 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <BellRing className="w-4 h-4 text-blue-600" />
                <span>
                  {editingRule
                    ? '修改监控点告警配置'
                    : addModalType === 'MACHINE'
                    ? '添加单机告警配置'
                    : '添加视图告警配置'}
                </span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">告警对象:</label>
                  <select
                    value={formData.alarmTarget}
                    onChange={(e) => setFormData({ ...formData, alarmTarget: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="单机">单机</option>
                    <option value="视图">视图</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    对象值 ({formData.alarmTarget === '单机' ? '机器IP' : '视图ID'}):
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.targetValue}
                    onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                    placeholder={formData.alarmTarget === '单机' ? '如 10.24.12.88' : '如 VIEW-CORE-AUTH'}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">关联监控点:</label>
                <select
                  value={formData.pointId}
                  onChange={(e) => {
                    const selected = availablePoints.find(
                      (p) => (p.pointId || p.pointCode || p.id) === e.target.value
                    );
                    setFormData({
                      ...formData,
                      pointId: e.target.value,
                      pointName: selected ? selected.pointName : formData.pointName,
                      unit: selected?.unit || formData.unit,
                    });
                  }}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                >
                  {availablePoints.map((p) => {
                    const pid = p.pointId || p.pointCode || p.id;
                    return (
                      <option key={pid} value={pid}>
                        {pid} - {p.pointName}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">告警类型:</label>
                  <select
                    value={formData.alarmType}
                    onChange={(e) => setFormData({ ...formData, alarmType: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="阈值上限告警">阈值上限告警</option>
                    <option value="异常波动告警">异常波动告警</option>
                    <option value="心跳缺失告警">心跳缺失告警</option>
                    <option value="连续超时告警">连续超时告警</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">屏蔽状态:</label>
                  <select
                    value={formData.shieldStatus}
                    onChange={(e) => setFormData({ ...formData, shieldStatus: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="未屏蔽">未屏蔽 (正常生效)</option>
                    <option value="已屏蔽">已屏蔽 (静默不发告警)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">触发比较符:</label>
                  <select
                    value={formData.operator}
                    onChange={(e) => setFormData({ ...formData, operator: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-blue-500"
                  >
                    <option value=">=">&gt;= (大于等于)</option>
                    <option value=">">&gt; (大于)</option>
                    <option value="<=">&lt;= (小于等于)</option>
                    <option value="<">&lt; (小于)</option>
                    <option value="==">== (等于)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">触发阈值:</label>
                  <input
                    type="number"
                    value={formData.threshold}
                    onChange={(e) => setFormData({ ...formData, threshold: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">单位:</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-sm cursor-pointer"
                >
                  保存配置
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 批量修改模态弹窗 */}
      {isBatchEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>批量修改告警配置 ({selectedIds.length} 项)</span>
              </h3>
              <button
                onClick={() => setIsBatchEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBatchEditSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">统一设置告警类型:</label>
                <select
                  value={batchFormData.alarmType}
                  onChange={(e) => setBatchFormData({ ...batchFormData, alarmType: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="阈值上限告警">阈值上限告警</option>
                  <option value="异常波动告警">异常波动告警</option>
                  <option value="心跳缺失告警">心跳缺失告警</option>
                  <option value="连续超时告警">连续超时告警</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">统一触发阈值:</label>
                <input
                  type="number"
                  value={batchFormData.threshold}
                  onChange={(e) => setBatchFormData({ ...batchFormData, threshold: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">持续判定时长 (分钟):</label>
                <input
                  type="number"
                  value={batchFormData.durationMinutes}
                  onChange={(e) => setBatchFormData({ ...batchFormData, durationMinutes: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBatchEditModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-sm cursor-pointer"
                >
                  应用修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
