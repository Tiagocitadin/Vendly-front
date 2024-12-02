<template>
  <div>
    <!-- Barra superior: Login e usuário -->
    <div class="login-bar">
      <div class="user-info">
        <span v-if="usuarioLogado">Olá, {{ usuarioLogado.nome }}</span>
        <router-link v-else to="/login" class="login">Login</router-link>

        <img
          v-if="usuarioLogado"
          src="/assets/perfil.png"
          alt="Perfil"
          class="btn-profile"
          @click="irParaPerfil"
          title="Perfil"
        />
        <button v-if="usuarioLogado" @click="logout" class="logout-button">Sair</button>
      </div>
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
  data() {
    return {
      produtos: [],
      usuarioLogado: null,
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
    this.fetchProdutos();
  },
  methods: {
    fetchProdutos() {
      // Simulação de chamada de API para obter produtos
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
  },
};
</script>



<style lang="scss">

/* Barra superior: Login e usuário */
.login-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #d47676;
  color: white;
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

.login {
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

.login:hover {
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

/* Barra inferior: Navegação */
#nav {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Alinha menus ao canto esquerdo */
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
  gap: 20px; /* Espaçamento entre os itens */
}

#nav nav ul li {
  display: inline-block;
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

</style>
