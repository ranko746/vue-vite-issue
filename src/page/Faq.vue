<template>
  <div class="about-container">
    <h1 class="title">About Us</h1>
    <p class="about-text">
      IO.DAY - the perfect solution for anyone looking for a free domain. You can easily get your own unique domain that's perfect for personal websites, passion projects, or anything else you're working on.
      <br>
      <br>
      Best of all, it's completely free - no hidden fees or strings attached. With IO.DAY, you can personalize your web presence with domains like "dude.io.day" or "foo.egg.rw" without breaking the bank.
    </p>
    <h2 class="subtitle">FAQ</h2>
    <ul class="faq-list">
      <li class="faq-item">
        <h3 class="faq-question">Is the domain permanent?</h3>
        <p class="faq-answer">
          Yes, the domain is permanent. However, it is important to note that our platform has terms of service (TOS) that must be followed. Violating our TOS can lead to termination of the domain, and the decision to terminate is made at our discretion.       
         </p>
      </li>
      <li class="faq-item">
        <h3 class="faq-question">How is this free?</h3>
        <p class="faq-answer">
          We keep this service free thanks to the power of friendship! 
         </p>
      </li>
      <li class="faq-item">
        <h3 class="faq-question">Why can't I use my domain with Cloudflare?</h3>
        <p class="faq-answer">
          Currently, your domain cannot be used with Cloudflare because it is not listed on the Mozilla Public Suffix List. However, we are working towards getting our domains listed on the list in the future. Once this happens, you will be able to use Cloudflare with your domain. We will notify you via email when this happens. Additionally, user can use alternative free service such as 1984 that support io.day domain names.      
        </p>
      </li>
      <li class="faq-item">
        <h3 class="faq-question">Do you offer free DNS management?</h3>
        <p class="faq-answer">
          Yes, we currently offer free DNS management for all users. But in the future there is a possibility that we may need to introduce changes in the future. In this scenario, we may recommend using a free third-party DNS provider like 1984.
          </p>
      </li>
      <li class="faq-item">
        <h3 class="faq-question">What type of DNS records is supported?</h3>
        <p class="faq-answer">
          We support the following standard record types:
          <br>
          - NS (We recommend our user to use this)
          <br>
          - A
          <br>
          - AAAA
          <br>
          - CNAME
          <br>
          - MX
          <br>
          - TXT
          </p>
      </li>
      <li class="faq-item">
        <h3 class="faq-question">Can I use this for my email?</h3>
        <p class="faq-answer">
          Yes, but you need to install your own mail server.
        </p>
      </li>
      <li class="faq-item">
        <h3 class="faq-question">Is it possible to use Internationalized Name (IDN) on IO.DAY?</h3>
        <p class="faq-answer">
          Yes, you can create a domain name with IDN on our service. For example, you may create domain names such as "امتحان.io.day" or "テスト.io.day".
        </p>
      </li>
      <li class="faq-item">
        <h3 class="faq-question">What specific user data do you store and for what purposes?</h3>
        <p class="faq-answer">
          The only user data we store is login and service-related information, which is necessary for providing and maintaining our services. We do not collect or retain any additional user data beyond what is necessary for these purposes.
         </p>
      </li>
      <li class="faq-item">
        <h3 class="faq-question">Do you sell our data?</h3>
        <p class="faq-answer">
          Rest assured that your data will be securely stored in our private database and will never be sold.
         </p>
      </li>
      <li class="faq-item">
        <h3 class="faq-question">Can I abuse this free platform?</h3>
        <p class="faq-answer">
          We beg you to not... 
         </p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "FAQ",
};
</script>

<style>
.about-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: transparent;
  max-width: 800px;
  margin: 0 auto;
}

.about-text {
  width: 100%;
  text-align: justify;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 20px;
  color: #ccc;
  background-color: #444;
  padding: 20px;
  border-radius: 10px;
  max-width: 800px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
}

@media screen and (max-width: 600px) {
  .about-container, .faq-list {
    max-width: 90%;
    font-size: 14px;
  }
  
  .about-text {
    max-width: 90%;
  }
}

.title {
  font-size: 28px;
  font-weight: bold;
  background-color: #444;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 20px;
  color: #fff;
  text-align: center;
}

.about-text {
  width: 100%;
  text-align: justify;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 20px;
  color: #ccc;
  background-color: #444;
  padding: 20px;
  border-radius: 10px;
  max-width: 800px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
}

.subtitle {
  background-color: #444;
  border-radius: 10px;
  padding: 10px;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #fff;
  text-align: center;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
}

.faq-list {
  text-align: justify;
  list-style: none;
  width: 100%;
  padding: 0;
  margin: 0;
  color: #ccc;
  background-color: #444;
  padding: 20px;
  border-radius: 10px;
  max-width: 800px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
}

@media screen and (max-width: 600px) {
  .faq-list {
    max-width: 90%;
    font-size: 14px;
  }
}

.faq-item {
  margin-bottom: 20px;
  padding: 10px;
  border: 3px solid #ccc;
  border-radius: 5px;
}

.faq-question {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.faq-answer {
  font-size: 16px;
  line-height: 1.5;
}
</style>