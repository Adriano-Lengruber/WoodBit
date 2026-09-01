import {
  Lead,
  Project,
  Quote,
  ProductionOrder,
  Machine,
  StockItem,
  CatalogProduct,
  FinanceTransaction,
  AIProviderConfig,
  AIExecutionLog,
  AuditLogEntry,
  ProductionCenter,
} from '../types';

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-01',
    tenantId: 'tenant-woodbit-rj',
    customerName: 'Mariana Costa',
    phone: '(22) 99871-4412',
    email: 'mariana.costa@email.com',
    city: 'Natividade - RJ',
    productLine: 'furniture',
    stage: 'quote_sent',
    source: 'whatsapp',
    budgetEstimate: 18500,
    notes: 'Cozinha planejada com ilha em MDF Louro Freijó e puxadores perfil cava.',
    createdAt: '2026-08-28T09:30:00Z',
    updatedAt: '2026-09-01T10:15:00Z',
    assignedTo: 'Carlos Marcenaria',
    aiTriage: {
      category: 'furniture',
      urgency: 'high',
      estimatedComplexity: 'high',
      needsTechnicalVisit: true,
      missingInformation: ['Ponto de gás exato', 'Modelo do cooktop'],
      suggestedQuestions: [
        'Qual a voltagem das tomadas da ilha (110v ou 220v)?',
        'O cooktop já foi comprado para ver o nicho de corte?'
      ],
      preliminaryNotes: 'Cliente deseja instalação antes do final do mês. Área estimada 14m².',
      confidence: 0.94,
      processedByModel: 'qwen2.5-coder:7b (Ollama Local)'
    },
    messages: [
      {
        id: 'msg-01',
        sender: 'client',
        content: 'Olá! Gostaria de um orçamento para armários de cozinha planejada aqui em Natividade. Tenho o esboço da arquiteta.',
        timestamp: '2026-08-28 09:30',
      },
      {
        id: 'msg-02',
        sender: 'agent',
        content: 'Olá Mariana! Seja bem-vinda à WoodBit. Que ótimo! Pode me enviar a planta ou fotos do espaço?',
        timestamp: '2026-08-28 09:32',
      },
      {
        id: 'msg-03',
        sender: 'client',
        content: 'Enviei a foto! Queremos MDF Freijó nos aéreos e Grafite na parte de baixo.',
        timestamp: '2026-08-28 09:35',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 'lead-02',
    tenantId: 'tenant-woodbit-rj',
    customerName: 'Lucas Gamer (Lucas Alvim)',
    phone: '(22) 98112-9900',
    email: 'lucas.streamer@gmail.com',
    city: 'Itaperuna - RJ',
    productLine: 'gamer',
    stage: 'approved',
    source: 'instagram',
    budgetEstimate: 3400,
    notes: 'Desk Gamer Blackout com suporte para 2 monitores, canaletas para fios, fita LED embutida e logo gravado na CNC.',
    createdAt: '2026-08-25T14:10:00Z',
    updatedAt: '2026-08-31T16:00:00Z',
    assignedTo: 'Diego Digital Fab',
    aiTriage: {
      category: 'gamer',
      urgency: 'medium',
      estimatedComplexity: 'medium',
      needsTechnicalVisit: false,
      missingInformation: ['Cor preferida da fita LED (ARGB ou fixa)'],
      suggestedQuestions: ['Deseja passa-cabos em alumínio ou impresso em 3D?'],
      preliminaryNotes: 'Produto padronizável com gravação personalizada na CNC router.',
      confidence: 0.98,
      processedByModel: 'llama-3.2-vision (LM Studio)'
    },
    messages: [
      {
        id: 'msg-04',
        sender: 'client',
        content: 'Boa tarde! Vi o setup gamer que vocês postaram no Insta. Tem como fazer um tampo de 1.60m com o logo do meu canal na CNC?',
        timestamp: '2026-08-25 14:10',
      },
      {
        id: 'msg-05',
        sender: 'agent',
        content: 'Com certeza Lucas! Fazemos a usinagem CNC de precisão e podemos incluir suportes de fone impressos em 3D.',
        timestamp: '2026-08-25 14:15',
      }
    ]
  },
  {
    id: 'lead-03',
    tenantId: 'tenant-woodbit-rj',
    customerName: 'Dr. Roberto Meireles (Clínica)',
    phone: '(22) 99933-7721',
    city: 'Porciúncula - RJ',
    productLine: 'digital_fab',
    stage: 'technical_visit',
    source: 'referral',
    budgetEstimate: 4200,
    notes: 'Letreiro de recepção em acrílico + MDF cortado a laser e CNC com iluminação backlight.',
    createdAt: '2026-08-29T11:00:00Z',
    updatedAt: '2026-09-01T08:00:00Z',
    assignedTo: 'Carlos Marcenaria',
    aiTriage: {
      category: 'digital_fab',
      urgency: 'low',
      estimatedComplexity: 'medium',
      needsTechnicalVisit: true,
      missingInformation: ['Ponto de energia na parede do letreiro'],
      suggestedQuestions: ['A parede onde o letreiro ficará é alvenaria ou drywall?'],
      preliminaryNotes: 'Visita agendada para medição de fachada interna.',
      confidence: 0.91,
      processedByModel: 'deepseek-r1:8b (Ollama Local)'
    }
  },
  {
    id: 'lead-04',
    tenantId: 'tenant-woodbit-rj',
    customerName: 'Ana Beatriz Varre-Sai',
    phone: '(22) 98844-3312',
    city: 'Varre-Sai - RJ',
    productLine: 'furniture',
    stage: 'lead',
    source: 'whatsapp',
    budgetEstimate: 12000,
    notes: 'Closet planejado para suíte master.',
    createdAt: '2026-09-01T09:15:00Z',
    updatedAt: '2026-09-01T09:15:00Z',
    assignedTo: 'Carlos Marcenaria'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'prj-01',
    tenantId: 'tenant-woodbit-rj',
    code: 'PRJ-2026-001',
    title: 'Cozinha & Espaço Gourmet Casa Silva',
    customerId: 'lead-01',
    customerName: 'Mariana Costa Silva',
    customerPhone: '(22) 99871-4412',
    productLine: 'furniture',
    status: 'production',
    version: 2,
    currentVersionName: 'v2.1 - Ajuste de Ilha e Gaveteiro',
    address: 'Rua Dr. Geraldo Martins, 142 - Centro',
    city: 'Natividade - RJ',
    totalValue: 18500,
    costValue: 11800,
    marginPercent: 36.2,
    riskScore: 'low',
    riskReasons: ['Medição técnica 100% validada', 'MDF Freijó em estoque reservado'],
    createdAt: '2026-08-15T10:00:00Z',
    updatedAt: '2026-09-01T08:30:00Z',
    deadline: '2026-09-25',
    rooms: [
      {
        id: 'room-01',
        name: 'Cozinha Principal',
        description: 'Armários superiores, aéreos com vidro reflecta, gaveteiros com amortecimento.',
        measurements: { width: 3600, height: 2650, depth: 600, notes: 'Desnível de 4mm no piso corrigido no rodapé.' },
        photos: ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=60'],
        itemsCount: 8,
        materialsUsed: ['MDF Louro Freijó 18mm', 'MDF Branco TX 15mm', 'Corrediças Telescópicas Ocultas']
      },
      {
        id: 'room-02',
        name: 'Ilha Gourmet',
        description: 'Bancada com nicho para torre de tomadas embutida e nicho de vinhos usinado na CNC.',
        measurements: { width: 2000, height: 920, depth: 900 },
        photos: ['https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&auto=format&fit=crop&q=60'],
        itemsCount: 4,
        materialsUsed: ['MDF Grafite Matt 18mm', 'Usinagem CNC Ripado']
      }
    ],
    technicalVisit: {
      id: 'tv-01',
      scheduledDate: '2026-08-20T14:00:00Z',
      completedDate: '2026-08-20T15:30:00Z',
      responsibleName: 'Carlos Souza (Marceneiro Chefe)',
      isValidated: true,
      checklist: {
        wallsPlumb: true,
        ceilingHeightChecked: true,
        electricalOutletsMapped: true,
        plumbingMapped: true,
        gasPointsMapped: true,
        doorsWindowsClearance: true,
        levelAndSquareChecked: true,
        structuralObstaclesNoted: true,
      },
      photosCount: 14,
      observations: 'Ponto de esgoto 45cm do piso. Tomada do depurador a 2.10m. Tudo conferido.',
      measurementPackagePdfUrl: '/docs/medicao-casa-silva.pdf'
    }
  },
  {
    id: 'prj-02',
    tenantId: 'tenant-woodbit-rj',
    code: 'PRJ-2026-002',
    title: 'Setup Gamer Modular Streamer',
    customerId: 'lead-02',
    customerName: 'Lucas Alvim',
    customerPhone: '(22) 98112-9900',
    productLine: 'gamer',
    status: 'production',
    version: 1,
    currentVersionName: 'v1.0 - Aprovado com Gravação CNC',
    address: 'Av. Cardoso Moreira, 820 - Centro',
    city: 'Itaperuna - RJ',
    totalValue: 3400,
    costValue: 1950,
    marginPercent: 42.6,
    riskScore: 'low',
    riskReasons: ['Peça 3D em fila de impressão', 'Arquivo DXF gerado'],
    createdAt: '2026-08-26T14:00:00Z',
    updatedAt: '2026-09-01T09:00:00Z',
    deadline: '2026-09-12',
    rooms: [
      {
        id: 'room-03',
        name: 'Quarto Setup',
        description: 'Mesa ergonômica com chanfro frontal usinado, passa cabos impresso em 3D e canaleta LED.',
        measurements: { width: 1600, height: 750, depth: 800 },
        photos: ['https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&auto=format&fit=crop&q=60'],
        itemsCount: 3,
        materialsUsed: ['MDF Preto TX 25mm', 'Filamento PLA Preto', 'Fita LED Cob 4000K']
      }
    ]
  },
  {
    id: 'prj-03',
    tenantId: 'tenant-woodbit-rj',
    code: 'PRJ-2026-003',
    title: 'Painel e Letreiro Clínica Meireles',
    customerId: 'lead-03',
    customerName: 'Dr. Roberto Meireles',
    customerPhone: '(22) 99933-7721',
    productLine: 'digital_fab',
    status: 'quoting',
    version: 1,
    currentVersionName: 'v1.0 - Orçamento Inicial',
    address: 'Rua Prefeito José Garcia, 44',
    city: 'Porciúncula - RJ',
    totalValue: 4200,
    costValue: 2400,
    marginPercent: 42.8,
    riskScore: 'medium',
    riskReasons: ['Aguardando confirmação de cor do acrílico pelo fornecedor'],
    createdAt: '2026-08-30T11:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
    deadline: '2026-09-20',
    rooms: [
      {
        id: 'room-04',
        name: 'Recepção',
        description: 'Painel ripado em MDF Louro Freijó com letras caixas cortadas na CNC e logo com acabamento escovado.',
        measurements: { width: 2800, height: 2400, depth: 80 },
        photos: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60'],
        itemsCount: 2,
        materialsUsed: ['MDF Louro Freijó 15mm', 'Acrílico 5mm Cristal', 'Backlight LED']
      }
    ],
    technicalVisit: {
      id: 'tv-03',
      scheduledDate: '2026-09-03T10:00:00Z',
      completedDate: '2026-09-03T11:30:00Z',
      responsibleName: 'Carlos Souza (Marceneiro Chefe)',
      isValidated: true,
      checklist: {
        wallsPlumb: true,
        ceilingHeightChecked: true,
        electricalOutletsMapped: true,
        plumbingMapped: false,
        gasPointsMapped: false,
        doorsWindowsClearance: true,
        levelAndSquareChecked: true,
        structuralObstaclesNoted: true,
      },
      photosCount: 6,
      observations: 'Ponto de tomada central para alimentação do backlight 12V.',
      measurementPackagePdfUrl: '/docs/medicao-clinica-meireles.pdf'
    }
  },
  {
    id: 'prj-04',
    tenantId: 'tenant-woodbit-rj',
    code: 'PRJ-2026-004',
    title: 'Closet Master & Home Office Café Colonial',
    customerId: 'lead-04',
    customerName: 'Ana Beatriz Varre-Sai',
    customerPhone: '(22) 98844-3312',
    productLine: 'furniture',
    status: 'technical_visit',
    version: 1,
    currentVersionName: 'v1.0 - Briefing Técnico',
    address: 'Sítio Santa Rita - Zona Rural',
    city: 'Varre-Sai - RJ',
    totalValue: 14800,
    costValue: 8600,
    marginPercent: 41.8,
    riskScore: 'low',
    riskReasons: ['Medição de prumo de parede de sítio realizada com scanner laser'],
    createdAt: '2026-08-31T09:00:00Z',
    updatedAt: '2026-09-01T09:15:00Z',
    deadline: '2026-10-05',
    rooms: [
      {
        id: 'room-05',
        name: 'Closet Master',
        description: 'Módulos em MDF Branco TX e portas de correr com perfil em alumínio bronze e espelho reflecta.',
        measurements: { width: 3200, height: 2700, depth: 650 },
        photos: ['https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600&auto=format&fit=crop&q=60'],
        itemsCount: 5,
        materialsUsed: ['MDF Branco TX 18mm', 'Perfil Alumínio Bronze', 'Corrediças Slow']
      },
      {
        id: 'room-06',
        name: 'Bancada Home Office',
        description: 'Bancada suspensa com gaveteiro volante e nichos decorativos para amostras de café.',
        measurements: { width: 2200, height: 750, depth: 600 },
        photos: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=60'],
        itemsCount: 2,
        materialsUsed: ['MDF Carvalho Batur 25mm', 'Ferragens Ocultas']
      }
    ],
    technicalVisit: {
      id: 'tv-04',
      scheduledDate: '2026-09-04T14:00:00Z',
      responsibleName: 'Carlos Souza (Marceneiro Chefe)',
      isValidated: false,
      checklist: {
        wallsPlumb: true,
        ceilingHeightChecked: true,
        electricalOutletsMapped: true,
        plumbingMapped: false,
        gasPointsMapped: false,
        doorsWindowsClearance: true,
        levelAndSquareChecked: false,
        structuralObstaclesNoted: false,
      },
      photosCount: 8,
      observations: 'Visita agendada para conferir pé-direito alto do casarão colonial.',
      measurementPackagePdfUrl: '/docs/medicao-varre-sai.pdf'
    }
  }
];

