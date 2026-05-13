<template>
  <Layout>
    <div class="content-placeholder">
      Área de contenido
    </div>
  </Layout>
</template>

<script setup>
import Layout from '../components/layout.vue'
</script>

<style scoped>
.content-placeholder {
  height: 100%;
  min-height: 400px;
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 16px;
}
</style>