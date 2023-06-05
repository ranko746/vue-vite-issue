<template>
  <div>
    <p class="apifont">
      Your API Key:
      <span :class="apiKeyVisible ? 'visible' : 'hidden'">{{ api_key }}</span>
      <i
        :class="apiKeyVisible ? 'fas fa-eye-slash eye-icon' : 'fas fa-eye eye-icon'"
        @click="toggleAPIKeyVisibility"
      ></i>
    </p>
    <button class="copy-button" @click="copyAPIKey">
      <i class="fas fa-copy"></i>
    </button>
    <button class="new-api-key-button" @click="createNewAPIKey">
      <i class="fas fa-plus"></i>
    </button>
    <transition name="fade">
      <p
        v-if="copySuccess || newAPIKeySuccess || cooldownError"
        :class="copySuccess ? 'copy-success' : (newAPIKeySuccess ? 'new-api-key-success' : 'cooldown-error')"
      >
        {{
          copySuccess
            ? 'API Key copied!'
            : newAPIKeySuccess
              ? "New API Key created! Don't forget to update your clients!"
              : cooldownError
        }}
      </p>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      copySuccess: false,
      newAPIKeySuccess: false,
      cooldownError: '',
      lastApiKeyGenerationTime: 0,
      apiKeyCooldownSeconds: 10,
      apiKeyVisible: true, // Set to true to make the API key visible by default
      userEmail: null,
      api_key: '',
    };
  },
  async mounted() {
    const storedLastApiKeyGenerationTime = localStorage.getItem('lastApiKeyGenerationTime');
  if (storedLastApiKeyGenerationTime) {
    this.lastApiKeyGenerationTime = parseInt(storedLastApiKeyGenerationTime, 10);
  }
  // Fetch the user's email data from the server on component mount
  try {
    const responseEmail = await fetch("http://localhost:4000/validateshowemail", {
      method: "GET",
      credentials: "include",
    });
    if (responseEmail.ok) {
      const dataEmail = await responseEmail.json();
      if (dataEmail.message === "Welcome") {
    this.userEmail = dataEmail.email;
    this.api_key = dataEmail.api_key;
  }
    } else if (responseEmail.status === 401) {
      console.log("Authentication error:", responseEmail.status);
      this.userEmail = null;
    } else {
      console.log("Server error:", responseEmail.status);
    }

    // Fetch the user's domain data from the server using the /showuserdomain endpoint
    const responseDomain = await fetch("http://localhost:4000/showuserdomain", {
      method: "GET",
      credentials: "include",
    });
    if (responseDomain.ok) {
      const dataDomain = await responseDomain.json();
      this.userDomainData = dataDomain;
      this.userDomainData.reverse();
    } else {
      console.log("Error fetching user domain data:", responseDomain.status);
    }
  } catch (err) {
    console.error("Error retrieving user data:", err);
  }
},
  methods: {
    toggleAPIKeyVisibility() {
      this.apiKeyVisible = !this.apiKeyVisible;
    },
    async copyAPIKey() {
    try {
      await navigator.clipboard.writeText(this.api_key);
      this.copySuccess = true;
      setTimeout(() => {
        this.copySuccess = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy API key: ', err);
    }
  },
  async createNewAPIKey() {
  this.newAPIKeySuccess = false; // Reset success message

  const currentTime = Date.now();
  const timeSinceLastGeneration = currentTime - this.lastApiKeyGenerationTime;
  const remainingTime = Math.ceil((this.apiKeyCooldownSeconds * 1000 - timeSinceLastGeneration) / 1000);

  if (timeSinceLastGeneration < this.apiKeyCooldownSeconds * 1000) {
    this.cooldownError = `Please wait ${remainingTime} seconds before generating a new API key.`;
    setTimeout(() => {
      this.cooldownError = '';
    }, 3000); // Show the error message for 3 seconds
    return;
  }

  try {
    const response = await fetch("http://localhost:4000/new-api-key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include the cookie in the request
    });

    if (response.ok) {
      const data = await response.json();
    this.api_key = data.api_key;
      this.newAPIKeySuccess = true;
      this.lastApiKeyGenerationTime = currentTime;
      localStorage.setItem('lastApiKeyGenerationTime', this.lastApiKeyGenerationTime);
      setTimeout(() => {
        this.newAPIKeySuccess = false;
      }, 3000);
    } else if (response.status === 419) {
      console.error("User session has expired");
    } else {
      console.error("Failed to create a new API key");
    }
  } catch (error) {
    console.error("Error creating a new API key:", error);
  }
},
  },
};
</script>