export const INITIAL_QUOTES: Quote[] = [
  {
    id: 'quote-01',
    tenantId: 'tenant-woodbit-rj',
    quoteNumber: 'ORC-2026-088',
    projectId: 'prj-01',
    projectTitle: 'Cozinha & Espaço Gourmet Casa Silva',
    customerName: 'Mariana Costa Silva',
    productLine: 'furniture',
    status: 'approved',
    version: 2,
    materialCost: 7200,
    machineCostCNC: 850,
    machineCost3D: 150,
    laborCost: 2600,
    overheadCost: 600,
    taxCost: 400,
    totalCost: 11800,
    discount: 500,
    totalPrice: 18500,
    marginPercent: 36.2,
    minimumMarginRequired: 25,
    isBelowMinimumMargin: false,
    paymentTerms: '50% entrada no contrato + 50% na conclusão da instalação',
    validityDays: 15,
    estimatedProductionDays: 18,
    createdAt: '2026-08-22T10:00:00Z',
    approvedAt: '2026-08-24T14:30:00Z',
    items: [
      {
        id: 'qi-01',
        roomName: 'Cozinha Principal',
        description: 'Chapas MDF Louro Freijó 18mm (4 chapas)',
        category: 'mdf',
        quantity: 4,
        unit: 'chapa',
        unitCost: 380,
        totalCost: 1520,
        markup: 1.6,
        unitPrice: 608,
        totalPrice: 2432
      },
      {
        id: 'qi-02',
        roomName: 'Cozinha Principal',
        description: 'Chapas MDF Branco TX 15mm estrutura interna (6 chapas)',
        category: 'mdf',
        quantity: 6,
        unit: 'chapa',
        unitCost: 210,
        totalCost: 1260,
        markup: 1.6,
        unitPrice: 336,
        totalPrice: 2016
      },
      {
        id: 'qi-03',
        roomName: 'Cozinha Principal',
        description: 'Kit Corrediças Ocultas com Amortecedor Slow (12 pares)',
        category: 'hardware',
        quantity: 12,
        unit: 'par',
        unitCost: 75,
        totalCost: 900,
        markup: 1.5,
        unitPrice: 112.5,
        totalPrice: 1350
      },
      {
        id: 'qi-04',
        roomName: 'Ilha Gourmet',
        description: 'Horas de Usinagem CNC Router para Painel Ripado da Ilha',
        category: 'cnc_service',
        quantity: 4.5,
        unit: 'hora',
        unitCost: 120,
        totalCost: 540,
        markup: 1.7,
        unitPrice: 204,
        totalPrice: 918
      },
      {
        id: 'qi-05',
        roomName: 'Ilha Gourmet',
        description: 'Puxadores personalizados impressos em 3D PETG alta resistência',
        category: 'print_3d',
        quantity: 6,
        unit: 'un',
        unitCost: 18,
        totalCost: 108,
        markup: 1.8,
        unitPrice: 32.4,
        totalPrice: 194.4
      },
      {
        id: 'qi-06',
        roomName: 'Geral',
        description: 'Mão de obra especializada marcenaria e montagem fina',
        category: 'labor',
        quantity: 48,
        unit: 'hora',
        unitCost: 45,
        totalCost: 2160,
        markup: 1.5,
        unitPrice: 67.5,
        totalPrice: 3240
      }
    ]
  },
  {
    id: 'quote-02',
    tenantId: 'tenant-woodbit-rj',
    quoteNumber: 'ORC-2026-089',
    projectId: 'prj-02',
    projectTitle: 'Setup Gamer Modular Streamer',
    customerName: 'Lucas Alvim',
    productLine: 'gamer',
    status: 'approved',
    version: 1,
    materialCost: 1100,
    machineCostCNC: 350,
    machineCost3D: 180,
    laborCost: 220,
    overheadCost: 70,
    taxCost: 30,
    totalCost: 1950,
    discount: 0,
    totalPrice: 3400,
    marginPercent: 42.6,
    minimumMarginRequired: 25,
    isBelowMinimumMargin: false,
    paymentTerms: 'PIX à vista com 5% ou 3x no cartão sem juros',
    validityDays: 15,
    estimatedProductionDays: 7,
    createdAt: '2026-08-26T15:00:00Z',
    approvedAt: '2026-08-27T11:00:00Z',
    items: [
      {
        id: 'qi-07',
        roomName: 'Quarto Setup',
        description: 'Tampo MDF 25mm Preto TX com borda chanfrada',
        category: 'mdf',
        quantity: 1,
        unit: 'un',
        unitCost: 450,
        totalCost: 450,
        markup: 1.8,
        unitPrice: 810,
        totalPrice: 810
      },
      {
        id: 'qi-08',
        roomName: 'Quarto Setup',
        description: 'Gravação artística de Logo na CNC + Usinagem de passa cabos',
        category: 'cnc_service',
        quantity: 2,
        unit: 'hora',
        unitCost: 120,
        totalCost: 240,
        markup: 1.9,
        unitPrice: 228,
        totalPrice: 456
      },
      {
        id: 'qi-09',
        roomName: 'Quarto Setup',
        description: 'Suporte de Headphone & Organizador de cabos impresso em 3D',
        category: 'print_3d',
        quantity: 2,
        unit: 'un',
        unitCost: 45,
        totalCost: 90,
        markup: 2.0,
        unitPrice: 90,
        totalPrice: 180
      }
    ]
  },
  {
    id: 'quote-03',
    tenantId: 'tenant-woodbit-rj',
    quoteNumber: 'ORC-2026-090',
    projectId: 'prj-03',
    projectTitle: 'Painel e Letreiro Clínica Meireles',
    customerName: 'Dr. Roberto Meireles',
    productLine: 'digital_fab',
    status: 'sent',
    version: 1,
    materialCost: 1400,
    machineCostCNC: 600,
    machineCost3D: 0,
    laborCost: 400,
    overheadCost: 120,
    taxCost: 80,
    totalCost: 2600,
    discount: 0,
    totalPrice: 4200,
    marginPercent: 38.1,
    minimumMarginRequired: 25,
    isBelowMinimumMargin: false,
    paymentTerms: 'Entrada 50% + 50% na fixação do letreiro',
    validityDays: 10,
    estimatedProductionDays: 10,
    createdAt: '2026-08-30T14:00:00Z',
    items: [
      {
        id: 'qi-10',
        roomName: 'Recepção',
        description: 'Painel Ripado Louro Freijó usinado na Router',
        category: 'mdf',
        quantity: 1,
        unit: 'un',
        unitCost: 850,
        totalCost: 850,
        markup: 1.7,
        unitPrice: 1445,
        totalPrice: 1445
      },
      {
        id: 'qi-11',
        roomName: 'Recepção',
        description: 'Letras Caixa Acrílico Cristal 5mm com fita LED Backlight',
        category: 'cnc_service',
        quantity: 1,
        unit: 'conj',
        unitCost: 550,
        totalCost: 550,
        markup: 1.8,
        unitPrice: 990,
        totalPrice: 990
      }
    ]
  },
  {
    id: 'quote-04',
    tenantId: 'tenant-woodbit-rj',
    quoteNumber: 'ORC-2026-091',
    projectId: 'prj-04',
    projectTitle: 'Closet Master & Home Office Café Colonial',
    customerName: 'Ana Beatriz Varre-Sai',
    productLine: 'furniture',
    status: 'draft',
    version: 1,
    materialCost: 5400,
    machineCostCNC: 700,
    machineCost3D: 100,
    laborCost: 1900,
    overheadCost: 500,
    taxCost: 350,
    totalCost: 8950,
    discount: 400,
    totalPrice: 14800,
    marginPercent: 39.5,
    minimumMarginRequired: 25,
    isBelowMinimumMargin: false,
    paymentTerms: '4x sem juros (Contrato + 30/60/90)',
    validityDays: 20,
    estimatedProductionDays: 22,
    createdAt: '2026-09-01T09:30:00Z',
    items: [
      {
        id: 'qi-12',
        roomName: 'Closet Master',
        description: 'Chapas MDF Branco TX 18mm estrutural',
        category: 'mdf',
        quantity: 8,
        unit: 'chapa',
        unitCost: 240,
        totalCost: 1920,
        markup: 1.6,
        unitPrice: 384,
        totalPrice: 3072
      }
    ]
  }
];

