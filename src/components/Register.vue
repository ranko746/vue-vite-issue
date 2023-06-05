<template>
  <div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="submit">
      <div id="google-signup-button"></div>
    </form>
    <h3 class="down-text">
      Already registered? <router-link to="/Login">Login</router-link>
    </h3>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="message" class="message">{{ message }}</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Register",
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
        callback: this.handleCredentialResponse,
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
    handleCredentialResponse(response) {
      if (response.credential) {
        this.submitWithAuthId(response.credential);
      }
    },
    async submitWithAuthId(authid) {
      try {
        const response = await axios.post("http://localhost:4000/register", {
          authid,
        });
        console.log(response.data);
        if (response.data.success) {
          this.$router.push("/success");
        }
      } catch (error) {
        console.error(error);
        if (error.response?.data?.message) {
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

<style src="./Register.css"></style>