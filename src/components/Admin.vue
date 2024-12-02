<template>
  <div class="admin-container">
    <!-- Tela de Login -->
    <div v-if="!autenticado" class="login-form">
      <h1>Autenticação Administrativa</h1>
      <form @submit.prevent="validarUsuarioESenha">
        <label>
          Usuário:
          <input v-model="usuario" type="text" placeholder="Digite seu usuário" required />
        </label>
        <label>
          Senha:
          <input v-model="senha" type="password" placeholder="Digite a senha" required />
        </label>
        <button type="submit">Entrar</button>
      </form>
    </div>

    <!-- Painel Administrativo -->
    <div v-else>
      <h1>Painel Administrativo</h1>
      <p v-if="adminLogado.tipoAdmin === 'superadmin'">Você é um Super Admin!</p>
      <p v-else>Você é um Admin Regular.</p>

      <table class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.nome }}</td>
            <td>{{ user.email }}</td>
            <td>
              <button @click="editarUsuario(user)">Editar</button>
              <button @click="excluirUsuario(user.id)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="usuarioSelecionado" class="edit-form">
        <h2>Editar Usuário</h2>
        <form @submit.prevent="salvarEdicao">
          <label>
            Nome:
            <input v-model="usuarioSelecionado.nome" />
          </label>
          <label>
            Email:
            <input v-model="usuarioSelecionado.email" />
          </label>
          <button type="submit">Salvar</button>
          <button type="button" @click="cancelarEdicao">Cancelar</button>
        </form>
      </div>
    </div>
  </div>
</template>

  
  <script>
import axios from "axios";

export default {
  data() {
    return {
      usuario: "", // Usuário digitado
      senha: "", // Senha digitada
      autenticado: false, // Estado de autenticação
      adminLogado: null, // Administrador logado
      admins: [], // Lista de administradores cadastrados
      users: [], // Lista de usuários
      usuarioSelecionado: null, // Usuário em edição
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
    validarUsuarioESenha() {
      const admin = this.admins.find(
        (admin) => admin.usuario === this.usuario && admin.senha === this.senha
      );

      if (admin) {
        this.autenticado = true;
        this.adminLogado = admin; // Armazena os dados do admin logado
        alert(`Bem-vindo, ${admin.usuario}!`);
        if (admin.tipoAdmin === "superadmin") {
          this.$router.push("/superadmin-dashboard");
        } else {
          this.$router.push("/cadastroproduto");
        }
      } else {
        alert("Usuário ou senha incorretos.");
      }
    },
    async carregarUsuarios() {
      try {
        const response = await axios.get("http://localhost:8000/clientes");
        this.users = response.data;
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        alert("Não foi possível carregar os usuários.");
      }
    },
    editarUsuario(user) {
      this.usuarioSelecionado = { ...user }; // Clona os dados do usuário selecionado
    },
    async excluirUsuario(userId) {
      try {
        await axios.delete(`http://localhost:8000/clientes/${userId}`);
        this.users = this.users.filter((user) => user.id !== userId);
        alert("Usuário excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        alert("Não foi possível excluir o usuário.");
      }
    },
    async salvarEdicao() {
      try {
        const response = await axios.put(
          `http://localhost:8000/clientes/${this.usuarioSelecionado.id}`,
          this.usuarioSelecionado
        );
        const index = this.users.findIndex((user) => user.id === response.data.id);
        this.$set(this.users, index, response.data);
        alert("Usuário atualizado com sucesso!");
        this.usuarioSelecionado = null;
      } catch (error) {
        console.error("Erro ao salvar edição:", error);
        alert("Não foi possível salvar as alterações.");
      }
    },
    cancelarEdicao() {
      this.usuarioSelecionado = null; // Limpa o formulário de edição
    },
  },
  mounted() {
    this.carregarAdmins(); // Carrega os administradores ao montar o componente
  },
};
</script>

  
  <style>
  /* Estilos principais */
  .admin-container {
    max-width: 800px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
    text-align: left;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  
  h1 {
    text-align: center;
  }
  
  .login-form {
    text-align: center;
  }
  
  label {
    display: block;
    margin-bottom: 10px;
  }
  
  input {
    padding: 8px;
    margin-top: 5px;
    width: 100%;
  }
  
  button {
    margin-top: 10px;
    padding: 8px 12px;
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
    margin: 20px 0;
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
  