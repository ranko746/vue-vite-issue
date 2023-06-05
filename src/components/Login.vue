<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="submit">
      <div id="google-signup-button"></div>
    </form>
    <h3 class="down-text">
      New to IO.day? <router-link to="/Register">Register</router-link>
    </h3>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="message" class="message">{{ message }}</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      error: "",
      message: "",
    };
  },
  methods: {
    async submit() {
      const google = window.google;
      google.accounts.id.initialize({
        client_id: "403171602463-oac6ner4h90qagerhnr0753dq070lacq.apps.googleusercontent.com",
        callback: this.handleCredentialResponse.bind(this),
      });
      google.accounts.id.renderButton(
        document.getElementById("google-signup-button"),
        {
          theme: "dark",
          size: "large",
          width: "100%",
          context: "signup",
        }
      );
    },
    async handleCredentialResponse(response) {
      if (response.credential) {
        const authid = response.credential;
        this.submitWithAuthId(authid);
      }
    },
    async submitWithAuthId(authid) {
  try {
    const response = await axios.post("http://localhost:4000/login", {
      authid: authid,
    }, {
      withCredentials: true, // Send the cookie with the request
    });
    if (response.data.success) {
      // Check if the set-cookie header is present and has at least one element
      const cookies = response.headers['set-cookie'];
      if (cookies && cookies.length > 0) {
        const cookie = cookies[0];
        document.cookie = cookie;
      }

      this.$router.push("/dashboard"); // Redirect to the dashboard upon successful registration
    }
  } catch (error) {
    console.error(error);
    if (error.response && error.response.data.message) {
      this.error = error.response.data.message;
    } else {
      this.error = "An error occurred during registration.";
    }
  }
},
},
  mounted() {
    this.submit();
  },
};
</script>

<style src="./Login.css"></style>