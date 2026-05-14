<template>
  <Layout>
    <main class="container" v-if="store.profile">
      <div class="grid">
        <div class="col">
          <section class="card animate-fade-in-up">
            <div class="profile-header">
              <div class="avatar animate-scale-in">{{ store.profile.initial }}</div>
              <div>
                <p class="username">{{ store.profile.name }}</p>
                <button class="btn btn-outline btn-sm hover-lift">{{ $t('settings.profile.changeAvatar') }}</button>
              </div>
            </div>

            <div class="form-grid">
              <div class="field">
                <label>{{ $t('settings.profile.fullName') }}</label>
                <input type="text" v-model="store.profile.name" class="input-transition" />
              </div>
              <div class="field">
                <label>{{ $t('settings.profile.email') }}</label>
                <input type="email" v-model="store.profile.email" class="input-transition" />
              </div>
              <div class="field">
                <label>{{ $t('settings.profile.occupation') }}</label>
                <input type="text" v-model="store.profile.occupation" class="input-transition" />
              </div>
              <div class="field">
                <label>{{ $t('settings.profile.timezone') }}</label>
                <input type="text" value="GMT-5 (Lima, Perú)" disabled class="input-transition" />
              </div>
            </div>

            <button class="btn btn-primary save-btn hover-lift" @click="store.updateProfile()">
              {{ $t('settings.profile.saveChanges') }}
            </button>
          </section>

          <section class="card animate-fade-in-up delay-1">
            <h3 class="card-title">{{ $t('settings.privacy.title') }}</h3>
            <div class="toggle-list">
              <div class="toggle-row">
                <div>
                  <p class="toggle-label">{{ $t('settings.privacy.pinLock') }}</p>
                  <p class="toggle-desc">{{ $t('settings.privacy.pinLockDesc') }}</p>
                </div>
                <label class="switch hover-scale">
                  <input type="checkbox" checked />
                  <span class="slider"></span>
                </label>
              </div>
              <div class="toggle-row">
                <div>
                  <p class="toggle-label">{{ $t('settings.privacy.darkMode') }}</p>
                  <p class="toggle-desc">{{ $t('settings.privacy.darkModeDesc') }}</p>
                </div>
                <label class="switch hover-scale">
                  <input type="checkbox" />
                  <span class="slider"></span>
                </label>
              </div>
              <div class="toggle-row">
                <div>
                  <p class="toggle-label">{{ $t('settings.privacy.habitReminders') }}</p>
                  <p class="toggle-desc">{{ $t('settings.privacy.habitRemindersDesc') }}</p>
                </div>
                <label class="switch hover-scale">
                  <input type="checkbox" checked />
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </section>
        </div>

        <div class="col">
          <section class="card card-dark animate-fade-in-up delay-2">
            <h3 class="card-title accent">{{ $t('settings.subscription.title') }}</h3>
            <p class="plan-text">{{ $t('settings.subscription.currentPlan') }}: <span>{{ store.profile.planName }}</span></p>
            <ul class="plan-features">
              <li class="ok">✓ {{ $t('settings.subscription.features.journal') }}</li>
              <li class="ok">✓ {{ $t('settings.subscription.features.habits') }}</li>
              <li :class="store.profile.isPremium ? 'ok' : 'ko'">
                {{ store.profile.isPremium ? '✓' : '✗' }} {{ $t('settings.subscription.features.pdf') }}
              </li>
              <li :class="store.profile.isPremium ? 'ok' : 'ko'">
                {{ store.profile.isPremium ? '✓' : '✗' }} {{ $t('settings.subscription.features.clinical') }}
              </li>
            </ul>
            <button class="btn btn-primary full hover-lift" v-if="!store.profile.isPremium">
              {{ $t('settings.subscription.upgrade') }}
            </button>
          </section>

          <section class="card animate-fade-in-up delay-3">
            <h3 class="card-title">{{ $t('settings.support.title') }}</h3>
            <div class="stack">
              <button class="btn btn-outline full hover-lift">{{ $t('settings.support.ticket') }}</button>
              <button class="btn btn-outline full hover-lift">{{ $t('settings.support.faq') }}</button>
            </div>
          </section>

          <section class="card danger animate-fade-in-up delay-4">
            <h3 class="card-title danger-title">{{ $t('settings.dangerZone.title') }}</h3>
            <p class="danger-desc">
              {{ $t('settings.dangerZone.warning') }}
            </p>
            <button class="btn btn-danger full hover-lift">{{ $t('settings.dangerZone.deleteAccount') }}</button>
          </section>
        </div>
      </div>
    </main>

    <div v-else class="loading-state">
      <div class="spinner"></div>
      <p class="animate-pulse">{{ $t('settings.loading') }}</p>
    </div>
  </Layout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useSettingsStore } from '../../application/settings.store'
