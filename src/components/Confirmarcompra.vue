<template>
  <div class="confirmar-compra">
    <h1>Confirmar Compra</h1>
    <div class="resumo-compra">
      <section class="dados-cliente">
        <h2>Dados do Cliente</h2>
      </section>

      <section class="itens-carrinho">
        <h2>Itens do Pedido</h2>
        <table class="tabela-itens">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Quantidade</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(produto, index) in produtosCarrinho" :key="index">
              <td>{{ produto.nome }}</td>
              <td>{{ produto.quantidade }}</td>
              <td>R$ {{ produto.preco.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <p class="total-pedido">
        <strong>Total do Pedido:</strong> R$ {{ total }}
      </p>
    </div>
    <div class="acoes">
      <button class="btn-confirmar" @click="confirmarCompra">Confirmar Compra</button>
      <button class="btn-cancelar" @click="cancelarCompra">Cancelar Compra</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      produtosCarrinho: [], // Lista de produtos no carrinho
      dadosCliente: {
        nome: "",
        formaPagamento: "",

      },
      total: 0, // Valor total do pedido
    };
  },
  methods: {
    carregarDados() {
      // Simula carregamento de dados do Vuex
      this.produtosCarrinho = this.$store.state.produtosCarrinho;
      this.dadosCliente = this.$store.state.dadosCliente;
      this.total = this.produtosCarrinho.reduce(
        (acc, item) => acc + item.preco * item.quantidade,
        0
      ).toFixed(2);
    },
    confirmarCompra() {
      alert("Compra confirmada! Obrigado pela preferência.");
      this.$router.push("/"); // Redireciona para a página inicial
    },
    cancelarCompra() {
      alert("Compra cancelada.");
      this.$router.push("/carrinho"); // Redireciona para o carrinho
    },
  },
  created() {
    this.carregarDados();
  },
};
</script>

<style scoped>
.confirmar-compra {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  text-align: center;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

h2 {
  font-size: 20px;
  margin-bottom: 10px;
  text-align: left;
}

.resumo-compra {
  margin-bottom: 20px;
}

.tabela-itens {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.tabela-itens th,
.tabela-itens td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.tabela-itens th {
  background-color: #f4f4f4;
  font-weight: bold;
  text-align: center;
}

.tabela-itens td:nth-child(2),
.tabela-itens td:nth-child(3) {
  text-align: center;
}

.total-pedido {
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
}

.acoes {
  margin-top: 20px;
}

button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-confirmar {
  background-color: #28a745;
  color: white;
}

.btn-confirmar:hover {
  background-color: #218838;
}

.btn-cancelar {
  background-color: #dc3545;
  color: white;
}

.btn-cancelar:hover {
  background-color: #c82333;
}
</style>
