<template>
  <div>
    <div id="nav">
      <nav>
        <ul class="nav-links">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/produto">Produtos</router-link></li>
          <li class="carrinho-link">
            <router-link to="/carrinho">
              <div class="carrinho-icon">
                <img src="/assets/carrinho-de-compras (1).png" alt="Carrinho de compra" />
                <span class="cart-count" v-if="produtosCarrinho.length > 0">
                  {{ produtosCarrinho.length }}
                </span>
              </div>
            </router-link>
          </li>
        </ul>

        <div class="user-controls">
          <span v-if="usuarioLogado" class="usuario-nome">Olá, {{ usuarioNome }}</span>
          <router-link v-else to="/login" class="login-nav">Login</router-link>

          <div class="user-buttons" v-if="usuarioLogado">
            <img
              src="/assets/perfil.png"
              alt="Perfil"
              class="btn-profile"
              @click="irParaPerfil"
              title="Perfil"
            />
            <img
              src="/assets/acesso.png"
              alt="Acesso"
              class="btn-profile"
              @click="irParaAcesso"
              title="Acesso"
            />
            <button @click="logout" class="logout-button" title="Sair">Sair</button>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import axios from "axios";

export default {
  props: {
    isDarkMode: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      produtos: [],
      usuarioLogado: null,
      usuarioNome: null,
    };
  },
  computed: {
    produtosCarrinho() {
      return this.$store.state.produtosCarrinho || [];
    },
  },
  created() {
    const clienteCookie = Cookies.get("clienteToken");
    const clienteNomeCookie = Cookies.get("clienteNome");

    if (clienteCookie) {
      this.usuarioLogado = { token: clienteCookie };
    }
    if (clienteNomeCookie) {
      this.usuarioNome = clienteNomeCookie;
    }

    const savedTheme = localStorage.getItem("isDarkMode");
    if (savedTheme === "true") {
      this.enableDarkMode();
    }
  },
  methods: {
    async logout() {
      if (!this.usuarioLogado) return;

      try {
        await axios.post(
          `${import.meta.env.VITE_APP_API_BASE_URL}/api/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${this.usuarioLogado.token}`,
            },
          }
        );
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
      }

      Cookies.remove("clienteNome");
      Cookies.remove("clienteToken");
      this.usuarioLogado = null;
      this.usuarioNome = null;
      this.$router.push("/");
    },
    irParaPerfil() {
      this.$router.push("/perfil");
    },
    irParaAcesso() {
      this.$router.push("/acesso");
    },
    toggleDarkMode() {
      if (this.isDarkMode) {
        this.disableDarkMode();
      } else {
        this.enableDarkMode();
      }
    },
    enableDarkMode() {
      this.isDarkMode = true;
      localStorage.setItem("isDarkMode", true);
      document.body.classList.add("dark-mode");
    },
    disableDarkMode() {
      this.isDarkMode = false;
      localStorage.setItem("isDarkMode", false);
      document.body.classList.remove("dark-mode");
    },
  },
};
</script>

<style lang="scss">
#nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #000000;
  color: #ffffff;
  padding: 10px 20px;
  height: 60px;
}

#nav nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 50px; /* Ajusta o espaço entre os links */
}

#nav nav ul li {
  display: inline-flex;
  align-items: center;
}

#nav nav ul li a {
  color: #a19b9b;
  text-decoration: none;
  font-size: 18px;
  padding: 5px 10px;
}

#nav nav ul li a.router-link-exact-active {
  color: #1efd00;
}

.carrinho-link {
  position: relative;
}

.carrinho-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.carrinho-icon img {
  width: 30px;
  height: auto;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.carrinho-icon img:hover {
  transform: scale(1.1);
}

.cart-count {
  position: absolute;
  top: -5px;
  right: -10px;
  background-color: #ff0000;
  color: #ffffff;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 50%;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: left;
  min-width: 10px;
  min-height: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.user-controls {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  right: 20px;
  top: 10px;
}

.usuario-nome {
  font-size: 16px;
}

.login-nav {
  background: linear-gradient(to bottom, #4a90e2, #357abd);
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  font-family: Arial, sans-serif;
  text-transform: uppercase;
  border: none;
  border-radius: 25px;
  padding: 10px 20px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-decoration: none;
}

.login-nav:hover {
  background: linear-gradient(to bottom, #357abd, #4a90e2);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
}

.user-buttons {
  display: flex;
  gap: 15px;
  align-items: center;
}

.btn-profile {
  width: 30px;
  height: 30px;
  cursor: pointer;
  border-radius: 50%;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.btn-profile:hover {
  transform: scale(1.2);
  opacity: 0.8;
}

.logout-button {
  background: linear-gradient(to bottom, #ff5c5c, #e53935);
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 15px;
  padding: 5px 15px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.logout-button:hover {
  background: linear-gradient(to bottom, #e53935, #ff5c5c);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.logout-button:active {
  transform: scale(0.95);
}
</style>
