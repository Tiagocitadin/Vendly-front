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
        <!-- Botão de Cadastro de Produto (ícone) 
        <img
          v-if="usuarioLogado"
          src="/public/assets/cadastro.png"
          alt="Cadastrar Produto"
          class="btn-add-product"
          @click="irParaCadastroProduto"
          title="Cadastrar Produto"
        /> -->

        <!-- Exibe o botão de logout se o usuário estiver logado -->
        <button v-if="usuarioLogado" @click="logout" class="logout-button">Sair</button>
      </div>
    </div>

    <!-- Barra inferior: Navegação -->
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
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      produtos: [], 
      usuarioLogado: null, 
    };
  },
  computed: {
    // Obtém os produtos que estão no carrinho de compras a partir do Vuex Store
    produtosCarrinho() {
      return this.$store.state.produtosCarrinho || [];
    },
  },
  created() {
    // Buscar os dados do usuário no localStorage ao montar o componente
    const usuario = localStorage.getItem("usuarioLogado");
    if (usuario) {
      this.usuarioLogado = JSON.parse(usuario); // Transforma o JSON em objeto e armazena
    }

    // Buscar os produtos ao carregar o componente
    this.fetchProdutos();
  },
  methods: {
    // Método para buscar os produtos da API local
    fetchProdutos() {
      axios
        .get("http://localhost:8000/produtos") // Requisição GET para a API local
        .then((response) => {
          this.produtos = response.data; // Armazena os produtos recebidos da API
        })
        .catch((error) => {
          console.error("Erro ao buscar produtos:", error); 
        });
    },
    logout() {
      // Remover o usuário do localStorage
      localStorage.removeItem("usuarioLogado");
      this.usuarioLogado = null; // Atualizar o estado do componente
      this.$router.push("/login"); // Redirecionar para a página de login
    },
    irParaPerfil() {
      // Redireciona para a página de perfil
      this.$router.push("/perfil");
    },
    //Cadastro de produto
    // irParaCadastroProduto() {
    // Redireciona para a página de cadastro de produto
   //  this.$router.push("/cadastroproduto");
   // },
  },
};
</script>

<style lang="scss">

.login-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #d47676;
  color: white;
  padding: 10px 20px;
  height: 50px;

  .user-info {
    display: flex;
    align-items: center;
    gap: 15px;

    span {
      font-size: 16px;
      font-weight: bold;
    }
    
    .login {
    background: linear-gradient(to bottom, #4a90e2, #357ABD); /* Gradiente azul */
    color: #ffffff; /* Cor do texto branca */
    font-size: 16px; /* Tamanho da fonte */
    font-weight: bold; /* Negrito */
    font-family: Arial, sans-serif; /* Fonte padrão */
    text-transform: uppercase; /* Texto em maiúsculas */
    border: none; /* Remove bordas padrão */
    border-radius: 25px; /* Bordas arredondadas */
    padding: 10px 20px; /* Espaçamento interno */
    cursor: pointer; /* Cursor de mãozinha */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombra leve */
    transition: all 0.3s ease; /* Transição suave */
}

.login:hover {
    background: linear-gradient(to bottom, #357ABD, #4a90e2); /* Inverte gradiente */
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2); /* Aumenta a sombra */
    transform: translateY(-2px); /* Efeito de elevação */
}

.login:active {
    transform: translateY(2px); /* Clique diminui elevação */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Reduz sombra */
}

    /* Estilo para imagem do botão de perfil */
    .btn-profile {
      width: 30px; /* Largura do ícone */
      height: 30px; /* Altura do ícone */
      cursor: pointer;
      border-radius: 50%; /* Deixa o ícone redondo */
      transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .btn-profile:hover {
      transform: scale(1.2);
      opacity: 0.8;
    }

    /* Estilo para imagem do botão de adicionar produto */
    .btn-add-product {
      width: 30px; /* Largura do ícone */
      height: 30px; /* Altura do ícone */
      cursor: pointer;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .btn-add-product:hover {
      transform: scale(1.2);
      opacity: 0.8;
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
    .logout-button {
    background: linear-gradient(to bottom, #ff5c5c, #e53935); /* Gradiente vermelho */
    color: #ffffff; /* Cor do texto branca */
    font-size: 14px; /* Tamanho da fonte */
    font-weight: bold; /* Negrito */
    font-family: Arial, sans-serif; /* Fonte padrão */
    border: none; /* Remove bordas padrão */
    border-radius: 15px; /* Bordas arredondadas */
    padding: 5px 15px; /* Espaçamento interno */
    cursor: pointer; /* Cursor de mãozinha */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Sombra leve */
    transition: all 0.3s ease; /* Transição suave */
}

.logout-button:hover {
    background: linear-gradient(to bottom, #e53935, #ff5c5c); /* Inverte gradiente */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); /* Aumenta a sombra */
    transform: scale(1.05); /* Leve aumento no hover */
}

.logout-button:active {
    transform: scale(0.95); /* Clique reduz o tamanho */
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2); /* Reduz sombra */
}

  }
}

/* Barra inferior: Navegação */
#nav {
  display: flex;
  justify-content: baseline;
  align-items: center;
  position: relative;
  width: 100%;
  z-index: 1000;
  background-color: #000000; /* Cor de fundo da barra inferior */
  color: #ffffff; /* Cor do texto */
  padding: 10px;
  height: 60px;

  a {
    color: #a19b9b; /* Cor padrão dos links */
    text-decoration: none;
    font-size: 20px;
    margin: 0 20px;

    &.router-link-exact-active {
      color: #1efd00; /* Cor para o link ativo */
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
    width: 40px; /* Tamanho do ícone do carrinho */
    height: auto;
  }

  .cart-count {
    position: absolute;
    top: -10px; /* Ajuste da posição vertical */
    right: -30px; /* Ajuste da posição horizontal */
    background-color: #ff0000; /* Fundo do contador */
    color: #fff;
    font-size: 14px;
    padding: 2px 6px;
    border-radius: 50%; /* Deixa o contador redondo */
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 24px;
  }

  
}
</style>
