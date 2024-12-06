<template>
  <div class="carrinho">
    <div class="items">
      <!-- Verifica se há produtos no carrinho -->
      <template v-if="produtosCarrinho.length">
        <div v-for="(produto, index) in produtosCarrinho" :key="index" class="item">
          <div class="remove" @click="removerItem(produto.id)">Remove item</div>
          <div class="photo">
            <img :src="'http://localhost:8000/' + produto.imagem" alt="Produto" />
          </div>
          <div class="descricao">{{ produto.nome }}</div>
          <div class="preco">
            <span class="quantidade-area">
              <button :disabled="produto.quantidade <= 1" @click="alterarQuantidade(produto, -1)">-</button>
              <span class="quantidade">{{ produto.quantidade }}</span>
              <button @click="alterarQuantidade(produto, 1)">+</button>
            </span>
            <span class="amount"> R$ {{ (produto.preco * produto.quantidade).toFixed(2) }}</span>
          </div>
        </div>
        <div class="grand-total">Total Pedido: R$ {{ calcularTotal() }}</div>
        <div class="finalizar">
          <button @click="finalizarCompra" class="btn-finalizar">Finalizar Compra</button>
        </div>
      </template>
      <!-- Carrinho vazio -->
      <template v-else>
        <h4>Não há itens no Carrinho</h4>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "Carrinho",
  methods: {
    calcularTotal() {
      return this.produtosCarrinho
        .reduce((total, item) => total + item.preco * item.quantidade, 0)
        .toFixed(2);
    },
    finalizarCompra() {    
      if (this.produtosCarrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
      }    
      this.$router.push("/confirmar-compra");
    },

    removerItem(id) {
      this.$store.dispatch("removerDoCarrinho", id);
    },
    alterarQuantidade(produto, quantidade) {
      if (produto.quantidade + quantidade > 0) {
        produto.quantidade += quantidade;
      }
    },
  },
  computed: {
    produtosCarrinho() {
      return this.$store.state.produtosCarrinho;
    },
  },
};
</script>

<style lang="scss">
.carrinho {
  padding: 60px 0;

  .items {
    max-width: 800px;
    margin: 80px auto;
  }

  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40px 0;
    border-bottom: 1px solid lightgrey;
    position: relative;

    .remove {
      position: absolute;
      top: 8px;
      right: 0;
      font-size: 11px;
      text-decoration: underline;
      cursor: pointer;
    }

    .quantidade-area {
      display: flex;
      align-items: center;
      margin: 8px auto;

      button {
        width: 24px;
        height: 24px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        background-color: #007bff;
        border: none;
        color: #fff;
        font-size: 16px;
        line-height: 16px;
        border-radius: 50%;

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .quantidade {
        margin: 0 8px;
        font-size: 16px;
        line-height: 24px;
      }
    }

    .photo {
      img {
        max-width: 80px;
      }
    }

    .descricao {
      padding-left: 30px;
      box-sizing: border-box;
      max-width: 50%;
      font-size: 14px;
    }

    .preco {
      display: flex;
      align-items: center;

      .amount {
        font-size: 16px;
        margin-left: 8px;
        vertical-align: middle;
      }
    }
  }

  .grand-total {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-top: 8px;
  }

  .finalizar {
    text-align: center;
    margin-top: 20px;

    .btn-finalizar {
      padding: 12px 24px;
      background-color: #28a745;
      border: none;
      color: white;
      font-size: 16px;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #023b0f;
      }
    }
  }
}
</style>
