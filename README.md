# Projeto Labook
O Labook é uma rede social com o objetivo de promover a conexão e interação entre pessoas. Quem se cadastrar no aplicativo poderá criar e curtir publicações.

Projeto criado utilizando Typescript e Programação orientada á objetos, dando mais segurança e padronização.A Arquitetura em camadas para facilitar  o desenvolvimento e visão do projeto.Gerenciador de senhas UUID e gerador de hashes (password) para tornar escalável e seguro . Todos os endpoints necessitam de autenticação  e assim autorizadas para utilizar cada endpoint. 


# Tecnologias Utilizadas.
- NodeJS
- Typescript
- Express
- SQLite
- Knex
- POO
- Arquitetura em camadas
- Geração de UUID
- Geração de hashes
- Autenticação e autorização
- Roteamento
- Postman

# Banco de dados
![projeto-labook (2)](https://user-images.githubusercontent.com/29845719/216036534-2b3dfb48-7782-411a-bffd-36245b78594e.png)

https://dbdiagram.io/d/63d16443296d97641d7c1ae1

## Documentação Postman 
## https://documenter.getpostman.com/view/24823167/2s93sW8Fep
# Lista de requisitos

- Endpoints
    - [x]  signup
    - [x]  login
    - [x]  getAllPosts
    - [x]  creatPost
    - [x]  updatePost
    - [x]  deletePost
    - [x]  like / dislike post
    - [x]  getAllUsers -  'ADMIN'

- Autenticação e autorização
    - [x]  identificação UUID
    - [x]  senhas hasheadas com Bcrypt
    - [x]  tokens JWT
 
 - Código
    - [x]  POO
    - [x]  Arquitetura em camadas
    - [x]  Roteadores no Express


# Instalação 
## instalar dependências
```
npm i 
```



## configurar variáveis de ambiente
 - criar arquivo .env na pasta raiz do projeto
```typescript

{ 
PORT=3003 // porta servidor padrão 3003
//  caminho para database
DB_FILE_PATH= caminho do arquivo banco de dados
//  senha para payload no  tokenManager
JWT_KEY= seuchave
//   tempo de expiração de token 
JWT_EXPIRES_IN=30d

//  número de rodadas. 'cost' . padrão 12
BCRYPT_COST=12

}
```
## Iniciar servidor
```
npm run dev 
```

# Token payload e User roles
O enum de roles  por padrão a criação de usuário está como 'NORMAL'
```typescript

export enum USER_ROLES {
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
}


```

# Exemplos de requisição

## Signup
Endpoint público utilizado para cadastro. Devolve um token jwt.


## Login
Endpoint público utilizado para login. Devolve um token jwt.


## Get posts
Endpoint protegido, requer um token jwt para acessá-lo.


## Create post
Endpoint protegido, requer um token jwt para acessá-lo.


## Edit post
Endpoint protegido, requer um token jwt para acessá-lo.<br>
Só quem criou o post pode editá-lo e somente o conteúdo pode ser editado.


## Delete post
Endpoint protegido, requer um token jwt para acessá-lo.<br>
Só quem criou o post pode deletá-lo. Admins podem deletar o post de qualquer pessoa.

## Like or dislike post (mesmo endpoint faz as duas coisas)

Endpoint protegido, requer um token jwt para acessá-lo.<br>
Quem criou o post não pode dar like ou dislike no mesmo.<br><br>
Caso dê um like em um post que já tenha dado like, o like é desfeito.<br>
Caso dê um dislike em um post que já tenha dado dislike, o dislike é desfeito.<br><br>
Caso dê um like em um post que tenha dado dislike, o like sobrescreve o dislike.<br>
Caso dê um dislike em um post que tenha dado like, o dislike sobrescreve o like.


