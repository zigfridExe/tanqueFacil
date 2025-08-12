### **1\. Tabela: Carro**

*(Aqui guardamos as configurações do veículo do usuário.)*

| Nome do Campo | Tipo de Dado | Descrição |
| :---- | :---- | :---- |
| id | INTEGER | Chave primária. |
| nome | TEXT | Nome do veículo (Ex: "Gol Bolinha"). |
| capacidadeTanque | REAL | Capacidade total do tanque em litros. |
| consumoManualGasolina | REAL | Consumo manual de gasolina em km/l. |
| consumoManualEtanol | REAL | Consumo manual de etanol em km/l. |
| tipoPonteiro | TEXT | "Analógico" ou "Digital". |
| salvarLocalizacao | INTEGER | 1 para sim, 0 para não. |
| lembreteCalibragem | INTEGER | 1 para sim, 0 para não. |
| frequenciaLembrete | INTEGER | Número de dias para o lembrete de calibragem. |

### **2\. Tabela: Abastecimentos**

*(Aqui guardamos cada registro de abastecimento feito pelo usuário.)*

| Nome do Campo | Tipo de Dado | Descrição |
| :---- | :---- | :---- |
| id | INTEGER | Chave primária. |
| data | TEXT | Data e hora do abastecimento. |
| quilometragem | INTEGER | KM do carro no momento do abastecimento. |
| litros | REAL | Litros abastecidos. |
| valorPago | REAL | Valor total pago no abastecimento. |
| precoPorLitro | REAL | Preço do litro no dia. |
| tipoCombustivel | TEXT | "Gasolina" ou "Etanol". |
| tipoTrajeto | TEXT | "Cidade", "Estrada" ou "Misto". |
| calibragemPneus | INTEGER | 1 se os pneus foram calibrados. |
| latitude | REAL | Latitude do local (opcional). |
| longitude | REAL | Longitude do local (opcional). |
| carroId | INTEGER | Chave estrangeira para a tabela Carro. |

