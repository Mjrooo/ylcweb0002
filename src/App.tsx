/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  MenuId,
  User,
  LogItem,
  MachineItem,
  MonitorPointItem,
  PointTypeItem,
  PointViewItem,
  AlarmConfigItem,
  AppItem,
  ModuleItem,
  LogConfigItem,
  AlertItem,
} from './types';
import {
  MOCK_USER,
  INITIAL_ALERTS,
  MOCK_REALTIME_LOGS,
  MOCK_LOG_FILES,
  MOCK_MACHINES,
  INITIAL_POINT_TYPES,
  INITIAL_MONITOR_POINTS,
  INITIAL_POINT_VIEWS,
  INITIAL_ALARM_CONFIGS,
  INITIAL_APPS,
  INITIAL_MODULES,
  INITIAL_LOG_SOURCE_CONFIGS,
} from './mockData';

// 布局组件
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// 3.1 登录模块
import { LoginPage } from './components/auth/LoginPage';

// 3.2 首页模块
import { DashboardHome } from './components/dashboard/DashboardHome';

// 3.3 上报查看模块
import { AlertListView } from './components/views/report-view/AlertListView';
import { RealtimeLogView } from './components/views/report-view/RealtimeLogView';
import { HistoryLogView } from './components/views/report-view/HistoryLogView';
import { LogFileListView } from './components/views/report-view/LogFileListView';
import { LinuxResourceView } from './components/views/report-view/LinuxResourceView';
import { BrowserMonitorView } from './components/views/report-view/BrowserMonitorView';
import { CommonMonitorView } from './components/views/report-view/CommonMonitorView';
import { ServerStatusView } from './components/views/report-view/ServerStatusView';

// 3.4 上报管理模块
import { MachineMgmtView } from './components/views/report-mgmt/MachineMgmtView';
import { PointTypeMgmtView } from './components/views/report-mgmt/PointTypeMgmtView';
import { PointMgmtView } from './components/views/report-mgmt/PointMgmtView';
import { PointViewMgmtView } from './components/views/report-mgmt/PointViewMgmtView';
import { PointAlarmConfigView } from './components/views/report-mgmt/PointAlarmConfigView';
import { AppMgmtView } from './components/views/report-mgmt/AppMgmtView';
import { ModuleMgmtView } from './components/views/report-mgmt/ModuleMgmtView';
import { LogSourceConfigView } from './components/views/report-mgmt/LogSourceConfigView';

