import React from 'react';
import {
  ActivitySquare,
  ShieldAlert,
  Terminal,
  FileText,
  FolderTree,
  Table,
  LineChart,
  Eye,
  Server,
  Cpu,
  Bookmark,
  Layers,
  FileCode,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  HardDrive,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { MenuId } from '../../types';

interface DashboardHomeProps {
  onNavigate: (menuId: MenuId) => void;
  unclaimedAlertsCount: number;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  onNavigate,
  unclaimedAlertsCount,
}) => {
  // 快捷跳转卡片定义（完全对应 3.3 与 3.4 次级模块）
  const quickJumpSections = [
    {
      category: '3.3 上报查看模块',
      description: '实时运行态势、告警处置、日志检索与多维可视化图表',
      items: [
        {
          id: 'alert-list' as MenuId,
          code: '3.3.1.1',
          parentCode: '3.3.1',
          name: '监控点告警列表',
          group: '监控告警查看',
          icon: ShieldAlert,
          iconColor: 'text-rose-500 bg-rose-50 border-rose-200',
          desc: '查看异常指标、告警持续时间，支持一键认领、修复标记与屏蔽处理',
          badge: unclaimedAlertsCount > 0 ? `${unclaimedAlertsCount}条待办` : '正常',
          badgeColor: unclaimedAlertsCount > 0 ? 'bg-rose-500 text-white' : 'bg-emerald-100 text-emerald-700',
        },
        {
          id: 'log-realtime' as MenuId,
          code: '3.3.2.1',
          parentCode: '3.3.2',
          name: '实时日志查看',
          group: '日志查看',
          icon: Terminal,
          iconColor: 'text-blue-500 bg-blue-50 border-blue-200',
          desc: '多条件动态筛选，支持流式日志监听、实时参数解析与暂停抓取',
        },
        {
          id: 'log-history' as MenuId,
          code: '3.3.2.2',
          parentCode: '3.3.2',
          name: '历史日志查看',
          group: '日志查看',
          icon: FileText,
          iconColor: 'text-indigo-500 bg-indigo-50 border-indigo-200',
          desc: '精确时间窗口、TraceID关联追踪、全链路异常堆栈与批量导出',
        },
        {
          id: 'log-files' as MenuId,
          code: '3.3.2.3',
          parentCode: '3.3.2',
          name: '日志文件列表',
          group: '日志查看',
          icon: FolderTree,
          iconColor: 'text-sky-500 bg-sky-50 border-sky-200',
          desc: '查看日志文件尺寸、压缩状态与行数统计，并可一键跳转历史日志',
        },
        {
          id: 'plugin-linux' as MenuId,
          code: '3.3.3',
          parentCode: '3.3.3',
          name: 'Linux基础资源监控',
          group: '插件实时表格',
          icon: Table,
          iconColor: 'text-amber-500 bg-amber-50 border-amber-200',
          desc: '系统概况、物理内存占用、TCP/UDP连接状态与磁盘IO实时明细表格',
        },
        {
          id: 'plugin-browser' as MenuId,
          code: '3.3.4',
          parentCode: '3.3.4',
          name: '浏览器端监控',
          group: '插件图表',
          icon: LineChart,
          iconColor: 'text-purple-500 bg-purple-50 border-purple-200',
          desc: 'OS类型分布、浏览器版本占比、访客地域分布与API耗时P90/P99趋势',
        },
        {
          id: 'view-common' as MenuId,
          code: '3.3.5.1',
          parentCode: '3.3.5',
          name: '监控系统-常用',
          group: '视图查看',
          icon: Eye,
          iconColor: 'text-cyan-500 bg-cyan-50 border-cyan-200',
          desc: '时间段筛选走势、日志写入吞吐量、登录及CGI请求成功率分析',
        },
        {
          id: 'server-status' as MenuId,
          code: '3.3.6',
          parentCode: '3.3.6',
          name: '服务器运行状态',
          group: '服务器查看',
          icon: Server,
          iconColor: 'text-teal-500 bg-teal-50 border-teal-200',
          desc: '指定日期运行态势、磁盘写入量、vmem虚拟内存存取吞吐及访问延迟',
        },
      ],
    },
    {
      category: '3.4 上报管理模块',
      description: '上报机器运维、监控点类型与告警策略编排、日志源与频控配置',
      items: [
        {
          id: 'mgmt-machines' as MenuId,
          code: '3.4.1',
          parentCode: '3.4.1',
          name: '上报机器管理',
          group: '上报机器管理',
          icon: Cpu,
          iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
          desc: '机器列表检索（ID/IP）、添加修改删除、探针插件在线部署及详情查看',
        },
        {
          id: 'mgmt-point-types' as MenuId,
          code: '3.4.2.1',
          parentCode: '3.4.2',
          name: '监控点类型管理',
          group: '监控点管理',
          icon: Bookmark,
          iconColor: 'text-orange-500 bg-orange-50 border-orange-200',
          desc: '监控指标类型编辑、右侧增删改表单及聚合算法（Sum/Avg/Max）配置',
        },
        {
          id: 'mgmt-points' as MenuId,
          code: '3.4.2.2',
          parentCode: '3.4.2',
          name: '监控点管理',
          group: '监控点管理',
          icon: ActivitySquare,
          iconColor: 'text-blue-600 bg-blue-50 border-blue-200',
          desc: '监控点全量列表展示、批量导入CSV/JSON、指标采集频次与增删改查',
        },
        {
          id: 'mgmt-point-views' as MenuId,
          code: '3.4.2.3',
          parentCode: '3.4.2',
          name: '监控点视图管理',
          group: '监控点管理',
          icon: Layers,
          iconColor: 'text-violet-500 bg-violet-50 border-violet-200',
          desc: '自定义监控大屏视图列表、ID与关键字检索、多监控点组合与增删改',
        },
        {
          id: 'mgmt-point-alarms' as MenuId,
          code: '3.4.2.4',
          parentCode: '3.4.2',
          name: '监控点告警配置',
          group: '监控点管理',
          icon: AlertTriangle,
          iconColor: 'text-rose-600 bg-rose-50 border-rose-200',
          desc: '单机/视图告警规则、批量修改阈值、批量屏蔽/解除屏蔽/删除与多维搜索',
        },
        {
          id: 'mgmt-apps' as MenuId,
          code: '3.4.3.1',
          parentCode: '3.4.3',
          name: '应用管理',
          group: '日志源管理',
          icon: Layers,
          iconColor: 'text-indigo-600 bg-indigo-50 border-indigo-200',
          desc: '业务应用系统注册、归属研发团队管理、关联模块列表与详情探查',
        },
        {
          id: 'mgmt-modules' as MenuId,
          code: '3.4.3.2',
          parentCode: '3.4.3',
          name: '模块管理',
          group: '日志源管理',
          icon: FolderTree,
          iconColor: 'text-blue-600 bg-blue-50 border-blue-200',
          desc: '服务模块注册维护、模块类型与技术栈标记、健康检查探针与增删改',
        },
        {
          id: 'mgmt-log-configs' as MenuId,
          code: '3.4.3.3',
          parentCode: '3.4.3',
          name: '日志配置管理',
          group: '日志源管理',
          icon: FileCode,
          iconColor: 'text-slate-700 bg-slate-100 border-slate-300',
          desc: '日志采集配置列表、频率限制（条/秒与突发限制）、JSON/正则类型规则',
        },
      ],
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 顶部欢迎卡与核心运行指标 */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 rounded-2xl p-6 text-white shadow-lg border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>3.2 首页模块 · 次级模块快捷跳转中枢</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              运维监控与全链路日志上报系统
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              提供从上报机器纳管、监控点编排、频控采集到实时告警处置、多维时序图表与日志审计的一站式运维管控。
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('alert-list')}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-medium transition-colors shadow-md shadow-rose-600/30 flex items-center gap-2 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>处置待办告警 ({unclaimedAlertsCount})</span>
            </button>
            <button
              onClick={() => onNavigate('log-realtime')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Terminal className="w-4 h-4" />
              <span>查看实时日志流</span>
            </button>
          </div>
        </div>

        {/* 关键统计指标横幅 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>在册上报主机</span>
              <Cpu className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white mt-1">7 台</div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>在线率 85.7% (1台演练 1台离线)</span>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>当前未解除告警</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xl font-bold font-mono text-rose-300 mt-1">5 起</div>
            <div className="text-[11px] text-rose-400 mt-1">
              致命: 1 · 严重: 2 · 警告: 2
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>今日日志写入总量</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white mt-1">1,849 万条</div>
            <div className="text-[11px] text-cyan-400 mt-1">约 6.24 GB 压缩存储</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>CGI接口平均响应</span>
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white mt-1">42.5 ms</div>
            <div className="text-[11px] text-emerald-400 mt-1">QPS 峰值 24,500 / 成功率 99.6%</div>
          </div>
        </div>
      </div>

      {/* 次级模块快捷跳转卡片网格 */}
      {quickJumpSections.map((sec, secIdx) => (
        <div key={secIdx} className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span>{sec.category}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{sec.description}</p>
            </div>
            <span className="text-xs text-slate-400">共 {sec.items.length} 个功能子项</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sec.items.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-lg border flex items-center justify-center ${item.iconColor}`}
                        >
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <div className="text-[11px] font-mono text-slate-400 font-semibold">
                            {item.code}
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </h4>
                        </div>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <div className="inline-block text-[11px] text-slate-400 font-medium bg-slate-100 px-1.5 py-0.5 rounded mb-2">
                      所属：{item.parentCode} {item.group}
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-medium group-hover:translate-x-0.5 transition-transform">
                    <span>立即进入模块</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
