<template>
  <div class="home">
    <!-- Cabeçalho -->
    <div class="homePage">
      <h1 class="animatedTitle">Vendly - A Plataforma Completa para Vender Produtos de PC</h1>
      <h4 class="animatedSubtitle">Seu marketplace especializado em tecnologia, pronto para impulsionar suas vendas online</h4>
    </div>

    <!-- Carrossel -->
    <div class="carousel" v-if="maisVendidos.length > 0">    
      <div class="carousel-container" :style="{ transform: 'translateX(-' + (currentIndex * 100) + '%)' }">
        <div class="carousel-item" v-for="(produto, index) in maisVendidos" :key="index">
          <img :src="produto.imagem" :alt="produto.nome" class="carousel-image" />
          <h3 class="produto-nome">{{ produto.nome }}</h3>
        </div>
      </div>
        </div>
    <p v-else class="no-products">Nenhum produto encontrado para exibir.</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      currentIndex: 0, // Índice atual do carrossel
      produtos: [], // Lista completa de produtos
      isRunning: false, // Controla se o carrossel está em execução
    };
  },
  computed: {
    maisVendidos() {
      return this.produtos.filter((produto) => produto.maisVendido);
    },
  },
  methods: {
    async produtosHome() {
      try {
        const response = await axios.get("http://localhost:8000/produtos");
        this.produtos = response.data;
        if (this.maisVendidos.length > 0) {
          this.startCarousel();
        }
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    },
    startCarousel() {
      if (!this.isRunning) {
        this.isRunning = true;
        const nextSlide = () => {
          if (this.isRunning && this.maisVendidos.length > 0) {
            this.currentIndex = (this.currentIndex + 1) % this.maisVendidos.length;
            setTimeout(nextSlide, 3000); // Avança automaticamente a cada 3 segundos
          }
        };
        nextSlide();
      }
    },
    stopCarousel() {
      this.isRunning = false;
    },
   },
  mounted() {
    this.produtosHome();
  },
  beforeDestroy() {
    this.stopCarousel();
  },
};
</script>

<style>
/* Estilo Geral */
body {
  font-family: "Arial", sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
  color: #333;
}

/* Estilo Principal */
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Cabeçalho */
.homePage {
  background-color: #333;
  color: #fff;
  padding: 30px 20px;
  text-align: center;
  width: 100%;
  margin-top: 120px; 
}

.animatedTitle {
  font-size: 36px;
  margin: 0;
  opacity: 0;
  transform: translateY(-20px);
  animation: fadeInUp 1s ease-in-out forwards;
}

.animatedSubtitle {
  font-size: 18px;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 2s ease-in-out forwards;
  animation-delay: 0.5s;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Carrossel */
.carousel {
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 1200px;
  margin: 30px auto;
  background-color: transparent; /* Corrigido: Remove qualquer fundo */
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.carousel-container {
  display: flex;
  transition: transform 0.5s ease-in-out;
  background: none; /* Corrigido: Remove fundo adicional */
}

.carousel-item {
  min-width: 100%;
  text-align: center;
  background: none; /* Corrigido: Remove fundo dos itens */
  border: none; /* Remove bordas dos itens */
}

.carousel-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  display: block;
  margin: 0 auto;
}

/* Título do Produto */
.produto-nome {
  font-size: 18px;
  margin: 10px 0;
}



</style>
