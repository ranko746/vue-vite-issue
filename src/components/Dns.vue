<template>
  <div class="dnsmaintablecontainer">
    <h4>Please select your domain:</h4>
    <api-buttons></api-buttons>
    <br>
    <select v-model="selectedDomain" class="selectedDomain" @change="getSelectedDomainRecords()">
      <option disabled value="">Select your domain (Click here)</option>
      <option v-for="domain in userDomains.slice().reverse()" :key="domain.name" :value="domain.name">
        {{ domain.name }}
      </option>
    </select>
  <div v-if="showSelectDomainError" class="error-message2">Please select a domain first.</div>
  <br>
  <button class="recordbutton" @click="handleAddRecordClick">Add Record</button>
  <div class="add-record-popup" v-if="showAddRecordPopup">
    <div class="add-record-popup-content">
      <h5 v-if="!isEditing">Add Record for {{ selectedDomain }}</h5>
      <h5 v-else>Edit Record for {{ editRecordTitle }}</h5>
      <label v-if="!isEditing" for="recordtypelist">Select Record Type</label>
      <select v-if="!isEditing" v-model="recordType" class="record-type">
        <option value="A">A (IPv4)</option>
        <option value="AAAA">AAAA (IPv6)</option>
        <option value="NS">NS</option>
        <option value="CNAME">CNAME</option>
        <option value="MX">MX</option>
        <option value="TXT">TXT</option>
      </select>
      <div class="form-group2" v-if="recordType !== 'MX' && recordType !== 'NS'">
        <label v-if="!isEditing" for="additionalSubdomain">Additional Subdomain (Optional)</label>
        <input v-if="!isEditing" type="text" id="additionalSubdomain" v-model="additionalSubdomain" class="form-control2">
        <label for="recordValue">Value</label>
        <input type="text" id="recordValue" v-model="recordValue" class="form-control2">
        <label for="recordTtl">Time to Live (TTL)</label>
        <select v-model="recordTtl" class="record-ttl">
          <option value="3600">1 hour</option>
          <option value="7200">2 hours</option>
          <option value="18000">5 hours</option>
          <option value="43200">12 hours</option>
          <option value="86400">1 day</option>
        </select>
      </div>
      <div class="form-group2" v-if="recordType === 'MX'">
        <label v-if="!isEditing" for="additionalSubdomain">Additional Subdomain (Optional)</label>
        <input v-if="!isEditing" type="text" id="additionalSubdomain" v-model="additionalSubdomain" class="form-control2">
        <label for="recordPriority">Priority Value 0-65535 (Required)</label>
        <input type="number" id="recordPriority" v-model="recordPriority" class="form-control2">
        <label for="recordValue">Value</label>
        <input type="text" id="recordValue" v-model="recordValue" class="form-control2">
        <label for="recordTtl">TTL</label>
        <select v-model="recordTtl" class="record-ttl">
          <option value="3600">1 hour</option>
          <option value="7200">2 hours</option>
          <option value="18000">5 hours</option>
          <option value="43200">12 hours</option>
          <option value="86400">1 day</option>
        </select>
      </div>
      <div class="form-group2 ns-value" v-if="recordType === 'NS'">
        <label v-if="!isEditing" for="additionalSubdomain">Additional Subdomain (Optional)</label>
        <input v-if="!isEditing" type="text" id="additionalSubdomain" v-model="additionalSubdomain" class="form-control2">
        <label for="recordValue">Name Servers (one per line)</label>
        <textarea id="recordValue" v-model="recordValue" class="form-control2" placeholder="ns1.example.com&#10;ns2.example.com&#10;ns3.example.com" style="box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);"></textarea>
        <label for="recordTtl">TTL</label>
        <select v-model="recordTtl" class="record-ttl">
          <option value="3600">1 hour</option>
          <option value="7200">2 hours</option>
          <option value="18000">5 hours</option>
          <option value="43200">12 hours</option>
          <option value="86400">1 day</option>
        </select>
      </div>       
      <button @click="addRecord" class="add-record-button">Confirm</button>
      <button @click="showAddRecordPopup = false; resetInputFields()" class="cancel-button2">Cancel</button>
    </div>
  </div> 
  <button @click="showDeleteAllRecordsPopup = true" class="deleteall-record-button">Delete All Records</button>
  <div v-if="showDeleteAllRecordsPopup" class="popup">
    <div class="popup-content">
      <p>Are you sure you want to delete all records?</p>
      <p>Type "confirm" to proceed:</p>
      <input type="text" v-model="confirmDelete" class="form-control2">
      <button @click="deleteallRecord" class="yes-button2" :disabled="confirmDelete.toLowerCase() !== 'confirm'">Yes</button>
      <button @click="showDeleteAllRecordsPopup = false; confirmDelete = ''" class="no-button2">No</button>
      <p v-if="confirmDelete && confirmDelete.toLowerCase() !== 'confirm'" class="error-message">Invalid value. Please type "confirm" to proceed.</p>
    </div>
  </div>  
  <div v-if="errorMessage" class="error-message2">{{ errorMessage }}</div>
  <div v-if="errorMessage2" class="error-message3" v-show="showErrorMessage2">{{ errorMessage2 }}</div>
  <div v-if="successMessage" class="success-message2">{{ successMessage }}</div>
  <div v-if="successMessage2" class="success-message3" v-show="showSuccessMessage2">{{ successMessage2 }}</div>
  <br>
  <h45>{{ userRecordCount }} / 20 Records</h45>   
  <div class="dnstable-container">
    <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Name</th>
          <th>Content</th>
          <th>Priority</th>
          <th>TTL</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="selectedDomainRecords.length === 0">
          <td colspan="5">{{ noRecordsMessage }}</td>
        </tr>
        <tr v-for="(record, index) in selectedDomainRecords" :key="record.id">
          <td>{{ record.type }}</td>
          <td>{{ record.additionalsubdomain ? record.additionalsubdomain : selectedDomain }}</td>
          <td>
            {{
              record.type === 'MX'
                ? record.value.split(' ')[1]
                : record.type === 'NS'
                ? record.nsRecords.join(', ')
                : record.value
            }}
          </td>          
          <td>{{ record.type === 'MX' ? record.value.split(' ')[0] : 'N/A' }}</td>
          <td>{{ formatTtl(record.ttl) }}</td>
          <td>
            <div class="button-wrapper">
              <button class="edit-record-button2" @click="handleEditRecordClick(record)">Edit</button>
              <button class="delete-record-button2" @click="showDeleteRecordPopup[index] = true">Delete</button>
            </div>
            <div class="popup" v-if="showDeleteRecordPopup[index]">
              <div class="popup-content">
                <p>Are you sure you want to delete this record?</p>
                <button @click="deleteRecord(record.id, index)" class="yes-button2">Yes</button>
                <button @click="showDeleteRecordPopup[index] = false" class="no-button2">No</button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>  
