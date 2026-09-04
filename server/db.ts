import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import {
  INITIAL_LEADS,
  INITIAL_PROJECTS,
  INITIAL_QUOTES,
  INITIAL_PRODUCTION_ORDERS,
  INITIAL_MACHINES,
  INITIAL_INVENTORY,
  INITIAL_FINANCE,
  INITIAL_AUDIT_LOGS,
  DEFAULT_AI_CONFIG,
} from '../src/data/mockDatabase';

// Ensure .data directory exists
const DATA_DIR = path.join(process.cwd(), '.data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'woodbit.sqlite');
console.log(`[WoodBit Database] Connecting native SQLite at: ${DB_PATH}`);

export const db = new DatabaseSync(DB_PATH);

// Initialize schema
export function initDatabase() {
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA synchronous = NORMAL;');

  // Generic key-value table for client state synchronization
  db.exec(`
    CREATE TABLE IF NOT EXISTS app_state (
      key TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Relational Leads Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      city TEXT NOT NULL,
      product_line TEXT NOT NULL,
      stage TEXT NOT NULL,
      source TEXT,
      budget_estimate REAL,
      notes TEXT,
      ai_triage TEXT,
      messages TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Relational Projects Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      customer_id TEXT,
      customer_name TEXT NOT NULL,
      customer_phone TEXT,
      city TEXT NOT NULL,
      product_line TEXT NOT NULL,
      status TEXT NOT NULL,
      version INTEGER DEFAULT 1,
      total_value REAL DEFAULT 0,
      margin_percent REAL DEFAULT 0,
      risk_score TEXT DEFAULT 'low',
      data TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Relational Quotes Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS quotes (
      id TEXT PRIMARY KEY,
      quote_number TEXT NOT NULL UNIQUE,
      project_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      status TEXT NOT NULL,
      total_price REAL DEFAULT 0,
      margin_percent REAL DEFAULT 0,
      data TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  // Relational Production Orders (PCP) Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS production_orders (
      id TEXT PRIMARY KEY,
      order_number TEXT NOT NULL UNIQUE,
      project_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      priority TEXT NOT NULL,
      stage TEXT NOT NULL,
      progress_percent INTEGER DEFAULT 0,
      data TEXT NOT NULL,
      target_end_date TEXT
    );
  `);

  // Relational Inventory Items Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS inventory (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      unit TEXT NOT NULL,
      current_quantity REAL DEFAULT 0,
      reserved_quantity REAL DEFAULT 0,
      min_quantity_alert REAL DEFAULT 0,
      unit_cost REAL DEFAULT 0,
      data TEXT NOT NULL
    );
  `);

  // Relational Finance Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS finance (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      due_date TEXT NOT NULL,
      status TEXT NOT NULL,
      cost_center TEXT NOT NULL,
      data TEXT NOT NULL
    );
  `);

  // Relational Audit Logs Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      entity_type TEXT,
      entity_id TEXT,
      actor_name TEXT,
      actor_role TEXT,
      details TEXT,
      timestamp TEXT NOT NULL
    );
  `);

  // Relational WhatsApp Messages Log Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS whatsapp_messages (
      id TEXT PRIMARY KEY,
      lead_id TEXT,
      phone TEXT NOT NULL,
      sender TEXT NOT NULL,
      content TEXT NOT NULL,
      media_type TEXT,
      media_url TEXT,
      ai_summary TEXT,
      timestamp TEXT NOT NULL
    );
  `);

  // Seed Initial Data if empty
  seedInitialDataIfEmpty();
}

