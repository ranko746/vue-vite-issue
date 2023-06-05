<template>
  <div class="dashboard-container">
    <header>
      <nav>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li>
            <a href="https://docs.made.my/" target="_blank" rel="noopener noreferrer">Docs</a>
          </li>          
          <li><router-link to="/stats">Stats</router-link></li>
          <li><router-link to="/dashboard">Dashboard</router-link></li>
        </ul>
      </nav>
    </header>
    <h1>Welcome {{ userEmail }}</h1>
    <api-buttons></api-buttons>
    <h3>Register a domain:</h3>
    <form>
      <div class="form-groupdashboard">
        <input
        type="text"
        v-model="registerTerm"
        @paste="onPaste"
        @keypress="validateInput"
        class="register-search"
        placeholder="Register domain..."
        maxlength="40"
      />      
          <select v-model="selectedDomain" class="domain-select">
          <option disabled value="">Select a domain extension</option>
          <option>.lag.tf</option>
          <option>.app.mq</option>
          <option>.scar.ai</option>
          <option>.memy.app</option>
        </select>
      </div>     
      <p v-if="registerMessage" class="successmessagedomain">{{ registerMessage }}</p> 
      <p v-if="errorMessage" class="errormessagedomain">{{ errorMessage }}</p>
      <div>
        <button type="button" class="button-register" @click="showRegisterPopup = true">Register</button>
        <div v-if="showRegisterPopup" class="popup">
          <div class="popup-content">
            <p>Are you sure you want to register this domain?</p>
            <div class="side-by-side-buttons">
              <button @click="registerDomainWithDelay" class="yes-button-register" style="margin-right: 10px;">Yes</button>
              <button @click="showRegisterPopup = false" class="no-button-register" style="margin-left: 10px;">No</button>
            </div>
          </div>
        </div>        
      </div>
    </form>
    <button v-if="userEmail" class="logoutbutton" @click="showLogoutPopup = true">Logout</button>
    <div class="table-container">
      <h44 class="h44">{{ userDomainCount }} / 10 domains</h44>
      <table>
        <thead>
          <tr>
            <th>Domain Name</th>
            <th>DNS Record</th>
            <th></th>
          </tr>
        </thead>
        <tbody v-if="userDomainData.length > 0">
          <tr v-for="(domain, index) in userDomainData" :key="index">
            <td>{{ domain.name }}{{ domain.extension }}</td>
            <td>
              <router-link :to="`/dns`" :class="`router-link routerlinkmanagedns`">Manage DNS</router-link>
            </td>
            <td>
              <button type="button" class="button-deletedomain" @click="showDeleteDomainPopup[index] = true; domainToDeleteIndex = index">Delete</button>
              <div class="popup" v-if="showDeleteDomainPopup[index]">
                <div class="popup-content">
                  <p>Are you sure you want to delete {{ domain.name }}{{ domain.extension && domain.extension }}?</p>
                  <p>Type the domain name below to confirm:</p>
                  <input type="text" v-model="domainToDelete" class="delete-domain-input">
                  <div>
                  <p v-if="deleteDomainError" class="errormessagedeletedomain">{{ deleteDomainError }}</p>
                  <button @click="validateAndDeleteDomain(domainToDeleteIndex)" class="yes-button" style="margin-right: 10px;">Yes</button>
                  <button @click="showDeleteDomainPopup[index] = false; domainToDelete = ''" class="no-button" style="margin-left: 10px;">No</button>
                  </div>
                </div>
              </div>                                   
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="3" style="text-align: center;">You have no domains registered.</td>
          </tr>
        </tbody>                       
      </table>
    </div>
    <div v-if="showLogoutPopup" class="popup">
      <div class="popup-content">
        <p>Are you sure you want to log out?</p>
        <div class="side-by-side-buttons">
          <button @click="handleLogout" class="yes-button-logout" style="margin-right: 10px;">Yes</button>
          <button @click="showLogoutPopup = false" class="no-button-logout" style="margin-left: 10px;">No</button>
        </div>
      </div>
    </div>
    <div class="domain-register-container">
    </div>
  </div>
</template>

<script>
import ApiButtons from './ApiButtons.vue';

