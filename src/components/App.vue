<template>
  <div id="app">
    <NavBar />
   
    <div class="content">
      <router-view />
    </div>

   <Footer />
  </div>
</template>

<script>
import NavBar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';

export default {
  components: {
    NavBar,
    Footer,
  },
  created() {
    this.$store.dispatch('carregarProdutos');
    document.title = "Vendly";
  },
};
</script>


<style lang="scss">
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

#app {
  display: flex;
  flex-direction: column; /* Coloca os elementos em uma coluna */
  min-height: 100vh; /* Altura mínima é 100% da tela */
}

.content {
  flex: 1; /* Faz o conteúdo ocupar o espaço restante */
}

footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 10px;
}
</style>
