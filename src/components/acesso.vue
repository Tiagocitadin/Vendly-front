<template>
  <div class="acesso-container">
    <h2>Relatório de Acessos</h2>
    <div v-if="usuario.id">
      <p><strong>Contagem de Acessos:</strong> {{ usuario.loginCount }}</p>
      <p><strong>Data e Hora do Login:</strong> {{ dataHoraLogin }}</p>
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
      },
      dataHoraLogin: "",
    };
  },
  methods: {
    async usuarioLogado() {
      try {
        // Recupera o ID do usuário logado no localStorage
        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
        console.log("Usuário logado recuperado:", usuarioLogado);

        if (!usuarioLogado || !usuarioLogado.id) {
          throw new Error("Usuário não está logado ou ID ausente.");
        }

        // Obtém os dados do usuário logado do JSON Server
        const response = await axios.get(`http://localhost:8000/clientes/${usuarioLogado.id}`);
        console.log("Dados do cliente recuperados:", response.data);

        const usuario = response.data;

        // Atualiza o contador de logins
        const atualizado = { ...usuario, loginCount: (usuario.loginCount || 0) + 1 };

        // Atualiza os dados no JSON Server
        const putResponse = await axios.put(`http://localhost:8000/clientes/${usuario.id}`, atualizado);
        console.log("Dados atualizados no servidor:", putResponse.data);

        // Atualiza os dados no componente
        this.usuario = atualizado;

        // Data e hora do login
        const now = new Date();
        this.dataHoraLogin = now.toLocaleString("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
        });
      } catch (error) {
        console.error("Erro ao buscar ou atualizar os dados do usuário:", error);
        alert("Não foi possível carregar as informações do usuário.");
      }
    },
  },
  mounted() {
    this.usuarioLogado();
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
}

h2 {
  margin-bottom: 20px;
}

p {
  font-size: 18px;
  margin-bottom: 10px;
}
</style>
