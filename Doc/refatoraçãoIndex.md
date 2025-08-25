Ok, analisei o código e a estrutura atual. Você está certo, a tela HomeScreen acumula muitas responsabilidades, e os dados estão estáticos ou focados em apenas um veículo.

Proponho o seguinte plano de ação para resolvermos esses pontos:

Plano de Ação:
1. Componentização da Tela Principal: Vou quebrar a tela index.tsx em componentes menores e mais focados. Criarei uma nova pasta src/components/dashboard para organizar esses novos componentes:

VehicleStatusCard.tsx: Exibirá o status dos veículos selecionados.
RemindersCard.tsx: Listará os lembretes pendentes (como calibragem) para cada veículo.
QuickStatsCard.tsx: Mostrará as estatísticas de gastos, litros, etc.
QuickActions.tsx: Para os botões de ação rápida (Gerenciar, Abastecer, etc.).
2. Status dos Veículos (Dinâmico):

Componente: O VehicleStatusCard.tsx terá o título "Status dos Veículos".
Configuração: Na tela de configuracoes.tsx, adicionarei uma nova seção onde você poderá marcar (com checkboxes, por exemplo) quais veículos deseja que apareçam no painel principal.
Lógica: O painel principal irá ler essa configuração e exibir apenas os veículos selecionados.
3. Lembretes (Específicos por Veículo):

Componente: O RemindersCard.tsx irá verificar todos os seus veículos.
Lógica: Ele listará individualmente cada lembrete pendente, mostrando o nome do veículo ao lado. Por exemplo: "Calibragem de pneus vencida! - Fiat Uno".
Ação: O botão "Calibrar Agora" ao lado de cada lemprete irá registrar a calibragem para aquele veículo específico, eliminando a ambiguidade.
4. Estatísticas (Dados Reais do BD):

Cálculo: Criarei uma nova função no abastecimentoService.ts para calcular as estatísticas (gastos, litros, km) com base nos abastecimentos registrados no banco de dados.
Componente: O QuickStatsCard.tsx usará essa nova função para exibir dados reais.
Configuração: Adicionarei uma opção na tela de configuracoes.tsx para você escolher se as estatísticas devem mostrar os dados de "Todos os veículos" ou apenas do "Veículo ativo/principal".
Este plano vai deixar seu dashboard muito mais poderoso, organizado e fácil de manter.