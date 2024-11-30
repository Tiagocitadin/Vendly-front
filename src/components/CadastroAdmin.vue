<template>
  <div class="admin-container">
    <h1>Cadastro de Administradores</h1>
    <form @submit.prevent="adicionarAdmin" class="admin-form">
      <label>
        Usuário:
        <input v-model="novoAdmin.usuario" type="text" required placeholder="Digite o nome de usuário" />
      </label>
      <label>
        Senha:
        <input v-model="novoAdmin.senha" type="password" required placeholder="Digite a senha" />
      </label>
      <button type="submit">Cadastrar</button>
    </form>

    <h2>Lista de Administradores</h2>
    <table class="admin-table" v-if="admins.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Usuário</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="admin in admins" :key="admin.id">
          <td>{{ admin.id }}</td>
          <td>{{ admin.usuario }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>Nenhum administrador cadastrado.</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      novoAdmin: {
        usuario: "",
        senha: "",
      },
      admins: [], // Lista de administradores cadastrados
    };
  },
  methods: {
    async carregarAdmins() {
      try {
        const response = await axios.get("http://localhost:8000/admins");
        this.admins = response.data;
      } catch (error) {
        console.error("Erro ao carregar administradores:", error);
        alert("Não foi possível carregar a lista de administradores.");
      }
    },
    async adicionarAdmin() {
      try {
        const response = await axios.post("http://localhost:8000/admins", {
          usuario: this.novoAdmin.usuario,
          senha: this.novoAdmin.senha,
        });

        this.admins.push(response.data);

        this.novoAdmin.usuario = "";
        this.novoAdmin.senha = "";

        alert("Administrador cadastrado com sucesso!");
      } catch (error) {
        console.error("Erro ao adicionar administrador:", error);
        alert("Não foi possível cadastrar o administrador.");
      }
    },
  },
  mounted() {
    this.carregarAdmins();
  },
};
</script>

<style>
.admin-container {
  max-width: 600px;
  margin: 50px auto;
  font-family: Arial, sans-serif;
  text-align: left;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;

}

h1,
h2 {
  text-align: center;
}

.admin-form {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 10px;
}

input {
  padding: 8px;
  margin-top: 5px;
  width: 100%;
  box-sizing: border-box;
}

button {
  margin-top: 10px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.admin-table th,
.admin-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.admin-table th {
  background-color: #f4f4f4;
}
</style>
