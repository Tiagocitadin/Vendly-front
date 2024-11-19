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
          <img :src="produto.imagem" :alt="produto.nome" />
          <h3>{{ produto.nome }}</h3>
        </div>
      </div>
    </div>
    <p v-else class="no-products">Nenhum produto encontrado para exibir.</p>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  name: 'Home',
  data() {
    return {
      currentIndex: 0, // Índice atual do carrossel
      produtos: [], // Lista completa de produtos
      isRunning: false, // Controla se o carrossel está em execução
    };
  },
  computed: {
    maisVendidos() {
      // Filtra os produtos com base na booleana "maisVendido"
      return this.produtos.filter((produto) => produto.maisVendido);
    },
  },
  methods: {
    async produtosHome() {
      try {
        const response = await axios.get('http://localhost:5500/produtos'); // Certifique-se de que o servidor JSON está rodando
        this.produtos = response.data;
        // Só inicia o carrossel se houver produtos
        if (this.maisVendidos.length > 0) {
          this.startCarousel();
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      }
    },
    startCarousel() {
      // Método para iniciar o carrossel contínuo
      if (!this.isRunning) {
        this.isRunning = true;
        const nextSlide = () => {
          if (this.isRunning && this.maisVendidos.length > 0) {
            this.currentIndex = (this.currentIndex + 1) % this.maisVendidos.length;
            this.$nextTick(() => {
              requestAnimationFrame(nextSlide); // Continua o ciclo
            });
          }
        };
        nextSlide(); // Inicia o ciclo
      }
    },
    stopCarousel() {
      this.isRunning = false; // Pausa o carrossel
    },
  },
  mounted() {
    this.produtosHome(); // Carrega os produtos ao montar o componente
  },
  beforeDestroy() {
    this.stopCarousel(); // Para o carrossel quando o componente for destruído
  },
};
</script>


<style>
/* Estilo Geral */
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  color: #333;
}

/* Estilo do Container Principal */
.home {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Estilo do Cabeçalho */
.homePage {
  background-color: #333;
  color: #fff;
  padding: 30px 20px;
  text-align: center;
  width: 100%;
  margin-top: 100px;
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

/* Estilo do Carrossel */
.carousel {
  overflow: hidden;
  width: 100%;
  max-width: 1200px;
  margin: 30px auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.carousel-container {
  display: flex;
  transition: transform 0.5s

}
</style>