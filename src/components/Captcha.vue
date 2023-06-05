<template>
  <div class="captcha-container">
    <div class="captcha-image-container">
      <img :src="captchaImage" class="captcha-image" />
    </div>
    <div class="captcha-input-container">
      <input type="text" v-model="captcha" class="captcha-input" placeholder="Enter captcha" />
      <i class="fas fa-sync-alt" v-if="!isCaptchaRefreshCooldown" @click="refreshCaptcha"></i>
    </div>
    <div class="captcha-error" v-if="captchaError">
      <div class="error-box">
        {{ captchaError }}
        <i class="fas fa-times error-close" @click="clearCaptchaError"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Captcha',
  data() {
    return {
      captchaImage: '',
      captcha: '',
      refreshCaptchaCooldown: 0,
      isCaptchaRefreshCooldown: false,
      cooldownDuration: 500, // Cooldown duration in milliseconds
      captchaError: '',
    };
  },
  mounted() {
    this.fetchCaptcha();
  },
  methods: {
    async fetchCaptcha() {
      try {
        const response = await fetch('http://localhost:4000/captcha');
        const data = await response.text();
        this.captchaImage = `data:image/svg+xml;base64,${btoa(data)}`;
      } catch (error) {
        console.error('Error fetching captcha:', error);
      }
    },
    refreshCaptcha() {
      const currentTime = Date.now();
      if (currentTime - this.refreshCaptchaCooldown < this.cooldownDuration) {
        this.captchaError = 'Please wait before refreshing the captcha again.';
        return;
      }

      this.fetchCaptcha();
      this.refreshCaptchaCooldown = currentTime; // Update the last refresh timestamp
    },
    validateCaptcha() {
      // Validate the captcha input
      if (this.captcha === '') {
        this.captchaError = 'Please enter the captcha.';
        return false;
      }

      // Clear any existing error
      this.captchaError = '';
      return true;
    },
    emitCaptchaError() {
      if (!this.validateCaptcha()) {
        this.$emit('captcha-error', this.captchaError);
      }
    },
    clearCaptchaError() {
      this.captchaError = '';
    },
  },
};
</script>

<style scoped>
.captcha-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.captcha-image {
  background-color: white;
}

.captcha-input-container {
  display: flex;
  align-items: center;
}

.captcha-input {
  height: 30px;
  font-size: 16px;
}

.captcha-error {
  margin-bottom: 10px;
}

.error-box {
  display: inline-block;
  background-color: #ffe5e5;
  color: red;
  font-size: 15px;
  padding: 6px 12px;
  border-radius: 4px;
}

.error-close {
  cursor: pointer;
  color: #1e1b1b;
  font-size: 12px;
  margin-left: 5px;
}

.fa-sync-alt {
  cursor: pointer;
  color: white;
  font-size: 24px;
  margin-left: 10px;
}
</style>