function seedInitialDataIfEmpty() {
  const checkCount = db.prepare('SELECT COUNT(*) as count FROM app_state').get() as { count: number };
  if (checkCount && checkCount.count > 0) {
    return;
  }

  console.log('[WoodBit Database] Seeding initial database tables from factory baseline...');
  const now = new Date().toISOString();

  // Save base collections to app_state for client hydration
  const insertState = db.prepare('INSERT OR REPLACE INTO app_state (key, data, updated_at) VALUES (?, ?, ?)');
  insertState.run('leads', JSON.stringify(INITIAL_LEADS), now);
  insertState.run('projects', JSON.stringify(INITIAL_PROJECTS), now);
  insertState.run('quotes', JSON.stringify(INITIAL_QUOTES), now);
  insertState.run('productionOrders', JSON.stringify(INITIAL_PRODUCTION_ORDERS), now);
  insertState.run('machines', JSON.stringify(INITIAL_MACHINES), now);
  insertState.run('inventory', JSON.stringify(INITIAL_INVENTORY), now);
  insertState.run('finance', JSON.stringify(INITIAL_FINANCE), now);
  insertState.run('auditLogs', JSON.stringify(INITIAL_AUDIT_LOGS), now);
  insertState.run('aiConfig', JSON.stringify(DEFAULT_AI_CONFIG), now);

  // Seed relational leads
  const insertLead = db.prepare(`
    INSERT OR REPLACE INTO leads (id, customer_name, phone, city, product_line, stage, source, budget_estimate, notes, ai_triage, messages, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const l of INITIAL_LEADS) {
    insertLead.run(
      l.id,
      l.customerName,
      l.phone,
      l.city,
      l.productLine,
      l.stage,
      l.source,
      l.budgetEstimate || 0,
      l.notes || '',
      JSON.stringify(l.aiTriage || null),
      JSON.stringify(l.messages || []),
      l.createdAt,
      l.updatedAt
    );
  }

  // Seed relational projects
  const insertProject = db.prepare(`
    INSERT OR REPLACE INTO projects (id, code, title, customer_id, customer_name, customer_phone, city, product_line, status, version, total_value, margin_percent, risk_score, data, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const p of INITIAL_PROJECTS) {
    insertProject.run(
      p.id,
      p.code,
      p.title,
      p.customerId,
      p.customerName,
      p.customerPhone,
      p.city,
      p.productLine,
      p.status,
      p.version,
      p.totalValue,
      p.marginPercent,
      p.riskScore,
      JSON.stringify(p),
      p.createdAt,
      p.updatedAt
    );
  }

  // Seed relational quotes
  const insertQuote = db.prepare(`
    INSERT OR REPLACE INTO quotes (id, quote_number, project_id, customer_name, status, total_price, margin_percent, data, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const q of INITIAL_QUOTES) {
    insertQuote.run(
      q.id,
      q.quoteNumber,
      q.projectId,
      q.customerName,
      q.status,
      q.totalPrice,
      q.marginPercent,
      JSON.stringify(q),
      q.createdAt
    );
  }

  // Seed relational production orders
  const insertOrder = db.prepare(`
    INSERT OR REPLACE INTO production_orders (id, order_number, project_id, customer_name, priority, stage, progress_percent, data, target_end_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const op of INITIAL_PRODUCTION_ORDERS) {
    insertOrder.run(
      op.id,
      op.orderNumber,
      op.projectId,
      op.customerName,
      op.priority,
      op.stage,
      op.progressPercent,
      JSON.stringify(op),
      op.targetEndDate
    );
  }

  console.log('[WoodBit Database] Initial database seeded successfully.');
}

// Data Access Object (DAO) helpers
export const dbService = {
  // Sync state retrieval
  getAllState: () => {
    const rows = db.prepare('SELECT key, data FROM app_state').all() as { key: string; data: string }[];
    const result: Record<string, any> = {};
    for (const r of rows) {
      try {
        result[r.key] = JSON.parse(r.data);
      } catch {
        result[r.key] = null;
      }
    }
    return result;
  },

  getState: <T>(key: string, fallback: T): T => {
    const row = db.prepare('SELECT data FROM app_state WHERE key = ?').get(key) as { data: string } | undefined;
    if (!row) return fallback;
    try {
      return JSON.parse(row.data) as T;
    } catch {
      return fallback;
    }
  },

  saveState: (key: string, data: any): void => {
    const now = new Date().toISOString();
    const serialized = JSON.stringify(data);
    db.prepare('INSERT OR REPLACE INTO app_state (key, data, updated_at) VALUES (?, ?, ?)').run(key, serialized, now);
  },

  // Leads
  getLeads: (): any[] => {
    return dbService.getState('leads', INITIAL_LEADS);
  },

  saveLead: (lead: any): void => {
    const leads = dbService.getLeads();
    const idx = leads.findIndex((l: any) => l.id === lead.id);
    if (idx >= 0) {
      leads[idx] = { ...leads[idx], ...lead, updatedAt: new Date().toISOString() };
    } else {
      leads.unshift({ ...lead, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    dbService.saveState('leads', leads);

    // Sync to relational table
    try {
      db.prepare(`
        INSERT OR REPLACE INTO leads (id, customer_name, phone, city, product_line, stage, source, budget_estimate, notes, ai_triage, messages, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        lead.id,
        lead.customerName,
        lead.phone || '',
        lead.city || 'Natividade - RJ',
        lead.productLine || 'furniture',
        lead.stage || 'lead',
        lead.source || 'whatsapp',
        lead.budgetEstimate || 0,
        lead.notes || '',
        JSON.stringify(lead.aiTriage || null),
        JSON.stringify(lead.messages || []),
        lead.createdAt || new Date().toISOString(),
        new Date().toISOString()
      );
    } catch (e) {
      console.warn('[WoodBit Database] Error syncing lead to relational table:', e);
    }
  },

  // Projects
  getProjects: (): any[] => {
    return dbService.getState('projects', INITIAL_PROJECTS);
  },

  saveProject: (project: any): void => {
    const projects = dbService.getProjects();
    const idx = projects.findIndex((p: any) => p.id === project.id);
    if (idx >= 0) {
      projects[idx] = { ...projects[idx], ...project, updatedAt: new Date().toISOString() };
    } else {
      projects.unshift({ ...project, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    dbService.saveState('projects', projects);
  },

  // Quotes
  getQuotes: (): any[] => {
    return dbService.getState('quotes', INITIAL_QUOTES);
  },

  saveQuote: (quote: any): void => {
    const quotes = dbService.getQuotes();
    const idx = quotes.findIndex((q: any) => q.id === quote.id);
    if (idx >= 0) {
      quotes[idx] = { ...quotes[idx], ...quote };
    } else {
      quotes.unshift({ ...quote, createdAt: new Date().toISOString() });
    }
    dbService.saveState('quotes', quotes);
  },

  // Production Orders
  getProductionOrders: (): any[] => {
    return dbService.getState('productionOrders', INITIAL_PRODUCTION_ORDERS);
  },

  saveProductionOrder: (order: any): void => {
    const orders = dbService.getProductionOrders();
    const idx = orders.findIndex((o: any) => o.id === order.id);
    if (idx >= 0) {
      orders[idx] = { ...orders[idx], ...order };
    } else {
      orders.unshift(order);
    }
    dbService.saveState('productionOrders', orders);
  },

  // Audit Log
  addAuditLog: (entry: any): void => {
    const logs = dbService.getState('auditLogs', INITIAL_AUDIT_LOGS);
    logs.unshift(entry);
    dbService.saveState('auditLogs', logs);

    try {
      db.prepare(`
        INSERT INTO audit_logs (id, action, entity_type, entity_id, actor_name, actor_role, details, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        entry.id,
        entry.action,
        entry.entityType || 'General',
        entry.entityId || '',
        entry.actorName || 'Operador',
        entry.actorRole || 'admin',
        entry.details || '',
        entry.timestamp || new Date().toISOString()
      );
    } catch (e) {
      console.warn('[WoodBit Database] Error recording audit log in SQLite:', e);
    }
  },

  // WhatsApp Message Logging
  logWhatsAppMessage: (msg: {
    id: string;
    leadId?: string;
    phone: string;
    sender: 'client' | 'agent' | 'system';
    content: string;
    mediaType?: string;
    mediaUrl?: string;
    aiSummary?: string;
  }) => {
    try {
      db.prepare(`
        INSERT OR REPLACE INTO whatsapp_messages (id, lead_id, phone, sender, content, media_type, media_url, ai_summary, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        msg.id,
        msg.leadId || null,
        msg.phone,
        msg.sender,
        msg.content,
        msg.mediaType || null,
        msg.mediaUrl || null,
        msg.aiSummary || null,
        new Date().toISOString()
      );
    } catch (e) {
      console.warn('[WoodBit Database] Error logging WhatsApp message:', e);
    }
  },

  getWhatsAppMessages: (limit: number = 20): any[] => {
    try {
      const stmt = db.prepare('SELECT * FROM whatsapp_messages ORDER BY timestamp DESC LIMIT ?');
      return stmt.all(limit) as any[];
    } catch (e) {
      console.warn('[WoodBit Database] Error fetching WhatsApp messages:', e);
      return [];
    }
  },
};
