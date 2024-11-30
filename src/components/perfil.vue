<template>
  <div class="perfil-container">
    <h2>Perfil do Usuário</h2>

    <!-- Exibe as informações do usuário em uma lista -->
    <ul class="perfil-detalhes">
      <li><strong>Nome:</strong> {{ usuario.nome }}</li>
      <li><strong>Email:</strong> {{ usuario.email }}</li>
      <li><strong>CPF:</strong> {{ usuario.cpf }}</li>
      <li><strong>Telefone:</strong> {{ usuario.telefone }}</li>
      <li><strong>CEP:</strong> {{ usuario.endereco.cep }}</li>
      <li><strong>Endereço:</strong> 
        {{ usuario.endereco.rua }}, {{ usuario.endereco.numero }} - 
        {{ usuario.endereco.bairro }}, {{ usuario.endereco.cidade }}/{{ usuario.endereco.estado }}
      </li>
      <li><strong>Complemento:</strong> {{ usuario.endereco.complemento }}</li>      
    </ul>

    <!-- Botões para alterar ou excluir -->
    <div class="botoes">
      <button @click="modoEdicao = !modoEdicao" class="btn-editar">
        {{ modoEdicao ? "Cancelar" : "Editar Perfil" }}
      </button>
      <button @click="excluirConta" class="btn-excluir">Excluir Conta</button>
    </div>

    <!-- Formulário para editar os dados -->
    <form v-if="modoEdicao" @submit.prevent="atualizarPerfil" class="perfil-form">
      <div class="form-group">
        <label for="nome">Nome</label>
        <input type="text" id="nome" v-model="usuario.nome" required />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="usuario.email" required />
      </div>

      <div class="form-group">
        <label for="telefone">Telefone</label>
        <input type="text" id="telefone" v-model="usuario.telefone" required />
      </div>

      <div class="form-group">
        <label for="cpf">CPF</label>
        <input type="text" id="cpf" v-model="usuario.cpf" required />
      </div>

      <div class="form-group">
        <label for="cep">CEP</label>
        <input type="text" id="cep" v-model="usuario.endereco.cep" required/>
      </div>

      <div class="form-group">
        <label for="rua">Rua</label>
        <input type="text" id="rua" v-model="usuario.endereco.rua" required />
      </div>

      <div class="form-group">
        <label for="numero">Número</label>
        <input type="text" id="numero" v-model="usuario.endereco.numero"  />
      </div>

      <div class="form-group">
        <label for="bairro">Bairro</label>
        <input type="text" id="bairro" v-model="usuario.endereco.bairro" required />
      </div>

      <div class="form-group">
        <label for="cidade">Cidade</label>
        <input type="text" id="cidade" v-model="usuario.endereco.cidade" required />
      </div>

      <div class="form-group">
        <label for="estado">Estado</label>
        <input type="text" id="estado" v-model="usuario.endereco.estado" required />
      </div>

      <div class="form-group">
        <label for="complemento">Complemento</label>
        <input type="text" id="complemento" v-model="usuario.endereco.complemento" />
      </div>

      <div class="form-group">
        <button type="submit" class="btn-atualizar">Salvar Alterações</button>
      </div>
    </form>
  </div>
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
        cpf: "",
        telefone: "",
        endereco: {
          cep: "",
          rua: "",
          bairro: "",
          cidade: "",
          estado: "",
          numero: "",
          complemento: ""       
        },
      },
      modoEdicao: false, // Controla se o formulário de edição está visível
    };
  },

  created() {
    const userId = this.getUsuarioLogadoId();
    if (userId) {
      this.carregarDadosUsuario(userId);
    } else {
      alert("Usuário não autenticado.");
      this.$router.push("/login");
    }
  },

  methods: {
    getUsuarioLogadoId() {
      const usuarioLogado = localStorage.getItem("usuarioLogado");
      return usuarioLogado ? JSON.parse(usuarioLogado).id : null;
    },

    async carregarDadosUsuario(userId) {
      try {
        const response = await axios.get(
          `http://localhost:8000/clientes/${userId}`
        );
        this.usuario = response.data;
      } catch (error) {
        console.error("Erro ao carregar os dados do usuário:", error);
        alert("Erro ao carregar os dados do usuário.");
      }
    },

    async atualizarPerfil() {
      try {
        await axios.put(
          `http://localhost:8000/clientes/${this.usuario.id}`,
          this.usuario
        );
        alert("Perfil atualizado com sucesso!");
        this.modoEdicao = false;
      } catch (error) {
        console.error("Erro ao atualizar o perfil:", error);
        alert("Erro ao atualizar o perfil.");
      }
    },

    async excluirConta() {
      if (confirm("Tem certeza de que deseja excluir sua conta?")) {
        try {
          await axios.delete(
            `http://localhost:8000/clientes/${this.usuario.id}`
          );
          alert("Conta excluída com sucesso!");
          localStorage.removeItem("usuarioLogado");
          this.$router.push("/login");
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
/* Estilo básico */
.perfil-container {
  max-width: 600px;
  margin: 170px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.perfil-detalhes {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
}

.perfil-detalhes li {
  margin-bottom: 10px;
}

.botoes {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-editar,
.btn-atualizar {
  background-color: #007bff;
  color: white;
}

.btn-editar:hover,
.btn-atualizar:hover {
  background-color: #0056b3; /* Cor de fundo mais escura ao passar o mouse */
} 

.btn-excluir {
  background-color: #dc3545;
  color: white;
}

.perfil-form {
  margin-top: 20px;
}
</style>
