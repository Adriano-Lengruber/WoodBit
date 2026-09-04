# Guia de Configuração da IA Local: LM Studio + Gemma 4 12B QAT
## Instalação, Parametrização e Otimização para o WoodBit ERP

---

### 1. Por que o Gemma 4 12B QAT?

O **Google Gemma 4 12B QAT (Quantization-Aware Trained)** é um modelo de pesos abertos de última geração que combina:
- **Multimodalidade Completa**: Visão de imagem de alta resolução + compreensão de texto em português.
- **Eficiência Extrema de VRAM**: Roda com excelência em placas com 8GB a 16GB de VRAM graças à quantização QAT, que preserva a precisão das camadas críticas.
- **Raciocínio Integrado (*Chain-of-Thought*)**: Executa pensamento analítico antes de emitir cálculos estruturados de orçamentos e triagem de clientes.

---

### 2. Passo a Passo de Configuração no LM Studio

1. **Baixar o Modelo**:
   - No campo de busca do LM Studio, procure por: `gemma-4-12b-qat` (ou `google/gemma-4-12b-qat`).
   - Conclua o download do arquivo de pesos.

2. **Carregar o Modelo na Memória**:
   - Na aba **Local Server / Developer** (ícone `<->` na lateral do LM Studio), selecione o modelo:
     `google/gemma-4-12b-qat`
   - **GPU Offload**: Ajuste para `Max` (todas as camadas na VRAM) para garantir inferência em menos de 10 segundos.
   - **Context Length**: Defina para `8192` (ou `16384` se sua GPU tiver 12GB+ de VRAM).

3. **Iniciar o Servidor Local**:
   - Certifique-se de que o servidor local está ligado na porta padrão:
     `http://localhost:1234`
   - O endpoint compatível com OpenAI estará ativo em `http://localhost:1234/v1`.

---

### 3. Como o WoodBit ERP se Conecta ao LM Studio

O WoodBit ERP realiza a autodescoberta do modelo sem que você precise configurar variáveis de ambiente complexas:

1. O backend consulta `http://localhost:1234/v1/models`.
2. O seletor prioriza automaticamente o modelo carregado: `google/gemma-4-12b-qat`.
3. Todas as chamadas de **Triagem de Leads**, **Orçamentos por Voz**, **Chat Técnico** e **Análise Fotográfica de Ambientes** passam a ser processadas instantaneamente pela sua GPU.

---

### 4. Como Testar a Conexão no ERP

1. Abra o WoodBit ERP no navegador: [http://localhost:3000](http://localhost:3000).
2. Acesse a aba **IA & Operações** no menu lateral.
3. Observe o card **LM Studio Local (Principal)**:
   - Status: Deve exibir **Online** (em verde).
   - Modelo Ativo: Deve exibir **google/gemma-4-12b-qat**.
4. No playground inferior:
   - Clique em **Executar Prompt** no modo *Chat Técnico* para testar a velocidade de geração.
   - Alterne para a aba **Análise de Visão** e clique em **Analisar Foto** para testar a visão computacional do modelo em fotos de cômodos.

---

### 5. Resolução de Problemas Frequentes

| Sintoma | Causa Mais Provável | Solução |
| :--- | :--- | :--- |
| **Card exibe "Aguardando Conexão"** | O LM Studio não está com o servidor local iniciado na porta 1234. | Abra o LM Studio, vá na aba `<->` e clique em *Start Server*. |
| **Timeout de 60s atingido** | O modelo precisou ser carregado do disco na primeira chamada. | Uma vez carregado na VRAM, as chamadas subsequentes levam de 4 a 15 segundos. |
| **Erro de memória de vídeo (OOM)** | Contexto muito grande para a placa de vídeo. | Reduza o *Context Length* no LM Studio de 16k para 8192 e garanta o offload correto. |