export default function App() {
  // 认证状态（默认为超级管理员登录状态，支持退出并重新登录）
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USER);

  // 当前导航菜单状态，默认定位到 3.2 首页模块
  const [currentMenuId, setCurrentMenuId] = useState<MenuId>('home');

  // 快捷跳转历史日志的上下文状态预填
  const [historyLogPrefill, setHistoryLogPrefill] = useState<{
    app?: string;
    module?: string;
    ip?: string;
  }>({});

  // 全局业务数据状态
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [logs] = useState<LogItem[]>(MOCK_REALTIME_LOGS);
  const [logFiles] = useState(MOCK_LOG_FILES);
  const [machines, setMachines] = useState<MachineItem[]>(MOCK_MACHINES);
  const [pointTypes, setPointTypes] = useState<PointTypeItem[]>(INITIAL_POINT_TYPES);
  const [monitorPoints, setMonitorPoints] = useState<MonitorPointItem[]>(INITIAL_MONITOR_POINTS);
  const [pointViews, setPointViews] = useState<PointViewItem[]>(INITIAL_POINT_VIEWS);
  const [alarmRules, setAlarmRules] = useState<AlarmConfigItem[]>(INITIAL_ALARM_CONFIGS);
  const [apps, setApps] = useState<AppItem[]>(INITIAL_APPS);
  const [modules, setModules] = useState<ModuleItem[]>(INITIAL_MODULES);
  const [logConfigs, setLogConfigs] = useState<LogConfigItem[]>(INITIAL_LOG_SOURCE_CONFIGS);

  // 未处理告警数量统计
  const unclaimedAlertsCount = alerts.filter(
    (a) => a.status === 'UNCLAIMED' || a.status === 'PENDING'
  ).length;

  // 登录处理
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentMenuId('home');
  };

  // 登出处理
  const handleLogout = () => {
    setCurrentUser(null);
  };

  // 跨模块快捷跳转
  const handleNavigate = (menuId: MenuId) => {
    setCurrentMenuId(menuId);
  };

  // 3.3.2.3 日志文件列表 -> 3.3.2.2 历史日志快捷跳转
  const handleJumpToHistoryLog = (app: string, module: string, ip: string) => {
    setHistoryLogPrefill({ app, module, ip });
    setCurrentMenuId('log-history');
  };

  // 未登录状态展示 3.1 登录模块
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} onLoginSuccess={handleLogin} />;
  }

  // 告警状态单条更新（认领、处置完成、忽略等）
  const handleUpdateAlertStatus = (id: string, status: AlertItem['status'], comment?: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status,
              handler: currentUser.realName || currentUser.username,
              processedBy: currentUser.realName || currentUser.username,
              processTime: '刚刚',
              handleNotes: comment || a.handleNotes,
              processComment: comment || a.processComment,
            }
          : a
      )
    );
  };

  // 批量更新告警状态
  const handleBatchUpdateAlertStatus = (ids: string[], status: AlertItem['status']) => {
    setAlerts((prev) =>
      prev.map((a) =>
        ids.includes(a.id)
          ? {
              ...a,
              status,
              handler: currentUser.realName || currentUser.username,
              processedBy: currentUser.realName || currentUser.username,
              processTime: '刚刚',
            }
          : a
      )
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* 左侧层级导航栏 */}
      <Sidebar
        currentMenuId={currentMenuId}
        onNavigate={handleNavigate}
        unclaimedAlertsCount={unclaimedAlertsCount}
      />

      {/* 右侧主内容区域 */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden">
        {/* 全局顶部 Header */}
        <Header
          currentMenuId={currentMenuId}
          onNavigate={handleNavigate}
          currentUser={currentUser}
          onLogout={handleLogout}
          unclaimedAlertsCount={unclaimedAlertsCount}
        />

        {/* 动态视图渲染容器 */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/60">
          {/* 3.2 首页模块 */}
          {(currentMenuId === 'home' || currentMenuId === '3.2') && (
            <DashboardHome
              onNavigate={handleNavigate}
              unclaimedAlertsCount={unclaimedAlertsCount}
            />
          )}

          {/* 3.3.1.1 监控点告警列表 */}
          {(currentMenuId === 'alert-list' || currentMenuId === '3.3.1.1') && (
            <AlertListView
              alerts={alerts}
              onUpdateStatus={handleUpdateAlertStatus}
              onBatchUpdateStatus={handleBatchUpdateAlertStatus}
            />
          )}

          {/* 3.3.2.1 实时日志查看 */}
          {(currentMenuId === 'log-realtime' || currentMenuId === '3.3.2.1') && (
            <RealtimeLogView initialLogs={logs} />
          )}

          {/* 3.3.2.2 历史日志查看 */}
          {(currentMenuId === 'log-history' || currentMenuId === '3.3.2.2') && (
            <HistoryLogView
              logs={logs}
              prefilledApp={historyLogPrefill.app}
              prefilledModule={historyLogPrefill.module}
              prefilledIp={historyLogPrefill.ip}
            />
          )}

          {/* 3.3.2.3 日志文件列表 */}
          {(currentMenuId === 'log-files' || currentMenuId === '3.3.2.3') && (
            <LogFileListView
              files={logFiles}
              onJumpToHistoryLog={handleJumpToHistoryLog}
            />
          )}

          {/* 3.3.3 插件实时表格 */}
          {(currentMenuId === 'plugin-linux' || currentMenuId === '3.3.3') && (
            <LinuxResourceView />
          )}

          {/* 3.3.4 插件图表 */}
          {(currentMenuId === 'plugin-browser' || currentMenuId === '3.3.4') && (
            <BrowserMonitorView />
          )}

          {/* 3.3.5.1 监控系统-常用 */}
          {(currentMenuId === 'view-common' || currentMenuId === '3.3.5.1') && (
            <CommonMonitorView />
          )}

          {/* 3.3.6 服务器查看 */}
          {(currentMenuId === 'server-status' || currentMenuId === '3.3.6') && (
            <ServerStatusView />
          )}

          {/* 3.4.1 上报机器管理 */}
          {(currentMenuId === 'mgmt-machines' || currentMenuId === '3.4.1') && (
            <MachineMgmtView
              machines={machines}
              onAddMachine={(newM) => setMachines([newM, ...machines])}
              onUpdateMachine={(upM) =>
                setMachines(machines.map((m) => (m.id === upM.id ? upM : m)))
              }
              onDeleteMachine={(id) => setMachines(machines.filter((m) => m.id !== id))}
            />
          )}

          {/* 3.4.2.1 监控点类型管理 */}
          {(currentMenuId === 'mgmt-point-types' || currentMenuId === '3.4.2.1') && (
            <PointTypeMgmtView
              types={pointTypes}
              points={monitorPoints}
              onAddType={(t) => setPointTypes([...pointTypes, t])}
              onUpdateType={(t) =>
                setPointTypes(pointTypes.map((item) => (item.id === t.id ? t : item)))
              }
              onDeleteType={(id) => setPointTypes(pointTypes.filter((item) => item.id !== id))}
            />
          )}

          {/* 3.4.2.2 监控点管理 */}
          {(currentMenuId === 'mgmt-points' || currentMenuId === '3.4.2.2') && (
            <PointMgmtView
              points={monitorPoints}
              types={pointTypes}
              onAddPoint={(p) => setMonitorPoints([p, ...monitorPoints])}
              onUpdatePoint={(p) =>
                setMonitorPoints(monitorPoints.map((item) => (item.id === p.id ? p : item)))
              }
              onDeletePoint={(id) =>
                setMonitorPoints(monitorPoints.filter((item) => item.id !== id))
              }
              onBatchImport={(newPoints) =>
                setMonitorPoints([...newPoints, ...monitorPoints])
              }
            />
          )}

          {/* 3.4.2.3 监控点视图管理 */}
          {(currentMenuId === 'mgmt-point-views' || currentMenuId === '3.4.2.3') && (
            <PointViewMgmtView
              views={pointViews}
              availablePoints={monitorPoints}
              onAddView={(v) => setPointViews([v, ...pointViews])}
              onUpdateView={(v) =>
                setPointViews(pointViews.map((item) => (item.id === v.id ? v : item)))
              }
              onDeleteView={(id) => setPointViews(pointViews.filter((item) => item.id !== id))}
            />
          )}

          {/* 3.4.2.4 监控点告警配置 */}
          {(currentMenuId === 'mgmt-point-alarms' || currentMenuId === '3.4.2.4') && (
            <PointAlarmConfigView
              rules={alarmRules}
              availablePoints={monitorPoints}
              availableViews={pointViews}
              onAddRule={(r) => setAlarmRules([r, ...alarmRules])}
              onUpdateRule={(r) =>
                setAlarmRules(alarmRules.map((item) => (item.id === r.id ? r : item)))
              }
              onDeleteRule={(id) => setAlarmRules(alarmRules.filter((item) => item.id !== id))}
              onBatchUpdateStatus={(ids, status) =>
                setAlarmRules(
                  alarmRules.map((r) => (ids.includes(r.id) ? { ...r, status } : r))
                )
              }
              onBatchDelete={(ids) =>
                setAlarmRules(alarmRules.filter((r) => !ids.includes(r.id)))
              }
            />
          )}

          {/* 3.4.3.1 应用管理 */}
          {(currentMenuId === 'mgmt-apps' || currentMenuId === '3.4.3.1') && (
            <AppMgmtView
              apps={apps}
              onAddApp={(a) => setApps([a, ...apps])}
              onUpdateApp={(a) =>
                setApps(apps.map((item) => (item.id === a.id ? a : item)))
              }
              onDeleteApp={(id) => setApps(apps.filter((item) => item.id !== id))}
            />
          )}

          {/* 3.4.3.2 模块管理 */}
          {(currentMenuId === 'mgmt-modules' || currentMenuId === '3.4.3.2') && (
            <ModuleMgmtView
              modules={modules}
              availableApps={apps}
              onAddModule={(m) => setModules([m, ...modules])}
              onUpdateModule={(m) =>
                setModules(modules.map((item) => (item.id === m.id ? m : item)))
              }
              onDeleteModule={(id) => setModules(modules.filter((item) => item.id !== id))}
            />
          )}

          {/* 3.4.3.3 日志配置 */}
          {(currentMenuId === 'mgmt-log-configs' || currentMenuId === '3.4.3.3') && (
            <LogSourceConfigView
              configs={logConfigs}
              availableApps={apps}
              availableModules={modules}
              onAddConfig={(c) => setLogConfigs([c, ...logConfigs])}
              onUpdateConfig={(c) =>
                setLogConfigs(logConfigs.map((item) => (item.id === c.id ? c : item)))
              }
              onDeleteConfig={(id) => setLogConfigs(logConfigs.filter((item) => item.id !== id))}
            />
          )}
        </main>
      </div>
    </div>
  );
}
