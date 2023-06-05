<template>
    <div class="failure-container">
      <h2>Oops!</h2>
      <p>Something went wrong with your registration.</p>
      <router-link to="/register"><button>Go back to Registration</button></router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: "Failure",
  };
  </script>
  
  <style>
  .failure-container {
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
  
  .failure-container h2 {
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
  
  .failure-container p {
    font-size: 16px;
    color: #fff;
    margin-bottom: 20px;
    margin-top: -10px;
    text-align: center;
  }
  
  .failure-container button {
    padding: 10px;
    background-color: #ff5757;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    width: 100%;
  }
  
  .failure-container button:hover {
    background-color: #ff8787;
  }
  
  @media screen and (max-width: 480px) {
    .failure-container h2 {
      font-size: 22px;
    }
  
    .failure-container p {
      font-size: 14px;
    }
  
    .failure-container button {
      font-size: 14px;
    }
  }
  
  @media screen and (min-width: 481px) and (max-width: 768px) {
    .failure-container h2 {
      font-size: 24px;
    }
  
    .failure-container p {
      font-size: 16px;
    }
  
    .failure-container button {
      font-size: 16px;
    }
  }
  
  @media screen and (min-width: 769px) {
    .failure-container h2 {
      font-size: 28px;
    }
  
    .failure-container p {
      font-size: 18px;
    }
  
    .failure-container button {
      font-size: 18px;
      width: auto;
    }
  }
  </style>
  