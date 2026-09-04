# 🪵 WoodBit ERP — Manual Oficial de Utilização & Guia Prático
### O Guia Completo Passo a Passo para Marceneiros, Vendedores e Operadores de Máquinas

---

## 📌 Sumário
1. [Apresentação do WoodBit ERP](#1-apresentação-do-woodbit-erp)
2. [Como Ligar o Sistema pela Manhã (1 Clique)](#2-como-ligar-o-sistema-pela-manhã-1-clique)
3. [Navegando pela Interface](#3-navegando-pela-interface)
4. [Módulo 1: Dashboard Executivo](#4-módulo-1-dashboard-executivo)
5. [Módulo 2: CRM & Atendimento WhatsApp](#5-módulo-2-crm--atendimento-whatsapp)
6. [Módulo 3: Medição Técnica na Obra (Celular & Tablet)](#6-módulo-3-medição-técnica-na-obra-celular--tablet)
7. [Módulo 4: Projetos & Ambientes](#7-módulo-4-projetos--ambientes)
8. [Módulo 5: Orçamentos, Margin Guard & Proposta PDF](#8-módulo-5-orçamentos-margin-guard--proposta-pdf)
9. [Módulo 6: Catálogo & Visualizador 3D (Upload STL/OBJ)](#9-módulo-6-catálogo--visualizador-3d-upload-stlobj)
10. [Módulo 7: PCP — Chão de Fábrica & Reserva de Estoque](#10-módulo-7-pcp--chão-de-fábrica--reserva-de-estoque)
11. [Módulo 8: Otimizador de Corte 2D (Nesting)](#11-módulo-8-otimizador-de-corte-2d-nesting)
12. [Módulo 9: Simulador CAM & Desgaste de Fresas](#12-módulo-9-simulador-cam--desgaste-de-fresas)
13. [Módulo 10: Estoque & Almoxarifado](#13-módulo-10-estoque--almoxarifado)
14. [Módulo 11: Gestão Financeira](#14-módulo-11-gestão-financeira)
15. [Módulo 12: Portal do Cliente](#15-módulo-12-portal-do-cliente)
16. [Módulo 13: Laboratório de IA Local (LM Studio)](#16-módulo-13-laboratório-de-ia-local-lm-studio)
17. [Módulo 14: Auditoria & Segurança](#17-módulo-14-auditoria--segurança)
18. [Guia de Solução de Problemas & Perguntas Frequentes (FAQ)](#18-guia-de-solução-de-problemas--perguntas-frequentes-faq)
19. [Como Atualizar este Manual no Futuro](#19-como-atualizar-este-manual-no-futuro)

---

## 1. Apresentação do WoodBit ERP

O **WoodBit ERP** foi criado pensando na realidade diária de marcenarias de alto padrão e oficinas de fabricação digital. 

Se antes você precisava de planilhas de Excel soltas, anotações de papel na prancheta que sujavam de serragem e contas de cabeça que davam prejuízo no final do mês, agora tudo fica em um único lugar seguro, funcionando até mesmo **sem internet**.

### Os 3 Pilares que você precisa lembrar:
1. **Zero Desperdício de Madeira**: O sistema calcula o plano de corte aproveitando cada retalho de MDF e respeita a direção dos veios da madeira amadeirada.
2. **Chega de Medição Errada na Casa do Cliente**: Com o celular na mão, o marceneiro tira fotos do quarto ou da cozinha e a IA aponta canos de água, tomadas e paredes tortas antes de cortar a primeira chapa.
3. **Margem Blindada**: Você nunca mais vai dar desconto no chute e pagar para trabalhar. O sistema avisa na hora se o lucro estiver abaixo do seguro.

---

## 2. Como Ligar o Sistema pela Manhã (1 Clique)

Não é necessário digitar nenhum comando complicado nem ser especialista em informática.

### Passo a Passo no Computador da Oficina:
1. Vá até a pasta do **WoodBit** (ou dê dois cliques no atalho que você criou na sua Área de Trabalho).
2. Dê dois cliques no arquivo **`iniciar-woodbit.bat`**.
3. Uma janela preta vai se abrir e, em 3 segundos, o seu navegador padrão (Chrome, Edge ou Firefox) abrirá automaticamente em:
   👉 **`http://localhost:3000`**
4. Pronto! O sistema já está funcionando. 
5. **Para desligar no fim do dia:** Basta fechar a janela preta.

> 💡 **Dica de Ouro:** Se você usa a IA local para triagem e visão, abra o aplicativo **LM Studio** e clique em "Start Server" antes de começar o atendimento.

---

## 3. Navegando pela Interface

A tela do WoodBit é dividida em duas áreas principais:

```
+-----------------------------------------------------------------------------------+
|  [Menu] [Busca Global...]             [Polo: Natividade] [Gemma 4] [Manual] [Tema]|
+-----------------------------------------------------------------------------------+
| [LOGOTIPO]  |                                                                     |
|             |                                                                     |
| • Dashboard |                                                                     |
| • CRM       |                                                                     |
| • Medição   |                       ÁREA DE TRABALHO                              |
| • Orçamentos|                (Muda de acordo com a aba clicada)                   |
| • PCP       |                                                                     |
| • Estoque   |                                                                     |
|             |                                                                     |
+-------------+---------------------------------------------------------------------+
```

### 1. Barra Superior (Cabeçalho):
- **Busca Global (`/`)**: Digite o nome de um cliente, número de pedido (ex: `OP-2026-042`) ou tipo de chapa (ex: `Freijó`) para achar tudo num piscar de olhos.
- **Seletor de Polo Regional**: Filtre seus pedidos entre **Natividade (Sede)**, **Itaperuna**, **Porciúncula** e **Varre-Sai**.
- **Botão "Manual"**: Abre a qualquer momento o guia prático interativo na própria tela.
- **Sol/Lua (Tema)**: Alterne entre o tema escuro (*Titanium*) e o tema claro amadeirado (*Natural Wood*).

### 2. Menu Lateral (Barra da Esquerda):
Contém todas as 12 áreas de trabalho. Basta clicar em qualquer uma para navegar.

---

## 4. Módulo 1: Dashboard Executivo

### 🎯 Para que serve?
É o **painel de bordo** do dono ou gerente da marcenaria. Em 10 segundos você sabe como está a saúde da sua oficina hoje.

### O que você encontra nesta tela:
- **Faturamento do Mês**: Total de vendas faturadas versus a meta estipulada.
- **Margem Média Real**: A porcentagem de lucro líquido que sobrou após pagar madeira, ferragens e horas de máquina.
- **Ordens em Produção**: Quantas encomendas estão ativas no momento.
- **Ocupação das Máquinas**: Se a Router CNC ou a serra esquadrejadeira estão paradas ou trabalhando a todo vapor.
- **Avisos Urgentes**: Alertas se algum material atingiu estoque crítico ou se tem cliente aguardando proposta.

---

## 5. Módulo 2: CRM & Atendimento WhatsApp

### 🎯 Para que serve?
Organiza todos os contatos que chegam pelo WhatsApp ou Instagram. Impede que você esqueça de responder um cliente ou perca vendas.

### Como funciona no dia a dia:
1. **Quadro em Colunas (Kanban)**:
   - *Novo Contato* ➡️ *Briefing Técnico* ➡️ *Visita Agendada* ➡️ *Proposta Enviada* ➡️ *Aprovado / Em Produção*.
2. **Arrastar e Soltar**:
   - Conforme você conversa com o cliente, basta clicar no cartão dele e arrastar para a coluna seguinte.
3. **Triagem com Inteligência Artificial**:
   - A IA local lê o que o cliente pediu (ex: *"Quero uma cozinha planejada em MDF amadeirado"*) e já indica:
     - Qual a linha do produto (Móveis Planejados ou Setup Gamer);
     - Se precisa de visita técnica presencial urgente;
     - Uma estimativa aproximada de valor;
     - Perguntas recomendadas para o vendedor fazer.
4. **Simulador WhatsApp**:
   - Clique em **"Gateway WhatsApp"** para testar mensagens simuladas e ver a IA analisando o texto em tempo real sem gastar dinheiro com créditos de internet.

---

## 6. Módulo 3: Medição Técnica na Obra (Celular & Tablet)

### 🎯 Para que serve?
É a ferramenta de campo do marceneiro. Usada dentro da casa ou apartamento do cliente para anotar todas as medidas reais com trena a laser e tirar fotos.

### Como o Marceneiro deve usar:
1. **Abra no Celular**: Acesse o sistema pelo navegador do celular e entre na aba **Medição Técnica**.
2. **Checklist da Parede**:
   - Marque os interruptores: As paredes estão no prumo? O teto está nivelado? Os pontos de água e esgoto foram mapeados?
3. **Fotografando com a Câmera**:
   - Clique no botão **"Câmera / Foto"**.
   - Fotografe a parede onde o móvel será instalado.
4. **Acionando a IA de Visão**:
   - Clique no botão **"Analisar com IA"** abaixo da foto.
   - O sistema vai inspecionar a imagem e apontar:
     - ⚠️ *Ponto de tomada fora de centro*;
     - ⚠️ *Cano de água aparente que exige recorte no fundo do armário*;
     - ⚠️ *Desaprumo de parede ou sanca de gesso que exige testeira de ajuste*.
5. **Incorporar ao Laudo**:
   - Clique em **"Incorporar ao Laudo"** para que essas observações fiquem salvas no projeto. Assim, o projetista no computador da marcenaria já faz o móvel com os recortes exatos!
6. **Sem Internet no Prédio?**
   - Não se preocupe! O WoodBit salva tudo na memória do celular. Ao chegar na oficina com Wi-Fi, toque em **"Sincronizar com a Oficina"**.

---

## 7. Módulo 4: Projetos & Ambientes

### 🎯 Para que serve?
Guarda a "ficha técnica" de cada cliente com seus cômodos (Cozinha, Quarto do Casal, Sala, etc.), arquivos técnicos (DXF, PDF) e histórico de alterações.

### Como utilizar:
1. Selecione o projeto desejado na lista.
2. Veja as dimensões de cada cômodo: Largura $\times$ Altura $\times$ Profundidade (em milímetros).
3. Caso o cliente peça para mudar a cor do MDF ou incluir gavetas a mais, você cria uma nova versão (ex: `v1.1 - Acréscimo Ilha`) sem perder o histórico do orçamento original.

---

## 8. Módulo 5: Orçamentos, Margin Guard & Proposta PDF

### 🎯 Para que serve?
É onde você calcula o preço de venda da marcenaria com precisão cirúrgica e emite o documento oficial para o cliente assinar.

### Como montar o orçamento:
1. Escolha o projeto e clique em **"Adicionar Item"**.
2. Selecione o cômodo (ex: *Cozinha*), o material (chapas de MDF, corrediças com amortecimento, horas de Router CNC).
3. Digite o custo e o markup (multiplicador). O sistema calcula o preço final automaticamente.

### O "Margin Guard" (O Guardião do seu Lucro):
- O sistema possui um piso mínimo de margem operacional (geralmente 30%).
- Se você der um desconto muito grande ou esquecer de cobrar ferragens caras, o sistema exibe um alerta vermelho: **"RISCO DETECTADO: Margem Abaixo do Piso Operacional!"**
- Isso impede que a marcenaria feche negócios que resultam em prejuízo.

### Como emitir a Proposta Comercial Formal em PDF:
1. No cabeçalho da proposta, clique no botão **"Proposta PDF"** (com ícone de impressora).
2. Uma janela com o documento diagramado em folha A4 será exibida na tela.
3. O documento contém:
   - Logotipo e dados da WoodBit (CNPJ, Inscrição Estadual e Polo de Natividade - RJ);
   - Memorial descritivo detalhado cômodo por cômodo;
   - Condições de pagamento: **Entrada de 50% via PIX** e saldo de 50% na conclusão da montagem;
   - Termo de Garantia: **5 anos para ferragens com amortecimento** (Blum / Häfele / FGV) e 1 ano estrutural;
   - Campos de assinatura para você e para o cliente.
4. Clique no botão azul **"Imprimir / Salvar PDF"**. Na janela do navegador, escolha "Salvar como PDF" e envie o arquivo direto pelo WhatsApp do cliente!

### Como cobrar o Sinal de Entrada (50% PIX):
- Ao lado do botão de proposta, clique em **"PIX Entrada"**.
- O sistema mostra o QR Code e o botão para copiar o código Pix copia-e-cola dos exatos 50% de entrada para você colar na conversa do WhatsApp.

---

## 9. Módulo 6: Catálogo & Visualizador 3D (Upload STL/OBJ)

### 🎯 Para que serve?
Permite inspecionar móveis paramétricos (Mesa Gamer com iluminação LED, nichos decorativos) e peças técnicas em 3D antes de fabricar.

### Como girar e visualizar o 3D:
- **Girar a Peça**: Clique com o botão esquerdo do mouse (ou passe o dedo na tela) e arraste.
- **Aproximar / Afastar (Zoom)**: Use a rodinha do mouse (*scroll*) ou o movimento de pinça no celular.
- **Trocar Acabamento**: Alterne entre Louro Freijó, Grafite TX, Branco TX e PETG Industrial para ver como a madeira fica na realidade.

### Upload de Arquivos 3D Reais do seu Computador (.STL e .OBJ):
1. Baixou uma peça do Thingiverse, Printables ou desenhou no Fusion 360 / SolidWorks?
2. Basta **arrastar o arquivo `.stl` ou `.obj` para dentro do visualizador 3D** (ou clicar no botão "Subir Arquivo 3D").
3. O sistema renderiza a peça na tela e calcula na hora:
   - **Dimensões exatas**: Largura, altura e profundidade em milímetros;
   - **Volume geométrico**: em centímetros cúbicos ($\text{cm}^3$);
   - **Peso em Gramas**: quanto você vai gastar de filamento PETG ou PLA;
   - **Tempo Estimado**: quantas horas vai demorar na impressora 3D;
   - **Custo do Material**: quanto vai custar o plástico em reais.

---

## 10. Módulo 7: PCP — Chão de Fábrica & Reserva de Estoque

### 🎯 Para que serve?
É o coração da produção. É onde o marceneiro, o operador da CNC e o montador acompanham o que precisa ser feito hoje.

### O Fluxo Automático de Estoque no PCP:
1. **Passo 1: Reservar no Estoque**
   - Ao iniciar uma Ordem de Produção (OP), o encarregado clica no botão **"Reservar no Estoque"**.
   - O sistema reserva automaticamente as chapas de MDF (ex: 3 chapas de Louro Freijó), os rolos de filamento e as dobradiças no almoxarifado. Isso garante que nenhum outro funcionário corte o material desse projeto por engano.
2. **Passo 2: Executar as Etapas**
   - A equipe segue o checklist:
     - 1. Corte e seccionamento;
     - 2. Colagem de fitas de borda;
     - 3. Usinagem CNC de furos e cavas;
     - 4. Montagem e teste de gavetas;
     - 5. Instalação no cliente.
   - Ao terminar cada fase, o operador clica em **"Concluir Etapa"**.
3. **Passo 3: Baixa Automática**
   - Quando a última etapa é concluída (ou ao clicar em **"Baixar Estoque"**), o sistema consome fisicamente os materiais do almoxarifado e atualiza as quantidades em estoque de forma 100% automática!

### Como registrar uma peça que quebrou (NCR / Refugo):
- Se uma chapa lascou na serra ou faltou energia durante a usinagem, clique em **"Registrar NCR"**.
- Digite o que aconteceu e qual peça precisa ser refeita. O sistema registrará a não conformidade para você saber onde a oficina está perdendo dinheiro.

---

## 11. Módulo 8: Otimizador de Corte 2D (Nesting)

### 🎯 Para que serve?
Mostra o mapa visual de como cortar as tábuas na chapa de MDF para ter o **menor desperdício de madeira possível**.

### Recursos que evitam erros caros:
- **Respeito ao Veio da Madeira**: Se o MDF for amadeirado (como Louro Freijó ou Carvalho), as frentes de gaveta e portas não podem ter os veios cortados na horizontal se o restante for na vertical. O otimizador respeita isso rigorosamente.
- **Espessura da Lâmina (*Kerf*)**: O sistema já desconta os 3mm a 4mm que a serra "come" no corte.
- **Aproveitamento de Retalhos**: Ele agrupa as sobras para que você use retalhos grandes em nichos ou fundos de gaveta futuros.

---

## 12. Módulo 9: Simulador CAM & Desgaste de Fresas

### 🎯 Para que serve?
Exclusivo para a **Router CNC**. Simula a fresa cortando a madeira em 3D antes de você apertar o play na máquina real, evitando quebras de fresa caras.

### O que você pode fazer:
- **Ver a Fresa Cortando**: Acompanhe o percurso em passadas sucessivas (Z step-down).
- **Horímetro de Fresas**: Mostra quantas horas de corte cada ferramenta já trabalhou (Fresa de Topo Reto 6mm, Fresa V-Bit 90º, Fresa Downcut).
- O sistema avisa quando a fresa está ficando cega e precisa de afiação ou troca, evitando que ela queime o MDF ou solte fumaça na oficina.

---

## 13. Módulo 10: Estoque & Almoxarifado

### 🎯 Para que serve?
Controla tudo o que entra e sai da marcenaria: chapas de MDF, fitas de borda, dobradiças, corrediças, parafusos e filamentos 3D.

### Como interpretar as cores:
- 🟢 **Verde**: Estoque confortável e suficiente para os próximos pedidos.
- 🟡 **Amarelo**: Quantidade próxima do mínimo (atenção para cotar com o fornecedor).
- 🔴 **Vermelho**: Estoque crítico! Falta material para atender as OPs da semana. Compre imediatamente.

---

## 14. Módulo 11: Gestão Financeira

### 🎯 Para que serve?
Controla o fluxo de caixa da oficina sem complicação de contador.

### O que registrar aqui:
- **Contas a Receber**: As entradas de 50% de sinal e 50% de entrega dos clientes.
- **Contas a Pagar**: Compras de chapas na madeireira, caixas de dobradiças, contas de luz da oficina e manutenção das máquinas.
- **Divisão por Centro de Custo**: Saiba quanto a Marcenaria tradicional gera de lucro em comparação com os serviços de Router CNC e peças impressas em 3D.

---

## 15. Módulo 12: Portal do Cliente

### 🎯 Para que serve?
É uma tela moderna e transparente que você pode mostrar ou enviar para o seu cliente final.

### Por que os clientes adoram?
- Em vez de o cliente ficar te ligando todo dia perguntando *"Meu armário já tá pronto?"*, ele recebe um link onde acompanha:
  - O percentual de conclusão (ex: *68% Concluído*);
  - A etapa atual (*Em Usinagem CNC na oficina de Natividade*);
  - Fotos reais do móvel sendo lixado e montado na bancada;
  - Previsão de entrega confirmada.
- Isso transmite um profissionalismo de multinacional para a sua marcenaria e justifica cobrar um preço mais alto.

---

## 16. Módulo 13: Laboratório de IA Local (LM Studio)

### 🎯 Para que serve?
Para verificar se o motor de inteligência artificial (**Google Gemma 4 12B QAT**) está funcionando perfeitamente no computador da sua oficina.

### O que você precisa saber:
- Toda a IA roda **dentro da placa de vídeo da sua máquina** através do programa LM Studio.
- Não há custo de assinatura mensal nem cobrança por mensagem enviada.
- Nenhuma foto de cliente ou orçamento é enviada para a nuvem.

---

## 17. Módulo 14: Auditoria & Segurança

### 🎯 Para que serve?
Registra uma linha do tempo imutável de tudo o que acontece no sistema:
- Quem criou um orçamento;
- Quem alterou o preço de uma peça;
- Quem concluiu uma etapa no chão de fábrica;
- Quem reservou ou deu baixa no estoque.

Isso traz segurança jurídica para a marcenaria, garante a conformidade com a LGPD e evita discussões internas sobre quem alterou determinado pedido.

---

## 18. Guia de Solução de Problemas & Perguntas Frequentes (FAQ)

### ❓ P: "O sistema não abriu quando dei dois cliques no arquivo `.bat`."
> **Resposta**: Verifique se o **Node.js** está instalado no computador. Se não estiver, baixe gratuitamente no site oficial [nodejs.org](https://nodejs.org) (versão LTS recomendada).

### ❓ P: "A IA está dizendo que está Offline na tela."
> **Resposta**: Abra o programa **LM Studio**, clique no ícone `<->` (Local Server), selecione o modelo `google/gemma-4-12b-qat` e clique no botão verde **Start Server**. A porta deve ser a padrão `1234`.

### ❓ P: "Como coloco o sistema no celular do meu marceneiro?"
> **Resposta**: Basta o celular estar conectado no mesmo Wi-Fi da oficina. Digite no navegador do celular o endereço IP do computador da marcenaria seguido de `:3000` (exemplo: `http://192.168.1.100:3000`). Depois, toque no menu do navegador e escolha **"Adicionar à Tela Inicial"**.

### ❓ P: "Como gero o arquivo PDF da proposta para mandar pelo WhatsApp?"
> **Resposta**: Abra a tela **Orçamentos**, selecione o cliente e clique no botão **"Proposta PDF"**. Na janela aberta, clique em **"Imprimir / Salvar PDF"**. Na caixa de diálogo que surgir, na opção *Destino*, escolha **Salvar como PDF**.

### ❓ P: "Posso usar em computadores diferentes na oficina ao mesmo tempo?"
> **Resposta**: Sim! O computador principal fica como servidor e todos os outros computadores, tablets da bancada e celulares da oficina acessam pelo navegador simultaneamente.

---

## 19. Como Atualizar este Manual no Futuro

Este manual foi escrito em formato modular e padronizado em **Markdown (`docs/USER_MANUAL.md`)**:
- Se uma nova funcionalidade for adicionada a uma tela existente (por exemplo, um novo botão no PCP), basta editar o capítulo daquele módulo correspondente.
- Se uma tela nova for criada no menu, basta adicionar um novo capítulo numerado mantendo a mesma estrutura:
  1. *Para que serve esta tela?*
  2. *Passo a passo de como usar*;
  3. *Dicas práticas e cuidados*.
- O componente interativo dentro do ERP ([`src/components/help/HelpModal.tsx`](../src/components/help/HelpModal.tsx)) reflete essas mesmas orientações diretamente na interface para facilitar o acesso de quem estiver usando o sistema no dia a dia.

---

*WoodBit ERP — Tecnologia Orgânica & Fabricação Digital para a Marcenaria Moderna.*  
*Polo de Natividade & Noroeste Fluminense - RJ.*
