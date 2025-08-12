# Plano de Ação Global: Projeto tanqueFacil

Este documento descreve o plano de desenvolvimento do aplicativo, dividido em fases lógicas para uma construção incremental e organizada.

---

### Fase 1: Fundação e Estrutura do App (O que estamos fazendo agora)

**Objetivo:** Configurar o ambiente, as ferramentas e a estrutura de dados inicial.

- **[Concluído]** Setup inicial do projeto com Expo e TypeScript.
- **[Concluído]** Estruturação inicial de pastas (componentes, telas, hooks).
- **[Concluído]** Configuração da internacionalização (i18n) com `i18next`.
- **[Concluído]** Criação dos documentos de planejamento.
- **A Fazer:** Escolher e configurar uma solução de armazenamento local. **Sugestão:** Iniciar com `AsyncStorage` pela simplicidade e, se necessário, migrar para SQLite no futuro.

---

### Fase 2: Gerenciamento de Veículos (Nosso próximo passo)

**Objetivo:** Implementar a funcionalidade central de cadastro de veículos.

1.  **Criar a Tela "Meus Veículos":**
    - Uma lista para exibir os veículos já cadastrados.
    - Um botão "Adicionar Novo Veículo" que levará ao formulário.
2.  **Criar o Formulário de Cadastro/Edição:**
    - Campos: Placa, Marca, Modelo, Ano, Nome Personalizado.
    - Validação básica dos campos.
3.  **Implementar a Lógica CRUD (Criar, Ler, Atualizar, Deletar):**
    - Salvar os dados do formulário no armazenamento local.
    - Ler os veículos do armazenamento para exibir na lista.
    - Permitir a edição de um veículo existente.
    - Permitir a exclusão de um veículo.

---

### Fase 3: Gerenciamento de Abastecimentos

**Objetivo:** Implementar a principal funcionalidade do app: o registro de abastecimentos.

1.  **Criar a Tela "Histórico de Abastecimentos":**
    - Associada a um veículo específico.
    - Listará todos os abastecimentos daquele veículo.
2.  **Criar o Formulário "Registrar Abastecimento":**
    - Campos: Data, Odômetro, Litros, Valor/Litro, Valor Total, Tipo de Combustível.
    - Implementar o cálculo automático do Valor Total.
3.  **Implementar a Lógica CRUD para Abastecimentos:**
    - Salvar, ler, editar e deletar registros de abastecimento, sempre vinculados a um veículo.

---

### Fase 4: Cálculos e Visualização de Dados

**Objetivo:** Dar ao usuário o retorno sobre os dados que ele inseriu.

1.  **Implementar Lógica de Cálculo de Consumo:**
    - Calcular o consumo médio (km/l) com base no odômetro e litros do abastecimento anterior.
2.  **Exibir Dados na UI:**
    - Mostrar o consumo médio na tela de histórico.
    - Criar uma área de "Resumo" ou "Dashboard" na tela do veículo para exibir estatísticas (consumo médio geral, último consumo, gasto total).

---

### Fase 5: Polimento e Refinamento (Pós-MVP)

**Objetivo:** Melhorar a experiência do usuário e finalizar o MVP.

1.  **Refinar a Navegação e o Fluxo do Usuário.**
2.  **Aplicar a Internacionalização (i18n)** em todas as telas e textos.
3.  **Melhorar o Design e a UI:** Garantir consistência visual e uma interface limpa.
4.  **Tratamento de Casos Especiais:** Primeiro abastecimento (sem cálculo de consumo), edição de odômetro que afeta cálculos, etc.

---

### Fase 6: Funcionalidades Avançadas (Futuro)

**Objetivo:** Adicionar valor além do MVP com base no `Planejamento.md`.

- Implementar relatórios e gráficos.
- Adicionar lembretes de manutenção.
- Implementar login e sincronização na nuvem.
- Adicionar funcionalidade de exportação de dados.
