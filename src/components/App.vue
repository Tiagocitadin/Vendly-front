<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <NavBar
      :isDarkMode="isDarkMode"
      @toggle-dark-mode="toggleDarkMode"
    />
    <div class="content">
      <router-view />
    </div>
    <Footer />
  </div>
</template>



<script>
import NavBar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";

export default {
  components: {
    NavBar,
    Footer,
  },
  data() {
    return {
      isDarkMode: false, // Estado para controlar o modo escuro
    };
  },
  created() {
    // Recupera o estado do tema no localStorage
    const savedTheme = localStorage.getItem("isDarkMode");
    if (savedTheme === "true") {
      this.isDarkMode = true;
      document.body.classList.add("dark-mode"); // Aplica o tema escuro ao body
    }

    this.$store.dispatch("carregarProdutos");
    document.title = "Vendly";
  },
  methods: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem("isDarkMode", this.isDarkMode); // Salva a preferência no localStorage

      // Aplica ou remove a classe "dark-mode" no body
      if (this.isDarkMode) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
    },
  },
 };
 
</script>

<style lang="scss">
/* Estilo geral */
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

/* Tema Claro (Padrão) */
body {
  background-color: #ffffff;
  color: #000000;
  transition: background-color 0.3s ease, color 0.3s ease;
}

footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 10px;
}

.content {
  flex: 1; /* Faz o conteúdo ocupar o espaço restante */
}

/* Tema Escuro */
body.dark-mode {
  background-color: #121212;
  color: #ffffff;
}

body.dark-mode footer {
  background-color: #222;
}

body.dark-mode .theme-toggle button {
  background-color: #333;
  color: #ffffff;
}

/* Estilo do botão para alternar o modo */
.theme-toggle {
  display: flex;
  justify-content: flex-end;
  padding: 10px 20px;
}

.theme-toggle button {
  background-color: #5c6bc0;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.theme-toggle button:hover {
  background-color: #3b4cb8;
}

</style>
