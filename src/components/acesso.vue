<template>
  <div class="acesso-container">
    <h1>Olá, {{ usuario.nome }}!</h1>
    <h2>Relatório de Acessos</h2>
    <div v-if="usuario.id">
      <p><strong>Contagem de Acessos:</strong> {{ usuario.loginCount }}</p>
      <p><strong>Data e Hora do Último Login:</strong> {{ dataHoraLogin }}</p>
      <p><strong>IP do Último Acesso:</strong> {{ ip }}</p>
      <h2>Histórico de Acessos</h2>
      <button @click="limparHistorico" class="limpar-historico-button">Limpar Histórico</button>
      <table class="historico-tabela" v-if="usuario.acessos.length">
        <thead>
          <tr>
            <th>Data</th>
            <th>Hora</th>
            <th>IP</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(acesso, index) in usuario.acessos.slice().reverse()" :key="index">
            <td>{{ acesso.data }}</td>
            <td>{{ acesso.hora }}</td>
            <td>{{ acesso.ip }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else>Não há histórico para exibir.</p>
    </div>
    <p v-else>Faça Login...</p>
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
        acessos: [],
      },
      dataHoraLogin: "",
      ip: "",
    };
  },
  methods: {
    async obterIp() {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        return response.data.ip;
      } catch (error) {
        console.error("Erro ao obter o IP do cliente:", error);
        return "Desconhecido";
      }
    },
    async registrarLogin() {
      try {
        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

        if (!usuarioLogado || !usuarioLogado.id) {
          throw new Error("Usuário não está logado ou ID ausente.");
        }

        this.ip = await this.obterIp();

        const response = await axios.get(`http://localhost:8000/clientes/${usuarioLogado.id}`);
        const usuario = response.data;

        const now = new Date();
        const dataHoraAtual = now.toLocaleString("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
        });

        const atualizado = {
          ...usuario,
          loginCount: usuario.loginCount + 1,
          acessos: [
            ...(usuario.acessos || []),
            {
              data: now.toLocaleDateString("pt-BR"),
              hora: now.toLocaleTimeString("pt-BR"),
              ip: this.ip,
            },
          ],
        };

        await axios.put(`http://localhost:8000/clientes/${usuario.id}`, atualizado);

        this.usuario = atualizado;
        this.dataHoraLogin = dataHoraAtual;
      } catch (error) {
        console.error("Erro ao registrar o login do usuário:", error);
        alert("Não foi possível registrar o login.");
      }
    },
    async limparHistorico() {
      try {
        if (!this.usuario.id) return;

        // Atualiza o histórico de acessos para vazio no servidor
        const atualizado = {
          ...this.usuario,
          acessos: [],
        };

        await axios.put(`http://localhost:8000/clientes/${this.usuario.id}`, atualizado);

        // Atualiza o estado local
        this.usuario.acessos = [];
        alert("Histórico de acessos limpo com sucesso.");
      } catch (error) {
        console.error("Erro ao limpar o histórico:", error);
        alert("Não foi possível limpar o histórico.");
      }
    },
  },
  async mounted() {
    await this.registrarLogin();
  },
};
</script>

<style lang="scss" scoped>

.acesso-container {
  max-width: 600px;
  margin: 50px auto;
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

.historico-tabela {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.historico-tabela th,
.historico-tabela td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

.historico-tabela th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.historico-tabela tr:nth-child(even) {
  background-color: #f9f9f9;
}

.limpar-historico-button {
  background-color: #ff5c5c;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 20px; 
  float: right;
}

.limpar-historico-button:hover {
  background-color: #e53935;
}

</style>
