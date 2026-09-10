import React, { useState } from 'react';
import { ShieldCheck, Lock, User as UserIcon, Eye, EyeOff, Server, AlertCircle, ArrowRight } from 'lucide-react';
import { User } from '../../types';

interface LoginPageProps {
  onLogin?: (user: User) => void;
  onLoginSuccess?: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin888');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('请输入登录账号');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('请输入登录密码');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const trimmedUser = username.trim();
      const trimmedPass = password.trim();

      let validUser: User | null = null;

      if (trimmedUser === 'admin' && (trimmedPass === 'admin888' || trimmedPass === 'admin')) {
        validUser = {
          username: 'admin',
          realName: '系统超级管理员',
          role: '超级管理员',
          department: '基础平台与智能监控运维部',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        };
      } else if (trimmedUser === 'ops_master' && (trimmedPass === 'ops123456' || trimmedPass === '123456')) {
        validUser = {
          username: 'ops_master',
          realName: '资深SRE运维专家',
          role: '运维主管',
          department: '基础平台与智能监控运维部',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        };
      } else if (trimmedUser === 'developer' && (trimmedPass === 'dev123456' || trimmedPass === '123456')) {
        validUser = {
          username: 'developer',
          realName: '高级研发工程师',
          role: '研发人员',
          department: '业务研发中心',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        };
      } else if (trimmedUser && trimmedPass) {
        validUser = {
          username: trimmedUser,
          realName: trimmedUser === 'root' ? 'Root管理员' : `${trimmedUser}(运维)`,
          role: trimmedUser === 'root' ? '超级管理员' : '运维工程师',
          department: '监控运维组',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        };
      }

      if (validUser) {
        if (rememberMe) {
          try {
            localStorage.setItem('auth_session_user', JSON.stringify(validUser));
          } catch (e) {
            // ignore localStorage quota/disabled errors
          }
        }
        setIsLoading(false);
        const loginCallback = onLogin || onLoginSuccess;
        if (typeof loginCallback === 'function') {
          loginCallback(validUser);
        }
      } else {
        setErrorMessage('账号或密码错误（默认测试账号：admin，密码：admin888）');
        setIsLoading(false);
      }
    }, 250);
  };

  const handleFillDemo = (demoUser: string, demoPass: string) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景格栅与几何光晕装饰 */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl p-8 z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Server className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-xs font-semibold text-blue-400 tracking-wider">3.1 登录模块</div>
            <h1 className="text-xl font-bold text-white tracking-tight">运维监控后台管理系统</h1>
          </div>
        </div>

        <p className="text-sm text-slate-400 mb-6">
          请输入您的企业统一认证账号与密码进入监控大盘与管理控制台
        </p>

        {errorMessage && (
          <div className="mb-5 p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center gap-2.5 text-rose-300 text-sm animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              登录账号 / 工号 (Username)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入管理员账号 (如 admin)"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              登录密码 (Password)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码 (如 admin888)"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
              />
              <span>记住登录凭据</span>
            </label>
            <span className="text-slate-500 hover:text-slate-400 cursor-pointer">
              安全认证标准 v3.8
            </span>
          </div>

          <button
            id="btn-submit-login"
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span>安全验证并登录</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-700/60">
          <div className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>快捷测试凭据（点击快速填入）：</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('admin', 'admin888')}
              className="text-xs px-2.5 py-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 rounded border border-slate-600 transition-colors cursor-pointer"
            >
              超级管理 (admin / admin888)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('ops_master', 'ops123456')}
              className="text-xs px-2.5 py-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 rounded border border-slate-600 transition-colors cursor-pointer"
            >
              运维主管 (ops_master / ops123456)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
