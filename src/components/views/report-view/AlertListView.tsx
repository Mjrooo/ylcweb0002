import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Eye,
  Check,
  Ban,
  RefreshCw,
  SlidersHorizontal,
  X,
  AlertOctagon,
  FileCheck,
  UserCheck,
} from 'lucide-react';
import { AlertItem } from '../../../types';

interface AlertListViewProps {
  alerts: AlertItem[];
  onUpdateAlertStatus: (
    id: string,
    status: AlertItem['status'],
    notes?: string,
    handler?: string
  ) => void;
}

export const AlertListView: React.FC<AlertListViewProps> = ({
  alerts,
  onUpdateAlertStatus,
}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  // 处理操作弹窗
  const [actionAlert, setActionAlert] = useState<AlertItem | null>(null);
  const [actionType, setActionType] = useState<'CLAIM' | 'RESOLVE' | 'IGNORE'>('CLAIM');
  const [actionNotes, setActionNotes] = useState('');

  // 过滤告警
  const filteredAlerts = alerts.filter((alert) => {
    const matchKeyword =
      !searchKeyword ||
      alert.id.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      alert.pointName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      alert.pointId.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      alert.machineIp.includes(searchKeyword) ||
      alert.moduleName.toLowerCase().includes(searchKeyword.toLowerCase());

    const matchLevel = levelFilter === 'ALL' || alert.level === levelFilter;
    const matchStatus = statusFilter === 'ALL' || alert.status === statusFilter;

    return matchKeyword && matchLevel && matchStatus;
  });

  const getLevelBadge = (level: AlertItem['level']) => {
    switch (level) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            致命 (Critical)
          </span>
        );
      case 'MAJOR':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            严重 (Major)
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            警告 (Warning)
          </span>
        );
      case 'INFO':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            提醒 (Info)
          </span>
        );
    }
  };

  const getStatusBadge = (status: AlertItem['status']) => {
    switch (status) {
      case 'UNCLAIMED':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            待认领
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            处理中
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            已恢复
          </span>
        );
      case 'IGNORED':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            已忽略
          </span>
        );
    }
  };

  const handleOpenAction = (alert: AlertItem, type: 'CLAIM' | 'RESOLVE' | 'IGNORE') => {
    setActionAlert(alert);
    setActionType(type);
    setActionNotes(
      type === 'CLAIM'
        ? '已由当前值班人员认领，正在排查机器指标与系统日志'
        : type === 'RESOLVE'
        ? '已修复根因并验证指标回落到安全阈值'
        : '业务批量演练或已知预热，临时设为忽略'
    );
  };

  const handleConfirmAction = () => {
    if (!actionAlert) return;
    const targetStatus =
      actionType === 'CLAIM'
        ? 'PROCESSING'
        : actionType === 'RESOLVE'
        ? 'RESOLVED'
        : 'IGNORED';

    onUpdateAlertStatus(actionAlert.id, targetStatus, actionNotes, '管理员 (ops_admin)');
    setActionAlert(null);
  };

  return (
    <div className="p-6 space-y-5">
      {/* 模块标题与说明 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-blue-600 font-mono mb-1">
            上报查看 &gt; 监控告警查看 &gt; 监控点告警列表
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span>监控点告警列表</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            实时捕获各监控点触发的阈值越界告警，支持在线认领、处置闭环跟踪与多维度检索
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-medium text-slate-700">当前待处理:</span>
          <span className="px-2 py-0.5 bg-rose-500 text-white rounded-full font-bold">
            {alerts.filter((a) => a.status === 'UNCLAIMED').length} 条
          </span>
        </div>
      </div>

      {/* 检索过滤条 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="搜索监控点ID/名称、机器IP、模块或告警号..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">告警级别:</span>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">全部级别</option>
            <option value="CRITICAL">致命 (Critical)</option>
            <option value="MAJOR">严重 (Major)</option>
            <option value="WARNING">警告 (Warning)</option>
            <option value="INFO">提醒 (Info)</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">处理状态:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">全部状态</option>
            <option value="UNCLAIMED">待认领</option>
            <option value="PROCESSING">处理中</option>
            <option value="RESOLVED">已恢复</option>
            <option value="IGNORED">已忽略</option>
          </select>
        </div>

        <button
          onClick={() => {
            setSearchKeyword('');
            setLevelFilter('ALL');
            setStatusFilter('ALL');
          }}
          className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>重置筛选</span>
        </button>
      </div>

      {/* 告警列表表格 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">告警编号</th>
                <th className="py-3 px-4">监控点 / ID</th>
                <th className="py-3 px-4">级别</th>
                <th className="py-3 px-4">指标实测 / 阈值</th>
                <th className="py-3 px-4">触发机器 / 模块</th>
                <th className="py-3 px-4">触发时间 / 持续</th>
                <th className="py-3 px-4">处理状态</th>
                <th className="py-3 px-4 text-center">操作栏</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <AlertOctagon className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <span>未检索到匹配的告警记录</span>
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                      {alert.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{alert.pointName}</div>
                      <div className="font-mono text-[11px] text-slate-400">
                        {alert.pointId}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">{getLevelBadge(alert.level)}</td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-rose-600">
                        {alert.currentValue} {alert.unit}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        设定阈值: {alert.threshold} {alert.unit}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-800 font-medium">
                        {alert.machineIp}
                      </div>
                      <div className="text-[11px] text-slate-500">{alert.moduleName}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-700">{alert.occurredTime}</div>
                      <div className="text-[11px] text-rose-500 font-medium">
                        持续: {alert.duration}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">{getStatusBadge(alert.status)}</td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedAlert(alert)}
                          title="查看告警详情"
                          className="p-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {alert.status === 'UNCLAIMED' && (
                          <button
                            onClick={() => handleOpenAction(alert, 'CLAIM')}
                            title="认领此告警"
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>认领</span>
                          </button>
                        )}

                        {alert.status === 'PROCESSING' && (
                          <button
                            onClick={() => handleOpenAction(alert, 'RESOLVE')}
                            title="标记已恢复处置完成"
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>恢复</span>
                          </button>
                        )}

                        {alert.status !== 'RESOLVED' && alert.status !== 'IGNORED' && (
                          <button
                            onClick={() => handleOpenAction(alert, 'IGNORE')}
                            title="忽略告警"
                            className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors cursor-pointer"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>共显示 {filteredAlerts.length} 条告警项</span>
          <span>指标数据由各节点监控插件每 10s 汇总上报</span>
        </div>
      </div>

      {/* 告警详情抽屉/模态框 */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-base">告警详细信息与处置回溯</h3>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400">告警单号：</span>
                  <span className="font-mono font-bold text-slate-800">{selectedAlert.id}</span>
                </div>
                <div>
                  <span className="text-slate-400">告警级别：</span>
                  {getLevelBadge(selectedAlert.level)}
                </div>
                <div>
                  <span className="text-slate-400">监控指标：</span>
                  <span className="font-semibold text-slate-800">{selectedAlert.pointName}</span>
                </div>
                <div>
                  <span className="text-slate-400">监控点ID：</span>
                  <span className="font-mono text-slate-700">{selectedAlert.pointId}</span>
                </div>
                <div>
                  <span className="text-slate-400">触发机器IP：</span>
                  <span className="font-mono text-blue-600 font-semibold">{selectedAlert.machineIp}</span>
                </div>
                <div>
                  <span className="text-slate-400">所属模块：</span>
                  <span className="text-slate-800">{selectedAlert.moduleName}</span>
                </div>
                <div>
                  <span className="text-slate-400">当前实测值：</span>
                  <span className="font-mono font-bold text-rose-600">{selectedAlert.currentValue} {selectedAlert.unit}</span>
                </div>
                <div>
                  <span className="text-slate-400">越界阈值：</span>
                  <span className="font-mono text-slate-700">{selectedAlert.threshold} {selectedAlert.unit}</span>
                </div>
                <div>
                  <span className="text-slate-400">触发时间：</span>
                  <span className="text-slate-700">{selectedAlert.occurredTime}</span>
                </div>
                <div>
                  <span className="text-slate-400">持续时长：</span>
                  <span className="text-rose-600 font-medium">{selectedAlert.duration}</span>
                </div>
              </div>

              {/* 处置记录 */}
              <div className="border border-slate-200 rounded-lg p-3 space-y-2">
                <div className="font-semibold text-slate-800 flex items-center justify-between">
                  <span>当前处理状态</span>
                  {getStatusBadge(selectedAlert.status)}
                </div>
                <div className="text-slate-600">
                  <span className="text-slate-400">处置处理人：</span>
                  <span className="font-medium text-slate-800">
                    {selectedAlert.handler || '暂无认领人'}
                  </span>
                </div>
                {selectedAlert.handleNotes && (
                  <div className="bg-amber-50/70 border border-amber-200 p-2.5 rounded text-amber-900 text-xs">
                    <span className="font-semibold block mb-0.5">处置日志备注：</span>
                    {selectedAlert.handleNotes}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 处理操作确认弹窗 */}
      {actionAlert && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-600" />
              <span>
                {actionType === 'CLAIM' && '确认认领告警'}
                {actionType === 'RESOLVE' && '标记告警已恢复'}
                {actionType === 'IGNORE' && '忽略告警处理'}
              </span>
            </h3>

            <p className="text-xs text-slate-500 mb-3">
              正在操作单号 <strong className="font-mono text-slate-800">{actionAlert.id}</strong> ({actionAlert.pointName})
            </p>

            <div className="space-y-3 text-xs mb-4">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">处置措施 / 备注说明：</label>
                <textarea
                  rows={3}
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="请输入处置排查记录..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setActionAlert(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-4 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-500 font-medium rounded-lg shadow-sm cursor-pointer"
              >
                提交处置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
