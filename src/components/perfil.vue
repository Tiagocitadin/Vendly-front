<template>
<template>
  <div class="perfil-container">
    <h2>Perfil do Usuário</h2>

    <form @submit.prevent="atualizarPerfil" class="perfil-form">
      <div class="form-group">
        <label for="nome">Nome</label>
        <input
          type="text"
          id="nome"
          v-model="usuario.nome"
          placeholder="Digite seu nome"
          required
        />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="usuario.email"
          placeholder="Digite seu email"
          required
        />
      </div>

      <div class="form-group">
        <label for="senha">Senha</label>
        <input
          type="password"
          id="senha"
          v-model="usuario.senha"
          placeholder="Digite sua senha"
        />
      </div>

      <div class="form-group">
        <button type="submit" class="btn-atualizar">Atualizar Perfil</button>
      </div>
    </form>

    <div class="form-group">
      <button @click="excluirConta" class="btn-excluir">Excluir Conta</button>
    </div>
  </div>
</template>

  </template>
  
  <script>
import axios from "axios";

export default {
  data() {
    return {
      usuario: {
        id: null,
        nome: "",
        email: "",
        senha: "",
      },
    };
  },

  created() {
    const userId = this.getUsuarioLogadoId(); // Obtém o ID do usuário logado
    if (userId) {
      this.carregarDadosUsuario(userId); // Carrega os dados do usuário
    } else {
      alert("Usuário não autenticado.");
      this.$router.push("/login"); // Redireciona para a página de login
    }
  },

  methods: {
    // Obtém o ID do usuário logado do localStorage
    getUsuarioLogadoId() {
      const usuarioLogado = localStorage.getItem("usuarioLogado");
      return usuarioLogado ? JSON.parse(usuarioLogado).id : null;
    },

    // Carrega os dados do usuário do db.json
    async carregarDadosUsuario(userId) {
      try {
        const response = await axios.get(
          `http://localhost:8000/clientes/${userId}`
        );
        this.usuario = response.data; // Preenche os dados no formulário
      } catch (error) {
        console.error("Erro ao carregar os dados do usuário:", error);
        alert("Erro ao carregar os dados do usuário.");
      }
    },

    // Atualiza os dados do perfil no db.json
    async atualizarPerfil() {
      try {
        await axios.put(
          `http://localhost:8000/clientes/${this.usuario.id}`,
          this.usuario
        );
        alert("Perfil atualizado com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar o perfil:", error);
        alert("Erro ao atualizar o perfil.");
      }
    },

    // Exclui o perfil do usuário no db.json
    async excluirConta() {
      if (confirm("Tem certeza de que deseja excluir sua conta?")) {
        try {
          await axios.delete(
            `http://localhost:8000/clientes/${this.usuario.id}`
          );
          alert("Conta excluída com sucesso!");
          localStorage.removeItem("usuarioLogado"); // Remove os dados do usuário do localStorage
          this.$router.push("/login"); // Redireciona para o login
        } catch (error) {
          console.error("Erro ao excluir a conta:", error);
          alert("Erro ao excluir a conta.");
        }
      }
    },
  },
};
</script>

  
  <style>
  .perfil-container {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    background: #f7f7f7;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
  }
  
  button {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
  }
  
  .btn-atualizar {
    background-color: #007bff;
    color: white;
  }
  
  .btn-atualizar:hover {
    background-color: #0056b3;
  }
  
  .btn-excluir {
    background-color: #ff4d4d;
    color: white;
  }
  
  .btn-excluir:hover {
    background-color: #e60000;
  }
  </style>
  