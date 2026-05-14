<template>
  <Layout>
    <main class="container" v-if="!store.isLoading && store.subscriptionData">
      <header class="hero">
        <h1>Invierte en tu bienestar emocional</h1>
        <p>
          Elige el plan que mejor se adapte a tu ritmo. Demócrata e inteligente,
          MindFlow te acompaña en cada paso hacia tu calma mental.
        </p>
      </header>

      <section class="plans">
        <article class="plan" :class="{ 'plan-featured': !store.isPremium }">
          <div class="badge" v-if="!store.isPremium">TU PLAN ACTUAL</div>

          <h2 class="plan-title" :class="{ 'accent': !store.isPremium }">Freemium</h2>
          <div class="price">
            <span class="amount">$0</span>
            <span class="period"> / mes</span>
          </div>
          <p class="plan-desc">
            Todo lo necesario para empezar a construir autoconocimiento.
          </p>

          <ul class="features">
            <li class="ok"><span class="icon">✓</span><span><b>AI Mood Journal:</b> Diario interactivo con NLP</span></li>
            <li class="ok"><span class="icon">✓</span><span><b>Dynamic Habit Tracker:</b> Ajuste basado en estrés</span></li>
            <li class="ok"><span class="icon">✓</span><span><b>Smart Interventions:</b> Guías de respiración</span></li>
            <li class="ok"><span class="icon">✓</span><span><b>Analíticas Básicas:</b> Calendario y Word Cloud</span></li>
            <li class="ko"><span class="icon">✗</span><span>Exportación de Reportes PDF</span></li>
            <li class="ko"><span class="icon">✗</span><span>Exportación de Datos CSV</span></li>
          </ul>

          <button class="btn btn-outline" disabled v-if="!store.isPremium">Plan Activo</button>
          <button class="btn btn-outline" v-else>Bajar de Plan</button>
        </article>

        <article class="plan" :class="{ 'plan-featured': store.isPremium }">
          <div class="badge" v-if="store.isPremium">TU PLAN ACTUAL</div>
          <div class="badge" v-else>RECOMENDADO</div>

          <h2 class="plan-title" :class="{ 'accent': store.isPremium }">MindFlow Premium</h2>
          <div class="price">
            <span class="amount">$4.99</span>
            <span class="period"> / mes</span>
          </div>
          <p class="plan-desc">
            Para quienes buscan un análisis profundo y acompañamiento profesional.
          </p>

          <ul class="features">
            <li class="ok"><span class="icon">✓</span><span>Todo lo incluido en Freemium</span></li>
            <li class="ok"><span class="icon">✓</span><span><b>Exportación PDF:</b> Descarga historiales clínicos.</span></li>
            <li class="ok"><span class="icon">✓</span><span><b>Exportación CSV:</b> Accede a tus datos en bruto.</span></li>
            <li class="ok"><span class="icon">✓</span><span><b>Analíticas Avanzadas:</b> Gráficos detallados.</span></li>
            <li class="ok"><span class="icon">✓</span><span><b>Soporte Prioritario:</b> Resolución de dudas técnicas.</span></li>
          </ul>

          <button class="btn btn-gradient" disabled v-if="store.isPremium">Plan Activo</button>
          <button class="btn btn-gradient" v-else>Actualizar a Premium</button>
        </article>
      </section>

      <footer class="footer">
        🔒 Pagos encriptados y procesados de forma segura a través de Stripe (US34).
      </footer>
    </main>

    <div v-else class="loading-state">
      <p>Cargando información de planes...</p>
    </div>
  </Layout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useSubscriptionStore } from '../../application/subscription.store'
import Layout from '@/shared/presentation/components/layout.vue'

const store = useSubscriptionStore()

onMounted(() => {
  store.fetchSubscription('u1')
})
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 48px 32px;
}

.hero {
  text-align: center;
  margin-bottom: 40px;
}

.hero h1 {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
}

.hero p {
  max-width: 600px;
  margin: 0 auto;
  color: #6b7280;
  font-size: 14px;
}

.plans {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
}

@media (max-width: 700px) {
  .plans { grid-template-columns: 1fr; }
}

.plan {
  position: relative;
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 2px solid transparent;
}

.plan-featured {
  border: 2px solid #818cf8;
}

.badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #e0e7ff;
  color: #6366f1;
  padding: 4px 14px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.plan-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #111827;
}

.plan-title.accent {
  color: #6366f1;
}

.price {
  margin-bottom: 12px;
}

.amount {
  font-size: 40px;
  font-weight: 700;
  color: #111827;
}

.period {
  color: #6b7280;
  font-size: 14px;
}

.plan-desc {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 24px;
}

.features {
  list-style: none;
  margin-bottom: 32px;
}

.features li {
  display: flex;
  gap: 8px;
  padding: 6px 0;
  font-size: 14px;
}

.features .icon {
  flex-shrink: 0;
  width: 18px;
  font-weight: 700;
  line-height: 1.4;
}

.features .ok { color: #374151; }
.features .ok .icon { color: #10b981; }

.features .ko {
  color: #9ca3af;
  text-decoration: line-through;
}
.features .ko .icon { color: #9ca3af; }

.features b {
  color: #111827;
  font-weight: 600;
}

.features .ko b {
  color: inherit;
  font-weight: inherit;
}

.btn {
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s;
}

.btn-outline {
  background: #f9fafb;
  color: #374151;
  border-color: #e5e7eb;
}

.btn-outline:disabled {
  cursor: default;
  opacity: 0.85;
  background: #e5e7eb;
}

.btn-gradient {
  background: linear-gradient(90deg, #4f46e5 0%, #10b981 100%);
  color: #ffffff;
  border: none;
}

.btn-gradient:disabled {
  cursor: default;
  background: #9ca3af;
  color: #f3f4f6;
}

.btn-gradient:hover:not(:disabled) {
  background: linear-gradient(90deg, #4338ca 0%, #059669 100%);
  box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
  transform: translateY(-1px);
}

.footer {
  text-align: center;
  margin-top: 40px;
  color: #6b7280;
  font-size: 13px;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 18px;
  color: #6b7280;
}
</style>