export const INITIAL_PRODUCTION_CENTERS: ProductionCenter[] = [
  { id: 'pc-01', name: 'Marcenaria & Corte', type: 'woodworking', icon: 'Hammer', capacityUtilizationPercent: 78, activeOrdersCount: 4 },
  { id: 'pc-02', name: 'CNC Router Usinagem', type: 'cnc', icon: 'Cpu', capacityUtilizationPercent: 85, activeOrdersCount: 3 },
  { id: 'pc-03', name: 'Impressão 3D (FDM)', type: '3d_printing', icon: 'Printer', capacityUtilizationPercent: 55, activeOrdersCount: 2 },
  { id: 'pc-04', name: 'Montagem & Pré-Encaixe', type: 'assembly', icon: 'Wrench', capacityUtilizationPercent: 62, activeOrdersCount: 2 },
  { id: 'pc-05', name: 'Controle de Qualidade', type: 'finishing', icon: 'ShieldCheck', capacityUtilizationPercent: 40, activeOrdersCount: 1 },
  { id: 'pc-06', name: 'Instalação / Campo', type: 'installation', icon: 'Truck', capacityUtilizationPercent: 70, activeOrdersCount: 1 },
];

export const INITIAL_MACHINES: Machine[] = [
  {
    id: 'mach-01',
    name: 'CNC Router Pro 2030 (Área 2x3m)',
    type: 'cnc_router',
    centerType: 'cnc',
    status: 'busy',
    costPerHour: 120,
    location: 'Galpão 1 - Setor Digital',
    currentJob: {
      orderNumber: 'OP-2026-042',
      productName: 'Painel Ripado Ilha Gourmet (Mariana Silva)',
      progressPercent: 68,
      estimatedEndTime: '2026-09-01T15:45:00Z',
      material: 'MDF Louro Freijó 18mm'
    },
    totalHoursRun: 1420,
    nextMaintenanceDate: '2026-09-18',
    maintenanceHealthScore: 92,
    queueLength: 3
  },
  {
    id: 'mach-02',
    name: 'Impressora 3D Bambu Lab X1-Carbon #01',
    type: '3d_printer_fdm',
    centerType: '3d_printing',
    status: 'busy',
    costPerHour: 35,
    location: 'Bancada 3D Lab',
    currentJob: {
      orderNumber: 'OP-2026-043',
      productName: 'Suporte Headphone Gamer + Logo (Lucas Alvim)',
      progressPercent: 82,
      estimatedEndTime: '2026-09-01T14:15:00Z',
      material: 'PETG Preto Fosco 1.75mm (180g)'
    },
    totalHoursRun: 890,
    nextMaintenanceDate: '2026-09-25',
    maintenanceHealthScore: 96,
    queueLength: 2
  },
  {
    id: 'mach-03',
    name: 'Impressora 3D Creality K1 Max #02',
    type: '3d_printer_fdm',
    centerType: '3d_printing',
    status: 'available',
    costPerHour: 30,
    location: 'Bancada 3D Lab',
    totalHoursRun: 650,
    nextMaintenanceDate: '2026-09-30',
    maintenanceHealthScore: 98,
    queueLength: 0
  },
  {
    id: 'mach-04',
    name: 'Coladeira de Borda Automática Maksiwa',
    type: 'edgebander',
    centerType: 'woodworking',
    status: 'available',
    costPerHour: 80,
    location: 'Galpão 1 - Setor Corte',
    totalHoursRun: 1100,
    nextMaintenanceDate: '2026-09-10',
    maintenanceHealthScore: 88,
    queueLength: 1
  },
  {
    id: 'mach-05',
    name: 'Esquadrejadeira de Precisão Baldan',
    type: 'panel_saw',
    centerType: 'woodworking',
    status: 'busy',
    costPerHour: 60,
    location: 'Galpão 1 - Setor Corte',
    currentJob: {
      orderNumber: 'OP-2026-042',
      productName: 'Caixaria Branca Cozinha',
      progressPercent: 45,
      estimatedEndTime: '2026-09-01T16:00:00Z',
      material: 'MDF Branco TX 15mm'
    },
    totalHoursRun: 2300,
    nextMaintenanceDate: '2026-09-08',
    maintenanceHealthScore: 84,
    queueLength: 2
  }
];

