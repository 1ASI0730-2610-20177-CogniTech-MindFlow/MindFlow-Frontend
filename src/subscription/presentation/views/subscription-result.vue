<template>
  <Layout>
    <main class="result-container">
      <div v-if="isSuccess" class="result-card success">
        <i class="pi pi-check-circle result-icon"></i>
        <h1>{{ $t('plansPage.result.successTitle') || 'Pago exitoso' }}</h1>
        <p>{{ $t('plansPage.result.successDesc') || 'Tu suscripcion premium ha sido activada. Disfruta de todas las funciones.' }}</p>
        <router-link to="/subscription" class="btn btn-primary">
          {{ $t('plansPage.result.viewPlan') || 'Ver mi plan' }}
        </router-link>
      </div>

      <div v-else class="result-card cancel">
        <i class="pi pi-times-circle result-icon"></i>
        <h1>{{ $t('plansPage.result.cancelTitle') || 'Pago cancelado' }}</h1>
        <p>{{ $t('plansPage.result.cancelDesc') || 'El proceso de pago fue cancelado. Puedes intentarlo de nuevo cuando quieras.' }}</p>
        <router-link to="/subscription" class="btn btn-primary">
          {{ $t('plansPage.result.backToPlans') || 'Volver a planes' }}
        </router-link>
      </div>
    </main>
  </Layout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Layout from '@/shared/presentation/components/layout.vue'

const route = useRoute()
const isSuccess = computed(() => route.path.includes('success'))
</script>

<style scoped>
.result-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 48px 32px;
}

.result-card {
  text-align: center;
  background: var(--bg-surface);
  border-radius: 20px;
  padding: 48px;
  max-width: 480px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-light);
}

.result-icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.success .result-icon {
  color: var(--accent-success);
}

.cancel .result-icon {
  color: var(--accent-danger);
}

.result-card h1 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 12px;
}

.result-card p {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 32px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 15px;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-hover));
  color: var(--text-on-accent, #fff);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.25);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(99, 102, 241, 0.35);
}
</style>
