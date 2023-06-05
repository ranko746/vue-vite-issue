<template>
    <div class="success-container">
      <h2>Success!</h2>
      <p>Your registration is complete. You can now log in to your account.</p>
      <router-link to="/login"><button>Go to Login</button></router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: "Success",
  };
  </script>
  
  <style>
  .success-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #444;
    border-radius: 10px;
    max-width: 400px;
    margin: 0 auto;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
  
  .success-container h2 {
    font-size: 28px;
    font-weight: bold;
    background-color: #444;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 20px;
    color: #fff;
    text-align: center;
    width: 100%;
  }
  
  .success-container p {
    font-size: 16px;
    color: #fff;
    margin-bottom: 20px;
    margin-top: -10px;
    text-align: center;
  }
  
  .success-container button {
    padding: 10px;
    background-color: rgb(161, 105, 172);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    width: 100%;
  }
  
  .success-container button:hover {
    background-color: #a2c1a5;
  }
  
  @media screen and (max-width: 480px) {
    .success-container h2 {
      font-size: 22px;
    }
  
    .success-container p {
      font-size: 14px;
    }
  
    .success-container button {
      font-size: 14px;
    }
  }
  
  @media screen and (min-width: 481px) and (max-width: 768px) {
    .success-container h2 {
      font-size: 24px;
    }
  
    .success-container p {
      font-size: 16px;
    }
  
    .success-container button {
      font-size: 16px;
    }
  }
  
  @media screen and (min-width: 769px) {
    .success-container h2 {
      font-size: 28px;
    }
  
    .success-container p {
      font-size: 18px;
    }
  
    .success-container button {
      font-size: 18px;
      width: auto;
    }
  }
  </style>
  