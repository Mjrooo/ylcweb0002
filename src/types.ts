export type MenuId =
  | 'home' // 3.2 首页模块
  | '3.2'
  | 'alert-list' // 3.3.1.1 监控点告警列表
  | '3.3.1.1'
  | 'log-realtime' // 3.3.2.1 实时日志查看
  | '3.3.2.1'
  | 'log-history' // 3.3.2.2 历史日志查看
  | '3.3.2.2'
  | 'log-files' // 3.3.2.3 日志文件列表
  | '3.3.2.3'
  | 'plugin-linux' // 3.3.3 插件实时表格 - Linux基础资源
  | '3.3.3'
  | 'plugin-browser' // 3.3.4 插件图表 - 浏览器端监控
  | '3.3.4'
  | 'view-common' // 3.3.5.1 视图查看 - 监控系统-常用
  | '3.3.5.1'
  | 'server-status' // 3.3.6 服务器查看 - 服务器运行状态
  | '3.3.6'
  | 'mgmt-machines' // 3.4.1 上报机器管理
  | '3.4.1'
  | 'mgmt-point-types' // 3.4.2.1 监控点类型管理
  | '3.4.2.1'
  | 'mgmt-points' // 3.4.2.2 监控点管理
  | '3.4.2.2'
  | 'mgmt-point-views' // 3.4.2.3 监控点视图管理
  | '3.4.2.3'
  | 'mgmt-point-alarms' // 3.4.2.4 监控点告警配置
  | '3.4.2.4'
  | 'mgmt-apps' // 3.4.3.1 应用管理
  | '3.4.3.1'
  | 'mgmt-modules' // 3.4.3.2 模块管理
  | '3.4.3.2'
  | 'mgmt-log-configs' // 3.4.3.3 日志配置管理
  | '3.4.3.3';

export interface NavSubItem {
  id: MenuId;
  label: string;
  code: string;
  badge?: number | string;
  badgeColor?: string;
  description?: string;
}

export interface NavGroupItem {
  id: string;
  code: string;
  label: string;
  subItems: NavSubItem[];
}

export interface NavCategory {
  id: string;
  code: string;
  label: string;
  icon: string;
  groups?: NavGroupItem[];
  directSubItems?: NavSubItem[];
}

export interface User {
  username: string;
  role: string;
  realName: string;
  name?: string;
  department: string;
  avatar: string;
}

// 3.3.1.1 监控点告警
export interface AlertItem {
  id: string;
  pointId: string;
  pointName: string;
  level: 'CRITICAL' | 'MAJOR' | 'WARNING' | 'INFO';
  currentValue: number;
  threshold: number;
  unit: string;
  machineIp: string;
  moduleName: string;
  occurredTime: string;
  duration: string;
  status: 'UNCLAIMED' | 'PROCESSING' | 'RESOLVED' | 'IGNORED' | 'PENDING';
  handler?: string;
  handleNotes?: string;
  processedBy?: string;
  processTime?: string;
  processComment?: string;
}

// 3.3.2.1 / 3.3.2.2 日志项
export interface LogItem {
  id: string;
  timestamp: string;
  app: string;
  module: string;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  machineIp: string;
  traceId: string;
  message: string;
  durationMs: number;
  httpStatus: number;
  params?: Record<string, any>;
  stackTrace?: string;
}

// 3.3.2.3 日志文件
export interface LogFileItem {
  id: string;
  fileName: string;
  filePath: string;
  app: string;
  module: string;
  machineIp: string;
  fileSizeBytes: number;
  fileSizeStr: string;
  lineCount: number;
  lastModified: string;
  isCompressed: boolean;
}

// 3.4.1 机器
export interface MachineItem {
  id: string;
  machineId: string;
  ip: string;
  innerIp: string;
  hostname: string;
  env: 'prod' | 'staging' | 'dev';
  datacenter: string;
  status: 'ONLINE' | 'OFFLINE' | 'ABNORMAL';
  agentVersion: string;
  pluginStatus: 'DEPLOYED' | 'NOT_DEPLOYED' | 'UPDATING';
  cpuCores: number;
  memTotalGB: number;
  diskTotalGB: number;
  lastHeartbeat: string;
  tags: string[];
}

// 3.4.2.1 监控点类型
export interface PointTypeItem {
  id: string;
  typeCode: string;
  typeName: string;
  unit: string;
  aggregation: 'SUM' | 'AVG' | 'MAX' | 'MIN' | 'COUNT';
  isSystem: boolean;
  description: string;
  pointCount: number;
}

