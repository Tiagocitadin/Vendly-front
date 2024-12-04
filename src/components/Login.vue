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
    if (!this.email || !this.password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      // Realizar a requisição GET com Axios
      const response = await axios.get("http://localhost:8000/clientes", {
        params: {
          email: this.email,
          password: this.password,
        },
      });
      const users = response.data;

      if (users.length > 0) {
        const user = users[0];
        // Salva o usuário no localStorage
        localStorage.setItem("usuarioLogado", JSON.stringify(user));
        this.$router.push("/"); 
        this.$emit("usuarioLogado", user); 
        window.location.href = "/";
      } else {
        alert("Email ou senha inválidos.");
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      alert("Erro ao conectar com o servidor. Tente novamente mais tarde.");
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
