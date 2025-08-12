
# Planejamento Global do Projeto: tanqueFacil

## 1. Resumo e Justificativa

O projeto "Meu Tanque Fácil" tem como objetivo simplificar e dinamizar o processo de gestão de combustível para motoristas, fornecendo informações rápidas e precisas sobre abastecimentos, consumo, autonomia e custos. A proposta é desburocratizar a tomada de decisão no posto, tornando o controle do veículo mais inteligente e acessível.

## 2. Objetivo Central e Escopo

Desenvolver um aplicativo móvel multiplataforma (iOS e Android) que permita aos usuários registrar e acompanhar abastecimentos, calcular consumo médio, comparar preços de combustíveis e receber lembretes de manutenção básica. O escopo inicial (MVP) foca em funcionalidades essenciais para controle de gastos e consumo, sem integração com sistemas de bordo, bombas ou nuvem.

### Escopo Negativo (O que NÃO será feito no MVP)
- Integração com sistemas OBD-II ou bombas de combustível
- Busca automática de preços em tempo real
- Armazenamento em nuvem (apenas local)
- Manutenção completa do veículo (apenas lembretes básicos)

## 3. Principais Stakeholders
- Patrocinador/Gerente: Everton Lyons Romansini
- Equipe de Desenvolvimento: Everton Lyons Romansini (dev, designer, QA)
- Usuários Finais: Motoristas de veículos leves

## 4. Marcos e Cronograma
- Especificação de Requisitos: 31/07/2025
- Design UI/UX: 11/08/2025
- MVP: 15/08/2025
- Lançamento v1.0: 01/09/2025

## 5. Funcionalidades Principais (MVP)

- **Cadastro de Veículos:**
  - Permitir cadastro de um ou mais veículos
  - Campos: Placa, Marca, Modelo, Ano, Nome Personalizado

- **Registro de Abastecimentos:**
  - Formulário para novo abastecimento
  - Campos: Data, Odômetro, Litros, Valor por Litro, Valor Total (calculado), Tipo de Combustível

- **Histórico de Abastecimentos:**
  - Listagem dos abastecimentos por veículo
  - Ordenação por data
  - Exibição dos dados essenciais

- **Cálculo de Consumo:**
  - Consumo médio (km/l) entre abastecimentos

- **Comparativo de Combustíveis:**
  - Entrada de preços de gasolina/etanol
  - Indicação do combustível mais vantajoso

- **Lembrete de Calibragem de Pneus:**
  - Alerta configurável após X dias ou abastecimentos

## 6. Funcionalidades Futuras (Pós-MVP)

- Relatórios e gráficos (gastos, consumo, preço)
- Lembretes de manutenção (óleo, rodízio)
- Suporte a múltiplos combustíveis (flex, GNV)
- Login/sincronização na nuvem
- Exportação de dados (CSV/PDF)

## 7. Requisitos Funcionais e Não Funcionais (Resumo)

### Funcionais
- Cadastro e edição de veículos
- Registro e histórico de abastecimentos
- Cálculo automático de valores e consumo
- Comparativo dinâmico de combustíveis
- Alertas de manutenção básica

### Não Funcionais
- Interface intuitiva e responsiva
- Performance rápida e cálculos instantâneos
- Persistência local dos dados
- Privacidade e controle de permissões
- Código modular e manutenível

## 8. Pilha Tecnológica (Stack)

- **Framework:** React Native com Expo
- **Linguagem:** TypeScript
- **Navegação:** Expo Router
- **Gerenciamento de Estado:** Zustand
- **Banco de Dados Local:** SQLite
- **Gestos:** React Native Gesture Handler
- **Estilização:** StyleSheet do React Native
- **Internacionalização:** i18next / react-i18next

## 9. Estrutura de Dados (Modelo Simplificado)

### Tabela: Veículos
- id
- placa
- marca
- modelo
- ano
- nome_personalizado

### Tabela: Abastecimentos
- id
- id_veiculo
- data
- odometro
- litros
- valor_por_litro
- valor_total
- tipo_combustivel

## 10. Referências e Documentação

- TAP: Termo de Abertura do Projeto
- Planejamento detalhado de requisitos e telas

---
Esse planejamento global serve como guia para o desenvolvimento, priorizando o MVP e preparando o terreno para futuras evoluções do app.

## 3. Funcionalidades Futuras (Pós-MVP)

- **Relatórios e Gráficos:**
  - Visualização de gastos mensais.
  - Gráfico de evolução do consumo médio.
  - Gráfico de variação do preço do combustível.

- **Lembretes de Manutenção:**
  - Cadastro de lembretes baseados em quilometragem ou data (ex: troca de óleo, rodízio de pneus).

- **Suporte a Múltiplos Combustíveis:**
  - Melhorar o suporte para veículos flex (Álcool/Gasolina) e GNV.

- **Login e Sincronização na Nuvem:**
  - Permitir que os usuários criem uma conta para fazer backup e sincronizar seus dados entre dispositivos.

- **Exportação de Dados:**
  - Exportar o histórico de abastecimentos para formatos como CSV ou PDF.

## 4. Pilha Tecnológica (Stack)

- **Framework:** React Native com Expo
- **Linguagem:** TypeScript
- **Navegação:** React Navigation
- **Estilização:** StyleSheet do React Native
- **Internacionalização:** i18next / react-i18next
- **Armazenamento Local:** (A definir: AsyncStorage, SQLite, etc.)