import Layout from '@/shared/presentation/components/layout.vue'

const store = useSettingsStore()

onMounted(() => {
  store.fetchProfile('u1')
})
</script>

<style scoped>

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}

.animate-scale-in {
  animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }
.delay-4 { animation-delay: 0.4s; }

.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.hover-scale {
  transition: transform 0.2s ease;
}
.hover-scale:hover {
  transform: scale(1.05);
}

.input-transition {
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #6366f1;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin-right: 12px;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 32px 64px 32px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
}

@media (max-width: 900px) {
  .grid { grid-template-columns: 1fr; }
}

.col {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
}

.card-dark {
  background: #111827;
  color: #fff;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.accent {
  color: #34d399;
  margin-bottom: 4px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2dd4bf, #14b8a6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
  box-shadow: 0 4px 6px -1px rgba(20, 184, 166, 0.4);
}

.username {
  font-weight: 500;
  margin-bottom: 8px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 600px) {
  .form-grid { grid-template-columns: 1fr; }
}

.field label {
  display: block;
  font-size: 13px;
  color: #4b5563;
  margin-bottom: 6px;
}

.field input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  color: #111827;
}

.field input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
}

.field input:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.save-btn {
  margin-top: 24px;
}

.btn {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.btn-sm {
  padding: 4px 12px;
  font-size: 13px;
}

.btn-primary {
  background: #6366f1;
  color: #fff;
}

.btn-primary:hover { background: #4f46e5; }

.btn-outline {
  background: #fff;
  color: #111827;
  border-color: #e5e7eb;
}

.btn-outline:hover { background: #f9fafb; }

.btn-danger {
  background: #fff;
  color: #ef4444;
  border-color: #fca5a5;
}

.btn-danger:hover { background: #fef2f2; }

.full { width: 100%; }

.stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toggle-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.toggle-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.toggle-label {
  font-size: 14px;
  color: #111827;
  transition: color 0.2s ease;
}

.toggle-row:hover .toggle-label {
  color: #6366f1;
}

.toggle-desc {
  font-size: 13px;
  color: #6b7280;
}

.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
  flex-shrink: 0;
}

.switch input { opacity: 0; width: 0; height: 0; }

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: #d1d5db;
  border-radius: 22px;
  transition: 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.slider::before {
  content: "";
  position: absolute;
  height: 18px;
  width: 18px;
  left: 2px;
  top: 2px;
  background: #fff;
  border-radius: 50%;
  transition: 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.switch input:checked + .slider { background: #34d399; }
.switch input:checked + .slider::before { transform: translateX(18px); }

.plan-text {
  color: #d1d5db;
  font-size: 14px;
  margin-bottom: 16px;
}

.plan-text span { color: #fff; font-weight: 500; }

.plan-features {
  list-style: none;
  margin-bottom: 20px;
}

.plan-features li {
  font-size: 14px;
  padding: 4px 0;
  color: #e5e7eb;
  transition: transform 0.2s ease;
}

.plan-features li:hover {
  transform: translateX(4px);
}

.plan-features .ko { color: #f87171; }
.plan-features .ok { color: #e5e7eb; }

.danger {
  border: 2px solid #fca5a5;
}

.danger-title {
  color: #ef4444;
  margin-bottom: 8px;
}

.danger-desc {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 16px;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  font-size: 18px;
  color: #6b7280;
}
</style>