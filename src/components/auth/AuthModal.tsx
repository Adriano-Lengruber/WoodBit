import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  User,
  Zap,
  MapPin
} from 'lucide-react';
import { UserRole } from '../../types';
import { useToast } from '../../context/ToastContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (role: UserRole, userEmail?: string, companyName?: string) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
  initialMode = 'login',
}) => {
  const { showToast } = useToast();
  const [tab, setTab] = useState<'login' | 'register' | 'demo'>(initialMode);

  // Form states
  const [email, setEmail] = useState('carlos@marcenariasilva.com.br');
  const [password, setPassword] = useState('••••••••••••');
  const [companyName, setCompanyName] = useState('Marcenaria e Móveis Silva');
  const [city, setCity] = useState('Natividade - RJ');
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'enterprise'>('pro');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast('Login Efetuado com Sucesso', `Bem-vindo de volta ao WoodBit, ${email.split('@')[0]}!`, 'success');
      onSuccessLogin(UserRole.OWNER, email, companyName);
      onClose();
    }, 450);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast(
        'Conta Criada com Sucesso!',
        `Período de teste de 14 dias liberado para ${companyName}.`,
        'success'
      );
      onSuccessLogin(UserRole.OWNER, email, companyName);
      onClose();
    }, 550);
  };

  const handleFastDemoLogin = (role: UserRole, label: string, name: string) => {
    showToast('Acesso de Demonstração Liberado', `Conectado como ${name} (${label}).`, 'info');
    onSuccessLogin(role, `${name.toLowerCase().replace(' ', '.')}@woodbit.demo`, 'Marcenaria Modelo WoodBit');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141313]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-[#1D1D1D] rounded-3xl border border-[#A06235]/40 shadow-2xl shadow-black/80 overflow-hidden text-[#EFEFEF]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#A06235] via-[#F3A446] to-[#A06235]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#141313]/60 hover:bg-[#141313] text-[#EFEFEF]/70 hover:text-[#EFEFEF] transition cursor-pointer border border-[#EFEFEF]/10 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pt-8 px-8 pb-4 text-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#F3A446]/10 border border-[#F3A446]/30 text-xs font-bold text-[#F3A446] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WoodBit Cloud ERP & SaaS 2026</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#EFEFEF] tracking-tight">
            {tab === 'login' && 'Entrar na sua Marcenaria'}
            {tab === 'register' && 'Começar Teste Grátis de 14 Dias'}
            {tab === 'demo' && 'Acesso Rápido de Avaliação'}
          </h2>
          <p className="text-sm text-[#EFEFEF]/60 mt-1 max-w-md mx-auto">
            {tab === 'login' && 'Acesse suas ordens de corte, orçamentos e chão de fábrica digital.'}
            {tab === 'register' && 'Crie seu tenant seguro na nuvem com IA local e nesting integrado.'}
            {tab === 'demo' && 'Explore todas as funcionalidades do WoodBit com perfis pré-configurados.'}
          </p>

          {/* Navigation Tabs */}
          <div className="flex p-1.5 mt-5 rounded-2xl bg-[#141313] border border-[#EFEFEF]/10 gap-1 text-xs font-bold">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-2.5 rounded-xl transition cursor-pointer ${
                tab === 'login'
                  ? 'bg-[#F3A446] text-[#141313] shadow-md font-extrabold'
                  : 'text-[#EFEFEF]/70 hover:text-[#EFEFEF]'
              }`}
            >
              Fazer Login
            </button>
            <button
              onClick={() => setTab('register')}
              className={`flex-1 py-2.5 rounded-xl transition cursor-pointer ${
                tab === 'register'
                  ? 'bg-[#F3A446] text-[#141313] shadow-md font-extrabold'
                  : 'text-[#EFEFEF]/70 hover:text-[#EFEFEF]'
              }`}
            >
              Criar Conta (14d Grátis)
            </button>
            <button
              onClick={() => setTab('demo')}
              className={`flex-1 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                tab === 'demo'
                  ? 'bg-[#F3A446] text-[#141313] shadow-md font-extrabold'
                  : 'text-[#F3A446] hover:text-[#F3A446]/80'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>1-Click Demo</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-8 pt-2">
          {/* TAB 1: LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#EFEFEF]/70 mb-1.5">
                  E-mail do Administrador ou Operador
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F3A446]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="carlos@marcenaria.com.br"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#141313] border border-[#EFEFEF]/10 text-sm text-[#EFEFEF] placeholder-[#EFEFEF]/30 focus:outline-none focus:border-[#F3A446] transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#EFEFEF]/70">
                    Senha de Acesso
                  </label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); showToast('Redefinição de Senha', 'Link de recuperação enviado para o e-mail cadastrado.', 'info'); }} className="text-xs text-[#F3A446] hover:underline">
                    Esqueceu a senha?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F3A446]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#141313] border border-[#EFEFEF]/10 text-sm text-[#EFEFEF] placeholder-[#EFEFEF]/30 focus:outline-none focus:border-[#F3A446] transition"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  defaultChecked
                  className="rounded accent-[#F3A446] cursor-pointer"
                />
                <label htmlFor="remember" className="text-xs text-[#EFEFEF]/70 cursor-pointer">
                  Manter conectado neste computador ou tablet de oficina
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F3A446] to-[#A06235] text-[#141313] font-black text-sm tracking-wide shadow-lg shadow-[#F3A446]/20 hover:brightness-110 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-block w-5 h-5 border-2 border-[#141313] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Entrar no Painel Operacional</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#EFEFEF]/70 mb-1.5">
                    Nome da Marcenaria / Fábrica
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F3A446]" />
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Ex: Studio Madeira Nobre"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#141313] border border-[#EFEFEF]/10 text-sm text-[#EFEFEF] placeholder-[#EFEFEF]/30 focus:outline-none focus:border-[#F3A446]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#EFEFEF]/70 mb-1.5">
                    Cidade / Polo Operacional
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F3A446]" />
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Natividade - RJ"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#141313] border border-[#EFEFEF]/10 text-sm text-[#EFEFEF] placeholder-[#EFEFEF]/30 focus:outline-none focus:border-[#F3A446]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#EFEFEF]/70 mb-1.5">
                  E-mail Corporativo
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F3A446]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contato@suamarcenaria.com.br"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141313] border border-[#EFEFEF]/10 text-sm text-[#EFEFEF] placeholder-[#EFEFEF]/30 focus:outline-none focus:border-[#F3A446]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#EFEFEF]/70 mb-1.5">
                  Criar Senha Forte
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F3A446]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141313] border border-[#EFEFEF]/10 text-sm text-[#EFEFEF] placeholder-[#EFEFEF]/30 focus:outline-none focus:border-[#F3A446]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#EFEFEF]/70 mb-1.5">
                  Selecione o Plano Desejado para Teste
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan('starter')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                      selectedPlan === 'starter'
                        ? 'border-[#F3A446] bg-[#F3A446]/10 text-[#EFEFEF]'
                        : 'border-[#EFEFEF]/10 bg-[#141313] text-[#EFEFEF]/60'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#F3A446]">Starter</div>
                    <div className="text-[11px] mt-0.5">Até 2 marcenas</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPlan('pro')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition relative ${
                      selectedPlan === 'pro'
                        ? 'border-[#F3A446] bg-[#F3A446]/10 text-[#EFEFEF]'
                        : 'border-[#EFEFEF]/10 bg-[#141313] text-[#EFEFEF]/60'
                    }`}
                  >
                    <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full bg-[#F3A446] text-[9px] font-black text-[#141313]">
                      POPULAR
                    </span>
                    <div className="text-xs font-bold text-[#F3A446]">Pro CNC</div>
                    <div className="text-[11px] mt-0.5">Router + 3D Lab</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPlan('enterprise')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                      selectedPlan === 'enterprise'
                        ? 'border-[#F3A446] bg-[#F3A446]/10 text-[#EFEFEF]'
                        : 'border-[#EFEFEF]/10 bg-[#141313] text-[#EFEFEF]/60'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#F3A446]">Franquias</div>
                    <div className="text-[11px] mt-0.5">Múltiplos Polos</div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F3A446] to-[#A06235] text-[#141313] font-black text-sm tracking-wide shadow-lg shadow-[#F3A446]/20 hover:brightness-110 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-block w-5 h-5 border-2 border-[#141313] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Ativar Teste de 14 Dias Grátis</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: ONE-CLICK DEMO (INVESTOR & INSTANT EVALUATION) */}
          {tab === 'demo' && (
            <div className="space-y-3">
              <p className="text-xs text-[#EFEFEF]/70 text-center mb-4">
                Selecione um perfil operacional para testar a ferramenta sem preencher formulários:
              </p>

              {/* Demo Profile 1: Director / Owner */}
              <button
                onClick={() => handleFastDemoLogin(UserRole.OWNER, 'Diretor Geral', 'Carlos Marcenaria')}
                className="w-full p-4 rounded-2xl bg-[#141313] border border-[#F3A446]/40 hover:border-[#F3A446] hover:bg-[#141313]/90 transition text-left cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F3A446]/20 border border-[#F3A446]/50 flex items-center justify-center text-[#F3A446] font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#EFEFEF]">Carlos Marcenaria</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#F3A446]/20 text-[10px] font-black text-[#F3A446]">
                        MASTER / DONO
                      </span>
                    </div>
                    <p className="text-xs text-[#EFEFEF]/60 mt-0.5">
                      Acesso total: DRE Financeiro, Funil WhatsApp, PCP, IA Gemma 4 e Auditoria LGPD.
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#F3A446] group-hover:translate-x-1 transition" />
              </button>

              {/* Demo Profile 2: CNC Operator */}
              <button
                onClick={() => handleFastDemoLogin(UserRole.OPERATOR, 'Operador CNC', 'Renato Usinagem')}
                className="w-full p-4 rounded-2xl bg-[#141313] border border-[#EFEFEF]/10 hover:border-[#F3A446]/60 hover:bg-[#141313]/90 transition text-left cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#A06235]/20 border border-[#A06235]/40 flex items-center justify-center text-[#F3A446] font-bold">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#EFEFEF]">Renato Usinagem</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#A06235]/20 text-[10px] font-black text-[#F3A446]">
                        CHÃO DE FÁBRICA
                      </span>
                    </div>
                    <p className="text-xs text-[#EFEFEF]/60 mt-0.5">
                      Foco em: Nesting 2D, exportação de G-Code para Router CNC e Impressão 3D Lab.
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#EFEFEF]/40 group-hover:translate-x-1 group-hover:text-[#F3A446] transition" />
              </button>

              {/* Demo Profile 3: Field Designer / Sales */}
              <button
                onClick={() => handleFastDemoLogin(UserRole.SALES, 'Vendas & Campo', 'Amanda Arquiteta')}
                className="w-full p-4 rounded-2xl bg-[#141313] border border-[#EFEFEF]/10 hover:border-[#F3A446]/60 hover:bg-[#141313]/90 transition text-left cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#EFEFEF]/10 border border-[#EFEFEF]/20 flex items-center justify-center text-[#EFEFEF] font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#EFEFEF]">Amanda Arquiteta</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#EFEFEF]/10 text-[10px] font-black text-[#EFEFEF]/80">
                        CAMPO / VISITA
                      </span>
                    </div>
                    <p className="text-xs text-[#EFEFEF]/60 mt-0.5">
                      Foco em: Medição técnica em obra offline, fotos com trena laser e orçamentos A4.
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#EFEFEF]/40 group-hover:translate-x-1 group-hover:text-[#F3A446] transition" />
              </button>
            </div>
          )}

          {/* Security & LGPD Guarantee Footer */}
          <div className="mt-6 pt-4 border-t border-[#EFEFEF]/10 flex items-center justify-between text-[11px] text-[#EFEFEF]/50">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#F3A446]" />
              <span>SaaS Seguro • Criptografia AES-256</span>
            </div>
            <span>Conformidade LGPD & Backup SQLite</span>
          </div>
        </div>
      </div>
    </div>
  );
};
