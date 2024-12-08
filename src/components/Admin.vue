<template>
  <div class="admin-container">
    <!-- Tela de Login -->
    <div v-if="!autenticado" class="login-form">
      <h1>Autenticação Administrativa</h1>
      <form @submit.prevent="validarUsuarioESenha">
        <div class="input-group">
          <label>Usuário:</label>
          <input v-model="usuario" type="text" placeholder="Digite seu usuário" required />
        </div>
        <div class="input-group">
          <label>Senha:</label>
          <div class="password-wrapper">
            <input
              v-model="senha"
              :type="mostrarSenha ? 'text' : 'password'"
              placeholder="Digite sua senha"
              required
            />
            <i
              :class="mostrarSenha ? 'fas fa-eye-slash' : 'fas fa-eye'"
              @click="toggleMostrarSenha"
              class="password-toggle"
              title="Mostrar/Esconder senha"
            ></i>
          </div>
        </div>
        <button type="submit" class="btn-login">Entrar</button>
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
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie"; // Importa a biblioteca js-cookie

export default {
  data() {
    return {
      usuario: "", // Campo para o nome de usuário
      senha: "", // Campo para a senha
      mostrarSenha: false, // Controle para exibir ou esconder senha
      autenticado: false, // Controle de autenticação
      adminLogado: null, // Informações do administrador logado
      admins: [], // Lista de administradores carregados do db.json
    };
  },
  created() {
    // Verifica se o cookie de login existe e autentica automaticamente
    const adminCookie = Cookies.get("adminLogado");
    if (adminCookie) {
      this.autenticado = true;
      this.adminLogado = JSON.parse(adminCookie); // Recupera os dados do cookie
    }
  },
  methods: {
    async validarUsuarioESenha() {
      try {
        const response = await axios.get("http://localhost:8000/admins");
        this.admins = response.data;

        const admin = this.admins.find(
          (admin) => admin.usuario === this.usuario && admin.senha === this.senha
        );

        if (admin) {
          this.autenticado = true;
          this.adminLogado = admin;
          Cookies.set("adminLogado", JSON.stringify(admin), { expires: 3 }); 
          this.$router.push("/cadastroproduto");
        } else {
          alert("Usuário ou senha incorretos!");
        }
      } catch (error) {
        console.error("Erro ao buscar administradores:", error);
        alert("Erro ao realizar login. Tente novamente mais tarde.");
      }
    },
    toggleMostrarSenha() {
      this.mostrarSenha = !this.mostrarSenha; // Alterna entre mostrar e esconder a senha
    },
  },
};
</script>

<style>
/* Estilos originais mantidos */
.admin-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  font-size: 1.8rem;
  color: #333333;
  margin-bottom: 20px;
}

/* Formulário */
.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-group {
  width: 100%;
  margin-bottom: 15px;
  text-align: left;
}

.input-group label {
  font-weight: bold;
  color: #555555;
  margin-bottom: 5px;
  display: block;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #007bff;
  outline: none;
}

/* Campo de senha */
.password-wrapper {
  position: relative;
  width: 100%;
}

.password-wrapper input {
  padding-right: 40px;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  font-size: 1.2rem;
  cursor: pointer;
  color: #666666;
}

.password-toggle:hover {
  color: #007bff;
}

/* Botão de login */
.btn-login {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  color: #ffffff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-login:hover {
  background-color: #0056b3;
}

.btn-login:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

/* Tabela Administrativa */
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
