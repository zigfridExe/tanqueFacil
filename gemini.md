# Meu Tanque Fácil

## Visão Geral
Aplicativo móvel para simplificar e otimizar o gerenciamento de combustível para motoristas, auxiliando na tomada de decisão no momento do abastecimento e no controle de consumo.

## Objetivo
Desenvolver um aplicativo móvel que forneça informações rápidas e precisas sobre:
- Nível do tanque e autonomia
- Custo de abastecimento
- Comparativo entre etanol e gasolina
- Controle de manutenção básica do veículo

## Stack de Desenvolvimento

### Frontend
- **Framework**: React Native (com Expo)
- **Padrão de Arquitetura**: MVC (Model-View-Controller)
- **Navegação**: Expo Router
- **Gerenciamento de Estado**: Zustand
- **Banco de Dados Local**: SQLite
- **Biblioteca de Gestos**: React Native Gesture Handler
- **Controle de Versão**: Git com GitHub

## Principais Funcionalidades

### 1. Configuração do Veículo
- Definição da capacidade do tanque
- Configuração do consumo de combustível (manual ou aprendizado)
- Seleção do tipo de combustível (gasolina, etanol ou flex)

### 2. Gerenciamento de Combustível
- Registro do nível de combustível
- Cálculo de autonomia restante
- Estimativa de litros necessários para encher o tanque

### 3. Decisão de Abastecimento
- Comparação dinâmica entre etanol e gasolina
- Cálculo do custo para encher o tanque
- Recomendação do melhor combustível para abastecer

### 4. Registro de Abastecimento
- Entrada de preços de combustível
- Cálculo de litros baseado no valor a pagar
- Registro de quilometragem
- Opção de registrar localização (GPS)

### 5. Manutenção Básica
- Lembretes de calibragem de pneus
- Controle de calibragem do estepe
- Histórico de manutenções

### 6. Histórico e Relatórios
- Lista de todos os abastecimentos
- Detalhes completos de cada abastecimento
- Cálculo de consumo médio
- Visualização de histórico em mapa

## Estrutura do Projeto

```
meu-tanque-facil/
├── assets/               # Recursos estáticos (imagens, ícones, fontes)
├── src/
│   ├── components/       # Componentes reutilizáveis
│   ├── screens/          # Telas da aplicação
│   ├── models/           # Modelos de dados
│   ├── controllers/      # Lógica de negócios
│   ├── services/         # Serviços (API, banco de dados)
│   ├── utils/            # Utilitários e helpers
│   └── store/            # Gerenciamento de estado (Zustand)
├── App.js               # Ponto de entrada da aplicação
└── app.json             # Configuração do Expo
```

## Pré-requisitos
- Node.js (versão LTS recomendada)
- npm
- Expo CLI instalado globalmente
- Dispositivo móvel com o aplicativo Expo Go ou emulador

## Como Executar

### Instalação
```bash
# Clonar o repositório
git clone [URL_DO_REPOSITORIO]

# Instalar dependências
cd meu-tanque-facil
npm install
# ou
yarn install
```

### Executando o Projeto
```bash
# Iniciar o servidor de desenvolvimento
expo start
```

## Próximos Passos
1. Configurar ambiente de desenvolvimento
2. Implementar navegação entre telas
3. Desenvolver componentes principais
4. Implementar lógica de negócios
5. Configurar banco de dados local (SQLite)
6. Testes e validações

## Licença
Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---
*Última atualização: 11/08/2025*

---

# Plano de Ação Global: Khypukamayuq

> **Nota:** Todas as inteligências artificiais utilizadas por mim recebem o nome Khypukamayuq. Este plano de ação deve sempre conter e detalhar as ações que a IA irá executar para controlar, monitorar e potencializar o projeto.


## Objetivo
Controlar, monitorar e otimizar o desenvolvimento do projeto "Meu Tanque Fácil" utilizando a inteligência artificial Khypukamayuq (Copilote Windsurf Cursor e demais instâncias Khypukamayuq).


## Funções da IA
- Gerenciar planos de ação das features e prompts
- Sugerir melhorias e automações
- Monitorar progresso e alertar sobre atrasos
- Auxiliar na tomada de decisão técnica
- Garantir alinhamento com requisitos e cronograma
- Executar e registrar todas as ações realizadas pela IA no projeto
- **Commits:** Apenas o usuário humano pode realizar commits. A IA irá preparar e propor mensagens de commit, mas nunca executará o comando `git commit`.


## Etapas de Controle
1. ✅ Mapear todas as features e prompts do projeto
2. ✅ Integrar planos de ação das pastas dedicadas
3. ✅ Definir indicadores de progresso (checklists, status, datas)
4. 🔄 Automatizar notificações e sugestões de melhoria
5. 🔄 Realizar revisões periódicas dos planos e execução
6. 🔄 Gerar relatórios de acompanhamento
7. ✅ Documentar todas as ações executadas pela IA Khypukamayuq

## Progresso Atual - Primeira Tela Implementada ✅

### O que foi implementado:
- **Tela de Cadastro de Veículos** (`/veiculo-cadastro`)
  - Formulário completo com validação
  - Campos: nome, capacidade do tanque, consumo gasolina/etanol, tipo de ponteiro
  - Switches para localização e lembretes de calibragem
  - Navegação com botão voltar
  
- **Tela Principal de Veículos** (`/veiculos`)
  - Lista de veículos cadastrados
  - Botões de ação (editar/excluir)
  - Estado vazio com mensagem orientativa
  - Navegação para cadastro
  
- **Dashboard Principal** (`/`)
  - Interface moderna e intuitiva
  - Cards de ação rápida
  - Status do veículo atual
  - Lembretes e estatísticas
  - Navegação integrada

