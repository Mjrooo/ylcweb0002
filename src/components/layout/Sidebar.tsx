import React, { useState } from 'react';
import {
  LayoutDashboard,
  ActivitySquare,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  FileText,
  Table,
  LineChart,
  Eye,
  Server,
  Cpu,
  Bookmark,
  Layers,
  FileCode,
  FolderTree,
  Terminal,
  Search,
} from 'lucide-react';
import { MenuId, NavCategory, NavGroupItem, NavSubItem } from '../../types';
import { NAVIGATION_STRUCTURE } from '../../mockData';

interface SidebarProps {
  currentMenuId: MenuId;
  onNavigate: (menuId: MenuId) => void;
  unclaimedAlertsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentMenuId,
  onNavigate,
  unclaimedAlertsCount,
}) => {
  // 保持展开的一级分类和二级组
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'home': true,
    'report-view': true,
    'report-mgmt': true,
  });

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'alarm-view': true,
    'log-view': true,
    'plugin-table': true,
    'plugin-chart': true,
    'view-look': true,
    'server-look': true,
    'machine-mgmt': true,
    'point-mgmt': true,
    'log-source-mgmt': true,
  });

  const [filterKeyword, setFilterKeyword] = useState('');

  const toggleCategory = (catId: string) => {
    setOpenCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'home':
        return LayoutDashboard;
      case 'report-view':
        return ActivitySquare;
      case 'report-mgmt':
        return SlidersHorizontal;
      default:
        return FolderTree;
    }
  };

  const getSubItemIcon = (id: MenuId) => {
    switch (id) {
      case 'home':
        return LayoutDashboard;
      case 'alert-list':
        return ShieldAlert;
      case 'log-realtime':
        return Terminal;
      case 'log-history':
        return FileText;
      case 'log-files':
        return FolderTree;
      case 'plugin-linux':
        return Table;
      case 'plugin-browser':
        return LineChart;
      case 'view-common':
        return Eye;
      case 'server-status':
        return Server;
      case 'mgmt-machines':
        return Cpu;
      case 'mgmt-point-types':
        return Bookmark;
      case 'mgmt-points':
        return ActivitySquare;
      case 'mgmt-point-views':
        return Layers;
      case 'mgmt-point-alarms':
        return ShieldAlert;
      case 'mgmt-apps':
        return Layers;
      case 'mgmt-modules':
        return FolderTree;
      case 'mgmt-log-configs':
        return FileCode;
      default:
        return ChevronRight;
    }
  };

  return (
    <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col shrink-0 h-screen border-r border-slate-800 select-none">
      {/* 侧边栏系统LOGO & 标题 */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-800 bg-slate-950/60">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <Server className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-sm text-white tracking-wide">
            运维监控后台管理系统
          </h1>
          <p className="text-[11px] text-slate-400 font-mono">v3.8 Enterprise Ops</p>
        </div>
      </div>

      {/* 目录快速搜索过滤 */}
      <div className="p-3 border-b border-slate-800/80">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="搜索功能目录..."
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-800/80 border border-slate-700/60 rounded-md text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 树形目录结构导航 (一级目录 -> 二级目录 -> 三级功能) */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-3 custom-scrollbar text-xs">
        {NAVIGATION_STRUCTURE.map((category) => {
          const isCatOpen = openCategories[category.id] ?? true;

          // 过滤逻辑
          const matchesCategory =
            category.label.includes(filterKeyword) ||
            category.code.includes(filterKeyword);

          return (
            <div key={category.id} className="space-y-1">
              {/* 一级目录 (首页模块, 上报查看, 上报管理) */}
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800/80 font-semibold transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {(() => {
                    const CatIcon = getCategoryIcon(category.id);
                    return <CatIcon className="w-4 h-4 text-blue-400 shrink-0" />;
                  })()}
                  <span className="text-sm text-white">{category.label}</span>
                </div>
                {isCatOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {/* 一级直属子项 */}
              {isCatOpen && category.directSubItems && (
                <div className="ml-3 pl-3 border-l border-slate-800 space-y-0.5 py-0.5">
                  {category.directSubItems.map((subItem) => {
                    const isActive = currentMenuId === subItem.id;
                    const IconComp = getSubItemIcon(subItem.id);
                    return (
                      <button
                        key={subItem.id}
                        type="button"
                        onClick={() => onNavigate(subItem.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all cursor-pointer ${
                          isActive
                            ? 'bg-blue-600 text-white font-medium shadow-sm shadow-blue-600/40'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span>{subItem.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 二级目录分组 (监控告警查看, 日志查看, 上报机器管理 等) */}
              {isCatOpen && category.groups && (
                <div className="ml-2 pl-2.5 border-l border-slate-800/80 space-y-1 py-1">
                  {category.groups.map((group) => {
                    const isGroupOpen = openGroups[group.id] ?? true;

                    // 检查搜索关键字匹配
                    const subFiltered = group.subItems.filter(
                      (si) =>
                        !filterKeyword ||
                        si.label.includes(filterKeyword) ||
                        group.label.includes(filterKeyword)
                    );

                    if (filterKeyword && subFiltered.length === 0) {
                      return null;
                    }

                    return (
                      <div key={group.id} className="space-y-0.5">
                        {/* 二级目录 Header */}
                        <button
                          type="button"
                          onClick={() => toggleGroup(group.id)}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-xs text-slate-300">
                              {group.label}
                            </span>
                          </div>
                          {isGroupOpen ? (
                            <ChevronDown className="w-3 h-3 text-slate-500" />
                          ) : (
                            <ChevronRight className="w-3 h-3 text-slate-500" />
                          )}
                        </button>

                        {/* 三级功能子菜单项 */}
                        {isGroupOpen && (
                          <div className="ml-2 pl-2 border-l border-slate-800/60 space-y-0.5 py-0.5">
                            {subFiltered.map((subItem) => {
                              const isActive = currentMenuId === subItem.id;
                              const IconComp = getSubItemIcon(subItem.id);

                              const badgeVal =
                                subItem.id === 'alert-list'
                                  ? unclaimedAlertsCount
                                  : subItem.badge;

                              return (
                                <button
                                  key={subItem.id}
                                  type="button"
                                  onClick={() => onNavigate(subItem.id)}
                                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left transition-all cursor-pointer ${
                                    isActive
                                      ? 'bg-blue-600 text-white font-medium shadow-sm shadow-blue-600/30'
                                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <IconComp
                                      className={`w-3.5 h-3.5 shrink-0 ${
                                        isActive ? 'text-white' : 'text-slate-500'
                                      }`}
                                    />
                                    <span className="truncate text-xs">
                                      {subItem.label}
                                    </span>
                                  </div>

                                  {badgeVal !== undefined && Number(badgeVal) > 0 && (
                                    <div className="flex items-center shrink-0 ml-1">
                                      <span
                                        className={`px-1.5 py-0.2 min-w-4 text-[10px] font-bold rounded-full text-center ${
                                          subItem.badgeColor || 'bg-rose-500 text-white'
                                        }`}
                                      >
                                        {badgeVal}
                                      </span>
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* 底部系统环境概览 */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400">
        <div className="flex items-center justify-between mb-1">
          <span className="text-slate-500">运行节点：</span>
          <span className="font-mono text-emerald-400">7台在线 / 0异常</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">探针采集：</span>
          <span className="font-mono text-blue-400">4,280 metrics/s</span>
        </div>
      </div>
    </aside>
  );
};
