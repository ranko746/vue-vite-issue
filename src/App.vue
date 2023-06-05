<template>
  <div>
    <header>
      <nav>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li>
            <a href="https://docs.made.my/" target="_blank" rel="noopener noreferrer">Docs</a>
          </li>          
          <li><router-link to="/stats">Stats</router-link></li>
          <li v-if="!authrouter0"><router-link to="/login">Login</router-link></li>
          <li v-if="!authrouter0"><router-link to="/register">Register</router-link></li>
          <li v-if="authrouter0"><router-link to="/dashboard">Dashboard</router-link></li>
        </ul>
      </nav>
    </header>
    <router-view />
  </div>
</template>

<script>
import { useCookies } from 'vue3-cookies';

export default {
  name: 'App',
  setup() {
    const { cookies } = useCookies();
    const authrouter0 = cookies.get('authrouter0');
    return { authrouter0 };
  },
};
</script>