- **Estrutura de Tipos**
  - Interfaces TypeScript para Veiculo e Abastecimento
  - Tipos baseados no modelo de dados SQLite definido

- **Navegação**
  - Tab "Veículos" adicionada ao layout principal
  - Rotas organizadas seguindo a estrutura do projeto
  - **Navegação Inferior Atualizada:**
    - Aba "Explore" removida.
    - Abas "Relatórios" e "Configurações" adicionadas.

### ✅ SQLite Implementado com Sucesso!

**Estrutura do Banco de Dados:**
- **Tabela Carro**: Armazena todos os dados dos veículos
- **Tabela Abastecimentos**: Preparada para futuros registros
- **Relacionamentos**: Chave estrangeira entre veículos e abastecimentos

### ✅ Tela de Registro de Abastecimentos Implementada!

**Funcionalidades Implementadas:**
- **Formulário Completo**: Data, quilometragem, litros, preço por litro, valor total
- **Cálculos Automáticos**: Preço por litro e valor total calculados automaticamente
- **Validações**: Campos obrigatórios e validações de valores
- **Tipos de Combustível**: Seleção entre Gasolina e Etanol
- **Tipos de Trajeto**: Cidade, Estrada ou Misto
- **Calibragem de Pneus**: Switch para marcar se foi realizada
- **Integração com Banco**: Serviço completo para CRUD de abastecimentos
- **Hook Personalizado**: useAbastecimentos para gerenciamento de estado
- **Cálculo de Consumo**: Função para calcular consumo médio por veículo

**Arquitetura:**
- `app/abastecimento-registro.tsx` - Tela de registro
- `services/abastecimentoService.ts` - Operações CRUD no banco
- `hooks/useAbastecimentos.ts` - Hook personalizado para gerenciar estado
- Integração completa com o banco SQLite existente

**Funcionalidades Implementadas (Veículos):**
- ✅ Criação de veículos com persistência
- ✅ Listagem de veículos do banco
- ✅ Exclusão de veículos (com validação de integridade)
- ✅ Atualização de veículos
- ✅ Hook personalizado para gerenciamento de estado
- ✅ Tratamento de erros e loading states
- ✅ Refresh control para atualizar dados
- ✅ Validação de exclusão (impede exclusão se há abastecimentos)

**Arquitetura (Veículos):**
- `database/database.ts` - Configuração e inicialização do SQLite
- `services/veiculoService.ts` - Operações CRUD no banco
- `hooks/useVeiculos.ts` - Hook personalizado para gerenciar estado
- Integração completa com as telas existentes

### ✅ Tela de Histórico de Abastecimentos Implementada!
- **Tela:** `app/abastecimento-historico.tsx`
- **Funcionalidade:** Lista todos os abastecimentos registrados, com opção de exclusão.
- **Acesso:** Botão "📊 Histórico" no Dashboard.

### ✅ Tela de Comparador de Combustível Implementada!
- **Tela:** `app/combustivel-comparador.tsx`
- **Funcionalidade:** Permite comparar preços de gasolina e etanol com base no consumo do veículo, recomendando a melhor opção.
- **Acesso:** Botão "⚖️ Comparar" no Dashboard.

### ✅ Cálculo de Consumo Médio Implementado!
- **Tela:** `app/(tabs)/relatorios.tsx`
- **Funcionalidade:** Calcula e exibe o consumo médio (km/L) para cada veículo, baseado nos abastecimentos registrados.
- **Acesso:** Nova aba "Relatórios" no menu inferior.

### 🔧 Problemas Identificados e Corrigidos:

**1. Erro de Importação SQLite:**
- ❌ `import * as SQLite from 'expo-sqlite'`
- ✅ `import { openDatabase } from 'expo-sqlite'`
- **Status**: Corrigido ✅

**2. Tratamento de Erros Melhorado:**
- Adicionado logging detalhado para debug
- Fallback para carregar veículos mesmo com erro de inicialização
- **Status**: Implementado ✅

**3. Arquivo de Teste SQLite:**
- Criado `database/test.ts` para verificação de funcionamento
- **Status**: Criado ✅

**4. Problema de Versão do expo-sqlite:**
- ❌ Versão 15.2.14 com problemas de compatibilidade
- ✅ Versão 11.3.3 instalada (mais estável)
- **Status**: Corrigido ✅

**5. Tela de Teste SQLite:**
- Criada tela `/test-sqlite` para verificar funcionamento
- Botão de teste adicionado ao dashboard
- **Status**: Implementado ✅

**6. Problema de Navegação para Abastecimento:**
- ❌ Botão de abastecimento navegando para tela inexistente
- ✅ Corrigida versão do expo-sqlite (15.2.14 → 11.3.3)
- ✅ Navegação corrigida para `/abastecimento-registro`
- **Status**: Corrigido ✅

### Próximos passos:
- **Configurações:** Implementar as opções de configuração do aplicativo na aba "Configurações".
- **Manutenção Básica:** Desenvolver as funcionalidades de lembretes e histórico de manutenção.
- **Gerenciamento de Combustível:** Implementar o registro de nível do tanque, cálculo de autonomia e estimativa de litros necessários.
- **Relatórios Avançados:** Expandir a tela de relatórios com mais métricas e visualizações (ex: histórico em mapa).


## Critérios de Aceite
- Todos os planos de ação estão integrados e monitorados
- Progresso do projeto é acompanhado e reportado
- Sugestões da IA são registradas e avaliadas
- Decisões técnicas são documentadas
- Todas as ações da IA Khypukamayuq estão descritas e acessíveis no plano

---
Este plano de ação global garante que Khypukamayuq atue como supervisor inteligente, potencializando o desenvolvimento e a organização do projeto.
