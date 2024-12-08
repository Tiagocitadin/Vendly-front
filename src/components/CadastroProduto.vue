<template>
  <div class="cadastro-container">
    <div class="header">
      <h4>{{ isEdit ? 'Editar Produto' : 'Cadastro Produto' }}</h4>
    </div>

    <div class="produto-registration">
      <form @submit.prevent="inserir">
        <div class="form-group">
          <label for="nome">Título Produto <span>*</span></label>
          <input type="text" id="nome" v-model="produto.nome" placeholder="Título do Produto" required />
          <small v-if="errors.nome" class="error">{{ errors.nome }}</small>
        </div>

        <div class="form-group">
          <label for="descricao">Descrição <span>*</span></label>
          <textarea id="descricao" v-model="produto.descricao" placeholder="Descrição do Produto" maxlength="300" required></textarea>
          <small v-if="errors.descricao" class="error">{{ errors.descricao }}</small>
        </div>

        <div class="form-group">
          <label for="quantidade">Quantidade em Estoque <span>*</span></label>
          <input type="number" id="quantidade" v-model="produto.quantidade" placeholder="Quantidade" required />
          <small v-if="errors.quantidade" class="error">{{ errors.quantidade }}</small>
        </div>

        <div class="form-group">
          <label for="preco">Valor <span>*</span></label>
          <input type="number" min="0" step=".01" id="preco" v-model="produto.preco" placeholder="R$" required />
          <small v-if="errors.preco" class="error">{{ errors.preco }}</small>
        </div>

        <div class="form-group">
          <label for="imagem">Imagem do Produto </label>
          <input type="file" id="imagem" @change="onImageSelected" accept="image/jpeg, image/png" />
          <small v-if="errors.imagem" class="error">{{ errors.imagem }}</small>
          
          <div v-if="produto.imagemPreview">
            <img :src="produto.imagemPreview" alt="Pré-visualização da imagem" style="max-width: 200px; margin-top: 10px;" />
          </div>
        </div>

        <div class="form-group-buttons">
          <button type="submit" class="submit-button_cadastrar">{{ isEdit ? 'Salvar Alterações' : 'Cadastrar' }}</button>
          <button type="button" class="submit-button_limpar" @click="clearForm">Limpar Formulário</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";

export default {
  data() {
    return {
      produto: {
        nome: "",
        descricao: "",
        quantidade: "",
        preco: "",
        imagem: null,
        imagemPreview: null,
      },
      errors: {},
      isEdit: false,
    };
  },

  mounted() {
    const token = Cookies.get("adminToken");
    if (!token) {
      this.$router.push("/admin");
    }

    const queryParams = new URLSearchParams(window.location.hash.slice(2).split('?')[1]);
    const id = queryParams.get('id');
    
    if (id) {
      this.isEdit = true;
      this.fetchProduct(id);
    }
  },

  methods: {
    async fetchProduct(id) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/api/produtos/${id}`);
        this.produto = response.data;

        if (this.produto.imagem) {
          this.produto.imagemPreview = `${import.meta.env.VITE_APP_API_BASE_URL}${this.produto.imagem}`;
        }
      } catch (error) {
        console.error("Erro ao buscar o produto:", error);
        alert("Erro ao buscar o produto.");
      }
    },

    async inserir() {
      this.errors = {};
      if (!this.produto.nome) this.errors.nome = "O título do produto é obrigatório.";
      if (!this.produto.descricao) this.errors.descricao = "A descrição do produto é obrigatória.";
      if (!this.produto.quantidade) this.errors.quantidade = "A quantidade em estoque é obrigatória.";
      if (!this.produto.preco) this.errors.preco = "O valor do produto é obrigatório.";

      if (Object.keys(this.errors).length > 0) return;

      try {
        const formData = new FormData();
        formData.append("nome", this.produto.nome);
        formData.append("descricao", this.produto.descricao);
        formData.append("quantidade", this.produto.quantidade);
        formData.append("preco", this.produto.preco);

        if (this.produto.imagem) {
          formData.append("imagem", this.produto.imagem);
        }

        const token = Cookies.get("adminToken");

        let url = `${import.meta.env.VITE_APP_API_BASE_URL}/api/produtos`;
        let method = 'post'; // Default method for creating
        if (this.isEdit) {
          url = `${url}/${this.produto.id}`;
          method = 'put'; // Update method for editing
        }


        await axios({
          method,
          url,
          data: formData,
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        alert(`${this.produto.nome} ${this.isEdit ? 'alterado' : 'cadastrado'} com sucesso!`);
        this.clearForm();
        this.$router.push("/listarproduto");
      } catch (error) {
        console.error("Erro ao cadastrar ou editar o produto:", error);
        alert("Erro ao cadastrar ou editar o produto.");
      }
    },

    clearForm() {
      this.produto = {
        nome: "",
        descricao: "",
        quantidade: "",
        preco: "",
        imagem: null,
        imagemPreview: null,
      };
      this.isEdit = false;
    },

    onImageSelected(event) {
      const file = event.target.files[0];
      if (file) {
        this.produto.imagem = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.produto.imagemPreview = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
  },
};
</script>

<style>

.cadastro-container {
  max-width: 30%;  
  padding: 10px;
  background-color: #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  color: #333;  
  margin: 50px 0 50px 550px;

}

.header h4 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #007bff;
  font-weight: bold;
  text-transform: uppercase;
}

/* Grid principal do formulário */
.produto-registration {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 15px;
  background-color: #f7f7f7;
  padding: 20px;
  border-radius: 8px;
}

/* Estilo dos grupos de campo */
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  padding: 5px;
}

/* Rótulos */
.form-group label {
  font-size: 13px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
  padding: 5px;
}

/* Inputs e Textareas */
.form-group input[type="text"],
.form-group input[type="number"],
.form-group input[type="file"],
.form-group textarea {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  transition: border-color 0.3s;
}

.form-group input[type="text"]:focus,
.form-group input[type="number"]:focus,
.form-group textarea:focus {
  border-color: #007bff;
  outline: none;
}

/* Ajustando a área da imagem */
.form-group img {
  max-width: 150px;
  margin-top: 10px;
  border: 2px solid #ddd;
  border-radius: 8px;
}

/* Estilizando os botões */
.submit-button_cadastrar {
  padding: 12px 20px;
  font-size: 14px;
  font-weight: bold;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;

}

.submit-button_limpar {
  margin-left: 10px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: bold;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
}


.submit-button:hover {
  background-color: #0056b3;
}

/* Layout para vários botões */
.form-group-buttons {
  grid-column: span 4;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.form-group-buttons button {
  width: 100%;
}

/* Responsividade */
@media (max-width: 768px) {
  .produto-registration {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .form-group-buttons {
    flex-direction: column;
  }

  .submit-button {
    width: 100%;
    margin-top: 10px;
  }
}
</style>
