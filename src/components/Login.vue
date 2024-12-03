<template>
  <div class="login-container">
    <div class="header">
      <h4>Vendly - Login</h4>
    </div>

    <div class="form-wrapper">
      <h2>Entre na sua conta</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email <span>*</span></label>
          <input type="email" id="email" v-model="email" placeholder="Email" required />
        </div>
        <div class="form-group">
          <label for="password">Senha <span>*</span></label>
          <div class="input-wrapper">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              placeholder="Senha"
              required
            />
            <button type="button" class="toggle-password" @click="togglePassword">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>
        <button type="submit" class="submit-button">Entrar</button>
      </form>
      <p class="register-link">
        Não tem uma conta? <router-link to="/cadastrocliente">Cadastre-se aqui</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    handleLogin() {
      // Lógica para realizar o login
      console.log("Logando com:", this.email, this.password);
    },
  },
};
</script>

<style scoped>
/* Estilo principal */
.login-container {
  max-width: 400px;
  width: 90%;
  margin: 80px auto;
  padding: 20px;
  border-radius: 10px;
  background-color: #f4f7f9; /* Fundo igual ao cadastro */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Cabeçalho */
.header h4 {
  font-size: 24px;
  color: #007bff; /* Azul padrão */
  margin-bottom: 20px;
}

/* Formulário */
h2 {
  font-size: 20px;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #007bff;
}

/* Botão de alternar senha */
.input-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #333;
}

.toggle-password:hover {
  color: #007bff;
}

/* Botão de envio */
.submit-button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #0056b3;
}

/* Link de registro */
.register-link {
  margin-top: 15px;
  font-size: 14px;
  color: #666;
}

.register-link a {
  color: #007bff;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
