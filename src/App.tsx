import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { CrmView } from './components/crm/CrmView';
import { ProductionView } from './components/production/ProductionView';
import { CutOptimizerView } from './components/production/CutOptimizerView';
import { QuotesView } from './components/quotes/QuotesView';
import { ProjectsView } from './components/projects/ProjectsView';
import { CatalogView } from './components/catalog/CatalogView';
import { InventoryView } from './components/inventory/InventoryView';
import { FinanceView } from './components/finance/FinanceView';
import { FieldVisitView } from './components/field/FieldVisitView';
import { ClientPortalView } from './components/portal/ClientPortalView';
import { AIOperationsView } from './components/ai/AIOperationsView';
import { AuditView } from './components/audit/AuditView';
import { AIAssistantModal } from './components/ai/AIAssistantModal';
import { NewProjectModal } from './components/projects/NewProjectModal';
import { ToastProvider, useToast } from './context/ToastContext';
import { loadState, saveState, hydrateFromSQLiteDatabase } from './services/storage';

import {
  INITIAL_LEADS,
  INITIAL_PROJECTS,
  INITIAL_QUOTES,
  INITIAL_PRODUCTION_ORDERS,
  INITIAL_MACHINES,
  INITIAL_PRODUCTION_CENTERS,
  INITIAL_INVENTORY,
  INITIAL_FINANCE,
  INITIAL_AUDIT_LOGS,
  DEFAULT_AI_CONFIG,
  CATALOG_PRODUCTS,
} from './data/mockDatabase';

import {
  UserRole,
  Lead,
  Project,
  Quote,
  ProductionOrder,
  Machine,
  InventoryItem,
  FinanceTransaction,
  AuditLog,
  AIConfig,
} from './types';

