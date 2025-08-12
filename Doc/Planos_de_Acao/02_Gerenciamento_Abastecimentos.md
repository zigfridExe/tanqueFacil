# Plano de Ação: Gerenciamento de Abastecimentos

**Fase do Projeto:** 3

**Objetivo:** Permitir que o usuário registre, visualize, edite e delete os abastecimentos de cada um de seus veículos.

---

### 1. Estrutura de Dados

- **Local:** `types/Fueling.ts`
- **Definição do Tipo:**
  ```typescript
  export interface Fueling {
    id: string; // Gerado automaticamente
    vehicleId: string; // ID do veículo ao qual pertence
    date: string; // Data no formato ISO (new Date().toISOString())
    odometer: number; // Quilometragem no momento do abastecimento
    liters: number; // Quantidade de litros
    pricePerLiter: number; // Preço por litro
    totalValue: number; // Valor total (calculado ou inserido)
    fuelType: 'gasoline' | 'ethanol' | 'diesel'; // Tipo de combustível
  }
  ```

### 2. Lógica de Armazenamento (AsyncStorage)

- **Local:** `hooks/useFuelingStorage.ts`
- **Responsabilidade:** Abstrair a interação com o `AsyncStorage` para os abastecimentos.
- **Funções a serem criadas:**
  - `getFuelingsByVehicleId(vehicleId: string): Promise<Fueling[]>`: Retorna todos os abastecimentos de um veículo, ordenados por data.
  - `saveFueling(fueling: Omit<Fueling, 'id'>): Promise<Fueling>`: Salva um novo abastecimento.
  - `updateFueling(fueling: Fueling): Promise<void>`: Atualiza um abastecimento.
  - `deleteFueling(id: string): Promise<void>`: Remove um abastecimento.

### 3. Telas e Navegação

1.  **Tela de Detalhes do Veículo (`app/veiculos/[id].tsx`):**
    - Esta tela, criada na fase anterior, será modificada para incluir a lista de abastecimentos do veículo selecionado.
    - Usará o hook `useFuelingStorage` para buscar os dados.
    - Terá um botão "Adicionar Abastecimento" que navegará para o formulário.

2.  **Tela de Criação/Edição de Abastecimento (`app/abastecimentos/[id].tsx`):**
    - Rota dinâmica para `abastecimentos/novo` e `abastecimentos/123`.
    - Conterá o formulário `FuelingForm`.
    - O `vehicleId` será passado como parâmetro de navegação.

### 4. Componentes da UI

1.  **`components/FuelingListItem.tsx`:**
    - Componente para exibir um único abastecimento na lista.
    - Mostrará a data, litros, valor total e, futuramente, o consumo calculado.

2.  **`components/FuelingList.tsx`:**
    - Componente que recebe o `vehicleId`, busca os dados e renderiza uma `FlatList` de `FuelingListItem`.

3.  **`components/FuelingForm.tsx`:**
    - Formulário com os campos de abastecimento.
    - Implementará a lógica de cálculo `totalValue = liters * pricePerLiter` em tempo real.

### 5. Passo a Passo da Implementação

1.  Criar o tipo `Fueling`.
2.  Implementar o hook `useFuelingStorage.ts`.
3.  Criar os componentes `FuelingListItem`, `FuelingList` e `FuelingForm`.
4.  Integrar o componente `FuelingList` na tela de detalhes do veículo.
5.  Criar a tela de formulário de abastecimento.
6.  Implementar a navegação entre a lista e o formulário.
7.  Testar o fluxo completo de CRUD para abastecimentos.