export const INITIAL_PRODUCTION_ORDERS: ProductionOrder[] = [
  {
    id: 'op-01',
    tenantId: 'tenant-woodbit-rj',
    orderNumber: 'OP-2026-042',
    projectId: 'prj-01',
    projectTitle: 'Cozinha & Espaço Gourmet Casa Silva',
    customerName: 'Mariana Costa Silva',
    productLine: 'furniture',
    priority: 'high',
    stage: 'in_progress',
    currentCenter: 'cnc',
    assignedOperator: 'Carlos Souza & Tiago CNC',
    startDate: '2026-08-28T08:00:00Z',
    targetEndDate: '2026-09-15',
    progressPercent: 55,
    materialsReserved: true,
    qualityPassed: false,
    files: [
      { name: 'painel-ilha-ripado.dxf', type: 'dxf', url: '#', size: '3.4 MB' },
      { name: 'gcode-frezagem-ilha.nc', type: 'gcode', url: '#', size: '1.8 MB' },
      { name: 'plano-corte-cozinha.pdf', type: 'pdf', url: '#', size: '5.2 MB' }
    ],
    operations: [
      { id: 'step-01', stepNumber: 1, name: 'Corte e Seccionamento de Chapas', center: 'woodworking', estimatedMinutes: 240, actualMinutes: 220, status: 'done', machineId: 'mach-05' },
      { id: 'step-02', stepNumber: 2, name: 'Colagem de Fitas de Borda PVC 1mm', center: 'woodworking', estimatedMinutes: 180, actualMinutes: 190, status: 'done', machineId: 'mach-04' },
      { id: 'step-03', stepNumber: 3, name: 'Usinagem CNC de Ripas e Cavas', center: 'cnc', estimatedMinutes: 270, status: 'running', machineId: 'mach-01', notes: 'Fresa V-Bit 90 graus + Fresa de topo reto 6mm.' },
      { id: 'step-04', stepNumber: 4, name: 'Pré-Montagem e Teste de Corrediças', center: 'assembly', estimatedMinutes: 300, status: 'pending' },
      { id: 'step-05', stepNumber: 5, name: 'Inspeção de Qualidade e Embalagem', center: 'finishing', estimatedMinutes: 90, status: 'pending' },
      { id: 'step-06', stepNumber: 6, name: 'Instalação na Residência (Natividade)', center: 'installation', estimatedMinutes: 480, status: 'pending' }
    ]
  },
  {
    id: 'op-02',
    tenantId: 'tenant-woodbit-rj',
    orderNumber: 'OP-2026-043',
    projectId: 'prj-02',
    projectTitle: 'Setup Gamer Modular Streamer',
    customerName: 'Lucas Alvim',
    productLine: 'gamer',
    priority: 'medium',
    stage: 'in_progress',
    currentCenter: '3d_printing',
    assignedOperator: 'Diego Digital Fab',
    startDate: '2026-08-30T09:00:00Z',
    targetEndDate: '2026-09-08',
    progressPercent: 70,
    materialsReserved: true,
    qualityPassed: false,
    files: [
      { name: 'suporte-headphone-v2.stl', type: 'stl', url: '#', size: '12.1 MB' },
      { name: 'logo-lucas-streamer.dxf', type: 'dxf', url: '#', size: '1.1 MB' }
    ],
    operations: [
      { id: 'step-07', stepNumber: 1, name: 'Usinagem CNC de Chanfro e Logo', center: 'cnc', estimatedMinutes: 120, actualMinutes: 110, status: 'done', machineId: 'mach-01' },
      { id: 'step-08', stepNumber: 2, name: 'Impressão 3D de Suportes e Passa Cabos', center: '3d_printing', estimatedMinutes: 360, status: 'running', machineId: 'mach-02', notes: 'Filamento PETG Preto fosco, infill 25% gyroid.' },
      { id: 'step-09', stepNumber: 3, name: 'Instalação Elétrica LED Cob & Teste', center: 'assembly', estimatedMinutes: 60, status: 'pending' },
      { id: 'step-10', stepNumber: 4, name: 'Controle de Qualidade e Embalagem', center: 'finishing', estimatedMinutes: 30, status: 'pending' }
    ]
  },
  {
    id: 'op-03',
    tenantId: 'tenant-woodbit-rj',
    orderNumber: 'OP-2026-044',
    projectId: 'prj-03',
    projectTitle: 'Painel e Letreiro Clínica Meireles',
    customerName: 'Dr. Roberto Meireles',
    productLine: 'digital_fab',
    priority: 'low',
    stage: 'to_do',
    currentCenter: 'cnc',
    assignedOperator: 'Tiago CNC',
    startDate: '2026-09-05T08:00:00Z',
    targetEndDate: '2026-09-18',
    progressPercent: 20,
    materialsReserved: true,
    qualityPassed: false,
    files: [
      { name: 'letreiro-clinica-vetor.dxf', type: 'dxf', url: '#', size: '2.1 MB' }
    ],
    operations: [
      { id: 'step-11', stepNumber: 1, name: 'Corte Laser / CNC Acrílico Cristal 5mm', center: 'cnc', estimatedMinutes: 90, status: 'pending', machineId: 'mach-01' },
      { id: 'step-12', stepNumber: 2, name: 'Usinagem de Rebaixo para Fita LED', center: 'cnc', estimatedMinutes: 60, status: 'pending' },
      { id: 'step-13', stepNumber: 3, name: 'Instalação em Porciúncula', center: 'installation', estimatedMinutes: 180, status: 'pending' }
    ]
  },
  {
    id: 'op-04',
    tenantId: 'tenant-woodbit-rj',
    orderNumber: 'OP-2026-045',
    projectId: 'prj-04',
    projectTitle: 'Closet Master & Home Office Café Colonial',
    customerName: 'Ana Beatriz Varre-Sai',
    productLine: 'furniture',
    priority: 'medium',
    stage: 'to_do',
    currentCenter: 'woodworking',
    assignedOperator: 'Carlos Souza',
    startDate: '2026-09-10T08:00:00Z',
    targetEndDate: '2026-09-28',
    progressPercent: 10,
    materialsReserved: false,
    qualityPassed: false,
    files: [
      { name: 'plano-corte-closet-varresai.pdf', type: 'pdf', url: '#', size: '4.8 MB' }
    ],
    operations: [
      { id: 'step-14', stepNumber: 1, name: 'Corte e Fita de Borda dos Módulos', center: 'woodworking', estimatedMinutes: 320, status: 'pending', machineId: 'mach-05' },
      { id: 'step-15', stepNumber: 2, name: 'Pré-Montagem e Teste de Portas Deslizantes', center: 'assembly', estimatedMinutes: 240, status: 'pending' },
      { id: 'step-16', stepNumber: 3, name: 'Transporte e Montagem em Varre-Sai', center: 'installation', estimatedMinutes: 480, status: 'pending' }
    ]
  }
];

