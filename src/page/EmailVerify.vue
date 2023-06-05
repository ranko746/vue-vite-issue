<template>
  <div class="success-container">
    <h2>Verify your email!</h2>
    <p>
      An email has been sent to your inbox. Please check your email to complete
      the registration process.
    </p>

    <!-- Add success and error messages here -->
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    <p v-if="cooldownMessage" class="cooldown-message">{{ cooldownMessage }}</p>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <!-- Show loading state -->
    <div v-if="loading" class="loading-message">Sending email ...</div>

    <button class="resend-button" @click="resendEmail">Resend Email</button>
    <router-link to="/login"><button>Go to Login</button></router-link>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email: new URL(window.location.href).searchParams.get("email"), // get email from URL parameters
      loading: false,
      successMessage: "",
      cooldownMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    async resendEmail() {
      // Reset messages
      this.successMessage = "";
      this.cooldownMessage = "";
      this.errorMessage = "";

      try {
        this.loading = true; // Start loading
        const response = await axios.post("http://localhost:4000/resendemail", {
          email: this.email,
        });

        if (response.data.success) {
          this.successMessage = response.data.message;
        } else if (response.status === 429) {
          const remainingMinutes = response.data.remainingTimeMinutes;
          const remainingSeconds = response.data.remainingTimeSeconds;
          this.cooldownMessage = `Too many attempts to resend confirmation email. Please try again in ${remainingMinutes} minutes and ${remainingSeconds} seconds.`;
        } else {
          this.errorMessage = response.data.message;
        }
      } catch (error) {
        console.error("Error during sending email:", error);
        this.errorMessage =
          "An error occurred while trying to resend the email.";
      } finally {
        this.loading = false; // End loading regardless of outcome
      }
    },
  },
};
</script>

<style scoped>
.success-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #444;
  border-radius: 10px;
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.success-container h2 {
  font-size: 28px;
  font-weight: bold;
  background-color: #444;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 20px;
  color: #fff;
  text-align: center;
  width: 100%;
}

.success-container p {
  font-size: 16px;
  color: #fff;
  margin-bottom: 20px;
  margin-top: -10px;
  text-align: center;
}

.success-container button {
  padding: 10px;
  background-color: rgb(161, 105, 172);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
}

.success-container .resend-button:hover {
  background-color: #a2c1a5;
}

.success-container .resend-button {
  background-color: #5ecba1;
  margin-bottom: 10px;
}

@media screen and (max-width: 480px) {
  .success-container h2 {
    font-size: 22px;
  }

  .success-container p {
    font-size: 14px;
  }

  .success-container button {
    font-size: 14px;
  }
}

@media screen and (min-width: 481px) and (max-width: 768px) {
  .success-container h2 {
    font-size: 24px;
  }

  .success-container p {
    font-size: 16px;
  }

  .success-container button {
    font-size: 16px;
  }
}

@media screen and (min-width: 769px) {
  .success-container h2 {
    font-size: 28px;
  }

  .success-container p {
    font-size: 18px;
  }

  .success-container button {
    font-size: 18px;
    width: auto;
  }
}

.success-message {
  color: #28a745 !important; /* green */
}

.error-message {
  color: #dc3545 !important; /* red */
}

.loading-message {
  color: #ffc107 !important; /* yellow */
}
</style>