</div>
</template>

<script>
import ApiButtons from './ApiButtons.vue';

export default {
  components: {
    ApiButtons,
  },
  name: "Dns",
  data() {
  return {
    selectedDomainRecords: [],
    noRecordsMessage: "You have no records OR you have not selected a domain.",
    userDomains: [],
    selectedDomain: "",
    errorMessage: "",
    successMessage: "",
    successMessage2: "",
    editingRecordId: null,
    errorMessage2: "",
    hideMessages: false,
    recordTypeOptions: [
      { value: "A", label: "A" },
      { value: "AAAA", label: "AAAA" },
      { value: "CNAME", label: "CNAME" },
      { value: "MX", label: "MX" },
      { value: "TXT", label: "TXT" },
      { value: "NS", label: "NS" },
    ],
    recordType: "",
    recordValue: "",
    recordTtl: "",
    editRecordTitle: '',
    confirmDelete: '',
    recordPriority: "0",
    additionalSubdomain: "",
    refreshTimeout: null,
    showAddRecordPopup: false,
    showSuccessMessage2: false,
    editingMode: false,
    originalAdditionalSubdomain: '',
    isEditing: false,
    showErrorMessage2: false,
    showDeleteAllRecordsPopup: false,
    showDeleteRecordPopup: [],
    showEditRecordPopup: [],
    showSelectDomainError: false,
  };
},
computed: {
  userRecordCount() {
    return this.selectedDomainRecords.length;
  }
},
watch: {
  selectedDomain(newVal) {
    if (newVal) {
      this.showSelectDomainError = false;
    }
  }
},
  methods: {
    async addRecord() {
      if (!this.editingMode && this.selectedDomainRecords.length >= 20) {
    this.errorMessage = "You have reached the maximum limit of 20 records.";
    this.showAddRecordPopup = false;
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
    return;
  }

  if (!this.selectedDomain) {
    this.showSelectDomainError = true;
    return;
  }

  if (!this.recordType && !this.recordValue) {
  this.errorMessage = "Please select a record type and enter a record value";
  this.showAddRecordPopup = false;
  this.resetInputFields();
  return;
}
if (!this.recordType) {
  this.errorMessage = "Please select a record type";
  this.showAddRecordPopup = false;
  this.resetInputFields();
  return;
}
if (!this.recordValue) {
  this.errorMessage = "Please enter a record value";
  this.showAddRecordPopup = false;
  this.resetInputFields();
  return;
}

    // Validate the A record value
    if (this.recordType === 'A') {
    const ipv4Regex = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (!ipv4Regex.test(this.recordValue)) {
      this.errorMessage = "Invalid IPv4 address format";
      this.showAddRecordPopup = false;
      this.resetInputFields();
      return;
    } else {
      this.errorMessage = ''; // clear error message
    }
    if (this.recordValue.length > 15) {
      this.errorMessage = "IPv4 address is too long";
      this.showAddRecordPopup = false;
      this.resetInputFields();
      return;
    } else {
      this.errorMessage = ''; // clear error message
    }
  }

// Validate the AAAA record value
if (this.recordType === 'AAAA') {
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/;
  if (!ipv6Regex.test(this.recordValue)) {
    this.errorMessage = "Invalid IPv6 address format";
    this.showAddRecordPopup = false;
    this.resetInputFields();
    return;
  } else {
    this.errorMessage = ''; // clear error message
  }
  
  if (this.recordValue.length > 45) {
    this.errorMessage = "IPv6 address is too long";
    this.showAddRecordPopup = false;
    this.resetInputFields();
    return;
  } else {
    this.errorMessage = ''; // clear error message
  }
}

// Validate the TXT record value
if (this.recordType === 'TXT') {
  if (this.recordValue.length > 255) {
    this.errorMessage = "TXT record value is too long";
    this.showAddRecordPopup = false;
    this.resetInputFields();
    return;
  } else if (this.recordValue.includes('\"')) {
    this.errorMessage = "TXT record value cannot contain [\"]";
    this.showAddRecordPopup = false;
    this.resetInputFields();
    return;
  } else {
    this.errorMessage = ''; // clear error message
  }
}

// Validate the CNAME/MX record value
if (this.recordType === 'CNAME' || this.recordType === 'MX') {
  const domainNameRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  if (!domainNameRegex.test(this.recordValue)) {
    this.errorMessage = "Invalid value format";
    this.showAddRecordPopup = false;
    this.resetInputFields();
    return;
  } else {
    // Additional validation to prevent first and last characters from being hyphens, and to prevent consecutive hyphens
    if (this.recordValue.startsWith('-') || this.recordValue.endsWith('-') || /--/.test(this.recordValue)) {
      this.errorMessage = "Invalid hyphen usage";
      this.showAddRecordPopup = false;
      this.resetInputFields();
      return;
    } else {
      this.errorMessage = ''; // clear error message
    }
  }
  if (this.recordValue.length > 255) {
    this.errorMessage = "Value is too long";
    this.showAddRecordPopup = false;
    this.resetInputFields();
    return;
  } else {
    this.errorMessage = ''; // clear error message
  }
}

  const domainParts = this.selectedDomain.split('.');
  const subdomain = domainParts[0];
  const domain = domainParts.slice(1).join('.');

  let recordValue = this.recordValue; // start with the value entered by the user

  // Validate the MX record priority
  if (this.recordType === "MX") {
  if (!this.recordPriority) {
    this.errorMessage = "Record priority cannot be empty";
    this.showAddRecordPopup = false;
    this.resetInputFields();
    return;
  } else if (this.recordPriority < 0 || this.recordPriority > 65535) {
    this.errorMessage = "Record priority must be between 0 and 65535";
    this.showAddRecordPopup = false;
    this.resetInputFields();
    return;
  } else {
    // concatenate the priority with the value
    recordValue = this.recordPriority + " " + recordValue;
    this.errorMessage = ""; // clear error message
  }
}

let nsRecords = [];

if (this.recordType === 'NS') {
  const lines = this.recordValue.split('\n');
  const nonEmptyLines = lines.filter(line => line.trim() !== '');
  const unwantedSymbolsRegex = /[^A-Za-z0-9-.]/;
  const domainNameRegex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])\.?$/;

  if (nonEmptyLines.length > 12) {
    this.errorMessage = "You can add a maximum of 12 NS records";
    this.showAddRecordPopup = false;
    this.resetInputFields();
    return;
  }

  if (lines.length !== nonEmptyLines.length) {
    this.errorMessage = "NS records line cannot be empty";
    this.showAddRecordPopup = false;
    this.resetInputFields();
    return;
  }

  for (const line of nonEmptyLines) {
    const domain = line.trim();
    
    // Check for unwanted symbols in the domain name
    if (unwantedSymbolsRegex.test(domain)) {
      this.errorMessage = `Invalid NS record: ${domain}. Contains unwanted symbols.`;
      this.showAddRecordPopup = false;
      this.resetInputFields();
      return;
    }
    
    // Check if the domain name is valid
    if (!domainNameRegex.test(domain)) {
      this.errorMessage = `Invalid NS record: ${domain}. Not a valid domain name.`;
      this.showAddRecordPopup = false;
      this.resetInputFields();
      return;
    }
  }

  nsRecords = nonEmptyLines.map(record => {
    return record.trim().endsWith('.') ? record.trim() : record.trim() + '.';
  });
}

// Check if it's editing mode and if the originalAdditionalSubdomain is not empty
if (this.isEditing && this.originalAdditionalSubdomain) {
  this.additionalSubdomain = this.originalAdditionalSubdomain;
}

try {
      if (this.recordType === 'NS') {
        recordValue = '';
      }
    
      const response = await fetch("http://localhost:4000/addrecord", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain: domain,
          subdomain: subdomain,
          recordType: this.recordType,
          recordValue: recordValue,
          recordTtl: this.recordTtl,
          additionalsubdomain: this.additionalSubdomain,
          nsRecords: nsRecords
        }),
      });

      if (response.ok) {
  const responseData = await response.json();
  if (responseData.success) {
    this.successMessage = "Success!";
    await this.getSelectedDomainRecords();
    this.showAddRecordPopup = false;
    this.resetInputFields();
    this.editingMode = false;

    // schedule a callback function to clear the success message after 5 seconds
    setTimeout(() => {
      this.successMessage = '';
    }, 6000);
  } else {
    this.errorMessage = responseData.message;
  }
} else if (response.status === 419) {
  this.errorMessage = "Your session has expired, please log in again.";
  await this.getSelectedDomainRecords();
  this.showAddRecordPopup = false;
  this.resetInputFields();
} else {
  console.log("Error adding record:", response.status);
  await this.getSelectedDomainRecords();
  this.errorMessage = "Failed to add record";
  this.showAddRecordPopup = false;
  this.resetInputFields();
}
    } catch (err) {
      console.error("Error adding record:", err);
      await this.getSelectedDomainRecords();
      this.errorMessage = "Failed to add record";
      this.showAddRecordPopup = false;
      this.resetInputFields();
    }
    setTimeout(() => {
  this.errorMessage = '';
}, 5000);
  },
    resetInputFields() {
      this.recordType = "";
      this.recordValue = "";
      this.recordTtl = "";
      this.recordPriority = "0";
      this.additionalSubdomain = "";
    },
    handleEditRecordClick(record) {
  this.isEditing = true;
  this.editingMode = true;
  if (!this.selectedDomain) {
    this.showSelectDomainError = true;
    return;
  }

  // Set the form values from the record object
  this.recordType = record.type;
  this.recordTtl = record.ttl;
  this.originalAdditionalSubdomain = record.additionalsubdomain;

  if (record.type === 'MX') {
    const [priority, value] = record.value.split(' ');
    this.recordPriority = priority;
    this.recordValue = value;
    this.additionalSubdomain = this.originalAdditionalSubdomain;
  } else if (record.type === 'NS') {
    this.recordValue = record.nsRecords.join('\n');
    this.additionalSubdomain = this.originalAdditionalSubdomain;
  } else {
    this.recordValue = record.value;
    this.additionalSubdomain = this.originalAdditionalSubdomain;
  }

  // Set the editRecordTitle based on the presence of additionalSubdomain and include the record type
  this.editRecordTitle = (record.additionalsubdomain
    ? record.additionalsubdomain + '.' + this.selectedDomain
    : this.selectedDomain) + ' (' + this.recordType + ')';

  // Add a new data property to store the record ID when editing
  this.editingRecordId = record.id;

  this.showAddRecordPopup = true;
},
    handleAddRecordClick() {
      this.isEditing = false;
      this.editingMode = false;
  if (!this.selectedDomain) {
    this.showSelectDomainError = true;
    return;
  }
  this.showAddRecordPopup = true;
},
async deleteRecord(id, index) {
  if (!this.selectedDomain) {
    this.showSelectDomainError = true;
    return;
  }
  this.showSelectDomainError = false;

  // Extract the domain, subdomain, and recordType from the record
  const record = this.selectedDomainRecords[index];
  const additionalsubdomain = record.additionalsubdomain || "";
  const recordTypes = [record.type];
  const domainParts = this.selectedDomain.split('.');
  const subdomain = domainParts[0];
  const domain = domainParts.slice(1).join('.');
  const recordValue = record.value;

  try {
  const response = await fetch("http://localhost:4000/deleterecord", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      domain,
      recordsToDelete: [
        {
          type: record.type,
          subdomains: [additionalsubdomain ? additionalsubdomain + "." + subdomain : subdomain],
          value: recordValue,
        },
      ],
    }),
  });

  if (!response.ok) {
    if (response.status === 419) {
      this.errorMessage = "Your session has expired, please log in again.";
      await this.getSelectedDomainRecords();
      this.showDeleteRecordPopup[index] = false; // Close the delete record popup on error
      // Add logic to redirect to login page or show a popup for login
    } else {
      throw new Error("Error deleting DNS record");
    }
  } else {
    // Remove the record from the table
    this.selectedDomainRecords.splice(index, 1);

    // Set showDeleteRecordPopup to false
    this.showDeleteRecordPopup[index] = false;

    // Show success message
    this.successMessage = "DNS record deleted successfully";
    await this.getSelectedDomainRecords();
    setTimeout(() => {
      this.successMessage = "";
    }, 5000);
  }
} catch (error) {
  console.error(error);
  this.errorMessage = "Error deleting DNS record";
  await this.getSelectedDomainRecords();
  this.showDeleteRecordPopup[index] = false; // Close the delete record popup on error
  setTimeout(() => {
    this.errorMessage = "";
  }, 5000);
}
},
async deleteallRecord() {
  if (!this.selectedDomain) {
    this.showSelectDomainError = true;
    this.showDeleteAllRecordsPopup = false;
    return;
  }
  this.showSelectDomainError = false;
  this.showDeleteAllRecordsPopup = false;
  this.confirmDelete = '';
  setTimeout(() => {
      this.errorMessage = "";
    }, 5000);

  const domainParts = this.selectedDomain.split('.');
  const subdomain = domainParts[0];
  const domain = domainParts.slice(1).join('.');
  let recordTypes = [];

  // Get all record types and subdomains for the selected domain
  const recordsToDelete = this.selectedDomainRecords.map((record) => {
    const additionalsubdomain = record.additionalsubdomain || "";
    const subdomains = [additionalsubdomain ? additionalsubdomain + "." + subdomain : subdomain];
    recordTypes.push(record.type);
    return { type: record.type, subdomains: subdomains, value: record.value };
  });

  // If there are no records for the selected domain, show an error message
  if (recordTypes.length === 0) {
    this.errorMessage = "No records found for the selected domain";
    setTimeout(() => {
      this.errorMessage = "";
      this.getSelectedDomainRecords(); // Call this method after the timeout
    }, 5000);
    return;
  }
  
  try {
    const response = await fetch("http://localhost:4000/deleterecord", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        domain,
        recordsToDelete,
        recordTypes
      }),
    });

    if (!response.ok) {
      if (response.status === 419) {
        this.errorMessage = "Your session has expired, please log in again.";
        await this.getSelectedDomainRecords();
      } else {
        throw new Error("Error deleting DNS records");
      }
    } else {
      // Remove all records from the table
      this.selectedDomainRecords = [];
      this.confirmDelete = '';

      // Show success message
      this.successMessage = "All DNS records deleted successfully";
      await this.getSelectedDomainRecords();
      setTimeout(() => {
        this.successMessage = "";
      }, 6000);
    }
  } catch (error) {
    console.error(error);
    this.errorMessage = "Error deleting DNS records";
    setTimeout(() => {
      this.errorMessage = "";
      this.getSelectedDomainRecords(); // Call this method after the timeout
    }, 5000);
  }
},
async getSelectedDomainRecords() {
  try {
    const response = await fetch(`http://localhost:4000/showuserdnsrecords/${this.selectedDomain}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Error fetching DNS records. Please refresh the page and try again.");
    }

    const data = await response.json();
    this.selectedDomainRecords = data;

    // Clear the error message when the response is ok
    this.errorMessage = "";

  } catch (error) {
    console.error(error);
    this.errorMessage = "Error fetching DNS records. Please refresh the page.";

    // Remove the error message after 5 seconds (5000 milliseconds)
    setTimeout(() => {
      this.errorMessage = "";

      // Clear the data of the table
      this.selectedDomainRecords = [];
    }, 5000);
  }
},
formatTtl(ttl) {
  switch (parseInt(ttl)) {
    case 3600:
      return '1 hour';
    case 7200:
      return '2 hours';
    case 18000:
      return '5 hours';
    case 43200:
      return '12 hours';
    case 86400:
      return '1 day';
    default:
      return '';
  }
},
  },
  async created() {
    try {
      const responseDomain = await fetch("http://localhost:4000/showuserdomain", {
        method: "GET",
        credentials: "include"
      });

      if (responseDomain.ok) {
        const dataDomain = await responseDomain.json();
        this.userDomains = dataDomain;
      } else {
        console.log("Error fetching user domain data:", responseDomain.status);
      }
    } catch (err) {
      console.error("Error refreshing user data:", err);
    }
  }
};
</script>

<style src="./Dns.css"></style>