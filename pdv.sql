-- criar database
create database pdv

-- criar tabelas
create table usuarios (
  id serial primary key,
  nome text not null,
  email text unique,
  senha varchar not null)

  create table produtos(
  id serial primary key,
  descricao text, 
  valor integer not null,
  produto_imagem varchar)
    
CREATE TABLE pedidos(
  id serial primary key,
  data_pedido timestamp default now(),
  valor_total integer not null);
    
CREATE TABLE pedido_produtos(
  id SERIAL PRIMARY KEY,
  pedido_id integer references pedidos(id),
  produto_id integer references produtos(id),
  quantidade_produto INTEGER not null
);

-- alterar BD para incluir tabelas
alter table produtos add column quantidade_estoque integer not null

alter table produtos add column nome_arquivo text
