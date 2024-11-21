<template>
  <div id="nav">
    <router-link to="/">Home</router-link>
    <router-link to="/produto">Produtos</router-link>
    <router-link to="/carrinho" class="carrinho-link">
      <div class="carrinho-icon">
        <img src="/src/img/carrinho-de-compras (1).png" alt="Carrinho de compra" />
        <span class="cart-count" v-if="produtosCarrinho.length > 0">
          ({{ produtosCarrinho.length }})
        </span>
      </div>
    </router-link>
    <!-- Exibir nome do usuário logado e botão de logout -->
    <div class="user-info">
      <span v-if="usuarioLogado">Olá, {{ usuarioLogado.nome }}</span>
      <router-link v-else to="/login">Olá, faça seu Login</router-link>
      <button v-if="usuarioLogado" @click="logout">Sair</button>
    </div>
  </div>
</template>

<script>
import axios from "axios"; // Importa Axios para fazer requisições HTTP

export default {
  data() {
    return {
      produtos: [], // Produtos serão carregados a partir da API
      usuarioLogado: null, // Dados do usuário logado
    };
  },
  computed: {
    // Obtém os produtos que estão no carrinho de compras a partir do Vuex Store
    produtosCarrinho() {
      return this.$store.state.produtosCarrinho;
    },
  },
  created() {
    // Buscar os dados do usuário do localStorage
    const usuario = localStorage.getItem("usuarioLogado");
    if (usuario) {
      this.usuarioLogado = JSON.parse(usuario);
    }

    // Buscar os produtos ao carregar o componente
    this.fetchProdutos();
  },
  methods: {
    // Método para buscar os produtos da API local
    fetchProdutos() {
      axios
        .get("https://localhost:8000/produtos") // Requisição GET para a API local
        .then((response) => {
          this.produtos = response.data.produtos; // Armazena os produtos recebidos da API
        })
        .catch((error) => {
          console.error("Erro ao buscar produtos:", error); // Exibe erro no console, se houver
        });
    },
    logout() {
      // Remover o usuário do localStorage
      localStorage.removeItem("usuarioLogado");
      this.usuarioLogado = null; // Atualizar o estado do componente
      this.$router.push("/login"); // Redirecionar para a página de login
    },
  },
};
</script>

<style lang="scss">
#nav {
  display: flex;
  justify-content: space-around; /* Divide os links de forma igual no espaço disponível */
  align-items: center; /* Alinha os itens verticalmente ao centro */
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  background-color: #d47676;
  color: white;
  padding: 10px;
  height: 80px;

  a {
    color: white;
    text-decoration: none;
    font-size: 30px; /* Aumenta um pouco o tamanho do texto */
    margin: 0 20px; /* Adiciona um espaçamento mínimo entre os links */

    &.router-link-exact-active {
      color: #007bff; /* Cor para o link ativo */
    }
  }

  img {
    width: 24px;
    height: 24px;
  }

  .carrinho-link {
    position: relative;
    display: flex;
    align-items: center;
  }

  .carrinho-icon {
    position: relative;
    display: inline-block;
  }

  .carrinho-icon img {
    width: 40px; /* Ajuste o tamanho da imagem do carrinho conforme necessário */
    height: auto;
  }

  .cart-count {
    position: absolute;
    top: -10px; /* Ajuste a posição vertical do contador */
    right: -30px; /* Ajuste a posição horizontal do contador */
    background-color: #ff0000;
    color: #fff;
    font-size: 14px;
    padding: 2px 6px;
    border-radius: 50%;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 24px;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 15px;

    span {
      font-size: 16px;
      font-weight: bold;
    }

    button {
      padding: 5px 10px;
      background-color: white;
      color: #d47676;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    button:hover {
      background-color: #ffcdd2;
    }
  }
}
</style>
