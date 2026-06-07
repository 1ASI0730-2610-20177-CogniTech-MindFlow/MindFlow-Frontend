<template>
  <div class="premium-card theme-transition">
    <div class="premium-title"><i class="pi pi-star-fill"></i> {{ $t('premium.title') }}</div>
    <p class="premium-text">{{ $t('premium.description') }}</p>
    <button class="premium-btn" @click="goToSubscription">{{ $t('premium.viewPlans') }}</button>
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
  padding: 18px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.08);
}

.premium-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
  transition: left 0.6s ease;
}

.premium-card:hover::before {
  left: 100%;
}

.premium-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.2);
}

.premium-title {
  color: var(--accent-primary);
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: titleGlow 2s ease-in-out infinite;
}

@keyframes titleGlow {
  0%, 100% {
    text-shadow: 0 0 0 rgba(99, 102, 241, 0);
  }
  50% {
    text-shadow: 0 0 8px rgba(99, 102, 241, 0.3);
  }
}

.premium-text {
  margin-top: 10px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.4;
  transition: color 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.premium-card:hover .premium-text {
  color: var(--text-primary);
}

.premium-btn {
  margin-top: 14px;
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-hover) 100%);
  color: #fff;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.premium-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.premium-btn:hover::before {
  width: 400px;
  height: 400px;
}

.premium-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
}

.premium-btn:active {
  transform: translateY(0px);
}
</style>