function AppContent() {
  const { showToast } = useToast();

  // Navigation & Role State
  const [activeView, setActiveView] = useState<string>(() => loadState('activeView', 'dashboard'));
  const [userRole, setUserRole] = useState<UserRole>(() => loadState('userRole', UserRole.OWNER));
  const [selectedCity, setSelectedCity] = useState<string>(() => loadState('selectedCity', 'all'));
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => loadState('isDarkMode', true));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState<boolean>(false);

  // Core Data States initialized with persistent store
  const [leads, setLeads] = useState<Lead[]>(() => loadState('leads', INITIAL_LEADS));
  const [projects, setProjects] = useState<Project[]>(() => loadState('projects', INITIAL_PROJECTS));
  const [quotes, setQuotes] = useState<Quote[]>(() => loadState('quotes', INITIAL_QUOTES));
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>(() =>
    loadState('productionOrders', INITIAL_PRODUCTION_ORDERS)
  );
  const [machines, setMachines] = useState<Machine[]>(() => loadState('machines', INITIAL_MACHINES));
  const [inventory, setInventory] = useState<InventoryItem[]>(() => loadState('inventory', INITIAL_INVENTORY));
  const [finance, setFinance] = useState<FinanceTransaction[]>(() => loadState('finance', INITIAL_FINANCE));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadState('auditLogs', INITIAL_AUDIT_LOGS));
  const [aiConfig, setAiConfig] = useState<AIConfig>(() => loadState('aiConfig', DEFAULT_AI_CONFIG));

  // Sync to localStorage safely
  useEffect(() => { saveState('leads', leads); }, [leads]);
  useEffect(() => { saveState('projects', projects); }, [projects]);
  useEffect(() => { saveState('quotes', quotes); }, [quotes]);
  useEffect(() => { saveState('productionOrders', productionOrders); }, [productionOrders]);
  useEffect(() => { saveState('machines', machines); }, [machines]);
  useEffect(() => { saveState('inventory', inventory); }, [inventory]);
  useEffect(() => { saveState('finance', finance); }, [finance]);
  useEffect(() => { saveState('auditLogs', auditLogs); }, [auditLogs]);
  useEffect(() => { saveState('aiConfig', aiConfig); }, [aiConfig]);
  useEffect(() => { saveState('activeView', activeView); }, [activeView]);
  useEffect(() => { saveState('selectedCity', selectedCity); }, [selectedCity]);
  useEffect(() => { saveState('userRole', userRole); }, [userRole]);
  // Initial SQLite database hydration with graceful offline fallback
  useEffect(() => {
    hydrateFromSQLiteDatabase().then((dbData) => {
      if (dbData) {
        if (dbData.leads) setLeads(dbData.leads);
        if (dbData.projects) setProjects(dbData.projects);
        if (dbData.quotes) setQuotes(dbData.quotes);
        if (dbData.productionOrders) setProductionOrders(dbData.productionOrders);
        if (dbData.inventory) setInventory(dbData.inventory);
        if (dbData.finance) setFinance(dbData.finance);
        if (dbData.auditLogs) setAuditLogs(dbData.auditLogs);
      }
    });
  }, []);
  const logAudit = (action: string, entityType: string, entityId: string, details?: string) => {
    const newLog: AuditLog = {
      id: `audit-${Date.now()}`,
      action,
      entityType,
      entityId,
      actorName: userRole === UserRole.OWNER ? 'Carlos Marcenaria (Diretor)' : 'Operador Técnico',
      actorRole: userRole,
      timestamp: new Date().toISOString(),
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Create Project and Quote from Modal
  const handleCreateProjectAndQuote = (newProject: Project, newQuote: Quote) => {
    setProjects([newProject, ...projects]);
    setQuotes([newQuote, ...quotes]);
    logAudit('Criou Novo Projeto e Orçamento', 'Project', newProject.id, `Cliente: ${newProject.customerName}`);
    showToast('Projeto e Orçamento Criados!', `${newProject.title} registrado com sucesso.`, 'success');
    setActiveView('quotes');
  };

  // Convert Lead to Project
  const handleCreateProjectFromLead = (lead: Lead) => {
    const newProject: Project = {
      id: `prj-${Date.now()}`,
      tenantId: 'tenant-woodbit-rj',
      code: `WB-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: `Projeto ${lead.customerName} (${lead.productLine === 'gamer' ? 'Setup Gamer' : 'Móveis Planejados'})`,
      customerId: lead.id,
      customerName: lead.customerName,
      customerPhone: lead.phone,
      address: 'Rua Principal, 120',
      city: lead.city,
      status: 'technical_visit',
      productLine: lead.productLine,
      totalValue: lead.budgetEstimate || 8500,
      costValue: (lead.budgetEstimate || 8500) * 0.58,
      marginPercent: 42,
      riskScore: 'low',
      riskReasons: ['Projeto recém-criado a partir de lead'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rooms: [
        {
          id: `room-${Date.now()}`,
          name: 'Ambiente Principal',
          description: lead.notes || 'Móveis planejados sob medida com ferragens especiais.',
          itemsCount: 1,
          materialsUsed: ['MDF Louro Freijó', 'Ferragens Slow'],
          photos: [],
        },
      ],
      version: 1,
      currentVersionName: 'v1.0 - Briefing Inicial',
    };

    setProjects([newProject, ...projects]);
    logAudit('Criou Projeto a partir de Lead', 'Project', newProject.id, `Cliente: ${lead.customerName}`);
    showToast('Lead convertido em Projeto!', `Projeto aberto para agendamento de medição técnica.`, 'success');
    setActiveView('projects');
  };

  // Generate OP from Configurator
  const handleGenerateOrderFromConfigurator = (newOrder: Partial<ProductionOrder>) => {
    const fullOrder = newOrder as ProductionOrder;
    setProductionOrders([fullOrder, ...productionOrders]);
    logAudit(
      'Gerou Ordem de Produção pelo Configurador Gamer',
      'ProductionOrder',
      fullOrder.id,
      `Ordem: ${fullOrder.orderNumber}`
    );
    showToast('OP Gerada pelo Configurador!', `Ordem ${fullOrder.orderNumber} enviada para o chão de fábrica.`, 'success');
    setActiveView('production');
  };

  // Open specific project
  const handleOpenProject = (projectId: string) => {
    setActiveView('projects');
  };

  return (
    <div
      id="woodbit-app-root"
      className={`min-h-screen flex ${isDarkMode ? '' : 'light'} bg-[var(--bg-surface)] text-[var(--text-main)] font-sans antialiased selection:bg-[var(--color-primary)] selection:text-[var(--text-on-primary)] transition-colors duration-200`}
    >
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={activeView}
        onSelectView={(view) => {
          setActiveView(view);
          setIsMobileMenuOpen(false);
        }}
        onOpenNewProject={() => setIsNewProjectModalOpen(true)}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
        userRole={userRole}
        onChangeRole={setUserRole}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden bg-[var(--bg-surface)]">
        {/* Persistent Top Header */}
        <Header
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
          onOpenAiAssistant={() => setIsAiModalOpen(true)}
          userRole={userRole}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Global Search Filter Active Notice */}
        {searchQuery.trim() && (
          <div className="bg-[var(--color-primary-container)] text-[var(--color-primary)] border-b border-[var(--border-subtle)] px-6 py-2 text-xs flex items-center justify-between font-medium animate-in fade-in">
            <span>
              Filtrando resultados por: <strong className="underline font-mono">"{searchQuery}"</strong> em todos os módulos
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs hover:underline cursor-pointer font-bold ml-4"
            >
              Limpar busca ✕
            </button>
          </div>
        )}

        {/* Dynamic Main View */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto bg-[var(--bg-surface)]">
          {activeView === 'dashboard' && (
            <DashboardView
              leads={leads}
              projects={projects}
              machines={machines}
              productionOrders={productionOrders}
              finance={finance}
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
              onNavigate={setActiveView}
              onOpenProject={handleOpenProject}
              onOpenAiAssistant={() => setIsAiModalOpen(true)}
            />
          )}

          {activeView === 'crm' && (
            <CrmView
              leads={leads}
              onUpdateLeads={setLeads}
              onCreateProjectFromLead={handleCreateProjectFromLead}
              selectedCityFilter={selectedCity}
            />
          )}

          {activeView === 'production' && (
            <ProductionView
              productionOrders={productionOrders}
              machines={machines}
              productionCenters={INITIAL_PRODUCTION_CENTERS}
              projects={projects}
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
              onUpdateOrders={setProductionOrders}
              onUpdateMachines={setMachines}
              inventory={inventory}
              onUpdateInventory={setInventory}
            />
          )}

          {activeView === 'cut_optimizer' && (
            <CutOptimizerView
              productionOrders={productionOrders}
              onBackToProduction={() => setActiveView('production')}
            />
          )}

          {activeView === 'quotes' && (
            <QuotesView
              quotes={quotes}
              projects={projects}
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
              onUpdateQuotes={setQuotes}
              onOpenVoiceAssistant={() => setIsAiModalOpen(true)}
            />
          )}

          {activeView === 'projects' && (
            <ProjectsView
              projects={projects}
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
              onUpdateProjects={setProjects}
              onNavigateToQuotes={() => setActiveView('quotes')}
              onNavigateToProduction={() => setActiveView('production')}
            />
          )}

          {activeView === 'catalog' && (
            <CatalogView
              products={CATALOG_PRODUCTS}
              onGenerateOrderFromConfigurator={handleGenerateOrderFromConfigurator}
            />
          )}

          {activeView === 'inventory' && (
            <InventoryView inventory={inventory} onUpdateInventory={setInventory} />
          )}

          {activeView === 'finance' && (
            <FinanceView finance={finance} onUpdateFinance={setFinance} />
          )}

          {activeView === 'field' && (
            <FieldVisitView
              projects={projects}
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
              onUpdateProjects={setProjects}
            />
          )}

          {activeView === 'client_portal' && (
            <ClientPortalView projects={projects} quotes={quotes} />
          )}

          {activeView === 'ai_operations' && (
            <AIOperationsView aiConfig={aiConfig} onUpdateAIConfig={setAiConfig} />
          )}

          {activeView === 'audit' && <AuditView auditLogs={auditLogs} />}
        </main>
      </div>

      {/* Global AI Multi-Modal Assistant Modal */}
      <AIAssistantModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />

      {/* New Project & Quote Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onCreateProjectAndQuote={handleCreateProjectAndQuote}
      />
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;

