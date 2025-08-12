TERMO DE ABERTURA DE PROJETO (TAP)
Nome do Projeto: Meu Tanque Fácil (Nome Provisório, sujeito a zoeira e alterações futuras!)
Data de Elaboração: 31 de julho de 2025

Resumo

1. Visão e Requisitos
Propósito: Criar um app simples e inteligente para ajudar motoristas a controlar o consumo de combustível e tomar a melhor decisão na hora de abastecer.
Requisitos Funcionais: A lista completa de funcionalidades, desde o registro de abastecimentos e cálculo de consumo até o comparativo de preços e a aprendizagem do consumo médio.
Requisitos Não Funcionais: Definições sobre a usabilidade, performance e confiabilidade do app.
2. Arquitetura e Ferramentas (A "Caixa de Ferramentas")
Stack Principal: React Native (com Expo)
Padrão de Arquitetura: MVC (Model-View-Controller)
Navegação: Expo Router
Gerenciamento de Estado: Zustand
Banco de Dados Local: SQLite
Gestos: React Native Gesture Handler
Versionamento: Git com GitHub
3. Design de Interface (Os Rascunhos das Telas)
Temos esboços detalhados de todas as telas principais:
Dashboard: O painel inicial do carro, com informações resumidas e atalhos.
Decisão no Posto: A tela de comparação de preços com o "dial" visual e cores temáticas.
Registro de Abastecimento: A tela de confirmação do abastecimento, com opções para registrar o tipo de trajeto e a calibragem de pneus.
Histórico: A lista de todos os abastecimentos registrados.
Relatórios: O painel com gráficos e métricas históricas, atuais e preditivas.
Configurações: Onde o usuário personaliza o carro e as funcionalidades do app.
4. Modelo de Dados (A "Planta Baixa" do Banco de Dados)
Definimos a estrutura de dados limpa e eficiente para o SQLite, com duas tabelas principais:
Carro: Para guardar as configurações do veículo.
Abastecimentos: Para registrar cada abastecimento de forma prática e sequencial.
Temos o projeto inteiro, do conceito à estrutura, planejado e documentado. Agora, podemos seguir para o próximo passo, que seria a codificação. Podemos começar a escrever o código da primeira tela ou montar a estrutura do projeto no React Native. Qual a sua preferência?



1. Objetivo do Projeto: Desenvolver um aplicativo móvel para simplificar e dinamizar o processo de gestão de combustível para motoristas. O objetivo é fornecer informações rápidas e precisas sobre o nível do tanque, autonomia, custo de abastecimento e otimização da escolha entre etanol e gasolina, além de auxiliar no controle da manutenção básica do veículo.

2. Justificativa: A gestão de combustível e a decisão de abastecimento no posto frequentemente exigem cálculos rápidos e precisão, o que pode ser um desafio e gerar estresse para motoristas no dia a dia. Este aplicativo visa desburocratizar essa tarefa, oferecendo uma ferramenta dinâmica e fácil de usar que empodera o motorista a tomar decisões financeiras mais inteligentes e manter o controle sobre o uso do seu veículo.

3. Escopo do Projeto (Visão Geral): O projeto consiste na criação de um aplicativo móvel que permitirá ao usuário:
Registrar e estimar o nível de combustível com base no ponteiro do carro.
Calcular a autonomia restante em quilômetros.
Calcular a quantidade de combustível necessária para encher o tanque e o custo associado.
Comparar dinamicamente a viabilidade de abastecer com etanol ou gasolina, com base nos preços atuais e consumo do veículo.
Auxiliar no cálculo da quantidade de litros a sair da bomba com base no valor a pagar.
Registrar a quilometragem do veículo para controle de consumo.
Gerenciar e ser lembrado sobre a calibragem dos pneus.
Registrar o local (latitude/longitude) de abastecimentos (funcionalidade configurável).

4. Escopo Negativo (O que o projeto NÃO fará neste momento):
Conexão direta com sistemas de bordo do veículo (OBD-II).
Integração direta com bombas de combustível ou sistemas de pagamento de postos.
Busca automática de postos ou preços de combustível em tempo real via internet (o usuário inserirá os preços manualmente).
Manutenção completa do veículo (apenas lembrete de calibragem de pneus).
Armazenamento de dados do usuário em nuvem (inicialmente, será local no dispositivo).

