import React, { useState } from 'react';
import {
  Cpu,
  Search,
  Plus,
  Trash2,
  Edit,
  Package,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Server,
  RefreshCw,
  HardDrive,
  Activity,
  Terminal,
  X,
  Sliders,
} from 'lucide-react';
import { MachineItem } from '../../../types';

interface MachineMgmtViewProps {
  machines: MachineItem[];
  onAddMachine: (machine: MachineItem) => void;
  onUpdateMachine: (machine: MachineItem) => void;
  onDeleteMachine: (id: string) => void;
}

export const MachineMgmtView: React.FC<MachineMgmtViewProps> = ({
  machines,
  onAddMachine,
  onUpdateMachine,
  onDeleteMachine,
}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [envFilter, setEnvFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // 弹窗状态
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<MachineItem | null>(null);
  const [viewingMachine, setViewingMachine] = useState<MachineItem | null>(null);
  const [deployingMachine, setDeployingMachine] = useState<MachineItem | null>(null);
  const [deployStep, setDeployStep] = useState<number>(0);
  const [deployLogs, setDeployLogs] = useState<string[]>([]);

  // 新增/编辑表单状态
  const [formState, setFormState] = useState({
    machineId: '',
    ip: '',
    innerIp: '',
    hostname: '',
    env: 'prod' as 'prod' | 'staging' | 'dev',
    datacenter: '上海一区 (BGP)',
    cpuCores: 16,
    memTotalGB: 64,
    diskTotalGB: 1024,
    tags: '核心服务, 业务集群',
  });

  const filteredMachines = machines.filter((m) => {
    const matchKeyword =
      !searchKeyword ||
      m.machineId.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      m.ip.includes(searchKeyword) ||
      m.innerIp.includes(searchKeyword) ||
      m.hostname.toLowerCase().includes(searchKeyword.toLowerCase());

    const matchEnv = envFilter === 'ALL' || m.env === envFilter;
    const matchStatus = statusFilter === 'ALL' || m.status === statusFilter;

    return matchKeyword && matchEnv && matchStatus;
  });

  const handleOpenAdd = () => {
    setFormState({
      machineId: `VM-PROD-${Math.floor(1000 + Math.random() * 9000)}`,
      ip: `10.24.12.${Math.floor(10 + Math.random() * 200)}`,
      innerIp: `192.168.1.${Math.floor(10 + Math.random() * 200)}`,
      hostname: 'node-app-worker.prod',
      env: 'prod',
      datacenter: '上海一区 (BGP)',
      cpuCores: 16,
      memTotalGB: 64,
      diskTotalGB: 1024,
      tags: '新纳管主机, 自动上报',
    });
    setEditingMachine(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (m: MachineItem) => {
    setEditingMachine(m);
    setFormState({
      machineId: m.machineId,
      ip: m.ip,
      innerIp: m.innerIp,
      hostname: m.hostname,
      env: m.env,
      datacenter: m.datacenter,
      cpuCores: m.cpuCores,
      memTotalGB: m.memTotalGB,
      diskTotalGB: m.diskTotalGB,
      tags: m.tags.join(', '),
    });
    setIsAddModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.ip.trim()) return;

    if (editingMachine) {
      onUpdateMachine({
        ...editingMachine,
        machineId: formState.machineId,
        ip: formState.ip,
        innerIp: formState.innerIp,
        hostname: formState.hostname,
        env: formState.env,
        datacenter: formState.datacenter,
        cpuCores: Number(formState.cpuCores),
        memTotalGB: Number(formState.memTotalGB),
        diskTotalGB: Number(formState.diskTotalGB),
        tags: formState.tags.split(',').map((t) => t.trim()).filter(Boolean),
      });
    } else {
      const newMachine: MachineItem = {
        id: `MCH-${Date.now().toString().slice(-4)}`,
        machineId: formState.machineId,
        ip: formState.ip,
        innerIp: formState.innerIp,
        hostname: formState.hostname,
        env: formState.env,
        datacenter: formState.datacenter,
        status: 'ONLINE',
        agentVersion: 'v3.8.4',
        pluginStatus: 'NOT_DEPLOYED',
        cpuCores: Number(formState.cpuCores),
        memTotalGB: Number(formState.memTotalGB),
        diskTotalGB: Number(formState.diskTotalGB),
        lastHeartbeat: '刚刚',
        tags: formState.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      onAddMachine(newMachine);
    }
    setIsAddModalOpen(false);
  };

  // 插件在线部署逻辑模拟
  const handleStartDeploy = (m: MachineItem) => {
    setDeployingMachine(m);
    setDeployStep(1);
    setDeployLogs([
      `[1/4] 连接目标主机节点 ${m.ip} (SSH 22 / Agent Tunnel)...`,
      `[2/4] 验证系统环境: Linux x86_64, glibc >= 2.31... 通过`,
    ]);

    setTimeout(() => {
      setDeployStep(2);
      setDeployLogs((prev) => [
        ...prev,
        `[3/4] 下发最新监控采集插件包 monitor-plugin-v3.8.4.tar.gz (18.4MB)...`,
        `[3/4] 安装守护进程 systemd/monitor-agent.service 并启动...`,
      ]);
    }, 900);

    setTimeout(() => {
      setDeployStep(3);
      setDeployLogs((prev) => [
        ...prev,
        `[4/4] 注册监控心跳成功！指标上报通道已建立。`,
        `[✔] 插件部署成功！状态更新为「已部署 (DEPLOYED)」。`,
      ]);

      onUpdateMachine({
        ...m,
        pluginStatus: 'DEPLOYED',
        agentVersion: 'v3.8.4',
      });
    }, 1800);
  };

  return (
    <div className="p-6 space-y-5">
      {/* 标题说明 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-blue-600 font-mono mb-1">
            上报管理 &gt; 上报机器管理
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-600" />
            <span>上报机器管理</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            统一维护集群主机节点、执行探针插件自动化部署与硬件监控全生命周期维护
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>添加上报机器</span>
        </button>
      </div>

      {/* 搜索与多维过滤栏 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="搜索机器ID、IP地址、内网IP或主机名..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">部署环境:</span>
          <select
            value={envFilter}
            onChange={(e) => setEnvFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">全部环境</option>
            <option value="prod">生产环境 (prod)</option>
            <option value="staging">预发演练 (staging)</option>
            <option value="dev">开发测试 (dev)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">运行状态:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">全部状态</option>
            <option value="ONLINE">在线 (Online)</option>
            <option value="ABNORMAL">异常 (Abnormal)</option>
            <option value="OFFLINE">离线 (Offline)</option>
          </select>
        </div>

        <button
          onClick={() => {
            setSearchKeyword('');
            setEnvFilter('ALL');
            setStatusFilter('ALL');
          }}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>重置</span>
        </button>
      </div>

      {/* 机器列表表格 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">机器标识 (ID / Hostname)</th>
                <th className="py-3 px-4">IP 地址 (外网 / 内网)</th>
                <th className="py-3 px-4">环境 / 机房</th>
                <th className="py-3 px-4">硬件规格</th>
                <th className="py-3 px-4">运行状态</th>
                <th className="py-3 px-4">插件部署状态</th>
                <th className="py-3 px-4">最近心跳</th>
                <th className="py-3 px-4 text-center">操作栏</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMachines.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-800 text-xs">{m.machineId}</div>
                    <div className="font-mono text-[11px] text-slate-400">{m.hostname}</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-semibold text-blue-600">{m.ip}</div>
                    <div className="text-[11px] text-slate-400">内: {m.innerIp}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.env === 'prod'
                          ? 'bg-purple-100 text-purple-800'
                          : m.env === 'staging'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {m.env.toUpperCase()}
                    </span>
                    <div className="text-[11px] text-slate-500 mt-0.5">{m.datacenter}</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    <div>{m.cpuCores}C / {m.memTotalGB}GB</div>
                    <div className="text-[11px] text-slate-400">{m.diskTotalGB}GB 存储</div>
                  </td>

                  <td className="py-3.5 px-4">
                    {m.status === 'ONLINE' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        在线正常
                      </span>
                    ) : m.status === 'ABNORMAL' ? (
                      <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-[11px] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        状态异常
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 text-[11px] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        离线
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    {m.pluginStatus === 'DEPLOYED' ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>已部署 ({m.agentVersion})</span>
                      </span>
                    ) : m.pluginStatus === 'UPDATING' ? (
                      <span className="text-amber-600 font-medium flex items-center gap-1">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>待升级</span>
                      </span>
                    ) : (
                      <span className="text-rose-500 font-medium flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>未部署</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                    {m.lastHeartbeat}
                  </td>

                  {/* 机器基础操作（添加、删除、修改、插件部署、查看详情） */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {/* 查看详情 */}
                      <button
                        onClick={() => setViewingMachine(m)}
                        title="查看详情"
                        className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* 插件部署 */}
                      <button
                        onClick={() => handleStartDeploy(m)}
                        title="部署/升级插件"
                        className="p-1 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                      >
                        <Package className="w-3.5 h-3.5" />
                      </button>

                      {/* 修改 */}
                      <button
                        onClick={() => handleOpenEdit(m)}
                        title="修改信息"
                        className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {/* 删除 */}
                      <button
                        onClick={() => {
                          if (confirm(`确定要移除机器 ${m.machineId} (${m.ip}) 吗？`)) {
                            onDeleteMachine(m.id);
                          }
                        }}
                        title="删除机器"
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>共管理 {filteredMachines.length} 台服务器节点</span>
          <span>心跳超时判定标准：超过 60s 标记为离线</span>
        </div>
      </div>

      {/* 模态框 1：添加 / 修改机器 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  {editingMachine ? '修改上报机器信息' : '添加新上报机器'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">机器编号 (ID):</label>
                  <input
                    type="text"
                    required
                    value={formState.machineId}
                    onChange={(e) => setFormState({ ...formState, machineId: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">主机名 (Hostname):</label>
                  <input
                    type="text"
                    required
                    value={formState.hostname}
                    onChange={(e) => setFormState({ ...formState, hostname: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">公网/BGP IP:</label>
                  <input
                    type="text"
                    required
                    value={formState.ip}
                    onChange={(e) => setFormState({ ...formState, ip: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">内网 VPC IP:</label>
                  <input
                    type="text"
                    required
                    value={formState.innerIp}
                    onChange={(e) => setFormState({ ...formState, innerIp: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">归属环境:</label>
                  <select
                    value={formState.env}
                    onChange={(e) => setFormState({ ...formState, env: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="prod">生产环境 (prod)</option>
                    <option value="staging">预发演练 (staging)</option>
                    <option value="dev">开发测试 (dev)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">机房专区:</label>
                  <input
                    type="text"
                    value={formState.datacenter}
                    onChange={(e) => setFormState({ ...formState, datacenter: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">CPU核数:</label>
                  <input
                    type="number"
                    value={formState.cpuCores}
                    onChange={(e) => setFormState({ ...formState, cpuCores: Number(e.target.value) })}
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">内存(GB):</label>
                  <input
                    type="number"
                    value={formState.memTotalGB}
                    onChange={(e) => setFormState({ ...formState, memTotalGB: Number(e.target.value) })}
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">磁盘(GB):</label>
                  <input
                    type="number"
                    value={formState.diskTotalGB}
                    onChange={(e) => setFormState({ ...formState, diskTotalGB: Number(e.target.value) })}
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">业务标签 (英文逗号分隔):</label>
                <input
                  type="text"
                  value={formState.tags}
                  onChange={(e) => setFormState({ ...formState, tags: e.target.value })}
                  placeholder="例如: 认证服务, 高可用"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-sm cursor-pointer"
                >
                  确认保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 模态框 2：查看详情 */}
      {viewingMachine && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">机器详情与上报探针概况</h3>
              </div>
              <button
                onClick={() => setViewingMachine(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 font-sans">机器ID：</span>
                  <span className="font-bold text-slate-800">{viewingMachine.machineId}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">外网IP：</span>
                  <span className="font-bold text-blue-600">{viewingMachine.ip}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">内网IP：</span>
                  <span className="text-slate-700">{viewingMachine.innerIp}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">机房：</span>
                  <span className="text-slate-700 font-sans">{viewingMachine.datacenter}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">CPU规格：</span>
                  <span className="text-slate-800">{viewingMachine.cpuCores} 核处理器</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">物理内存：</span>
                  <span className="text-slate-800">{viewingMachine.memTotalGB} GB</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">磁盘容量：</span>
                  <span className="text-slate-800">{viewingMachine.diskTotalGB} GB NVMe</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">探针版本：</span>
                  <span className="text-emerald-600 font-bold">{viewingMachine.agentVersion}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block mb-1">业务标签：</span>
                <div className="flex flex-wrap gap-1.5">
                  {viewingMachine.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded text-[11px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <button
                onClick={() => setViewingMachine(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 模态框 3：插件部署进度终端 */}
      {deployingMachine && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm font-mono">
                  插件部署控制台 · {deployingMachine.ip}
                </h3>
              </div>
              {deployStep === 3 && (
                <button
                  onClick={() => setDeployingMachine(null)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  关闭
                </button>
              )}
            </div>

            <div className="py-4 space-y-3 font-mono text-xs">
              <div className="space-y-1.5 p-3 bg-slate-900 rounded-lg border border-slate-800 h-44 overflow-y-auto custom-scrollbar text-[11px]">
                {deployLogs.map((log, i) => (
                  <div key={i} className="text-slate-300">
                    {log}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>部署阶段: {deployStep} / 3</span>
                {deployStep === 3 ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>部署完成并已上线</span>
                  </span>
                ) : (
                  <span className="text-amber-400 font-medium flex items-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>正在执行部署脚本...</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                disabled={deployStep < 3}
                onClick={() => setDeployingMachine(null)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded text-xs font-medium cursor-pointer"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
