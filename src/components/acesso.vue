<template>
    <div class="acesso-container">
      <h2>Relatório de Acessos</h2>
  
      <!-- Exibe as informações do usuário em uma lista -->
      <ul class="perfil-detalhes" v-if="cliente">
        <li><strong>ID:</strong> {{ cliente.id }}</li>
        <li><strong>Nome:</strong> {{ cliente.nome }}</li>
        <li><strong>Email:</strong> {{ cliente.email }}</li>
        <li><strong>CPF:</strong> {{ cliente.cpf }}</li>
        <li><strong>Telefone:</strong> {{ cliente.telefone }}</li>
        </ul>
  
      <p v-else>Carregando...</p>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        cliente: null, // Dados do usuário
      };
    },
    methods: {
      async fetchcliente() {
        try {
          // Recupera o ID do usuário logado no localStorage
          const clienteLogado = JSON.parse(localStorage.getItem("clienteLogado"));
          if (!clienteLogado || !clienteLogado.id) {
            throw new Error("Usuário não está logado.");
          }
  
          // Obtém os dados do usuário logado do db.json
          const response = await axios.get(`http://localhost:8000/clientes/${clienteLogado.id}`);
          const cliente = response.data;
  
          // Atualiza o contador de logins
          const atualizado = { ...cliente, loginCount: (cliente.loginCount || 0) + 1 };
  
          // Atualiza os dados no JSON Server
          await axios.put(`http://localhost:8000/clientes/${cliente.id}`, atualizado);
  
          // Define os dados do usuário para exibição
          this.cliente = atualizado;
        } catch (error) {
          console.error("Erro ao buscar ou atualizar os dados do cliente:", error);
          alert("Não foi possível carregar as informações do cliente.");
        }
      },
    },
    mounted() {
      this.fetchcliente();
    },
  };
  </script>
  
  <style>
  .acesso-container {
    max-width: 600px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .perfil-detalhes {
    list-style: none;
    padding: 0;
  }
  
  .perfil-detalhes li {
    margin-bottom: 10px;
    line-height: 1.5;
  }
  </style>
  