export const INITIAL_STOCK: StockItem[] = [
  {
    id: 'stk-01',
    tenantId: 'tenant-woodbit-rj',
    code: 'MDF-FREIJO-18',
    name: 'MDF Duratex Louro Freijó 18mm (2750x1840)',
    category: 'mdf_sheet',
    unit: 'sheet',
    currentQuantity: 14,
    reservedQuantity: 4,
    availableQuantity: 10,
    minQuantityAlert: 6,
    unitCost: 380,
    supplier: 'Madeireira Noroeste (Itaperuna)',
    location: 'Rack A - Setor Chapas',
    specifications: { dimensions: '2750 x 1840 x 18mm', thicknessMm: 18, finish: 'Louro Freijó Essencial Wood' },
    lastRestockedAt: '2026-08-20'
  },
  {
    id: 'stk-02',
    tenantId: 'tenant-woodbit-rj',
    code: 'MDF-BRANCO-15',
    name: 'MDF Branco TX 15mm Estrutural (2750x1840)',
    category: 'mdf_sheet',
    unit: 'sheet',
    currentQuantity: 28,
    reservedQuantity: 8,
    availableQuantity: 20,
    minQuantityAlert: 10,
    unitCost: 210,
    supplier: 'Madeireira Noroeste (Itaperuna)',
    location: 'Rack B - Setor Chapas',
    specifications: { dimensions: '2750 x 1840 x 15mm', thicknessMm: 15, finish: 'Branco TX' },
    lastRestockedAt: '2026-08-22'
  },
  {
    id: 'stk-03',
    tenantId: 'tenant-woodbit-rj',
    code: 'MDF-GRAFITE-18',
    name: 'MDF Grafite Matt 18mm (2750x1840)',
    category: 'mdf_sheet',
    unit: 'sheet',
    currentQuantity: 5,
    reservedQuantity: 3,
    availableQuantity: 2,
    minQuantityAlert: 4,
    unitCost: 360,
    supplier: 'Compensados Rio (Campos)',
    location: 'Rack A - Setor Chapas',
    specifications: { dimensions: '2750 x 1840 x 18mm', thicknessMm: 18, finish: 'Grafite Matt Soft Touch' },
    lastRestockedAt: '2026-08-10'
  },
  {
    id: 'stk-04',
    tenantId: 'tenant-woodbit-rj',
    code: 'FIL-PETG-BLK',
    name: 'Filamento 3D PETG Preto Fosco 1.75mm (1kg)',
    category: 'filament_3d',
    unit: 'spool',
    currentQuantity: 8,
    reservedQuantity: 2,
    availableQuantity: 6,
    minQuantityAlert: 3,
    unitCost: 85,
    supplier: 'Voolt3D Filamentos',
    location: 'Armário Dessecante 3D',
    specifications: { filamentMaterial: 'PETG', filamentColor: 'Preto Fosco', filamentWeightGrams: 1000 },
    lastRestockedAt: '2026-08-25'
  },
  {
    id: 'stk-05',
    tenantId: 'tenant-woodbit-rj',
    code: 'FIL-PLA-WOOD',
    name: 'Filamento 3D PLA Wood Fibra de Madeira 1.75mm (1kg)',
    category: 'filament_3d',
    unit: 'spool',
    currentQuantity: 3,
    reservedQuantity: 1,
    availableQuantity: 2,
    minQuantityAlert: 2,
    unitCost: 130,
    supplier: '3D Fila Brasil',
    location: 'Armário Dessecante 3D',
    specifications: { filamentMaterial: 'PLA', filamentColor: 'Madeira Clara', filamentWeightGrams: 1000 },
    lastRestockedAt: '2026-08-15'
  },
  {
    id: 'stk-06',
    tenantId: 'tenant-woodbit-rj',
    code: 'HARD-CORR-SLOW',
    name: 'Par de Corrediças Ocultas Slow Motion 450mm',
    category: 'hardware',
    unit: 'un',
    currentQuantity: 36,
    reservedQuantity: 12,
    availableQuantity: 24,
    minQuantityAlert: 16,
    unitCost: 75,
    supplier: 'FGVTN Distribuidora',
    location: 'Gaveteiro Ferragens G-04',
    lastRestockedAt: '2026-08-18'
  },
  {
    id: 'stk-07',
    tenantId: 'tenant-woodbit-rj',
    code: 'ELEC-LED-COB',
    name: 'Fita LED COB 4000K Branco Neutro 24V (Rolo 5m)',
    category: 'led_electronics',
    unit: 'un',
    currentQuantity: 7,
    reservedQuantity: 2,
    availableQuantity: 5,
    minQuantityAlert: 4,
    unitCost: 95,
    supplier: 'Iluminação & Cia (Natividade)',
    location: 'Bancada Eletrônica',
    lastRestockedAt: '2026-08-26'
  }
];

