
# Documentação do Desafio - Desenvolvimento do Backend em Node.js

Este documento fornece instruções passo a passo para reproduzir o desenvolvimento do backend para o desafio proposto, incluindo a importação do repositório do GitHub, instalação de dependências e uso de ferramentas para criar as rotas necessárias.

## Importando o repositório do GitHub:

* Acesse o repositório do projeto no GitHub e clone o projeto 


## Instalando as dependências:

* Instale todas as dependências
* Execute o seguinte comando para instalar as dependências listadas no arquivo package.json:


```http
    npm install
```


## Configurando as variáveis de ambiente:

* Abra o arquivo .env e configure as variáveis de ambiente necessárias, como informações de conexão com o banco de dados. 

* A lib instalada permite a conexão somente com o banco PostgreSQL. Garanta a conexão antes de fazer o teste. 

* E inicie o servidor. 

```http
    npm start
```

## Testando os recursos implementados:

* Para testar o recebimento de payloads via MQTT, você pode usar o MQTTX ou qualquer outra ferramenta de sua preferência. 

* Certifique-se de configurar a ferramenta de teste com o endereço do broker MQTT especificado nas variáveis de ambiente.

* Envie mensagens MQTT com payloads no formato fornecido no desafio para o tópico configurado no servidor.

* Verifique o log do servidor para confirmar que os payloads foram recebidos e as informações foram armazenadas corretamente no banco de dados.

* Para testar a leitura de informações do banco de dados via navegador, você pode usar um cliente HTTP, como o Postman ou o cURL.

* Faça uma solicitação GET para a rota adequada da API, fornecendo os parâmetros necessários, como "/BESS?param=COV&limit=4". Isso retornará as informações mais recentes do payload, de acordo com os parâmetros fornecidos.

* Para testar o envio de comandos do navegador para o MQTT, faça uma solicitação POST para a rota adequada da API, fornecendo as informações necessárias no corpo da solicitação.

* Verifique a resposta da API para confirmar se as informações foram enviadas corretamente.

* Use a ferramenta de teste MQTT para verificar se os comandos foram recebidos corretamente pelo broker MQTT.


## ROTAS API

#### Retorna os dados filtradas de acordo com os parâmetros passados na rota.

```http
  GET /<ROTA>?param=<INFO>&limit=<VALOR LIMITE>

  exemplo: /BESSFILTER?param=COV&limit=4
```

Use para testar as 3 tabelas que vão ser criadas, é um padrão só.

#### Retorna todos os dados da tabela

```http
  GET /<ROTA>

  exemplo: /METER
```

Use para testar as 3 tabelas que vão ser criadas, é um padrão só.


#### Envio de comandos do browser ao MQTT

```http
POST /<ROTA>

exemplo: /send-mqtt-command
```
Para esse **POST** é necessário um body com a seguinte estrutura:

```http
{
  "command": {
    "manualMode": {
      "Enable": 0,
      "scheduleStart": "08:32:10",
      "scheduleStop": "09:33:20",
      "Power": 10
    }
  }
}

```


