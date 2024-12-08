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
  padding: 20px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h1,
h2 {
  text-align: center;
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 20px;
}

/* Formulários */
.admin-form,
.edit-form {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.admin-form label,
.edit-form label {
  display: block;
  font-weight: bold;
  color: #555;
  margin-bottom: 8px;
}

.admin-form input,
.edit-form input,
.admin-form select,
.edit-form select {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.admin-form input:focus,
.edit-form input:focus,
.admin-form select:focus,
.edit-form select:focus {
  border-color: #007bff;
  outline: none;
}

/* Campo de senha com ícone */
.password-container {
  position: relative;
  display: flex;
  align-items: center;
}

.password-container input {
  flex: 1;
  padding-right: 40px;
}

.password-container .toggle-password {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-60%); 
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #007bff;
  cursor: pointer;
  transition: color 0.3s ease;
}

.password-container .toggle-password:hover {
  color: #0056b3;
}

/* Botões */
button {
  padding: 12px 20px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

button:active {
  background-color: #003f7f;
  transform: scale(0.95);
}

button.cancelar {
  background-color: #dc3545;
  margin-left: 10px;
}

button.cancelar:hover {
  background-color: #a71d2a;
}

button.cancelar:active {
  transform: scale(0.95);
}

/* Tabela de administradores */
.admin-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.admin-table th,
.admin-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
  font-size: 0.9rem;
}

.admin-table th {
  background-color: #f4f4f4;
  font-weight: bold;
  color: #555;
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

/* Responsividade */
@media (max-width: 768px) {
  .admin-container {
    padding: 15px;
  }

  .admin-form,
  .edit-form {
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