export const INITIAL_CATALOG: CatalogProduct[] = [
  {
    id: 'cat-01',
    name: 'Mesa Gamer WoodBit Streamer Edition',
    category: 'gamer_desk',
    basePrice: 2890,
    baseCost: 1550,
    imageUrl: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&auto=format&fit=crop&q=60',
    description: 'Mesa ergonômica com chanfro anatômico de antebraço na CNC, canaletas ocultas para gestão de fios e pés metálicos reforçados.',
    dimensionsDefault: '160cm x 80cm x 75cm',
    tags: ['Gamer', 'Ergonomia', 'CNC Router', 'RGB'],
    options: {
      finishes: [
        { name: 'Preto TX Absoluto', extraPrice: 0 },
        { name: 'Louro Freijó Amadeirado', extraPrice: 150 },
        { name: 'Grafite Soft Matt', extraPrice: 120 }
      ],
      ledLighting: [
        { name: 'Sem iluminação', extraPrice: 0 },
        { name: 'Fita LED COB Branco Neutro 4000K', extraPrice: 180 },
        { name: 'Fita LED ARGB Dinâmico com Controle/App', extraPrice: 290 }
      ],
      cncEngraving: [
        { name: 'Sem gravação', extraPrice: 0 },
        { name: 'Gravação CNC de Nickname / Gamertag', extraPrice: 90 },
        { name: 'Gravação de Brasão / Logo Completo', extraPrice: 160 }
      ],
      printed3dAccent: [
        { name: 'Sem adicionais 3D', extraPrice: 0 },
        { name: 'Kit Suporte de Headphone + Bungee de Mouse', extraPrice: 110 },
        { name: 'Passa Cabos Articulado Hexagonal 3D', extraPrice: 75 }
      ]
    }
  },
  {
    id: 'cat-02',
    name: 'Nicho Hexagonal Geométrico Hive Decor',
    category: 'niche_decor',
    basePrice: 380,
    baseCost: 160,
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=60',
    description: 'Nicho decorativo com corte CNC de alta precisão em ângulos de 60 graus, união invisível e iluminação backlight opcional.',
    dimensionsDefault: '45cm x 40cm x 15cm',
    tags: ['Decor', 'Geométrico', 'CNC', 'Madeira Nobre'],
    options: {
      finishes: [
        { name: 'Madeira Natural Maciça Cumaru', extraPrice: 120 },
        { name: 'MDF Louro Freijó', extraPrice: 0 },
        { name: 'MDF Branco Laqueado', extraPrice: 60 }
      ],
      ledLighting: [
        { name: 'Sem backlight', extraPrice: 0 },
        { name: 'Backlight LED Quente 3000K', extraPrice: 85 }
      ],
      cncEngraving: [
        { name: 'Fundo Liso', extraPrice: 0 },
        { name: 'Fundo com Textura Geométrica Usinada', extraPrice: 50 }
      ],
      printed3dAccent: [
        { name: 'Padrão', extraPrice: 0 },
        { name: 'Mini Vaso Geométrico 3D Integrado', extraPrice: 35 }
      ]
    }
  },
  {
    id: 'cat-03',
    name: 'Placa Comercial com Letras em Relevo CNC',
    category: 'cnc_sign',
    basePrice: 850,
    baseCost: 390,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=60',
    description: 'Placa de identificação para escritórios, clínicas e comércios com base amadeirada e logotipo em acrílico usinado.',
    dimensionsDefault: '100cm x 50cm',
    tags: ['Comercial', 'CNC Router', 'Acrílico', 'Identidade Visual'],
    options: {
      finishes: [
        { name: 'Base MDF Freijó', extraPrice: 0 },
        { name: 'Base Acrílico Preto Black Piano', extraPrice: 180 }
      ],
      ledLighting: [
        { name: 'Sem LED', extraPrice: 0 },
        { name: 'Retroiluminação LED Halo', extraPrice: 190 }
      ],
      cncEngraving: [
        { name: 'Letras em Acrílico 3mm', extraPrice: 0 },
        { name: 'Letras Caixa em Alto Relevo 10mm', extraPrice: 150 }
      ],
      printed3dAccent: [
        { name: 'Sem 3D', extraPrice: 0 },
        { name: 'Distanciadores de Fixação em Parede 3D', extraPrice: 40 }
      ]
    }
  }
];