// 3.4.2.2 监控点
export interface MonitorPointItem {
  id: string;
  pointCode: string;
  pointName: string;
  typeCode: string;
  typeName: string;
  targetApp: string;
  targetModule: string;
  intervalSec: number;
  status: 'ENABLED' | 'DISABLED' | 'ACTIVE';
  createdTime?: string;
  creator?: string;
  // 规范对应字段
  period?: string; // 统计周期 (如 10s, 60s, 300s)
  dataType?: string; // 数据类型 (如 原始值, 累计值, 瞬时值, 差值)
  valueType?: string; // 值类型 (如 整数, 浮点数, 百分比, 毫秒)
  chartType?: string; // 图表类型 (如 折线图, 面积图, 柱状图, 仪表盘)
  description?: string; // 监控点描述
  // 扩展与兼容字段
  pointId?: string;
  unit?: string;
  intervalSeconds?: number;
  reportMethod?: string;
  app?: string;
  module?: string;
  latestValue?: number;
  updateTime?: string;
}

// 3.4.2.3 监控点视图
export interface PointViewItem {
  id: string;
  viewCode?: string;
  viewId?: string;
  viewName: string;
  description: string;
  boundMachines?: string[]; // 绑定机器 (如 ['10.24.12.88', '10.24.12.89'])
  boundMachine?: string;
  creator?: string; // 添加者
  createdTime?: string; // 添加时间
  pointCount?: number;
  points?: string[];
  pointIds?: string[];
  layoutType?: 'GRID_2' | 'GRID_3' | 'ROW';
  chartType?: 'LINE' | 'AREA' | 'BAR';
  refreshIntervalSeconds?: number;
  domain?: string;
  updatedTime?: string;
  updatedAt?: string;
}

// 3.4.2.4 监控点告警配置
export interface AlarmConfigItem {
  id: string;
  targetType: 'MACHINE' | 'VIEW';
  targetId: string;
  targetName: string;
  pointCode?: string;
  pointId?: string; // 监控点ID
  pointName?: string; // 监控点名称
  alarmTarget?: '单机' | '视图' | 'MACHINE' | 'VIEW'; // 告警对象
  targetValue?: string; // 对象值 (如 10.24.12.88, VIEW-CORE-AUTH)
  alarmType?: string; // 告警类型 (如 阈值上限告警, 突增突降告警, 心跳缺失告警)
  shieldStatus?: '未屏蔽' | '已屏蔽' | 'NORMAL' | 'SHIELDED'; // 屏蔽状态
  operator: '>' | '>=' | '<' | '<=' | '==';
  threshold: number;
  unit: string;
  level: 'CRITICAL' | 'MAJOR' | 'WARNING' | 'INFO';
  durationSeconds?: number;
  durationMinutes?: number;
  noticeChannels?: ('SMS' | 'EMAIL' | 'WECHAT' | 'WEBHOOK')[];
  notifyChannels?: string[];
  receivers?: string[];
  ruleName?: string;
  isShielded?: boolean; // 是否被屏蔽
  shieldUntil?: string;
  silencedUntil?: string | null;
  enabled?: boolean;
  createdTime?: string; // 添加时间
  // 别名字段兼容
  status?: 'ACTIVE' | 'SHIELDED' | 'DISABLED';
  silenceHours?: number;
}

export type AlarmRuleItem = AlarmConfigItem;

// 3.4.3.1 应用
export interface AppItem {
  id: string;
  appCode: string;
  appName: string;
  owner: string;
  department?: string;
  domain?: string;
  env?: string;
  moduleCount: number;
  createdTime?: string;
  createdAt?: string;
  description: string;
  status?: 'ACTIVE' | 'ARCHIVED';
}

// 3.4.3.2 模块
export interface ModuleItem {
  id: string;
  moduleCode: string;
  moduleName: string;
  appCode: string;
  appName: string;
  moduleType?: 'SERVICE' | 'GATEWAY' | 'STORAGE' | 'JOB' | 'CLIENT';
  language?: string;
  lang?: string;
  port?: number;
  healthPath?: string;
  hostCount?: number;
  description?: string;
  status?: 'ACTIVE' | 'DISABLED';
  createdAt?: string;
}

// 3.4.3.3 日志配置
export interface LogConfigItem {
  id: string;
  configCode?: string;
  configName: string;
  appCode: string;
  appName?: string;
  moduleCode: string;
  moduleName?: string;
  logType?: 'STANDARD_TEXT' | 'JSON' | 'REGEX' | 'DELIMITED';
  filePath?: string;
  filePathPattern?: string;
  logFormat?: 'JSON' | 'REGEX' | 'TEXT' | 'DELIMITER';
  collectStrategy?: 'SINGLE_LINE' | 'MULTILINE' | 'REGEX_EXTRACT';
  multilinePattern?: string;
  fieldExtractRegex?: string;
  rateLimitPerSec?: number;
  burstLimit?: number;
  encoding?: 'UTF-8' | 'GBK';
  sampleRate?: number;
  enabled?: boolean;
  status?: 'ACTIVE' | 'PAUSED';
  updatedAt?: string;
}

export type LogSourceConfigItem = LogConfigItem;
