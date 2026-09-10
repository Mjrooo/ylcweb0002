import React from 'react';
import {
  Bell,
  Search,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Globe,
  Radio,
} from 'lucide-react';
import { MenuId, User } from '../../types';

interface HeaderProps {
  currentMenuId: MenuId;
  onNavigate: (menuId: MenuId) => void;
  currentUser: User;
  onLogout: () => void;
  unclaimedAlertsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentMenuId,
  onNavigate,
  currentUser,
  onLogout,
  unclaimedAlertsCount,
}) => {
  // Breadcrumb mapping
  const getBreadcrumb = (id: MenuId) => {
    switch (id) {
      case 'home':
        return ['首页模块', '系统首页总览'];
      case 'alert-list':
        return ['上报查看', '监控告警查看', '监控点告警列表'];
      case 'log-realtime':
        return ['上报查看', '日志查看', '实时日志查看'];
      case 'log-history':
        return ['上报查看', '日志查看', '历史日志查看'];
      case 'log-files':
        return ['上报查看', '日志查看', '日志文件列表'];
      case 'plugin-linux':
        return ['上报查看', '插件实时表格', 'Linux基础资源监控'];
      case 'plugin-browser':
        return ['上报查看', '插件图表', '浏览器端监控'];
      case 'view-common':
        return ['上报查看', '视图查看', '监控系统-常用'];
      case 'server-status':
        return ['上报查看', '服务器查看', '服务器运行状态'];
      case 'mgmt-machines':
        return ['上报管理', '上报机器管理'];
      case 'mgmt-point-types':
        return ['上报管理', '监控点管理', '监控点类型管理'];
      case 'mgmt-points':
        return ['上报管理', '监控点管理', '监控点管理'];
      case 'mgmt-point-views':
        return ['上报管理', '监控点管理', '监控点视图管理'];
      case 'mgmt-point-alarms':
        return ['上报管理', '监控点管理', '监控点告警配置'];
      case 'mgmt-apps':
        return ['上报管理', '日志源管理', '应用管理'];
      case 'mgmt-modules':
        return ['上报管理', '日志源管理', '模块管理'];
      case 'mgmt-log-configs':
        return ['上报管理', '日志源管理', '日志配置管理'];
      default:
        return ['系统后台'];
    }
  };

  const breadcrumbs = getBreadcrumb(currentMenuId);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20 shrink-0">
      {/* 左侧面包屑与导航指示 */}
      <div className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            <span
              className={
                idx === breadcrumbs.length - 1
                  ? 'font-semibold text-slate-800'
                  : 'text-slate-500'
              }
            >
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* 右侧集群状态、告警通知、用户面板 */}
      <div className="flex items-center gap-4">
        {/* 系统集群健康状态 */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <Radio className="w-3.5 h-3.5" />
          <span>上报链路健康 (SLA 99.98%)</span>
        </div>

        {/* 告警提醒按钮 */}
        <button
          onClick={() => onNavigate('alert-list')}
          title="点击快速查看待处理告警"
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          {unclaimedAlertsCount > 0 && (
            <span className="absolute top-1 right-1 px-1.5 py-0.5 min-w-4 text-[10px] font-bold bg-rose-500 text-white rounded-full leading-none flex items-center justify-center">
              {unclaimedAlertsCount}
            </span>
          )}
        </button>

        {/* 登录用户信息与退出 */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-slate-800 leading-tight">
              {currentUser.realName}
            </div>
            <div className="text-xs text-slate-400">
              {currentUser.role} · {currentUser.username}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {currentUser.realName.slice(0, 1)}
          </div>
          <button
            onClick={onLogout}
            title="退出登录"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
