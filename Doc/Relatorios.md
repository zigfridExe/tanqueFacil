# Relatórios – Guia de Implementação e Uso

Este documento descreve a implementação da guia de Relatórios do app, os componentes criados, como os dados reais são calculados a partir do banco SQLite (expo-sqlite), os filtros de período (incluindo intervalo personalizado com DatePicker) e passos para manutenção/expansão.

## Visão Geral

- Tela: `app/(tabs)/relatorios.tsx`
- Componentes de relatórios:
  - `components/reports/CostsReport.tsx` (Custos)
  - `components/reports/PerformanceReport.tsx` (Desempenho)
  - `components/reports/ConsumptionTrendReport.tsx` (Tendência de Consumo)
- Layout inspirado em “cards” (estilo app de meteorologia): títulos, chips de filtro, cards com KPIs, minibarras/pílulas.
- Mapa: botão “Ver Mapa” permanece no header e segue para a tela OSM existente (`/abastecimento-mapa`).

## Dependências

- Banco de dados: `expo-sqlite` (já no projeto)
- Date Picker: `@react-native-community/datetimepicker`

Instalação (rodar na pasta do projeto):

```bash
npm install @react-native-community/datetimepicker
```

Após instalar, reiniciar o bundler.

## Dados e Cálculos

### Tabelas usadas
- `Carro` e `Abastecimentos` em `database/database.ts`.
- Tipos: `types/veiculo.ts`.
- Serviços: `services/abastecimentoService.ts`, `services/veiculoService.ts`.
- Hooks: `hooks/useAbastecimentos.ts`, `hooks/useVeiculos.ts`.

### Estratégia para Consumo e Tendências
- Os cálculos usam “trechos” entre abastecimentos de um mesmo veículo:
  1. Ordena-se os abastecimentos por `quilometragem` (e `data` como desempate).
  2. Para cada item `i`, considera-se a distância até o próximo (`quilometragem[i+1] - quilometragem[i]`).
  3. O consumo do trecho é `distância / litros[i]`.
- Essa abordagem evita usar o primeiro abastecimento como consumo e é aplicada em:
  - Desempenho por combustível e por tipo de trajeto.
  - Impacto da calibragem (comparando trechos com `calibragemPneus = true` vs. `false`).
  - Tendência de consumo (série com os últimos 8 trechos, agregando todos os veículos).

### Custos (CostsReport)
- KPIs:
  - Gasto Total: soma de `valorPago` filtrados.
  - Litros Totais: soma de `litros` filtrados.
  - Custo médio por litro: `Gasto Total / Litros Totais`.
  - Ticket médio: `Gasto Total / quantidade de abastecimentos`.
  - Custo por km: `Gasto Total / kmPercorridos` onde `kmPercorridos` é somado por veículo (máx(0, km_max − km_min)).
- Distribuição por combustível: soma de `valorPago` por `tipoCombustivel`.

### Desempenho (PerformanceReport)
- Por combustível: km/L por combustível a partir dos trechos.
- Por tipo de trajeto: km/L por `tipoTrajeto` (Cidade/Estrada/Misto) a partir dos trechos.
- Calibragem: km/L calibrado vs. descalibrado e ganho percentual `((calibrado − descalibrado)/descalibrado) * 100`.

### Tendência (ConsumptionTrendReport)
- Série real com os últimos 8 trechos (km/L) considerando todos os veículos (ordenada por data do fim do trecho).
- Visual em “pílulas” proporcionais, com destaque acima/abaixo da média.

## Filtros de Período

Chips nos três componentes:
- Este mês: do primeiro dia do mês atual até hoje.
- Últimos 30 dias: `hoje − 30` dias.
- Personalizado: abre um modal com DatePicker para escolher `Início` e `Fim`.

Validações no modal:
- Início e fim obrigatórios.
- Início deve ser anterior ou igual ao fim.
- Erros exibidos em vermelho; o botão “Aplicar” fecha o modal apenas se válido.

Implementação dos filtros:
- `CostsReport.tsx`: aplica o filtro antes de calcular KPIs e distribuição; inclui modal e validações.
- `PerformanceReport.tsx`: aplica o filtro antes de construir os trechos para métricas por combustível, trajeto e calibragem; inclui modal e validações.
- `ConsumptionTrendReport.tsx`: aplica o filtro antes de montar a série; inclui modal e validações.

## Estrutura Visual

- Cards com sombras leves e bordas arredondadas (`Colors.light.background`).
- Ícones via `components/ui/IconSymbol.tsx` (mapeia SF Symbols para MaterialIcons).
- Barras/pílulas simples para comparativos, sem libs de gráfico (leve e responsivo).

## Extensões Futuras

- Seleção de Veículo: adicionar dropdown “Todos / veículo X” e propagar para os três componentes.
- Persistência de filtros: salvar preferências (período/veículo) em `src/store/` para manter entre sessões.
- Exportação: gerar CSV/PDF a partir dos KPIs.
- Mais períodos: “Últimos 7 dias”, “Este ano”, “Trimestre”.
- UI: exibir datas no formato `dd/MM/aaaa` (hoje usa ISO no modal; leitura simples por hora).

## Arquivos Alterados/Criados

- `app/(tabs)/relatorios.tsx` – tela orquestrando os componentes.
- `components/reports/CostsReport.tsx` – relatório de custos com dados reais + filtros + modal de datas.
- `components/reports/PerformanceReport.tsx` – desempenho com dados reais por combustível/traçado/calibragem + filtros + modal de datas.
- `components/reports/ConsumptionTrendReport.tsx` – tendência com série real + filtros + modal de datas.
- `components/ui/IconSymbol.tsx` – utilitário de ícones existentes.

## Como Validar

1. Acesse a aba `Relatórios`.
2. Troque entre chips: Este mês / Últimos 30 dias / Personalizado.
3. Em Personalizado, selecione `Início` e `Fim` e clique em Aplicar.
4. Verifique a atualização dos KPIs e visuais nos três relatórios.
5. Botão “Ver Mapa” continua navegando para o OSM.

---

Se quiser, posso adicionar o seletor de veículo, persistir o último filtro escolhido e formatar as datas como `dd/MM/aaaa`.
