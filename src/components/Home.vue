<template>
  <div>
    <div class="search-container">
      <h1><i id="flag-start" class="flag-icon"></i> Domain Names For Free! <i id="flag-end" class="flag-icon"></i></h1>
      <div class="search-form">
        <input type="text" v-model="searchTerm" onkeypress="return /^[a-zA-Z0-9-]*$/.test(event.key)" class="home-search" placeholder="Check availability..." maxlength="63">
        <select v-model="selectedDomain" class="subdomain-select">
          <option disabled value="">Select a ...</option>
          <option value=".xyz.wf">.xyz.wf</option>
          <option value=".lag.tf">.lag.tf</option>
          <option value=".scar.ai">.scar.ai</option>
          <option value=".memy.app">.memy.app</option>
        </select>
        <button class="search-button" @click="checkDomain">GO</button>
      </div>
      <div id="domain-result" class="result-section" v-if="showDomainResultContent">
        <button id="close-domain-result" class="close-button" @click="closeDomainResult">&times;</button>
        <div id="domain-result-content" class="result-content" v-html="domainResultMessage"></div>
      </div>
      <div class="captcha-container">
      <img :src="captchaImage" class="captcha-image" />
      <i class="fas fa-sync-alt" v-if="!isCaptchaRefreshCooldown" @click="refreshCaptcha" style="cursor: pointer; color: white; font-size: 24px;"></i>
    </div>
      <input type="text" v-model="captcha" class="captcha-input" placeholder="Enter captcha" />
    <div class="features-section">
      <h2>Made.my - Free Dynamic DNS Hosting!</h2>
      <div class="social-icons">
        <a href="https://discord.gg/your_invite_link" target="_blank" rel="noopener noreferrer">
          <i class="fab fa-discord fa-lg circle-icon"></i>
        </a>
        <a href="https://t.me/your_telegram_group" target="_blank" rel="noopener noreferrer">
          <i class="fab fa-telegram-plane fa-lg circle-icon"></i>
        </a>
        <a href="https://medium.com/your_medium_profile" target="_blank" rel="noopener noreferrer">
          <i class="fab fa-medium fa-lg circle-icon"></i>
        </a>
      </div>
      <div class="terms">
        <p>
          <a href="https://docs.made.my/terms-of-use" target="_blank" rel="noopener noreferrer">Terms of Use</a>
          &nbsp;|&nbsp;
          <a href="https://docs.made.my/privacy-statement" target="_blank" rel="noopener noreferrer">Privacy Statement</a>
        </p>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <h3>Free and Awesome!</h3>
          <p>Get a free permanent domain name for your website and project!</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-thumbs-up"></i>
          </div>
          <h3>Easy to Use</h3>
          <p>Our interface is designed to be user-friendly, allowing you to easily register and efficiently manage your domain.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-sync"></i>
          </div>
          <h3>Automated DNS Management</h3>
          <p>Keep your domain up to date with our API support.</p>
        </div>
      </div>
      <footer class="footer-section">
        <h4 class="h469">Support us with Crypto Donations:</h4>
        <div class="crypto-donations">
          <div class="crypto-donation">
            <i class="fab fa-bitcoin fa-lg"></i>
            <p>Bitcoin: <span class="crypto-address">1B5eeRS9RGW4bp3ij3p7ckg3ScWmqU4ENE</span></p>
          </div>
          <div class="crypto-donation">
            <i class="fab fa-ethereum fa-lg"></i>
            <p>Ethereum/ERC20/BEP20: <span class="crypto-address">0xdD678f7b30f8AD0793b48E6E93940d76233b780d</span></p>
          </div>
        </div>
      </footer>      
    </div>
  </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      searchTerm: '',
      subdomainName: '',
      selectedDomain: '',
      showDomainResultContent: false,
      domainResultMessage: '',
      captchaImage: '',
    captcha: '',
    refreshCaptchaCooldown: 0,
    isCaptchaRefreshCooldown: false,
    isCaptchaRefreshDisabled: false,
      cooldownDuration: 500, // Cooldown duration in milliseconds
    }
  },
  mounted() {
    this.fetchCaptcha();

    document.querySelectorAll('.crypto-donation').forEach(el => {
      el.addEventListener('click', this.copyCryptoAddress);
    });
    this.setRandomFlags();
    setInterval(() => {
      this.setRandomFlags();
    }, 6000); // 5 seconds
  },
  methods: {
    copyCryptoAddress(event) {
  const cryptoAddress = event.currentTarget.querySelector('.crypto-address');
  cryptoAddress.classList.add('copied');
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = cryptoAddress.textContent;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand('copy');
  document.body.removeChild(tempTextArea);

  const cryptoDonation = event.currentTarget;
  cryptoDonation.classList.add('copied');
  setTimeout(() => {
    cryptoDonation.classList.remove('copied');
    cryptoAddress.classList.remove('copied');
  }, 1000);
},
    closeDomainResult() {
      this.showDomainResultContent = false;
    },
    getRandomFlag() {
      const flags = [
        'us', 'gb', 'ca', 'fr', 'de', 'it', 'es', 'br', 'in', 'jp', 'cn', 'tf', 'au', 'za', 'kr', 'se', 'nl', 'mx', 'my', 'id', 'ph'
        // More country soon
      ];

      return flags[Math.floor(Math.random() * flags.length)];
    },
    setRandomFlags() {
      let startFlag = this.getRandomFlag();
      let endFlag = this.getRandomFlag();

      // Ensure that the startFlag and endFlag are not the same
      while (startFlag === endFlag) {
        endFlag = this.getRandomFlag();
      }

      // Remove old flags and add new ones
      const startFlagElement = document.getElementById('flag-start');
      const endFlagElement = document.getElementById('flag-end');
      startFlagElement.className = 'flag-icon';
      endFlagElement.className = 'flag-icon';
      startFlagElement.classList.add(`flag-icon-${startFlag}`);
      endFlagElement.classList.add(`flag-icon-${endFlag}`);
    },
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
    this.domainResultMessage = '<div class="message error" role="alert">Please wait before refreshing the captcha again.</div>';
    this.showDomainResultContent = true;
    this.isCaptchaRefreshCooldown = true; // Set cooldown to true

    // Hide the refresh button for the duration of the cooldown
    setTimeout(() => {
      this.isCaptchaRefreshCooldown = false;
    }, this.cooldownDuration);
    return;
  }

  this.fetchCaptcha();
  this.refreshCaptchaCooldown = currentTime; // Update the last refresh timestamp
  this.captcha = ''; // Clear the captcha input field
},
async checkDomain() {
  if (this.searchTerm === '') {
    this.domainResultMessage = '<div class="message error" role="alert">Please enter a domain name to check availability.</div>';
    this.showDomainResultContent = true;
    return;
  }

  if (this.searchTerm.length < 3) {
    this.domainResultMessage = '<div class="message error" role="alert">Search term must be at least 3 characters long.</div>';
    this.showDomainResultContent = true;
    return;
  }

  const response = await fetch(`http://localhost:4000/checkdomain?registerTerm=${encodeURIComponent(this.searchTerm)}&selectedDomain=${encodeURIComponent(this.selectedDomain)}&captcha=${encodeURIComponent(this.captcha)}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 200) {
    this.domainResultMessage = `<div class="message success" role="alert">Domain <strong>${this.searchTerm}${this.selectedDomain}</strong> is available!&nbsp;&nbsp;&nbsp;</div>`;
    this.captcha = ''; // Reset captcha input
    this.fetchCaptcha(); // Fetch a new captcha image
  } else if (response.status === 400) {
    this.domainResultMessage = `<div class="message error" role="alert">Domain <strong>${this.searchTerm}${this.selectedDomain}</strong> is not available.&nbsp;&nbsp;&nbsp;</div>`;
    this.refreshCaptcha(); // Refresh the captcha
    this.captcha = ''; // Clear captcha input field
  } else {
    if (response.status === 470) {
      this.domainResultMessage = `<div class="message error" role="alert">Invalid captcha.&nbsp;&nbsp;&nbsp;</div>`;
      this.refreshCaptcha(); // Refresh the captcha
      this.captcha = ''; // Clear captcha input field
    } else {
      const responseData = await response.json();
      if (response.status === 490) {
        this.domainResultMessage = `<div class="message error" role="alert">Invalid domain extension. Please choose a valid one.&nbsp;&nbsp;&nbsp;</div>`;
      } else {
        this.domainResultMessage = `<div class="message error" role="alert">Domain <strong>${this.searchTerm}${this.selectedDomain}</strong> is not available. ${responseData.message}&nbsp;&nbsp;&nbsp;</div>`;
      }
      this.refreshCaptcha(); // Refresh the captcha
      this.captcha = ''; // Clear captcha input field
    }
  }

  this.showDomainResultContent = true;
},
  },
}
</script>

<style src="./Home.css"></style>