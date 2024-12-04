<template>
  <div>
   
    <div class="login-bar">
      <div class="user-info">
        <span v-if="usuarioLogado">Olá, {{ usuarioLogado.nome }}</span>
        <router-link v-else to="/login" class="login-nav">Login</router-link>

        <img
          v-if="usuarioLogado"
          src="/assets/perfil.png"
          alt="Perfil"
          class="btn-profile"
          @click="irParaPerfil"
          title="Perfil"
        />
        <img v-if="usuarioLogado" src="/public/assets/acesso.png" alt="acesso"
        class="btn-profile"
        @click="irParaAcesso"
        title="Acesso">
        <button v-if="usuarioLogado" @click="logout" class="logout-button" title="Sair">Sair</button>
      </div>

      <!-- Botão de modo escuro -->
        <button
          class="dark-mode-toggle"
          :class="{ 'dark-mode': isDarkMode, 'light-mode': !isDarkMode }"
          @click="$emit('toggle-dark-mode')"
          :title="isDarkMode ? 'Modo Claro' : 'Modo Escuro'" >
          <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
        </button>

    </div>

    <!-- Barra inferior: Navegação -->
    <div id="nav">
      <nav>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/produto">Produtos</router-link></li>
          <li class="carrinho-link">
            <router-link to="/carrinho">
              <div class="carrinho-icon">
                <img src="/public/assets/carrinho-de-compras (1).png" alt="Carrinho de compra" />
                <span class="cart-count" v-if="produtosCarrinho.length > 0">
                  {{ produtosCarrinho.length }}
                </span>
              </div>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    isDarkMode: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      produtos: [], // Produtos disponíveis
      usuarioLogado: null, // Informações do usuário logado
    };
  },
  computed: {
    produtosCarrinho() {
      return this.$store.state.produtosCarrinho || [];
    },
  },
  created() {
    const usuario = localStorage.getItem("usuarioLogado");
    if (usuario) {
      this.usuarioLogado = JSON.parse(usuario);
    }

    // Recupera o estado do modo escuro do localStorage
    const savedTheme = localStorage.getItem("isDarkMode");
    if (savedTheme === "true") {
      this.enableDarkMode();
    }
  },
  methods: {
    fetchProdutos() {
      console.log("Fetching produtos...");
    },
    logout() {
      localStorage.removeItem("usuarioLogado");
      this.usuarioLogado = null;
      this.$router.push("/login");
    },
    irParaPerfil() {
      this.$router.push("/perfil");
    },
    irParaAcesso(){
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

.login-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: white;
  color:black;
  padding: 10px 20px;
  height: 50px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info span {
  font-size: 16px;
  font-weight: bold;
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


#nav {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Alinha menus ao canto esquerdo */
  background-color: #000000;
  color: #ffffff;
  padding: 10px 0; /* Ajusta para centralizar verticalmente sem espaçamento lateral extra */
  height: 60px;
 
}

#nav nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0 20px; /* Espaçamento lateral para começar à esquerda */
  gap: 50px; /* Espaçamento entre os itens */
}

#nav nav ul li {
  display: inline-flex; /* Garante alinhamento dos itens */
  align-items: center; /* Alinha verticalmente */
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
  min-width: 20px;
  height: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.dark-mode-toggle {
  border: none;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: 10px;
  transition: color 0.3s ease;
}

.dark-mode-toggle.dark-mode {
  color: #ffd700; /* Cor amarelo para o ícone de sol */
  background: white;
}

.dark-mode-toggle.light-mode {
  color: black; /* Cor preta para o ícone de lua */
  background: white;
}

.dark-mode-toggle:hover {
  transform: scale(1.1); /* Leve aumento no hover */
}



</style>
