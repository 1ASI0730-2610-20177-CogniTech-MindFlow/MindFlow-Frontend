<template>
  <Layout>
    <transition name="fade" mode="out-in">
      <main class="container" v-if="!store.isLoading && store.subscriptionData">
        <header class="hero theme-transition">
          <h1 class="theme-transition">{{ $t('plansPage.hero.title') }}</h1>
          <p class="theme-transition">
            {{ $t('plansPage.hero.subtitle') }}
          </p>
        </header>

        <section class="plans">
          <article class="plan theme-transition" :class="{ 'plan-featured': !store.isPremium }">
            <div class="badge" v-if="!store.isPremium">{{ $t('plansPage.badges.current') }}</div>

            <h2 class="plan-title theme-transition" :class="{ 'accent': !store.isPremium }">{{ $t('plansPage.freemium.title') }}</h2>
            <div class="price">
              <span class="amount theme-transition">$0</span>
              <span class="period theme-transition">{{ $t('plansPage.pricing.perMonth') }}</span>
            </div>
            <p class="plan-desc theme-transition">
              {{ $t('plansPage.freemium.desc') }}
            </p>

            <ul class="features">
              <li class="ok theme-transition"><i class="pi pi-check icon"></i><span><b>{{ $t('plansPage.freemium.features.f1Bold') }}</b>{{ $t('plansPage.freemium.features.f1Text') }}</span></li>
              <li class="ok theme-transition"><i class="pi pi-check icon"></i><span><b>{{ $t('plansPage.freemium.features.f2Bold') }}</b>{{ $t('plansPage.freemium.features.f2Text') }}</span></li>
              <li class="ok theme-transition"><i class="pi pi-check icon"></i><span><b>{{ $t('plansPage.freemium.features.f3Bold') }}</b>{{ $t('plansPage.freemium.features.f3Text') }}</span></li>
              <li class="ok theme-transition"><i class="pi pi-check icon"></i><span><b>{{ $t('plansPage.freemium.features.f4Bold') }}</b>{{ $t('plansPage.freemium.features.f4Text') }}</span></li>
              <li class="ko theme-transition"><i class="pi pi-times icon"></i><span>{{ $t('plansPage.freemium.features.f5') }}</span></li>
              <li class="ko theme-transition"><i class="pi pi-times icon"></i><span>{{ $t('plansPage.freemium.features.f6') }}</span></li>
            </ul>

            <button class="btn btn-outline theme-transition" disabled v-if="!store.isPremium">{{ $t('plansPage.buttons.activePlan') }}</button>
            <button class="btn btn-outline theme-transition" v-else @click="handleDowngrade" :disabled="store.isProcessingPayment">{{ store.isProcessingPayment ? '...' : $t('plansPage.buttons.downgrade') }}</button>
          </article>

          <article class="plan theme-transition" :class="{ 'plan-featured': store.isPremium }">
            <div class="badge" v-if="store.isPremium">{{ $t('plansPage.badges.current') }}</div>
            <div class="badge" v-else>{{ $t('plansPage.badges.recommended') }}</div>

            <h2 class="plan-title theme-transition" :class="{ 'accent': store.isPremium }">{{ $t('plansPage.premium.title') }}</h2>
            <div class="price">
              <span class="amount theme-transition">$4.99</span>
              <span class="period theme-transition">{{ $t('plansPage.pricing.perMonth') }}</span>
            </div>
            <p class="plan-desc theme-transition">
              {{ $t('plansPage.premium.desc') }}
            </p>

            <ul class="features">
              <li class="ok theme-transition"><i class="pi pi-check icon"></i><span>{{ $t('plansPage.premium.features.f1') }}</span></li>
              <li class="ok theme-transition"><i class="pi pi-check icon"></i><span><b>{{ $t('plansPage.premium.features.f2Bold') }}</b>{{ $t('plansPage.premium.features.f2Text') }}</span></li>
              <li class="ok theme-transition"><i class="pi pi-check icon"></i><span><b>{{ $t('plansPage.premium.features.f3Bold') }}</b>{{ $t('plansPage.premium.features.f3Text') }}</span></li>
              <li class="ok theme-transition"><i class="pi pi-check icon"></i><span><b>{{ $t('plansPage.premium.features.f4Bold') }}</b>{{ $t('plansPage.premium.features.f4Text') }}</span></li>
              <li class="ok theme-transition"><i class="pi pi-check icon"></i><span><b>{{ $t('plansPage.premium.features.f5Bold') }}</b>{{ $t('plansPage.premium.features.f5Text') }}</span></li>
            </ul>

            <button class="btn btn-gradient theme-transition" disabled v-if="store.isPremium">{{ $t('plansPage.buttons.activePlan') }}</button>
            <button class="btn btn-gradient theme-transition" v-else @click="handleUpgrade" :disabled="store.isProcessingPayment">{{ store.isProcessingPayment ? '...' : $t('plansPage.buttons.upgrade') }}</button>
          </article>
        </section>

        <footer class="footer theme-transition">
          {{ $t('plansPage.footer') }}
        </footer>

        <!-- PaymentHistory managed by Stripe -->
      </main>

      <div v-else class="loading-state">
        <p>{{ $t('plansPage.loading') }}</p>
      </div>
    </transition>
  </Layout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSubscriptionStore } from '../../application/subscription.store'
