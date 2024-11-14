<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

  <div class="cadastro-container">
    <div class="header">
      <h4>Vendly - Cadastro Cliente</h4>
    </div>

    <div class="form-container">
      <form @submit.prevent="cadastrarOuEditarCliente">
        <div class="form-row">
          <div class="form-group half-width">
            <label for="nome">Nome <span>*</span></label>
            <input type="text" id="nome" v-model="cliente.nome" placeholder="Nome" required />
            <small v-if="errors.nome" class="error">{{ errors.nome }}</small>
          </div>

          <div class="form-group half-width">
            <label for="cpf">CPF <span>*</span></label>
            <input type="text" id="cpf" v-model="cliente.cpf" placeholder="000.000.000-00" @input="cliente.cpf = formataCpf(cliente.cpf)" required />
            <small v-if="errors.cpf" class="error">{{ errors.cpf }}</small>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group half-width">
            <label for="telefone">Telefone <span>*</span></label>
            <input type="text" id="telefone" v-model="cliente.telefone" placeholder="(XX)XXXXX-XXXX" @input="cliente.telefone = formataTelefone(cliente.telefone)" required />
            <small v-if="errors.telefone" class="error">{{ errors.telefone }}</small>
          </div>

          <div class="form-group half-width">
            <label for="email">Email <span>*</span></label>
            <input type="text" id="email" v-model="cliente.email" placeholder="Email" required />
            <small v-if="errors.email" class="error">{{ errors.email }}</small>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group half-width senha-container">
            <label for="senha">Senha <span>*</span></label>
            <div class="senha-wrapper">
              <input
                :type="mostrarSenha ? 'text' : 'password'"
                id="senha"
                v-model="cliente.senha"
                placeholder="Senha"
                required
              />
              <button type="button" class="toggle-senha" @click="toggleSenha">
                <i :class="mostrarSenha ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <small v-if="errors.senha" class="error">{{ errors.senha }}</small>
          </div>
        </div>

        <div class="action-buttons">
          <button class="submit-button" @click="cadastrarCliente">Cadastrar</button>
          <button class="edit-button" @click="editarCliente">Editar</button>
          <button class="delete-button" @click="excluirCliente">Excluir</button>
          <button class="cancel-button" @click="clearForm">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      cliente: {
        id: '',
        nome: '',
        cpf: '',
        email: '',
        senha: '',
        telefone: ''
      },
      mostrarSenha: false,
      errors: {},
      isEditing: false
    };
  },

  methods: {
    toggleSenha() {
      this.mostrarSenha = !this.mostrarSenha;
    },

    formataCpf(cpf) {
      return cpf.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2').slice(0, 14);
    },

    formataTelefone(telefone) {
      return telefone.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 15);
    },

    async cadastrarCliente() {
      if (!this.cliente.nome || !this.cliente.senha) {
        this.errors = {
          nome: !this.cliente.nome ? 'O nome é obrigatório' : '',
          senha: !this.cliente.senha ? 'A senha é obrigatória' : ''
        };
        return;
      }
      try {
        await axios.post('http://localhost:5500/clientes', this.cliente);
        alert('Cliente cadastrado com sucesso!');
        this.clearForm();
      } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
      }
    },

    async editarCliente() {
      if (!this.cliente.id) {
        alert('Nenhum cliente selecionado para edição.');
        return;
      }
      try {
        await axios.put(`http://localhost:5500/clientes/${this.cliente.id}`, this.cliente);
        alert('Cliente alterado com sucesso!');
        this.clearForm();
      } catch (error) {
        console.error('Erro ao editar cliente:', error);
      }
    },

    async excluirCliente() {
      if (!confirm('Tem certeza que deseja excluir este cliente?')) return;
      try {
        await axios.delete(`http://localhost:5500/clientes/${this.cliente.id}`);
        alert('Cliente excluído com sucesso!');
        this.clearForm();
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
      }
    },

    clearForm() {
      this.cliente = {
        id: '',
        nome: '',
        cpf: '',
        email: '',
        senha: '',
        telefone: ''
      };
      this.errors = {};
      this.isEditing = false;
    }
  }
};
</script>

<style scoped>

.cadastro-container {
  max-width: 400px; /* Define uma largura máxima menor */
  width: 90%; /* Ocupa 90% da largura da tela, mas respeita o max-width */
  margin: 0 auto; /* Centraliza o formulário */
  padding: 20px;
  border-radius: 10px;
  background-color: #f4f7f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.senha-container {
  position: relative;
}

.senha-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

/* Ajuste para foco no campo */
input[type="password"],
input[type="text"],
input[type="email"] {
  display: block;
  width: 100%; /* Define a largura fixa para ocupar todo o espaço disponível */
  max-width: 400px; /* Define um limite máximo de largura */
  padding-right: 40px; /* Espaço para o ícone de alternar senha */
  padding-left: 10px;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  color: #333;
  background-color: #fff;
  outline: none;
  transition: border-color 0.3s ease;
  box-sizing: border-box; /* Garante que o padding não altere o tamanho */
}

/* Ajuste para foco no campo */
input:focus {
  border-color: #007bff;
}

/* Estilo do botão de alternar senha */
.toggle-senha {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #555;
  padding: 0;
}

/* Estilo do ícone */
.toggle-senha i {
  pointer-events: none;
}

/* Mensagem de erro */
.error {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
}

/* Botões de ação */
button {
  padding: 10px 20px;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
}

.submit-button {
  background-color: #007bff;
  margin-left: 5px;
}

.edit-button {
  background-color: #3498db;
  margin-left: 5px;
}

.delete-button {
  background-color: #e74c3c;
  margin-left: 5px;
}

.cancel-button {
  background-color: #95a5a6;
  margin-left: 5px;
}

button:hover {
  opacity: 0.8;
}

</style>
