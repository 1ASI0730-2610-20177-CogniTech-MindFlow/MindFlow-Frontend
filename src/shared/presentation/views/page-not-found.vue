<template>
  <Layout>
    <div class="not-found">
      <div class="not-found-content">
        <h1 class="error-code">404</h1>
        <h2>Página no encontrada</h2>
        <p>Lo sentimos, la página que buscas no existe.</p>
        <router-link to="/dashboard" class="btn-back">
          Volver al Dashboard
        </router-link>
      </div>
    </div>
  </Layout>
</template>
<script setup>
import Layout from '../components/layout.vue'
</script>
<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.not-found-content {
  text-align: center;
}
.error-code {
  font-size: 96px;
  font-weight: 700;
  margin: 0;
  color: #4a9eff;
}
h2 {
  font-size: 28px;
  margin: 20px 0 10px;
  color: #212529;
}
p {
  font-size: 16px;
  color: #6c757d;
  margin-bottom: 30px;
}
.btn-back {
  display: inline-block;
  padding: 12px 32px;
  background: #4a9eff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  transition: background 0.3s ease;
}
.btn-back:hover {
  background: #2e7fd9;
}
</style>
