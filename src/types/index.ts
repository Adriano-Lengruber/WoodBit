/**
 * WoodBit ERP — Domain Types & Schemas
 * Local-First AI + Marcenaria + Fabricação Digital (CNC + 3D)
 */

export type TenantId = string;

export enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  SALES = 'sales',
  PRODUCTION = 'production',
  OPERATOR = 'operator',
  INSTALLER = 'installer',
  FINANCE = 'finance',
  CLIENT = 'client',
}

export interface User {
  id: string;
  tenantId: TenantId;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

export type ProductLine = 'furniture' | 'gamer' | 'digital_fab';

// CRM & Leads
export type LeadStage = 
  | 'lead' 
  | 'contact' 
  | 'briefing' 
  | 'quote_prep' 
  | 'quote_sent' 
  | 'technical_visit' 
  | 'approved' 
  | 'contract' 
  | 'in_production' 
  | 'delivered' 
  | 'completed'
  | 'lost';

export interface Lead {
  id: string;
  tenantId: TenantId;
  customerName: string;
  phone: string;
  email?: string;
  city: string; // e.g. Natividade, Itaperuna, Porciúncula, Varre-Sai
  productLine: ProductLine;
  stage: LeadStage;
  source: 'whatsapp' | 'instagram' | 'referral' | 'walk_in' | 'website';
  budgetEstimate?: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  aiTriage?: {
    category: ProductLine;
    urgency: 'low' | 'medium' | 'high';
    estimatedComplexity: 'low' | 'medium' | 'high';
    needsTechnicalVisit: boolean;
    missingInformation: string[];
    suggestedQuestions: string[];
    preliminaryNotes: string;
    confidence: number;
    processedByModel?: string;
  };
  messages?: WhatsAppMessage[];
}

export interface WhatsAppMessage {
  id: string;
  sender: 'client' | 'agent' | 'system';
  content: string;
  timestamp: string;
  mediaType?: 'image' | 'audio' | 'document';
  mediaUrl?: string;
  audioDuration?: string;
  aiSummary?: string;
}

// Projects & Rooms
export interface Project {
  id: string;
  tenantId: TenantId;
  code: string; // e.g. PRJ-2026-001
  title: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  productLine: ProductLine;
  status: 'draft' | 'technical_visit' | 'quoting' | 'approved' | 'production' | 'installation' | 'completed';
  version: number;
  currentVersionName: string;
  address: string;
  city: string;
  rooms: Room[];
  technicalVisit?: TechnicalVisit;
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  totalValue: number;
  costValue: number;
  marginPercent: number;
  riskScore: 'low' | 'medium' | 'high';
  riskReasons: string[];
}

export interface Room {
  id: string;
  name: string; // e.g. Cozinha, Quarto Casal, Setup Gamer
  description: string;
  measurements?: {
    width: number; // in mm or cm
    height: number;
    depth: number;
    notes?: string;
  };
  photos: string[];
  itemsCount: number;
  materialsUsed: string[];
}

export interface TechnicalVisit {
  id: string;
  scheduledDate: string;
  completedDate?: string;
  responsibleName: string;
  isValidated: boolean;
  checklist: {
    wallsPlumb: boolean; // Paredes no prumo
    ceilingHeightChecked: boolean; // Pé-direito medido
    electricalOutletsMapped: boolean; // Pontos elétricos/tomadas
    plumbingMapped: boolean; // Hidráulica e esgoto
    gasPointsMapped: boolean; // Ponto de gás
    doorsWindowsClearance: boolean; // Abertura de esquadrias
    levelAndSquareChecked: boolean; // Nível e esquadro
    structuralObstaclesNoted: boolean; // Colunas, vigas ou shafts
  };
  photosCount: number;
  observations: string;
  measurementPackagePdfUrl?: string;
}

// Quotes & Pricing
export interface QuoteItem {
  id: string;
  description: string;
  roomName: string;
  category: 'mdf' | 'hardware' | 'cnc_service' | 'print_3d' | 'led_electronics' | 'labor' | 'finishing';
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  markup: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Quote {
  id: string;
  tenantId: TenantId;
  quoteNumber: string; // e.g. ORC-2026-088
  projectId: string;
  projectTitle: string;
  customerName: string;
  productLine: ProductLine;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
  version: number;
  items: QuoteItem[];
  materialCost: number;
  machineCostCNC: number;
  machineCost3D: number;
  laborCost: number;
  overheadCost: number;
  taxCost: number;
  totalCost: number;
  discount: number;
  totalPrice: number;
  marginPercent: number;
  minimumMarginRequired: number; // default e.g. 25%
  isBelowMinimumMargin: boolean;
  paymentTerms: string;
  validityDays: number;
  estimatedProductionDays: number;
  createdAt: string;
  approvedAt?: string;
}

// Production & PCP
export type ProductionCenterType = 
  | 'woodworking' 
  | 'cnc' 
  | '3d_printing' 
  | 'assembly' 
  | 'finishing' 
  | 'installation' 
  | 'external_supplier';

export interface ProductionCenter {
  id: string;
  name: string;
  type: ProductionCenterType;
  icon: string;
  capacityUtilizationPercent: number;
  activeOrdersCount: number;
}

export interface Machine {
  id: string;
  name: string;
  type: 'cnc_router' | '3d_printer_fdm' | 'edgebander' | 'panel_saw' | 'laser';
  centerType: ProductionCenterType;
  status: 'available' | 'busy' | 'maintenance' | 'offline' | 'blocked';
  costPerHour: number;
  location: string;
  currentJob?: {
    orderNumber: string;
    productName: string;
    progressPercent: number;
    estimatedEndTime: string;
    material: string;
  };
  totalHoursRun: number;
  nextMaintenanceDate: string;
  maintenanceHealthScore: number; // 0-100%
  queueLength: number;
}

export interface ProductionOrder {
  id: string;
  tenantId: TenantId;
  orderNumber: string; // e.g. OP-2026-042
  projectId: string;
  projectTitle: string;
  customerName: string;
  productLine: ProductLine;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  stage: 'to_do' | 'in_progress' | 'quality_check' | 'completed';
  currentCenter: ProductionCenterType;
  operations: ProductionOperation[];
  assignedOperator?: string;
  startDate?: string;
  targetEndDate: string;
  progressPercent: number;
  files: {
    name: string;
    type: 'dxf' | 'stl' | 'gcode' | '3mf' | 'pdf' | 'img';
    url: string;
    size: string;
  }[];
  materialsReserved: boolean;
  qualityPassed: boolean;
  nonConformityNotes?: string;
}

export interface ProductionOperation {
  id: string;
  stepNumber: number;
  name: string;
  center: ProductionCenterType;
  estimatedMinutes: number;
  actualMinutes?: number;
  status: 'pending' | 'running' | 'done' | 'failed';
  machineId?: string;
  notes?: string;
}

// Inventory & Materials
export interface StockItem {
  id: string;
  tenantId: TenantId;
  code: string;
  name: string;
  category: 'mdf_sheet' | 'filament_3d' | 'hardware' | 'led_electronics' | 'paint_finish' | 'consumable';
  unit: 'sheet' | 'kg' | 'spool' | 'un' | 'meter' | 'liter';
  currentQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  minQuantityAlert: number;
  unitCost: number;
  supplier: string;
  location: string;
  specifications?: {
    dimensions?: string; // e.g. 2750x1840x15mm
    thicknessMm?: number;
    finish?: string; // e.g. Louro Freijó, Branco TX, Grafite
    filamentMaterial?: 'PLA' | 'PETG' | 'ABS' | 'TPU';
    filamentColor?: string;
    filamentWeightGrams?: number;
  };
  lastRestockedAt: string;
}

// Catalog & Product Configurator (Gamer / Decor line)
export interface CatalogProduct {
  id: string;
  name: string;
  category: 'gamer_desk' | 'niche_decor' | 'cnc_sign' | 'headphone_stand' | 'cable_organizer' | 'led_shelf';
  basePrice: number;
  baseCost: number;
  imageUrl: string;
  description: string;
  dimensionsDefault: string;
  tags: string[];
  options: {
    finishes: { name: string; extraPrice: number }[];
    ledLighting: { name: string; extraPrice: number }[];
    cncEngraving: { name: string; extraPrice: number }[];
    printed3dAccent: { name: string; extraPrice: number }[];
  };
}

// Finance
export interface FinanceTransaction {
  id: string;
  tenantId: TenantId;
  type: 'payable' | 'receivable';
  description: string;
  category: 'client_payment' | 'material_purchase' | 'machine_maintenance' | 'utility_energy' | 'payroll' | 'taxes';
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue';
  projectId?: string;
  projectTitle?: string;
  costCenter: 'Marcenaria' | 'CNC' | 'Impressão 3D' | 'Geral';
  recipientOrPayer: string;
}

// AI Gateway & Management
export type AIProviderType = 'ollama' | 'lm_studio' | 'openai_compatible' | 'gemini_server';

export interface AIProviderConfig {
  id: string;
  name: string;
  type: AIProviderType;
  baseUrl: string;
  isActive: boolean;
  isDefault: boolean;
  status: 'online' | 'offline' | 'checking';
  models: AIModelInfo[];
}

export interface AIModelInfo {
  id: string;
  name: string;
  displayName: string;
  providerType: AIProviderType;
  purpose: 'general_assistant' | 'lead_triage' | 'quote_assistant' | 'production_assistant' | 'vision_analysis' | 'voice_to_quote';
  isLocal: boolean;
  supportsVision: boolean;
  supportsStructuredOutput: boolean;
  supportsTools: boolean;
  contextWindow: number;
  estimatedCostPer1k: number; // 0 for local
  latencyMsAverage: number;
}

export interface AIExecutionLog {
  id: string;
  timestamp: string;
  providerType: AIProviderType;
  modelName: string;
  task: string;
  promptPreview: string;
  status: 'success' | 'fallback' | 'error';
  latencyMs: number;
  tokensEstimated: number;
  costEstimated: number;
  wasLocal: boolean;
  outputPreview: string;
}

// Audit & Events
export interface AuditLogEntry {
  id: string;
  tenantId?: TenantId;
  actor?: string;
  actorName?: string;
  actorRole?: string;
  action: string;
  entity?: string;
  entityType?: string;
  entityId: string;
  details?: string;
  timestamp: string;
}
export type AuditLog = AuditLogEntry;

export interface AIConfig {
  primaryProvider: string;
  primaryModel: string;
  fallbackModel: string;
  ollamaEndpoint: string;
  lmStudioEndpoint: string;
  timeoutMs: number;
  autoFallbackEnabled: boolean;
}

export type InventoryItem = StockItem;
