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