5. Principais Stakeholders (Partes Interessadas):
Patrocinador: Everton Lyons Romansini
Gerente de Projeto: Everton Lyons Romansini
Equipe de Desenvolvimento: Everton Lyons Romansini (Programadores, Designers UI/UX, QA (testadores).)
Usuários Finais: Motoristas de veículos leves.

6. Marcos Importantes (Estimativa Inicial):
Conclusão da Especificação de Requisitos: 31/07/2025
Conclusão do Design da Interface (UI/UX): 11/08/2025
Conclusão do Desenvolvimento da Versão MVP (Produto Mínimo Viável): 15/08/2025
Lançamento da Versão 1.0: 01/09/2025

LEVANTAMENTO DE REQUISITOS (Detalhado)
Aplicativo: Meu Tanque Fácil
Objetivo Central: Descomplicar a gestão de combustível e a tomada de decisão no posto de forma dinâmica e intuitiva.
1. Requisitos Funcionais (O que o app DEVE fazer):
1.1. Configuração Inicial e do Veículo:
RF001 - Capacidade do Tanque: O usuário deve ser capaz de informar a capacidade total do tanque do seu veículo (em litros).
RF002 - Consumo de Combustível: O app deve oferecer dois métodos para gerenciar o consumo de combustível:
Consumo Manual: O usuário pode informar um valor de consumo médio (km/l) para gasolina e/ou etanol.
Consumo Aprendido: O app pode calcular e refinar o consumo médio com base nos abastecimentos registrados.
RF003 - Tipo de Combustível: O usuário deve selecionar se o veículo utiliza gasolina, etanol ou é flex.
RF004 - Salvamento de Dados do Veículo: O app deve salvar os dados do veículo para uso futuro, evitando redigitação.
1.2. Gerenciamento do Nível de Combustível (Ao Ligar o Carro):
RF005 - Registro de Quilometragem Atual: O usuário deve ser capaz de digitar a quilometragem atual do odômetro do veículo.
RF006 - Entrada do Nível do Tanque (Visual): O app deve fornecer uma interface visual (ex: slider, medidor de ponteiro) onde o usuário pode indicar o nível aproximado do combustível no tanque (ex: 1/4, 1/2, reserva, cheio).
RF007 - Estimativa de Litros Restantes: Com base no nível indicado e na capacidade total do tanque, o app deve estimar e exibir os litros de combustível restantes.
RF008 - Cálculo de Autonomia: O app deve calcular e exibir a quilometragem estimada que o veículo ainda pode rodar com o combustível restante, utilizando o consumo médio configurado.
RF009 - Cálculo de Litros para Encher: O app deve calcular e exibir a quantidade de litros necessária para encher completamente o tanque.
1.3. Decisão de Abastecimento (No Posto - Jogo Rápido):
RF010 - Entrada de Preços de Combustível: O usuário deve ser capaz de digitar rapidamente os preços atuais da gasolina e do etanol no posto.
RF011 - Comparativo Dinâmico Álcool vs. Gasolina: Para veículos flex, o app deve comparar instantaneamente os dois combustíveis e indicar qual compensa mais (ex: "Abasteça com Gasolina", "Abasteça com Etanol").
RF012 - Detalhamento da Comparação: O comparativo deve exibir a quantidade de litros necessária para encher o tanque com cada combustível e a autonomia estimada para cada um.
RF013 - Estimativa de Custo para Encher: O app deve exibir o custo estimado para encher o tanque com o combustível recomendado ou escolhido pelo usuário.
1.4. Abastecimento e Registro:
RF014 - Entrada de Valor a Pagar: O usuário deve ser capaz de informar o valor total em reais que pretende abastecer.
RF015 - Cálculo de Litros na Bomba: O app deve calcular e exibir a quantidade exata de litros que a bomba deve marcar para o valor informado.
RF016 - Registro da Quilometragem Final: Após o abastecimento, o usuário deve ser capaz de digitar a quilometragem final do odômetro, para fins de cálculo de consumo e histórico.
RF017 - Salvar Abastecimento: Todos os dados do abastecimento (data, hora, quilometragem inicial e final, litros, valor pago, tipo de combustível, preço por litro, localização) devem ser salvos no histórico.
RF018 - Registro de Localização (GPS - Configurável): O app deve, mediante permissão e configuração do usuário, registrar a latitude e longitude do local do abastecimento e armazenar no histórico.
1.5. Pós-Abastecimento e Manutenção Básica:
RF019 - Alerta de Calibragem de Pneus: O app deve emitir um alerta configurável (ex: após X dias do último registro de calibragem ou X abastecimentos) para lembrar o usuário de calibrar os pneus.
RF020 - Confirmação de Calibragem: O usuário deve ser capaz de confirmar que a calibragem foi realizada.
RF021 - Pergunta de Estepe: Após a confirmação da calibragem, um modal deve perguntar se o estepe também foi calibrado (Sim/Não).
RF022 - Registro da Data de Calibragem: O app deve registrar a data da última calibragem dos pneus.
1.6. Histórico e Relatórios:
RF023 - Visualização do Histórico: O app deve exibir uma lista de todos os abastecimentos registrados.
RF024 - Detalhes do Abastecimento no Histórico: Ao selecionar um item do histórico, o app deve mostrar todos os detalhes do abastecimento, incluindo a localização em um mapa (se registrado).
RF025 - Cálculo de Consumo Médio Real: O histórico deve permitir visualizar o consumo médio real do veículo ao longo do tempo, com base nos abastecimentos registrados.
2. Requisitos Não Funcionais (Como o app DEVE ser):
2.1. Usabilidade (UX/UI):
RNF001 - Interface Intuitiva e Simples: O design deve ser limpo, com botões grandes e textos claros, otimizado para uso rápido no posto.
RNF002 - Fluxo de Navegação Lógico: As telas devem seguir uma sequência natural e intuitiva, guiando o usuário sem complicações.
RNF003 - Respostas Imediatas: Todos os cálculos e informações devem ser exibidos instantaneamente após a entrada de dados.
RNF004 - Design Responsivo: O app deve se adaptar bem a diferentes tamanhos e orientações de tela de dispositivos móveis.
2.2. Performance:
RNF005 - Rapidez no Carregamento: O app deve carregar rapidamente.
RNF006 - Cálculos Eficientes: Os cálculos devem ser processados de forma ágil, sem travamentos ou lentidão.
RNF007 - Otimização de Recursos: O app deve consumir o mínimo de bateria e dados móveis possível.
RNF008 - Otimização de GPS: A requisição de GPS deve ser otimizada, ativando-se apenas no momento exato da confirmação do abastecimento e desativando-se logo em seguida.
2.3. Confiabilidade:
RNF009 - Precisão dos Cálculos: Todos os cálculos matemáticos devem ser 100% precisos.
RNF010 - Persistência de Dados: Os dados do usuário e do histórico devem ser armazenados de forma segura e persistente no dispositivo.
2.4. Segurança:
RNF011 - Privacidade de Dados: Os dados pessoais e de localização do usuário devem ser protegidos e não devem ser compartilhados sem consentimento explícito.
RNF012 - Permissões Claras: O app deve solicitar apenas as permissões necessárias e de forma clara ao usuário (ex: acesso ao GPS).
2.5. Manutenibilidade:
RNF013 - Código Limpo e Modular: O código deve ser bem estruturado para facilitar futuras atualizações e manutenções.
2.6. Configurabilidade:
RNF014 - Ativação/Desativação de GPS: O usuário deve ter total controle sobre o uso de sua localização, podendo ativar ou desativar a funcionalidade de registro de GPS a qualquer momento nas configurações do app.
RNF015 - Frequência de Alerta de Pneus: O usuário deve poder configurar a frequência do alerta de calibragem de pneus.

Resumo da Stack de Desenvolvimento
Framework: React Native (com o Expo)
Padrão de Arquitetura: MVC (Model-View-Controller)
Navegação: Expo Router
Gerenciamento de Estado: Zustand
Banco de Dados Local: SQLite
Gestos: React Native Gesture Handler
Versionamento: Git com GitHub
Essa é a fundação perfeita para o nosso app. Agora que temos a "planta baixa" (os requisitos) e a "caixa de ferramentas" (a stack), podemos começar a dar vida ao projeto.
O que me diz de passarmos para a fase de Design da Interface e Experiência do Usuário (UI/UX)? Podemos começar rascunhando a primeira tela para ver como ela ficaria na prática.
