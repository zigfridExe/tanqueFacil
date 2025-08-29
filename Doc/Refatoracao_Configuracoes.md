# Plano de Refatoração: Separação de Configurações

## Visão Geral
Este documento descreve as mudanças necessárias para separar as configurações do veículo das configurações do aplicativo, visando melhorar a organização e usabilidade.

## Configurações do Veículo

### Dados Básicos
- [ ] Nome do veículo
- [ ] Capacidade do tanque
- [ ] Tipo de ponteiro (Analógico/Digital)

### Consumo de Combustível
- [ ] Tipo de acompanhamento (Aprendido/Manual)
- [ ] Consumo médio (se manual)
- [ ] Tipo de combustível principal

### Manutenção
- [ ] Lembrete de calibragem (ativo/inativo)
- [ ] Frequência de calibragem
- [ ] Data da última calibragem

## Configurações do Aplicativo

### Preferências de Exibição
- [ ] Tema (claro/escuro)

### Funcionalidades
- [ ] Salvar localização dos abastecimentos
- [ ] Backup automático
- [ ] Notificações

### Gerenciamento de Dados
- [ ] Exportar dados
- [ ] Fazer backup
- [ ] Restaurar backup
- [ ] Limpar todos os dados

### Sobre o Aplicativo
- [ ] Versão
- [ ] Contato do suporte

## Estrutura de Navegação Proposta

1. **Tela de Configurações do Veículo**
   - Acessível a partir da lista de veículos
   - Contém apenas configurações específicas do veículo selecionado

2. **Tela de Configurações do Aplicativo**
   - Acessível pelo menu principal
   - Contém configurações gerais do app

## Próximos Passos
1. Criar telas separadas para configurações do veículo e do app
2. Atualizar a navegação entre as telas
3. Migrar as configurações existentes para as novas telas
4. Atualizar a lógica de salvamento
5. Testar todas as funcionalidades
