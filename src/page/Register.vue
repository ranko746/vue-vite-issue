<template>
  <div class="register-container">
    <h2>Register</h2>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="message" class="message">{{ message }}</div>
    <form @submit.prevent="submit">
      <div class="input-container">
        <input v-model="email" type="email" placeholder="Email" required />
      </div>
      <div class="input-container">
        <input v-model="confirmEmail" type="email" placeholder="Confirm Email" required />
      </div>
      <div class="input-container">
        <input :type="passwordFieldType" v-model="password" placeholder="Password" required />
        <i :class="passwordVisible ? 'fa fa-eye-slash' : 'fa fa-eye'" @click="togglePassword"></i>
      </div>
      <div class="input-container">
        <input :type="confirmPasswordFieldType" v-model="confirmPassword" placeholder="Confirm Password" required />
        <i :class="confirmPasswordVisible ? 'fa fa-eye-slash' : 'fa fa-eye'" @click="toggleConfirmPassword"></i>
      </div>
      <div class="captcha-container">
        <img :src="captchaImage" class="captcha-image" />
        <div class="captcha-input-container">
          <input type="text" v-model="captcha" class="captcha-input" placeholder="Enter captcha" />
          <i class="fas fa-sync-alt" v-if="!isCaptchaRefreshCooldown" @click="refreshCaptcha"></i>
        </div>
      </div>
      <button type="submit">Register</button>
    </form>
    <h3 class="down-text">
      Already registered? <router-link to="/Login">Login</router-link>
    </h3>
    <div class="terms-privacy">
      <a href="https://docs.made.my/terms-of-use" target="_blank">Terms of Use</a>
      <a href="https://docs.made.my/privacy-statement" target="_blank">Privacy Statement</a>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Register",
  data() {
    return {
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
      passwordFieldType: "password",
      confirmPasswordFieldType: "password",
      error: "",
      message: "",
      passwordVisible: false,
      confirmPasswordVisible: false,
      captchaImage: "",
      captcha: "",
      refreshCaptchaCooldown: 0,
      isCaptchaRefreshCooldown: false,
      cooldownDuration: 500, // Cooldown duration in milliseconds
    };
  },
  mounted() {
    this.fetchCaptcha();
  },
  methods: {
    togglePassword() {
      this.passwordFieldType = this.passwordFieldType === "password" ? "text" : "password";
      this.passwordVisible = !this.passwordVisible;
    },
    toggleConfirmPassword() {
      this.confirmPasswordFieldType = this.confirmPasswordFieldType === "password" ? "text" : "password";
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    },
    async fetchCaptcha() {
      try {
        const response = await fetch("http://localhost:4000/captcha");
        const data = await response.text();
        this.captchaImage = `data:image/svg+xml;base64,${btoa(data)}`;
      } catch (error) {
        console.error("Error fetching captcha:", error);
      }
    },
    refreshCaptcha() {
      const currentTime = Date.now();
      if (currentTime - this.refreshCaptchaCooldown < this.cooldownDuration) {
        this.error = "Please wait before refreshing the captcha again.";
        this.isCaptchaRefreshCooldown = true; // Set cooldown to true

        // Hide the refresh button for the duration of the cooldown
        setTimeout(() => {
          this.isCaptchaRefreshCooldown = false;
        }, this.cooldownDuration);
        return;
      }

      this.fetchCaptcha();
      this.refreshCaptchaCooldown = currentTime; // Update the last refresh timestamp
    },
    async submit() {
      if (this.password !== this.confirmPassword) {
        this.error = "Passwords do not match.";
        return;
      }
      if (this.email !== this.confirmEmail) {
        this.error = "Emails do not match.";
        return;
      }
      if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(this.password)) {
        this.error =
          "Password must contain at least 1 lowercase alphabetical character, 1 uppercase alphabetical character, 1 numeric character, and the string must be eight characters or longer.";
        return;
      }

      try {
        const response = await axios.post("http://localhost:4000/register", {
          email: this.email,
          password: this.password,
          captcha: this.captcha, // Pass the captcha input to the backend
        });
        if (response.data.success) {
          this.$router.push({
    path: '/emailverify',
    query: { email: this.email }
});
        } else {
      this.error = response.data.message;
      if (response.status === 470) { // Captcha invalid
        this.refreshCaptcha();
      }
    }
      } catch (error) {
        console.error(error);
        if (error.response?.data?.message) {
          this.error = error.response.data.message;
        } else {
          this.error = "An error occurred during registration.";
        }
        if (error.response?.status === 409) {
  // User already exists
  this.confirmEmail = "";
  this.confirmPassword = "";
}
    if (error.response?.status === 470) { // Captcha invalid
      this.refreshCaptcha();
      this.captcha = ""; // Clear captcha input field
    }
      }
    },
  },
};
</script>

<style scoped>
.input-container {
  position: relative;
  width: 100%;
}

.input-container input {
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
}

.fa-eye,
.fa-eye-slash {
  position: absolute;
  right: 10px;
  top: 15px;
  cursor: pointer;
}

.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #444;
  border-radius: 10px;
  max-width: 400px;
  margin: 0 auto;
}

.register-container h2 {
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

.register-container h3 {
  font-size: 18px;
  font-weight: bold;
  background-color: #444;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 20px;
  color: #fff;
  text-align: center;
  width: 100%;
}

@media screen and (max-width: 480px) {
  .register-container h2 {
    font-size: 18px;
  }

  .register-container h3 {
    font-size: 16px;
  }
}

@media screen and (min-width: 481px) and (max-width: 768px) {
  .register-container h2 {
    font-size: 20px;
  }

  .register-container h3 {
    font-size: 18px;
  }
}

@media screen and (min-width: 769px) {
  .register-container h2 {
    font-size: 22px;
  }

  .register-container h3 {
    font-size: 18px;
  }
}

form input[type="email"],
form input[type="password"],
form input[type="text"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  border: none;
  font-size: 16px;
}

form button[type="submit"] {
  padding: 10px;
  background-color: #cd9bea;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

form button[type="submit"]:hover {
  background-color: #222;
}

.error {
  color: red;
  margin-top: 10px;
  font-size: 18px;
}

.down-text a {
  color: inherit;
}

.captcha-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}

.captcha-image {
  width: 80%;
  background-color: white;
}

.captcha-input-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.captcha-input {
  flex: 1;
  height: 25px;
  font-size: 16px;
  margin-right: 10px;
}

.fa-sync-alt {
  cursor: pointer;
  color: white;
  font-size: 24px;
}
</style>
