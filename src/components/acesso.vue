<template>
  <div class="acesso-container">
  <h1>Olá, {{ usuario.nome }}!</h1>
    <h2>Relatório de Acessos</h2>
    <div v-if="usuario.id">
      <p><strong>Contagem de Acessos:</strong> {{ usuario.loginCount }}</p>
      <p><strong>Data e Hora do Último Login:</strong> {{ dataHoraLogin }}</p>
      <h3>Histórico de Acessos</h3>
      <ul>
        <li v-for="(acesso, index) in usuario.acessos" :key="index">
          {{ acesso }}
        </li>
      </ul>
    </div>
    <p v-else>Carregando...</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      usuario: {
        id: null,
        loginCount: 0,
        acessos: [], // Histórico de acessos do usuário
      },
      dataHoraLogin: "",
    };
  },
  methods: {
    async registrarLogin() {
      try {
        // Recupera o ID do usuário logado no localStorage
        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
        console.log("Usuário logado recuperado:", usuarioLogado);

        if (!usuarioLogado || !usuarioLogado.id) {
          throw new Error("Usuário não está logado ou ID ausente.");
        }

        // Obtém os dados do usuário do servidor
        const response = await axios.get(`http://localhost:8000/clientes/${usuarioLogado.id}`);
        console.log("Dados do cliente recuperados:", response.data);

        const usuario = response.data;

        // Atualiza o contador e o histórico de acessos
        const now = new Date();
        const dataHoraAtual = now.toLocaleString("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
        });

        const atualizado = {
          ...usuario,
          loginCount: (usuario.loginCount || 0) + 1,
          acessos: [...(usuario.acessos || []), dataHoraAtual], // Adiciona a nova data ao histórico
        };

        // Atualiza os dados no JSON Server
        const putResponse = await axios.put(`http://localhost:8000/clientes/${usuario.id}`, atualizado);
        console.log("Dados atualizados no servidor:", putResponse.data);

        // Atualiza os dados no componente
        this.usuario = atualizado;

        // Define a data e hora do login atual
        this.dataHoraLogin = dataHoraAtual;
      } catch (error) {
        console.error("Erro ao registrar o login do usuário:", error);
        alert("Não foi possível registrar o login.");
      }
    },
  },
  mounted() {
    this.registrarLogin();
  },
};
</script>

<style>
.acesso-container {
  max-width: 600px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  text-align: center;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  text-align: left;
}

h2 {
  margin-bottom: 20px;
}

h3 {
  margin-top: 20px;
  margin-bottom: 10px;
}

p {
  font-size: 18px;
  margin-bottom: 10px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  font-size: 16px;
  padding: 5px;
  border-bottom: 1px solid #ccc;
}
</style>
