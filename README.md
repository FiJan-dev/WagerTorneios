# WagerTorneios

## Descrição

## Tecnologias Utilizadas

- **React + Tailwind CSS** no frontend
- **Node.js + Express** no backend
- **MariaDB** como banco de dados
- **Docker + Docker Compose** para orquestração

## Estrutura do Projeto

## Protótipo

## Integrantes

## Status do Projeto

Em desenvolvimento
Primeira versão estimada para: XX/XX/XXXX

## Como rodar o Projeto

### Pré-requisitos

- [Docker](https://www.docker.com/products/docker-desktop) e Docker Compose instalados
- [Node.js](https://nodejs.org/) e npm (caso deseje rodar localmente sem Docker)

---

### Clonar o repositório

```bash
git clone https://github.com/FiJan-dev/WagerTorneios
cd WagerTorneios
```

### Configurar variaveis de ambiente

- **Fazer o .env com base no .env.example**

### Criar e iniciar os containers

```bash
docker-compose up --build
```

### Acessar o projeto

- _Frontend:_ http://localhost:3000
- _Banco:_ docker exec -it mariadb mariadb -u root -p