import { useAuthStore } from '@/iam/application/auth.store.js'
import Layout from '@/shared/presentation/components/layout.vue'

const { t } = useI18n()
const store = useSubscriptionStore()
const authStore = useAuthStore()

onMounted(() => {
  store.fetchSubscription()
})

async function handleUpgrade() {
  try {
    await store.startCheckout()
  } catch (error) {
    console.error('Checkout failed:', error)
  }
}

async function handleDowngrade() {
  if (!confirm(t('plansPage.buttons.confirmDowngrade'))) return
  try {
    await store.cancelSubscription()
  } catch (error) {
    console.error('Downgrade failed:', error)
  }
}
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
  animation: slideDown 0.6s ease-out;
}

.hero h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.hero p {
  max-width: 600px;
  margin: 0 auto;
  color: var(--text-secondary);
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
  background: var(--bg-surface);
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-sm);
  border: 2px solid transparent;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
  animation: slideUp 0.6s ease-out backwards;
}

.plan:nth-child(1) {
  animation-delay: 0.1s;
}

.plan:nth-child(2) {
  animation-delay: 0.2s;
}

.plan:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.plan:active {
  transform: translateY(-2px) scale(0.99);
}

.plan-featured {
  border: 2px solid var(--accent-primary);
}

.badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--accent-primary);
  color: var(--text-on-accent);
  padding: 4px 14px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  animation: pulse 2s infinite;
}

.plan-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text-primary);
}

.plan-title.accent {
  color: var(--accent-primary);
}

.price {
  margin-bottom: 12px;
}

.amount {
  font-size: 40px;
  font-weight: 700;
  color: var(--text-primary);
}

.period {
  color: var(--text-secondary);
  font-size: 14px;
}

.plan-desc {
  color: var(--text-secondary);
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
  font-size: 14px;
  line-height: 1.4;
}

.features .ok { color: var(--text-primary); }
.features .ok .icon { color: var(--accent-success); }

.features .ko {
  color: var(--text-muted);
  text-decoration: line-through;
}
.features .ko .icon { color: var(--text-muted); }

.features b {
  color: var(--text-primary);
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
  transition: all 0.3s ease;
}

.btn-outline {
  background: var(--bg-surface-secondary);
  color: var(--text-primary);
  border-color: var(--border-color);
}

.btn-outline:disabled {
  cursor: default;
  opacity: 0.85;
  background: var(--bg-surface-secondary);
}

.btn-outline:hover:not(:disabled) {
  background: var(--border-color);
}

.btn-outline:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-gradient {
  background: linear-gradient(90deg, var(--accent-hover) 0%, var(--accent-success) 100%);
  color: var(--text-on-accent);
  border: none;
  background-size: 200% auto;
  transition: 0.5s;
}

.btn-gradient:disabled {
  cursor: default;
  background: var(--bg-surface-secondary);
  color: var(--text-muted);
  opacity: 0.6;
}

.btn-gradient:hover:not(:disabled) {
  background-position: right center;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4);
  transform: translateY(-2px);
}

.btn-gradient:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

.footer {
  text-align: center;
  margin-top: 40px;
  color: var(--text-secondary);
  font-size: 13px;
  animation: fadeIn 1s ease-in 0.5s backwards;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 18px;
  color: var(--text-secondary);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent-primary), transparent 60%);
  }
  70% {
    box-shadow: 0 0 0 6px color-mix(in srgb, var(--accent-primary), transparent 100%);
  }
  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent-primary), transparent 100%);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>