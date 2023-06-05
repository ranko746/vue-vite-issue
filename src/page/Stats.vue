<template>
  <div class="stats">
    <h1>STATS V2 COMING SOON</h1>
    <div v-if="loading" class="loading">Loading stats...</div>
    <div v-else class="stats-container">
      <table class="table table-hover table-striped">
        <thead class="thead22">
          <tr>
            <th>Total Domain <i class="fa fa-globe"></i></th>
            <th>Total User <i class="fa fa-user"></i></th>
            <th colspan="2">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ domainsCount }}</td>
            <td>{{ usersCount }}</td>
            <td>{{ lastUpdatedFormatted }}</td>
            <td></td>
          </tr>
        </tbody>        
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "Stats",
  data() {
    return {
      loading: true,
      domainsCount: 0,
      usersCount: 0,
      lastUpdated: null,
    };
  },
  computed: {
    lastUpdatedFormatted() {
      if (this.lastUpdated === null) return "Please refresh";
      if (typeof this.lastUpdated === "string") {
        const diff = parseInt(this.lastUpdated);
        return `Last updated ${diff} minutes ago`;
      }
      const diff = Math.floor((Date.now() - this.lastUpdated) / 60000);
      return `Last updated ${diff} minutes ago`;
    },
  },
  async created() {
    try {
      const response = await fetch("http://localhost:4000/stats");
      const data = await response.json();

      if (data.success) {
        this.domainsCount = data.domainsCount;
        this.usersCount = data.usersCount;
        this.lastUpdated = data.lastUpdated;
      } else {
        console.error("Failed to fetch stats:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style>
.stats {
  padding: 20px;
}

.loading {
  color: #fff;
}

.stats-container {
  display: flex;
  flex-direction: column;
}

.stat-item {
  font-size: 20px;
  color: #fff;
  margin-bottom: 10px;
}

.stats-container table {
  background-color: #dadada;
  color: #333;
}

.thead22 {
  background-color: #965aae;
  color: #fff;
}
</style>