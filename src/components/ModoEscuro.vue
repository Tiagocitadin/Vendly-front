<template>
    <div></div> 
  </template>
  
  <script>
  export default {
    name: "DarkModeManager",
    props: {
      isDarkMode: {
        type: Boolean,
        required: true,
      },
    },
    watch: {
      isDarkMode(newVal) {
        if (newVal) {
          document.body.classList.add("dark-mode");
        } else {
          document.body.classList.remove("dark-mode");
        }
      },
    },
    created() {
      // Verifica se o modo escuro está ativado ao inicializar
      if (this.isDarkMode) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
    },
  };
  </script>
  


<style>
/* Modo Escuro */
body.dark-mode .acesso-container {
  background-color: #1e1e1e; /* Fundo no modo escuro */
  color: #ffffff; /* Texto no modo escuro */
  border-color: #444; /* Bordas no modo escuro */
}

/* Estilo da Tabela */
body.dark-mode .historico-tabela th {
  background-color: #333333; /* Fundo do cabeçalho no modo escuro */
  color: #ffffff; /* Texto do cabeçalho no modo escuro */
}

body.dark-mode .historico-tabela tr:nth-child(even) {
  background-color: #2c2c2c; /* Linhas pares no modo escuro */
}

body.dark-mode .historico-tabela td {
  color: #ffffff; /* Texto das células no modo escuro */
  background-color: #1e1e1e; /* Fundo das células no modo escuro */
  border-color: #444; /* Bordas das células no modo escuro */
}

</style>