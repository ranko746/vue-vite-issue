<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="submit">
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="message" class="message">{{ message }}</div>
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <div class="captcha-container">
        <img :src="captchaImage" class="captcha-image" />
        <div class="captcha-input-container">
          <input type="text" v-model="captcha" class="captcha-input" placeholder="Enter captcha" />
          <i class="fas fa-sync-alt" v-if="!isCaptchaRefreshCooldown" @click="refreshCaptcha"></i>
        </div>
      </div>
      <button type="submit">Login</button>
    </form>
    <h3 class="down-text">
      New to IO.day? <router-link to="/Register">Register</router-link>
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
  name: "Login",
  data() {
    return {
      email: '',
      password: '',
      error: "",
      message: "",
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
    clearCaptchaInput() {
      this.captcha = '';
    },
    retryLogin() {
      this.clearCaptchaInput();
      this.refreshCaptcha();
    },
    async submit() {
  try {
    const response = await axios.post("http://localhost:4000/login", {
      email: this.email,
      password: this.password,
      captcha: this.captcha,
    }, {
      withCredentials: true,
    });

    if (response.data.success) {
      this.$router.push("/dashboard");
    } else {
      throw new Error("Invalid email or password."); // Throw an error if login is unsuccessful
    }
  } catch (error) {
    console.error(error);
    if (error.response && error.response.data.message) {
      this.error = error.response.data.message;
    } else {
      this.error = "An error occurred during login.";
    }
    // Retry the login, this will clear the captcha and refresh it.
    this.retryLogin();
      }
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
  }
};
</script>

<style>
.terms-privacy {
  margin-top: 10px;
  color: #fff; /* White text color */
}

.terms-privacy a {
  margin-right: 10px;
  color: #fff; /* White link color */
  text-decoration: none; /* Removes the underline */
}

.terms-privacy a:hover {
  color: #cd9bea; /* Color change on hover */
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #444;
  border-radius: 10px;
  max-width: 400px;
  margin: 0 auto;
}

.login-container h3 {
  font-size: 18px;
  background-color: #444;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 20px;
  color: #fff;
  text-align: center;
  width: 100%;
}

.login-container h2 {
  font-size: 20px;
  color: #fff;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

form label {
  margin-bottom: 10px;
  color: #444;
}

form input[type="email"],
form input[type="password"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  border: none;
  font-size: 16px;
}

@media screen and (max-width: 480px) {
  .login-container h2 {
    font-size: 18px;
  }

  .login-container h3 {
    font-size: 16px;
  }
}

@media screen and (min-width: 481px) and (max-width: 768px) {
  .login-container h2 {
    font-size: 20px;
  }

  .login-container h3 {
    font-size: 18px;
  }
}

@media screen and (min-width: 769px) {
  .login-container h2 {
    font-size: 22px;
  }

  .login-container h3 {
    font-size: 18px;
  }
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
  margin-bottom: 10px;
}

.down-text a {
  color: inherit; /* Inherits the text color of the parent element */
}

.login-container .captcha-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}

.login-container .captcha-image {
  width: 80%;
  background-color: white;
}

.login-container .captcha-input-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.login-container .captcha-input {
  flex: 1;
  height: 25px;
  font-size: 16px;
  margin-right: 10px;
}

.login-container .fa-sync-alt {
  cursor: pointer;
  color: white;
  font-size: 24px;
}
</style>
