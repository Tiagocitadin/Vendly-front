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
        <div class="password-container">
          <input
            v-model="novoAdmin.senha"
            :type="senhaVisivelNovo ? 'text' : 'password'"
            required
            placeholder="Digite a senha"
          />
          <button
            type="button"
            class="toggle-password"
            @click="senhaVisivelNovo = !senhaVisivelNovo"
          >
            <i :class="senhaVisivelNovo ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
      </label>
      <label>
        Tipo de Admin:
        <select v-model="novoAdmin.tipoAdmin" required>
          <option value="superadmin">Super Admin</option>
          <option value="admin">Admin</option>
        </select>
      </label>
      <button type="submit">Cadastrar</button>
    </form>

    <h2>Lista de Administradores</h2>
    <table class="admin-table" v-if="admins.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Usuário</th>
          <th>Tipo</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="admin in admins" :key="admin.id">
          <td>{{ admin.id }}</td>
          <td>{{ admin.usuario }}</td>
          <td>{{ admin.tipoAdmin }}</td>
          <td>
            <button @click="editarAdmin(admin)">Editar</button>
            <button @click="excluirAdmin(admin.id)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>Nenhum administrador cadastrado.</p>

    <!-- Formulário de edição -->
    <div v-if="adminSelecionado" class="edit-form">
      <h2>Editar Administrador</h2>
      <form @submit.prevent="salvarEdicao">
        <label>
          Usuário:
          <input v-model="adminSelecionado.usuario" type="text" required />
        </label>
        <label>
          Senha:
          <div class="password-container">
            <input
              v-model="adminSelecionado.senha"
              :type="senhaVisivelSelecionado ? 'text' : 'password'"
              required
            />
            <button
              type="button"
              class="toggle-password"
              @click="senhaVisivelSelecionado = !senhaVisivelSelecionado"
            >
              <i :class="senhaVisivelSelecionado ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </label>
        <label>
          Tipo de Admin:
          <select v-model="adminSelecionado.tipoAdmin" required>
            <option value="superadmin">Super Admin</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <button type="submit">Salvar</button>
        <button type="button" @click="cancelarEdicao">Cancelar</button>
      </form>
    </div>
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
        tipoAdmin: "admin", // Valor padrão
      },
      senhaVisivelNovo: false, // Controle da visibilidade da senha no formulário de cadastro
      senhaVisivelSelecionado: false, // Controle da visibilidade da senha no formulário de edição
      admins: [], // Lista de administradores cadastrados
      adminSelecionado: null, // Administrador em edição
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
          tipoAdmin: this.novoAdmin.tipoAdmin,
        });

        this.admins.push(response.data);

        this.novoAdmin.usuario = "";
        this.novoAdmin.senha = "";
        this.novoAdmin.tipoAdmin = "admin"; // Reseta o tipo para o valor padrão
        this.senhaVisivelNovo = false;

        alert("Administrador cadastrado com sucesso!");
      } catch (error) {
        console.error("Erro ao adicionar administrador:", error);
        alert("Não foi possível cadastrar o administrador.");
      }
    },
    editarAdmin(admin) {
      this.adminSelecionado = { ...admin }; // Clona os dados do administrador selecionado
      this.senhaVisivelSelecionado = false; // Reseta a visibilidade da senha
    },
    async salvarEdicao() {
  try {
    // Verifique o ID do administrador selecionado
    const adminId = this.adminSelecionado.id;

    // Faça a requisição PUT para atualizar o administrador na API
    const response = await axios.put(
      `http://localhost:8000/admins/${adminId}`, // Certifique-se de que a rota está correta
      {
        usuario: this.adminSelecionado.usuario,
        senha: this.adminSelecionado.senha,
        tipoAdmin: this.adminSelecionado.tipoAdmin,
      }
    );

    // Atualize o administrador na lista local
    const index = this.admins.findIndex((admin) => admin.id === adminId);
    if (index !== -1) {
      this.$set(this.admins, index, response.data);
    }

    // Mensagem de sucesso
    alert("Administrador atualizado com sucesso!");
    this.adminSelecionado = null; // Limpa o formulário de edição
  } catch (error) {
    console.error("Erro ao salvar edição:", error);
    alert("Não foi possível salvar as alterações.");
  }
},

    cancelarEdicao() {
      this.adminSelecionado = null; // Cancela a edição
    },
    async excluirAdmin(adminId) {
      try {
        await axios.delete(`http://localhost:8000/admins/${adminId}`);
        this.admins = this.admins.filter((admin) => admin.id !== adminId);
        alert("Administrador excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir administrador:", error);
        alert("Não foi possível excluir o administrador.");
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
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1,
h2 {
  text-align: center;
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.admin-form,
.edit-form {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.password-container {
  display: flex;
  align-items: center;
  position: relative;
}

.password-container {
  display: flex;
  align-items: center;
  position: relative;
}

.password-container input {
  flex: 1;
  padding-right: 40px; /* Espaço para o botão de alternar senha */
}

.password-container .toggle-password {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem; /* Tamanho do ícone */
  color: #007bff;
  transition: color 0.3s ease;
}

.password-container .toggle-password:hover {
  color: #0056b3;
}


button {
  margin-top: 10px;
  padding: 10px 20px; /* Ajuste para mais espaçamento interno */
  background-color: #007bff; /* Azul padrão */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem; /* Tamanho consistente */
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
  background-color: #0056b3; /* Azul mais escuro no hover */
  transform: scale(1.05); /* Leve aumento no hover */
}

button:active {
  background-color: #003f7f; /* Azul ainda mais escuro no clique */
  transform: scale(0.95); /* Leve redução ao clicar */
}

button.cancelar {
  background-color: #dc3545; /* Vermelho para o botão Cancelar */
  margin-left: 10px; /* Espaçamento entre Salvar e Cancelar */
}

button.cancelar:hover {
  background-color: #a71d2a; /* Vermelho mais escuro no hover */
}

.edit-form button {
  display: inline-block; /* Os botões ficam alinhados na horizontal */
  margin-right: 10px; /* Espaçamento entre os botões */
}

button.cancelar:active {
  transform: scale(0.95);
}

.admin-table td button {
  margin-right: 5px;
  padding: 5px 10px;
  font-size: 0.85rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.admin-table td button:first-child {
  background-color: #007bff;
}

.admin-table td button:first-child:hover {
  background-color: #0056b3;
}

.admin-table td button:last-child {
  background-color: #dc3545;
}

.admin-table td button:last-child:hover {
  background-color: #a71d2a;
}

.admin-table td {
  text-align: center;
}

@media (max-width: 768px) {
  .admin-container {
    padding: 10px;
  }

  button {
    width: 100%;
  }

  .admin-table th,
  .admin-table td {
    font-size: 0.8rem;
    padding: 8px;
  }
}
</style>
