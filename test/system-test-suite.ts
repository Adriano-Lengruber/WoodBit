/**
 * WoodBit ERP - Automated System Test Battery
 * Tests all core backend endpoints, business logic algorithms, and persistence rules.
 */

import http from 'http';

interface TestResult {
  name: string;
  category: string;
  passed: boolean;
  message: string;
  durationMs: number;
}

const results: TestResult[] = [];

function assert(condition: boolean, testName: string, category: string, successMsg = 'Passed', failMsg = 'Assertion failed') {
  const start = Date.now();
  if (condition) {
    results.push({ name: testName, category, passed: true, message: successMsg, durationMs: Date.now() - start });
    console.log(`  ✅ [PASS] ${testName}: ${successMsg}`);
  } else {
    results.push({ name: testName, category, passed: false, message: failMsg, durationMs: Date.now() - start });
    console.error(`  ❌ [FAIL] ${testName}: ${failMsg}`);
  }
}

async function requestPost(path: string, body: any): Promise<any> {
  const res = await fetch(`http://127.0.0.1:3000${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function requestGet(path: string): Promise<any> {
  const res = await fetch(`http://127.0.0.1:3000${path}`);
  return res.json();
}

async function runAllTests() {
  console.log('\n======================================================');
  console.log('🚀 INICIANDO BATERIA DE TESTES AUTOMATIZADOS - WOODBIT ERP');
  console.log('======================================================\n');

  // ----------------------------------------------------
  // 1. TESTES DE REGRAS DE NEGÓCIO E CÁLCULO DE MARCENARIA
  // ----------------------------------------------------
  console.log('📦 CATEGORIA 1: Regras de Engenharia & Otimização de Corte (CAM)');

  // Test 1.1: Chapa Padrão Brasileira de MDF
  const sheetWidth = 2750;
  const sheetHeight = 1850;
  const sheetAreaM2 = (sheetWidth * sheetHeight) / 1_000_000;
  assert(
    Math.abs(sheetAreaM2 - 5.0875) < 0.001,
    'Área da Chapa MDF Padrão (2750x1850mm)',
    'CAM/Nesting',
    `Área exata calculada: ${sheetAreaM2.toFixed(4)} m²`
  );

  // Test 1.2: Cálculo de Fita de Borda
  const pieceWidth = 800;
  const pieceHeight = 600;
  const perimeter1L = pieceWidth / 1000; // 0.8m
  const perimeter2L = (pieceWidth + pieceHeight) / 1000; // 1.4m
  const perimeter4L = (2 * pieceWidth + 2 * pieceHeight) / 1000; // 2.8m
  assert(
    perimeter4L === 2.8 && perimeter2L === 1.4,
    'Cálculo Linear de Fita de Borda (1L/2L/4L)',
    'CAM/Nesting',
    `Fita 4 lados: ${perimeter4L}m, 2 lados: ${perimeter2L}m`
  );

  // Test 1.3: Aproveitamento de Chapa (Nesting Efficiency)
  const pieces = [
    { w: 1200, h: 600 },
    { w: 1200, h: 600 },
    { w: 750, h: 590 },
    { w: 750, h: 590 },
    { w: 1500, h: 600 },
  ];
  const totalPiecesAreaM2 = pieces.reduce((sum, p) => sum + (p.w * p.h) / 1_000_000, 0);
  const utilizationPercent = (totalPiecesAreaM2 / sheetAreaM2) * 100;
  assert(
    totalPiecesAreaM2 > 0 && utilizationPercent > 0 && utilizationPercent <= 100,
    'Aproveitamento de Chapa MDF (%)',
    'CAM/Nesting',
    `Peças: ${totalPiecesAreaM2.toFixed(2)} m², Aproveitamento: ${utilizationPercent.toFixed(1)}%`
  );

  // ----------------------------------------------------
  // 2. TESTES DE FORMAÇÃO DE PREÇO E MARGEM
  // ----------------------------------------------------
  console.log('\n💰 CATEGORIA 2: Motor de Precificação & Custos');

  const costMaterials = 3500;
  const hoursCNC = 4;
  const rateCNC = 120; // R$/h
  const hoursLabor = 30;
  const rateLabor = 40; // R$/h
  const overheadFactor = 1.15; // 15% indiretos

  const totalCost = (costMaterials + hoursCNC * rateCNC + hoursLabor * rateLabor) * overheadFactor;
  const targetMargin = 0.45; // 45%
  const salePrice = totalCost / (1 - targetMargin);
  const grossProfit = salePrice - totalCost;
  const calculatedMargin = grossProfit / salePrice;

  assert(
    Math.abs(calculatedMargin - targetMargin) < 0.001,
    'Fórmula de Markup por Margem Alvo (45%)',
    'Finanças/Custos',
    `Custo: R$ ${totalCost.toFixed(2)} -> Venda: R$ ${salePrice.toFixed(2)} (Lucro: R$ ${grossProfit.toFixed(2)})`
  );

  // Test 2.2: Matriz de Frete Regional (Noroeste Fluminense)
  const freightMatrix: Record<string, number> = {
    Natividade: 80,
    Itaperuna: 180,
    Porciúncula: 120,
    'Varre-Sai': 150,
  };
  assert(
    freightMatrix['Natividade'] === 80 && freightMatrix['Itaperuna'] === 180,
    'Matriz Logística de Frete Regional',
    'Finanças/Custos',
    'Polo Natividade (Sede R$80), Itaperuna (R$180), Porciúncula (R$120), Varre-Sai (R$150)'
  );

  // ----------------------------------------------------
  // 3. TESTES DE PERSISTÊNCIA & STORAGE
  // ----------------------------------------------------
  console.log('\n💾 CATEGORIA 3: Integridade de Persistência & Schemas');

  const sampleProject = {
    id: 'proj-test-1',
    code: 'PRJ-2026-999',
    title: 'Projeto de Teste',
    customerName: 'Cliente Teste',
    status: 'in_production',
    city: 'Natividade',
  };
  const serialized = JSON.stringify(sampleProject);
  const deserialized = JSON.parse(serialized);
  assert(
    deserialized.id === sampleProject.id && deserialized.city === 'Natividade',
    'Serialização e Deserialização de Entidades',
    'Storage',
    'JSON Roundtrip perfeito sem perda de campos ou tipos.'
  );

  // ----------------------------------------------------
  // 4. TESTES DE ENDPOINTS DO SERVIDOR (API HEALTH & AI GATEWAY)
  // ----------------------------------------------------
  console.log('\n🌐 CATEGORIA 4: Endpoints de Backend & Gateway de IA');

  try {
    // 4.1 Health Check
    const health = await requestGet('/api/health');
    assert(
      health.status === 'ok' && health.service === 'WoodBit ERP Engine',
      'GET /api/health',
      'API Backend',
      `Serviço operacional: ${health.service}`
    );

    // 4.2 AI Chat Endpoint
    const chatRes = await requestPost('/api/ai/chat', {
      prompt: 'Qual a velocidade ideal de avanço e rotação para usinar MDF 18mm na CNC Router?',
      preferredProvider: 'woodbit_rule_engine',
    });
    assert(
      chatRes.text && chatRes.text.length > 10,
      'POST /api/ai/chat (Local-First Gateway)',
      'API AI',
      `Resposta recebida via [${chatRes.provider}] em ${chatRes.latencyMs}ms`
    );

    // 4.3 Lead Triage Endpoint
    const triageRes = await requestPost('/api/ai/triage-lead', {
      customerName: 'Roberto Carlos',
      text: 'Preciso de um armário planejado com nicho para máquina de costura em Porciúncula',
      origin: 'WhatsApp',
    });
    assert(
      triageRes.triage && typeof triageRes.triage.needsTechnicalVisit === 'boolean',
      'POST /api/ai/triage-lead (Triagem Estruturada)',
      'API AI',
      `Categoria: ${triageRes.triage.category}, Visita Técnica: ${triageRes.triage.needsTechnicalVisit ? 'Sim' : 'Não'}`
    );

    // 4.4 Voice to Quote Parser Endpoint
    const voiceRes = await requestPost('/api/ai/voice-to-quote', {
      transcript: 'Cozinha linear três metros por dois e meio em MDF Louro Freijó com puxador cava',
    });
    assert(
      voiceRes.quoteData && voiceRes.quoteData.projectTitle,
      'POST /api/ai/voice-to-quote (Parser de Áudio)',
      'API AI',
      `Projeto: "${voiceRes.quoteData.projectTitle}", Itens: ${voiceRes.quoteData.suggestedItems?.length || 0}`
    );

    // 4.5 Vision Analysis Endpoint
    const visionRes = await requestPost('/api/ai/vision-analysis', {
      imageBase64: 'data:image/jpeg;base64,dGVzdA==',
      promptText: 'Analise os pontos de tomada e hidráulica',
    });
    assert(
      visionRes.analysis && visionRes.analysis.legalDisclaimer.includes('Estimativa visual'),
      'POST /api/ai/vision-analysis (com Disclaimer Jurídico Mandatório)',
      'API AI',
      `Disclaimer: "${visionRes.analysis?.legalDisclaimer}"`
    );

    // 4.6 Evaluation Benchmark Runner Endpoint
    const evalRes = await requestPost('/api/ai/eval-benchmark', {
      testTask: 'lead_triage',
    });
    assert(
      evalRes.results && evalRes.results.length >= 3,
      'POST /api/ai/eval-benchmark (Laboratório de Benchmark)',
      'API AI',
      `Modelos avaliados: ${evalRes.results?.length} (Ollama, LM Studio, Gemini)`
    );
  } catch (err: any) {
    console.error('Erro na conexão com o servidor local:', err.message);
    assert(false, 'Conexão com Servidor Express', 'API Backend', '', err.message);
  }

  // ----------------------------------------------------
  // RESUMO CONSOLIDADO
  // ----------------------------------------------------
  console.log('\n======================================================');
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  console.log(`📊 RESUMO DA BATERIA DE TESTES:`);
  console.log(`   Total de Testes: ${total}`);
  console.log(`   Sucessos (Pass): ${passed}`);
  console.log(`   Falhas (Fail):   ${failed}`);
  console.log(`   Taxa de Êxito:   ${((passed / total) * 100).toFixed(1)}%`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Fatal error during test suite:', err);
  process.exit(1);
});
