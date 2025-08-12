# Plano de Ação: Gerenciamento de Veículos

**Fase do Projeto:** 2

**Objetivo:** Implementar o CRUD (Criar, Ler, Atualizar, Deletar) completo para os veículos do usuário.

---

### 1. Estrutura de Dados

- **Local:** `types/Vehicle.ts`
- **Definição do Tipo:**
  ```typescript
  export interface Vehicle {
    id: string; // Gerado automaticamente (ex: UUID)
    plate: string; // Placa
    brand: string; // Marca
    model: string; // Modelo
    year: number; // Ano
    name: string; // Apelido, ex: "Carro da família"
  }
  ```

### 2. Lógica de Armazenamento (AsyncStorage)

- **Local:** `hooks/useVehicleStorage.ts`
- **Responsabilidade:** Abstrair toda a interação com o `AsyncStorage` para a gestão de veículos.
- **Funções a serem criadas:**
  - `getVehicles(): Promise<Vehicle[]>`: Retorna todos os veículos.
  - `getVehicleById(id: string): Promise<Vehicle | null>`: Retorna um veículo específico.
  - `saveVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle>`: Salva um novo veículo e retorna o objeto completo com ID.
  - `updateVehicle(vehicle: Vehicle): Promise<void>`: Atualiza um veículo existente.
  - `deleteVehicle(id: string): Promise<void>`: Remove um veículo.

### 3. Telas e Navegação

1.  **Tela de Listagem (`app/(tabs)/veiculos.tsx`):**
    - Criar um novo arquivo para ser a aba "Veículos".
    - Usará o hook `useVehicleStorage` para buscar e exibir a lista de veículos.
    - Cada item da lista será um `Pressable` que navegará para a tela de detalhes/edição.
    - Terá um botão flutuante ou no header para navegar para a tela de criação.

2.  **Tela de Criação/Edição (`app/veiculos/[id].tsx`):**
    - Rota dinâmica para lidar com `veiculos/novo` (criação) e `veiculos/123` (edição).
    - Conterá o componente de formulário `VehicleForm`.
    - Em modo de edição, buscará os dados do veículo usando `getVehicleById`.
    - Terá botões para "Salvar" e "Deletar".

3.  **Atualização do Layout das Abas (`app/(tabs)/_layout.tsx`):**
    - Adicionar a nova aba "Veículos" na `TabBar`, com um ícone apropriado.

### 4. Componentes da UI

1.  **`components/VehicleListItem.tsx`:**
    - Componente para exibir um único veículo na lista.
    - Mostrará o nome, modelo e placa.

2.  **`components/VehicleForm.tsx`:**
    - Formulário reutilizável com os campos do veículo (`TextInput` para cada campo).
    - Gerenciará o estado do formulário.
    - Incluirá validação básica (ex: campos não podem estar vazios).

### 5. Passo a Passo da Implementação

1.  Criar o arquivo e a definição do tipo `Vehicle`.
2.  Implementar o hook `useVehicleStorage.ts` com a lógica do AsyncStorage.
3.  Criar os componentes `VehicleListItem` e `VehicleForm`.
4.  Desenvolver a tela de listagem `veiculos.tsx`.
5.  Desenvolver a tela de criação/edição `[id].tsx`.
6.  Atualizar o `_layout.tsx` das abas para incluir a nova rota.
7.  Testar o fluxo completo: criar, visualizar, editar e deletar um veículo.
