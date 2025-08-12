# Plano de Ação: Cálculos e Dashboard

**Fase do Projeto:** 4

**Objetivo:** Processar os dados de abastecimento para fornecer ao usuário métricas úteis, como o consumo médio do veículo.

---

### 1. Lógica de Cálculo

- **Local:** `services/consumption.ts` ou similar.
- **Função Principal:** `calculateConsumption(currentFueling: Fueling, previousFueling: Fueling): number`
- **Fórmula:** `(currentFueling.odometer - previousFueling.odometer) / currentFueling.liters`
- **Regras de Negócio:**
  - O cálculo só é possível se houver um abastecimento anterior.
  - O primeiro abastecimento de um veículo não terá cálculo de consumo.
  - Lidar com casos onde o usuário abastece sem encher o tanque (o cálculo representa a média do trecho, o que é aceitável para este MVP).

### 2. Integração dos Cálculos

1.  **Na Lista de Abastecimentos (`components/FuelingList.tsx`):**
    - A lógica para buscar os abastecimentos (`getFuelingsByVehicleId`) deve garantir que eles venham ordenados por odômetro ou data.
    - Ao renderizar a lista, para cada item, pegar o item anterior para realizar o cálculo.

2.  **No Item da Lista (`components/FuelingListItem.tsx`):**
    - O componente receberá o resultado do cálculo como uma `prop` opcional.
    - Exibirá o consumo (ex: `12.5 km/l`) se o valor for fornecido.

### 3. Componente de Dashboard

- **Local:** `components/VehicleDashboard.tsx`
- **Responsabilidade:** Exibir um resumo das estatísticas do veículo.
- **Métricas a serem exibidas (MVP):**
  - **Consumo Médio Geral:** Média de todos os consumos calculados.
  - **Último Consumo:** O consumo referente ao último trecho percorrido.
  - **Gasto Total no Mês:** Soma do `totalValue` de todos os abastecimentos no mês corrente.
- **Implementação:**
  - O componente receberá a lista completa de abastecimentos do veículo como `prop`.
  - Fará todos os cálculos internamente.

### 4. Integração do Dashboard

- **Local:** `app/veiculos/[id].tsx` (Tela de Detalhes do Veículo).
- **Ação:** Adicionar o componente `VehicleDashboard` no topo da tela, acima da lista de abastecimentos, para dar ao usuário uma visão geral imediata.

### 5. Passo a Passo da Implementação

1.  Criar o serviço ou função utilitária para o cálculo de consumo.
2.  Modificar a `FuelingList` para realizar o cálculo para cada item e passar o resultado para `FuelingListItem`.
3.  Atualizar `FuelingListItem` para exibir o consumo.
4.  Criar o componente `VehicleDashboard` e implementar a lógica para as métricas de resumo.
5.  Integrar o `VehicleDashboard` na tela de detalhes do veículo.
6.  Validar os cálculos e a exibição dos dados.