export const INITIAL_FINANCE: FinanceTransaction[] = [
  {
    id: 'fin-01',
    tenantId: 'tenant-woodbit-rj',
    type: 'receivable',
    description: 'Entrada 50% Contrato - Cozinha Casa Silva',
    category: 'client_payment',
    amount: 9250,
    dueDate: '2026-08-24',
    paidDate: '2026-08-24',
    status: 'paid',
    projectId: 'prj-01',
    projectTitle: 'Cozinha & Espaço Gourmet Casa Silva',
    costCenter: 'Marcenaria',
    recipientOrPayer: 'Mariana Costa Silva'
  },
  {
    id: 'fin-02',
    tenantId: 'tenant-woodbit-rj',
    type: 'receivable',
    description: 'Parcela Final na Entrega - Cozinha Casa Silva',
    category: 'client_payment',
    amount: 9250,
    dueDate: '2026-09-25',
    status: 'pending',
    projectId: 'prj-01',
    projectTitle: 'Cozinha & Espaço Gourmet Casa Silva',
    costCenter: 'Marcenaria',
    recipientOrPayer: 'Mariana Costa Silva'
  },
  {
    id: 'fin-03',
    tenantId: 'tenant-woodbit-rj',
    type: 'receivable',
    description: 'Pagamento PIX à Vista - Setup Gamer Streamer',
    category: 'client_payment',
    amount: 3400,
    dueDate: '2026-08-27',
    paidDate: '2026-08-27',
    status: 'paid',
    projectId: 'prj-02',
    projectTitle: 'Setup Gamer Modular Streamer',
    costCenter: 'CNC',
    recipientOrPayer: 'Lucas Alvim'
  },
  {
    id: 'fin-04',
    tenantId: 'tenant-woodbit-rj',
    type: 'payable',
    description: 'Compra de MDF Freijó e Branco TX (NF 4521)',
    category: 'material_purchase',
    amount: 4800,
    dueDate: '2026-09-10',
    status: 'pending',
    costCenter: 'Marcenaria',
    recipientOrPayer: 'Madeireira Noroeste (Itaperuna)'
  },
  {
    id: 'fin-05',
    tenantId: 'tenant-woodbit-rj',
    type: 'payable',
    description: 'Lote de Filamentos PETG & PLA (Voolt3D)',
    category: 'material_purchase',
    amount: 680,
    dueDate: '2026-08-29',
    paidDate: '2026-08-29',
    status: 'paid',
    costCenter: 'Impressão 3D',
    recipientOrPayer: 'Voolt3D Filamentos'
  },
  {
    id: 'fin-06',
    tenantId: 'tenant-woodbit-rj',
    type: 'payable',
    description: 'Energia Trifásica Galpão Natividade (Enel)',
    category: 'utility_energy',
    amount: 1150,
    dueDate: '2026-09-15',
    status: 'pending',
    costCenter: 'Geral',
    recipientOrPayer: 'Enel Distribuição Rio'
  }
];

