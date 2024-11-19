<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
 

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

  <div class="cadastro-container">
    <div class="header">
      <h4>Vendly - Cadastro Cliente</h4>
    </div>

    <!-- Etapa 1: Dados Básicos -->
    <div class="form-container" v-if="etapa === 1">
      <form @submit.prevent="irParaProximaEtapa">
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

        <div class="action-buttons">
          <button class="submit-button" type="submit">Próximo</button>
        </div>
      </form>
    </div>

    <!-- Etapa 2: Endereço -->
    <div class="form-container" v-else-if="etapa === 2">
      <form @submit.prevent="finalizarCadastro">
        <div class="form-row">
          <div class="form-group half-width">
            <label for="cep">CEP <span>*</span></label>
            <input
              type="text"
              id="cep"
              v-model="cliente.endereco.cep"
              placeholder="00000-000"
              maxlength="9"
              @blur="buscarEnderecoPorCep"
              required
            />
            <small v-if="errors.cep" class="error">{{ errors.cep }}</small>
          </div>

          <div class="form-group half-width">
            <label for="rua">Rua <span>*</span></label>
            <input type="text" id="rua" v-model="cliente.endereco.rua" placeholder="Rua" required />
            <small v-if="errors.rua" class="error">{{ errors.rua }}</small>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group half-width">
            <label for="bairro">Bairro <span>*</span></label>
            <input type="text" id="bairro" v-model="cliente.endereco.bairro" placeholder="Bairro" required />
            <small v-if="errors.bairro" class="error">{{ errors.bairro }}</small>
          </div>

          <div class="form-group half-width">
            <label for="cidade">Cidade <span>*</span></label>
            <input type="text" id="cidade" v-model="cliente.endereco.cidade" placeholder="Cidade" required />
            <small v-if="errors.cidade" class="error">{{ errors.cidade }}</small>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group half-width">
            <label for="estado">Estado <span>*</span></label>
            <input type="text" id="estado" v-model="cliente.endereco.estado" placeholder="Estado" required />
            <small v-if="errors.estado" class="error">{{ errors.estado }}</small>
          </div>
          <div class="form-group half-width">
            <label for="numero">Número <span>*</span></label>
            <input type="text" id="numero" v-model="cliente.endereco.numero" placeholder="Número" required />
            <small v-if="errors.numero" class="error">{{ errors.numero }}</small>
          </div>
        </div>

        <div class="action-buttons">
          <button class="cancel-button" @click="voltarParaEtapaAnterior">Voltar</button>
          <button class="submit-button" type="submit">Finalizar</button>
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
      etapa: 1,
      cliente: {
        id: '',
        nome: '',
        cpf: '',
        email: '',
        senha: '',
        telefone: '',
        endereco: {
          rua: '',
          numero: '',
          bairro: '',
          cidade: '',
          estado: '',
          cep: ''
        }
      },
      errors: {},
    };
  },

  methods: {
    async buscarEnderecoPorCep() {
      if (!this.cliente.endereco.cep || this.cliente.endereco.cep.length < 8) {
        this.errors.cep = "CEP inválido ou incompleto";
        return;
      }

      try {
        const response = await axios.get(`https://viacep.com.br/ws/${this.cliente.endereco.cep}/json/`);
        if (response.data.erro) {
          this.errors.cep = "CEP não encontrado";
          return;
        }

        this.cliente.endereco.rua = response.data.logradouro;
        this.cliente.endereco.bairro = response.data.bairro;
        this.cliente.endereco.cidade = response.data.localidade;
        this.cliente.endereco.estado = response.data.uf;
        this.errors.cep = ""; // Limpa o erro
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        this.errors.cep = "Erro ao buscar CEP";
      }
    },

    irParaProximaEtapa() {
      if (!this.cliente.nome || !this.cliente.cpf || !this.cliente.email || !this.cliente.telefone) {
        this.errors = {
          nome: !this.cliente.nome ? 'O nome é obrigatório' : '',
          cpf: !this.cliente.cpf ? 'O CPF é obrigatório' : '',
          email: !this.cliente.email ? 'O email é obrigatório' : '',
          telefone: !this.cliente.telefone ? 'O telefone é obrigatório' : ''
        };
        return;
      }
      this.errors = {};
      this.etapa = 2;
    },

    formataCpf(cpf) {
      return cpf.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2').slice(0, 14);
    },

    formataTelefone(telefone) {
      return telefone.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 15);
    },

    voltarParaEtapaAnterior() {
      this.etapa = 1;
    },

    async finalizarCadastro() {
      if (!this.cliente.endereco.rua || !this.cliente.endereco.numero || !this.cliente.endereco.bairro || !this.cliente.endereco.cidade || !this.cliente.endereco.estado || !this.cliente.endereco.cep) {
        this.errors = {
          rua: !this.cliente.endereco.rua ? 'A rua é obrigatória' : '',
          numero: !this.cliente.endereco.numero ? 'O número é obrigatório' : '',
          bairro: !this.cliente.endereco.bairro ? 'O bairro é obrigatório' : '',
          cidade: !this.cliente.endereco.cidade ? 'A cidade é obrigatória' : '',
          estado: !this.cliente.endereco.estado ? 'O estado é obrigatório' : '',
          cep: !this.cliente.endereco.cep ? 'O CEP é obrigatório' : ''
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

    clearForm() {
      this.cliente = {
        id: '',
        nome: '',
        cpf: '',
        email: '',
        senha: '',
        telefone: '',
        endereco: {
          rua: '',
          numero: '',
          bairro: '',
          cidade: '',
          estado: '',
          cep: ''
        }
      };
      this.errors = {};
      this.etapa = 1;
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
