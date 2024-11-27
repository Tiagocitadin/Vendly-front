<template>
  <div class="login-page">
    <!-- Cabeçalho -->
    <div class="login">
      <h4>Vendly - Login</h4>
    </div>

    <!-- Formulário de Login -->
    <div class="login-container">
      <h2>Entre na sua conta</h2>

      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required />
        </div>

        <div class="input-group">
          <label for="password">Senha:</label>
          <input type="password" id="password" v-model="password" required />
        </div>

        <button type="submit">Entrar</button>
      </form>

      <p class="register-link">
        Não tem uma conta? <router-link to="/cadastrocliente">Cadastre-se aqui</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        // Busca os usuários no db.json
        const response = await axios.get("http://localhost:8000/clientes");
        const usuarios = response.data;

        // Verifica se o email e senha correspondem a algum registro
        const usuario = usuarios.find(
          (user) => user.email === this.email && user.senha === this.password
        );

        if (usuario) {
          // Incrementa o contador de logins
          const loginCount = (usuario.loginCount || 0) + 1;
          const atualizado = { ...usuario, loginCount };

          // Atualiza o cliente no JSON Server
          await axios.put(`http://localhost:8000/clientes/${usuario.id}`, atualizado);

          // Armazena o usuário logado no localStorage
          localStorage.setItem("usuarioLogado", JSON.stringify(atualizado));
          window.location.href = 'this.$router.push("/")';           
         
        } else {
          alert("Email ou senha inválidos.");
        }
      } catch (error) {
        console.error("Erro ao buscar ou atualizar os usuários:", error);
        alert("Erro ao realizar o login. Tente novamente.");
      }
    },
  },
};
</script>

<style scoped>
/* Adicione os estilos existentes aqui */
</style>


<style scoped>
/* Página de login */
.login-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
  font-family: "Arial", sans-serif;
  position: relative;
}

/* Estilização do cabeçalho */
.login {
  text-align: center;
  margin-bottom: 20px;
}

.login h4 {
  font-size: 28px;
  color: #333;
  font-weight: bold;
  margin: 0;
  top: 10%;
  text-align: center;
}

/* Container de login */
.login-container {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
  z-index: 1;
  position: relative;
  margin-bottom: 150px;
}

.login-container h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 30px;
  font-weight: bold;
}

/* Grupo de inputs */
.input-group {
  margin-bottom: 20px;
  text-align: left;
}

.input-group label {
  display: block;
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
  font-weight: bold;
}

.input-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s;
}

.input-group input:focus {
  border-color: #5c6bc0;
}

/* Botão de login */
button[type="submit"] {
  width: 100%;
  padding: 14px;
  background-color: #5c6bc0;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
  background-color: #3b4cb8;
}

/* Link de cadastro */
.register-link {
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.register-link a {
  color: #5c6bc0;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

/* Botão de cadastro de produto */
.product-add {
  margin-top: 20px;
}

.btn-add-product {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-add-product:hover {
  background-color: #218838;
}
</style>