export default {
  components: {
    ApiButtons,
  },
  name: "Dashboard",
  data() {
  return {
    userEmail: null,
    userDomains: [],
    userDomainData: [], // Add new property to hold user's domain data
    showRegisterPopup: false,
    showLogoutPopup: false,
    copySuccess: false,
    cooldownError: '',
    showDeleteDomainPopup: [],
    domainToDelete: "",
    deleteDomainError: "",
    registerTerm: "",
    selectedDomain: "",
    errorMessage: "",
    registerMessage: "",
  };
},
computed: {
    userDomainCount() {
      return this.userDomainData.length;
    }
  },
async mounted() {
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
    onPaste(event) {
  event.preventDefault(); // Prevent the default paste action
  const pastedText = event.clipboardData.getData('text'); // Get the pasted text
  let allowedText;
  if (/^xn--/.test(pastedText)) { // Check if the pasted text contains IDN
    allowedText = pastedText; // Allow the pasted text if it contains IDN
  } else {
    allowedText = pastedText.replace(/[^a-zA-Z0-9-]/g, ''); // Remove any unallowed characters if the pasted text does not contain IDN
  }
  this.registerTerm += allowedText; // Append the allowed text to the registerTerm
},
validateInput(event) {
  const regex = /^([a-zA-Z0-9-]|[\u0080-\uFFFF])*$/;
  if (!regex.test(event.key)) {
    event.preventDefault(); // Prevent the input if the key pressed is not allowed
  }
},
onPaste(event) {
  event.preventDefault(); // Prevent the default paste action
  const pastedText = event.clipboardData.getData('text'); // Get the pasted text
  const allowedText = pastedText.replace(/[^a-zA-Z0-9\u0080-\uFFFF-]/g, ''); // Remove any unallowed characters
  this.registerTerm += allowedText; // Append the allowed text to the registerTerm
},
    async handleLogout() {
      try {
        const response = await fetch("http://localhost:4000/logout", {
          method: "POST",
          credentials: "include",
        });
        if (response.ok) {
          console.log("User logged out");
          this.userEmail = null; // Clear the userEmail data property
          this.showPopup = false; // Close the popup window
          this.$router.push("/"); // Redirect the user to the home page
        } else {
          console.log("Error logging out:", response.status);
        }
      } catch (err) {
        console.error("Error logging out:", err);
      }
    },
    async registerDomainWithDelay() {
      this.showRegisterPopup = false;
      setTimeout(this.registerDomain, 800); // Call registerDomain function after 5 seconds
    },
    async registerDomain() {
  // Reset error message
  this.errorMessage = "";

  // Validate input
  if (!this.registerTerm || !this.selectedDomain) {
  this.errorMessage = "Please fill out both the domain name and extension.";
  return;
}

if (this.registerTerm.trim().length < 3) {
    this.errorMessage = "Domain names must be at least 3 characters long.";
    return;
  }

const domainName = this.registerTerm.trim() + "." + this.selectedDomain;
if (/^-|-$/.test(domainName) || domainName.includes("--") || /-$/.test(this.registerTerm.trim())) {
  this.errorMessage = "Domain names cannot start or end with a hyphen or contain consecutive hyphens.";
  return;
}

  // Send data to server
  try {
    const response = await fetch("http://localhost:4000/registerdomain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        registerTerm: this.registerTerm,
        selectedDomain: this.selectedDomain,
      }),
      credentials: "include",
    });
    if (response.ok) {
  const data = await response.json();
  console.log("Domain registered:", data);
  const { name, extension } = data;
  this.userDomains.push({ name, extension }); // Add new domain to userDomains array
  this.registerTerm = ""; // Clear the input field
  this.selectedDomain = ""; // Clear the select field
  this.registerMessage = data.message;
  await this.fetchDomains();

  // Clear the registerMessage after 5 seconds
  setTimeout(() => {
    this.registerMessage = "";
  }, 5000);
} else if (response.status === 419) {
  console.log("Session expired");
  this.errorMessage = "Your session has expired, please log in again.";
  await this.fetchDomains();

} else if (response.status === 490) {
      console.log("Invalid domain extension");
      this.errorMessage = "Invalid domain extension. Please choose a valid one.";

  // Clear the errorMessage after 5 seconds
  setTimeout(() => {
    this.errorMessage = "";
  }, 5000);
} else {
  console.log("Error registering domain:", response.status);
  this.errorMessage = "An error occurred while registering the domain.";
  await this.fetchDomains();

  // Clear the errorMessage after 5 seconds
  setTimeout(() => {
    this.errorMessage = "";
  }, 5000);
}
} catch (err) {
  console.error("Error registering domain:", err);
  this.errorMessage = "An error occurred while registering the domain.";
  await this.fetchDomains();

  // Clear the errorMessage after 5 seconds
  setTimeout(() => {
    this.errorMessage = "";
  }, 5000);
}
},
async fetchDomains() {
  try {
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
    console.error("Error refreshing user data:", err);
  }
},
async deleteDomain(index) {
  const domain = this.userDomainData[index];
  const regex = /^([^.]+)\.(.*)$/; // Regular expression to extract domain name and extension
  const match = domain.name.match(regex);
  const domainName = match[1]; // Extract domain name from the match object
  const extension = match[2]; // Extract extension from the match object

  try {
    const response = await fetch("http://localhost:4000/deletedomain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        domain: domainName + "." + extension, // Use the extracted domain name and extension
      }),
      credentials: "include",
    });

    if (response.ok) {
  const data = await response.json();
  console.log("Domain deleted:", data);
  this.showDeleteDomainPopup = new Array(this.userDomainData.length).fill(false);
  // Remove the deleted domain from the userDomainData array
  this.userDomainData.splice(index, 1);
  await this.fetchDomains();
  this.registerMessage = "Domain has been successfully deleted.";

  // Clear the registerMessage after 5 seconds
  setTimeout(() => {
    this.registerMessage = "";
  }, 5000);
} else if (response.status === 419) {
  console.log("Session expired");
  this.errorMessage = "Your session has expired, please log in again.";
  this.showDeleteDomainPopup[index] = false;
  // Add logic to redirect to login page or show a popup for login

  // Clear the errorMessage after 5 seconds
  setTimeout(() => {
    this.errorMessage = "";
  }, 5000);
} else {
  console.log("Error deleting domain:", response.status);
  await this.fetchDomains();
  this.errorMessage = "An error occurred while deleting the domain.";

  // Clear the errorMessage after 5 seconds
  setTimeout(() => {
    this.errorMessage = "";
  }, 5000);
}
} catch (err) {
  console.error("Error deleting domain:", err);
  await this.fetchDomains();
  this.errorMessage = "An error occurred while deleting the domain.";

  // Clear the errorMessage after 5 seconds
  setTimeout(() => {
    this.errorMessage = "";
  }, 5000);
}

  this.showDeleteDomainPopup[index] = false; // Set popup value to false for corresponding index
},
validateAndDeleteDomain(index) {
  const domain = this.userDomainData[index];
  const combinedDomain = domain.extension ? domain.name + domain.extension : domain.name;

  if (this.domainToDelete.toLowerCase() === combinedDomain.toLowerCase()) {
    this.deleteDomainError = "";
    this.deleteDomain(index);
    this.domainToDelete = ""; // Add this line to clear the domainToDelete variable
  } else {
    this.deleteDomainError = "The domain name is wrong. Please double-check and fix any spacing errors.";
  }
},
async handleRefresh() {
  const DEBOUNCE_TIMEOUT_MS = 600; // set debounce timeout

  if (this.refreshTimeoutId) {
    // if there is already a timeout set, clear it to prevent multiple requests
    clearTimeout(this.refreshTimeoutId);
  }

  // set a new timeout for the debounce interval
  this.refreshTimeoutId = setTimeout(async () => {
    try {
      const responseDomain = await fetch("http://localhost:4000/showuserdomain", {
        method: "GET",
        credentials: "include",
      });
      if (responseDomain.ok) {
        const dataDomain = await responseDomain.json();
        this.userDomainData = dataDomain;
        this.userDomainData.reverse(); // Reverse the order of the userDomainData array
        this.registerMessage = "";
      } else {
        console.log("Error fetching user domain data:", responseDomain.status);
      }
    } catch (err) {
      console.error("Error refreshing user data:", err);
    }
  }, DEBOUNCE_TIMEOUT_MS);
}
  },
};
</script>

<style src="./Dashboard.css"></style>