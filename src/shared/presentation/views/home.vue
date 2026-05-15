<template>
  <Layout>
    <div class="content-placeholder theme-transition">
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
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  background: var(--bg-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 16px;
}
</style>