export const INITIAL_AI_PROVIDERS: AIProviderConfig[] = [
  {
    id: 'prov-ollama',
    name: 'Ollama Local (Servidor Oficina)',
    type: 'ollama',
    baseUrl: 'http://localhost:11434',
    isActive: true,
    isDefault: true,
    status: 'online',
    models: [
      {
        id: 'qwen2.5-coder:7b',
        name: 'qwen2.5-coder:7b',
        displayName: 'Qwen 2.5 Coder 7B (Local)',
        providerType: 'ollama',
        purpose: 'general_assistant',
        isLocal: true,
        supportsVision: false,
        supportsStructuredOutput: true,
        supportsTools: true,
        contextWindow: 32768,
        estimatedCostPer1k: 0,
        latencyMsAverage: 380
      },
      {
        id: 'deepseek-r1:8b',
        name: 'deepseek-r1:8b',
        displayName: 'DeepSeek R1 Distill 8B (Raciocínio Local)',
        providerType: 'ollama',
        purpose: 'quote_assistant',
        isLocal: true,
        supportsVision: false,
        supportsStructuredOutput: true,
        supportsTools: true,
        contextWindow: 16384,
        estimatedCostPer1k: 0,
        latencyMsAverage: 540
      }
    ]
  },
  {
    id: 'prov-lmstudio',
    name: 'LM Studio Local (Workstation 3D/CNC)',
    type: 'lm_studio',
    baseUrl: 'http://localhost:1234/v1',
    isActive: true,
    isDefault: false,
    status: 'online',
    models: [
      {
        id: 'llama-3.2-vision',
        name: 'llama-3.2-11b-vision-instruct',
        displayName: 'Llama 3.2 11B Vision (Local)',
        providerType: 'lm_studio',
        purpose: 'vision_analysis',
        isLocal: true,
        supportsVision: true,
        supportsStructuredOutput: true,
        supportsTools: true,
        contextWindow: 128000,
        estimatedCostPer1k: 0,
        latencyMsAverage: 620
      }
    ]
  },
  {
    id: 'prov-gemini',
    name: 'Google Gemini Gateway (Servidor / Fallback)',
    type: 'gemini_server',
    baseUrl: 'https://generativelanguage.googleapis.com',
    isActive: true,
    isDefault: false,
    status: 'online',
    models: [
      {
        id: 'gemini-3.7-flash',
        name: 'gemini-3.7-flash',
        displayName: 'Gemini 3.7 Flash (Cloud Fallback & Visão)',
        providerType: 'gemini_server',
        purpose: 'general_assistant',
        isLocal: false,
        supportsVision: true,
        supportsStructuredOutput: true,
        supportsTools: true,
        contextWindow: 1000000,
        estimatedCostPer1k: 0.0004,
        latencyMsAverage: 240
      }
    ]
  }
];

export const INITIAL_AI_LOGS: AIExecutionLog[] = [
  {
    id: 'log-01',
    timestamp: '2026-09-01T10:15:22Z',
    providerType: 'ollama',
    modelName: 'qwen2.5-coder:7b',
    task: 'lead_triage',
    promptPreview: 'Triagem de lead recebido via WhatsApp: Mariana Costa (Cozinha planejada)',
    status: 'success',
    latencyMs: 410,
    tokensEstimated: 520,
    costEstimated: 0,
    wasLocal: true,
    outputPreview: '{"category": "furniture", "urgency": "high", "needs_technical_visit": true, "confidence": 0.94}'
  },
  {
    id: 'log-02',
    timestamp: '2026-09-01T09:40:10Z',
    providerType: 'ollama',
    modelName: 'deepseek-r1:8b',
    task: 'quote_assistant',
    promptPreview: 'Cálculo de margem e horas de máquina para Projeto PRJ-2026-001',
    status: 'success',
    latencyMs: 580,
    tokensEstimated: 740,
    costEstimated: 0,
    wasLocal: true,
    outputPreview: 'Sugestão: Margem calculada 36.2% compatível com a política mínima da WoodBit (25%).'
  },
  {
    id: 'log-03',
    timestamp: '2026-08-31T16:05:00Z',
    providerType: 'lm_studio',
    modelName: 'llama-3.2-vision',
    task: 'vision_analysis',
    promptPreview: 'Análise de foto de ambiente enviada pelo cliente via WhatsApp',
    status: 'success',
    latencyMs: 720,
    tokensEstimated: 890,
    costEstimated: 0,
    wasLocal: true,
    outputPreview: 'Ambiente identificado: Cozinha com piso cerâmico. Estimativa visual: parede com ~3.5m de extensão.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-01',
    tenantId: 'tenant-woodbit-rj',
    actor: 'Carlos Souza (Marceneiro Chefe)',
    action: 'TECHNICAL_VISIT_VALIDATED',
    entity: 'Project',
    entityId: 'PRJ-2026-001',
    details: 'Pacote de medições da Casa Silva aprovado após conferência de prumo e tomadas.',
    timestamp: '2026-08-20T15:35:00Z'
  },
  {
    id: 'aud-02',
    tenantId: 'tenant-woodbit-rj',
    actor: 'Admin WoodBit',
    action: 'QUOTE_APPROVED',
    entity: 'Quote',
    entityId: 'ORC-2026-088',
    details: 'Orçamento aprovado pelo cliente. 4 chapas de MDF Freijó e 6 de MDF Branco reservadas.',
    timestamp: '2026-08-24T14:32:00Z'
  },
  {
    id: 'aud-03',
    tenantId: 'tenant-woodbit-rj',
    actor: 'Diego Digital Fab',
    action: 'OP_STARTED',
    entity: 'ProductionOrder',
    entityId: 'OP-2026-043',
    details: 'Impressão 3D iniciada na Bambu Lab X1-Carbon #01 (Filamento PETG Preto).',
    timestamp: '2026-08-30T09:05:00Z'
  }
];

export const INITIAL_INVENTORY = INITIAL_STOCK;
export const CATALOG_PRODUCTS = INITIAL_CATALOG;

export const DEFAULT_AI_CONFIG = {
  primaryProvider: 'ollama',
  primaryModel: 'qwen2.5-coder:7b',
  fallbackModel: 'gemini-3.7-flash',
  ollamaEndpoint: 'http://localhost:11434',
  lmStudioEndpoint: 'http://localhost:1234/v1',
  timeoutMs: 3500,
  autoFallbackEnabled: true
};
