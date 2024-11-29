<template>
  <div class="cadastro-container">
    <div class="header">
      <h4>Vendly - Cadastro Cliente</h4>
    </div>

    <!-- Mensagem de Sucesso -->
    <div v-if="mensagemSucesso" class="mensagem-sucesso">
      <span>Cadastrado com sucesso!</span>
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
            <label for="email">Email <span>*</span></label>
            <input type="email" id="email" v-model="cliente.email" placeholder="Email" required />
            <small v-if="errors.email" class="error">{{ errors.email }}</small>
          </div>

          <div class="form-group half-width">
            <label for="senha">Senha <span>*</span></label>
            <div class="input-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="senha"
                v-model="cliente.senha"
                placeholder="Senha"
                minlength="6"
                required
              />
              <button type="button" class="toggle-password" @click="togglePassword">
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <small v-if="errors.senha" class="error">{{ errors.senha }}</small>
          </div>

          <div class="form-group half-width">
            <label for="cpf">CPF <span>*</span></label>
            <input
              type="text"
              id="cpf"
              v-model="cliente.cpf"
              placeholder="000.000.000-00"
              @input="cliente.cpf = formataCpf(cliente.cpf)"
              maxlength="14"
              required
            />
            <small v-if="errors.cpf" class="error">{{ errors.cpf }}</small>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group half-width">
            <label for="telefone">Telefone <span>*</span></label>
            <input
              type="text"
              id="telefone"
              v-model="cliente.telefone"
              placeholder="(XX)XXXXX-XXXX"
              @input="cliente.telefone = formataTelefone(cliente.telefone)"
              required
            />
            <small v-if="errors.telefone" class="error">{{ errors.telefone }}</small>
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
            <label for="numero">Número </label>
            <input type="text" id="numero" v-model="cliente.endereco.numero" placeholder="Número" />
          </div>

          <div class="form-group full-width">
            <label for="complemento">Complemento</label>
            <textarea
              id="complemento"
              v-model="cliente.endereco.complemento"
              placeholder="Digite..."
              rows="5"
            ></textarea>
          </div>
        </div>

        <div class="action-buttons">
          <button class="cancel-button" @click="voltarParaEtapaAnterior">Voltar</button>
          <button class="submit-button" type="submit">Cadastrar</button>
        </div>
      </form>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  data() {
    return {
      etapa: 1,
      mensagemSucesso: false,
      cliente: {
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
        },
      },
      errors: {},
      showPassword: false,
    };
  },
  methods: {
    async buscarEnderecoPorCep() {
      const cep = this.cliente.endereco.cep.replace(/\D/g, "");
      if (cep.length !== 8) {
        this.errors.cep = "CEP inválido";
        return;
      }
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (response.data.erro) {
          this.errors.cep = "CEP não encontrado";
        } else {
          this.cliente.endereco.rua = response.data.logradouro;
          this.cliente.endereco.bairro = response.data.bairro;
          this.cliente.endereco.cidade = response.data.localidade;
          this.cliente.endereco.estado = response.data.uf;
          this.errors.cep = "";
        }
      } catch (error) {
        this.errors.cep = "Erro ao buscar CEP";
        console.error(error);
      }
    },
    async finalizarCadastro() {
      try {
        await axios.post("http://localhost:8000/clientes", this.cliente);
        this.mensagemSucesso = true;
        setTimeout(() => (this.mensagemSucesso = false), 5000); // Oculta a mensagem após 5 segundos
        this.cliente = {
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
          },
        };
        this.etapa = 1;
      } catch (error) {
        console.error("Erro ao cadastrar:", error);
        alert("Erro ao cadastrar cliente");
      }
    },
    formataCpf(cpf) {
      return cpf
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    },
    formataTelefone(telefone) {
      return telefone
        .replace(/\D/g, "")
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .slice(0, 15);
    },
    irParaProximaEtapa() {
      this.errors = {
        nome: !this.cliente.nome ? "O nome é obrigatório" : "",
        email: !this.cliente.email ? "O email é obrigatório" : "",
        senha: !this.cliente.senha ? "A senha é obrigatória" : "",
        cpf: !this.cliente.cpf ? "O CPF é obrigatório" : "",
        telefone: !this.cliente.telefone ? "O telefone é obrigatório" : "",
      };
      if (Object.values(this.errors).some((error) => error)) return;
      this.errors = {};
      this.etapa = 2;
    },
    voltarParaEtapaAnterior() {
      this.etapa = 1;
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>
<style scoped>
.cadastro-container {
  max-width: 400px; /* Define uma largura máxima menor */
  width: 90%; /* Ocupa 90% da largura da tela, mas respeita o max-width */
  margin: 80px auto; /* Centraliza o formulário */
  padding: 20px;
  border-radius: 10px;
  background-color: #f4f7f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 150px;
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

/* Estilo para o campo de texto múltiplo */
textarea {
  display: block;
  width: 100%; /* Largura total */
  max-width: 400px; /* Define um limite máximo */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  color: #333;
  background-color: #fff;
  resize: none; /* Impede redimensionamento */
  outline: none;
  transition: border-color 0.3s ease;
  height: auto; /* Permite altura dinâmica */
}

/* Ajuste para foco no campo */
input:focus,
textarea:focus {
  border-color: #007bff;
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

.success-message {
  display: block;
  margin-top: 10px;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 5px;
  font-size: 14px;
  text-align: center;
}

.mensagem-sucesso {
  text-align: center;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 5px;
  font-size: 16px;
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Wrapper do campo e ícone */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

/* Campo de input */
.input-wrapper input {
  flex: 1; /* Ocupa todo o espaço disponível */
  padding-right: 40px; /* Espaço para o ícone */
}
/* Botão de alternar senha */
.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #555;
  padding: 0;
  transition: color 0.3s ease;
}

.toggle-password:hover {
  color: #007bff;
}

.toggle-password i {
  font-size: 18px;
}

/* Campo de input com espaçamento para o botão */
.input-wrapper input {
  flex: 1;
  padding-right: 40px;
}



</style>


