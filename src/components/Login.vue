<template>
  <div class="login-page">

    <div class="login">
      <h4>Vendly - Login</h4>
    </div>

    <!-- Formulário de Login -->
    <div class="login-container">
      <h2>Entre na sua conta</h2>

      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" placeholder="Digite seu email" required />
        </div>

        <div class="input-group">
          <label for="password">Senha:</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Digite sua senha"
            required
          />
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
import Cookies from "js-cookie"; // Importa a biblioteca js-cookie

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      autenticado: false,
      clienteLogado: null,
    };
  },
  created() {
    // Verifica se o cookie de login existe e autentica automaticamente
    const clienteToken = Cookies.get("clienteToken");
    if (clienteToken) {
      // Se o token estiver presente, redireciona para a página principal
      this.$router.push("/");
    }
  },
  methods: {
    async handleLogin() {
  if (!this.email || !this.password) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  try {
    // Requisição ao endpoint para autenticar o cliente
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API_BASE_URL}/api/clientes/login`,
      {
        email: this.email,
        senha: this.password,
      },
      {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const token = response.data.token;
    const cliente = response.data.user; // Acessa o usuário da resposta

    if (token) {
      // Cliente autenticado com sucesso
      this.autenticado = true;
      this.clienteLogado = cliente; // Personalize conforme necessário
      Cookies.set("clienteToken", token, { expires: 3, secure: true });
      Cookies.set("clienteNome", cliente.nome, { expires: 3, secure: true }); // Salvando o nome corretamente

      this.$router.push("/"); // Redireciona para a página inicial
    } else {
      alert("Falha na autenticação. Tente novamente!");
    }
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    alert("Email ou senha inválidos.");
  }
},
  },
};
</script>

<style scoped>
/* Estilos permanecem os mesmos */
.login-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
  font-family: "Arial", sans-serif;
}

.login h4 {
  font-size: 28px;
  color: #333;
  font-weight: bold;
  text-align: center;
}

.login-container {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
  margin-bottom: 150px;
}

.login-container h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 30px;
  font-weight: bold;
}

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
</style>
