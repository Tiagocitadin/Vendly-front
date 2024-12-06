<template>
    <div class="feedback-container">
      <h1>Avaliação de Experiência</h1>
      <p>Por favor, avalie sua experiência ao utilizar nosso sistema:</p>
  
      <!-- Avaliação com estrelas -->
      <div class="stars">
        <span
          v-for="star in 5"
          :key="star"
          class="star"
          :class="{ active: star <= rating }"
          @click="setRating(star)"
          @mouseover="hoverRating(star)"
          @mouseleave="hoverRating(0)"
        >
          ★
        </span>
      </div>
  
      <textarea
        v-model="feedbackText"
        placeholder="Deixe seu comentário (opcional)"
      ></textarea>
  
      <button @click="submitFeedback" :disabled="!rating">Enviar Avaliação</button>
  
      <div v-if="submitted" class="feedback-thank-you">
        <p>Obrigado!</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        rating: 0, // Avaliação com estrelas (1-5)
        hoverRating: 0, // Para destaque ao passar o mouse
        feedbackText: "", // Comentário adicional
        submitted: false, // Indica se o feedback foi enviado
      };
    },
    methods: {
      setRating(star) {
        this.rating = star;
      },
      hoverRating(star) {
        this.hoverRating = star;
      },
      submitFeedback() {
        // Simulação de envio para uma API ou servidor
        console.log({
          rating: this.rating,
          feedback: this.feedbackText,
        });
  
        this.submitted = true;
  
        // Redirecionar para a página inicial após enviar o feedback
        setTimeout(() => {
          this.$router.push("/");
        }, 2000); // 2 segundos de atraso para exibir mensagem de agradecimento
      },
    },
  };
  </script>
  
  <style scoped>
  .feedback-container {
    max-width: 500px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background: #f9f9f9;
  }
  
  .feedback-container h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  .stars {
    display: flex;
    gap: 5px;
    margin-bottom: 15px;
  }
  
  .star {
    font-size: 24px;
    cursor: pointer;
    color: #ccc;
    transition: color 0.3s;
  }
  
  .star.active,
  .star:hover {
    color: #ffc107;
  }
  
  textarea {
    width: 100%;
    height: 100px;
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    resize: none;
  }
  
  button {
    display: block;
    width: 100%;
    padding: 10px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }
  
  button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  .feedback-thank-you {
    margin-top: 20px;
    color: green;
    font-weight: bold;
    text-align: center;
  }
  </style>
  