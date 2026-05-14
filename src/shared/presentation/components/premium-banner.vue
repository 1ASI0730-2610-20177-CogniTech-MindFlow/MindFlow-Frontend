<template>
  <div class="premium-card">
    <div class="premium-title">✦ MindFlow Premium</div>
    <p class="premium-text">
      Desbloquea exportación de reportes PDF y CSV para tu terapeuta.
    </p>
    <button class="premium-btn" @click="goToSubscription">Ver Planes</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToSubscription = () => {
  router.push('/subscription')
}
</script>

<style scoped>
.premium-card {
  margin: 16px;
  padding: 16px;
  background: #f5f3ff;
  border: 1px solid #ede9fe;
  border-radius: 12px;
}

.premium-title {
  color: #6d28d9;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

.premium-text {
  margin-top: 8px;
  color: #64748b;
  font-size: 13px;
}

.premium-btn {
  margin-top: 12px;
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  background: linear-gradient(90deg, #4f46e5 0%, #10b981 100%);
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
  font-weight: 500;
}

.premium-btn:hover {
  background: #6d28d9;
}
</style>