<template>
  <Layout>
    <main class="container settings-page" v-if="store.profile">
      <div class="grid">
        <div class="col">
          <section class="card animate-fade-in-up theme-transition">
            <div class="profile-header">
              <div class="avatar animate-scale-in">{{ store.profile.initial }}</div>
              <div>
                <p class="username theme-transition">{{ store.profile.name }}</p>
                <button class="btn btn-outline btn-sm hover-lift theme-transition">{{ $t('settings.profile.changeAvatar') }}</button>
              </div>
            </div>

            <div class="form-grid">
              <div class="field">
                <label class="theme-transition">{{ $t('settings.profile.fullName') }}</label>
                <input type="text" v-model="store.profile.name" class="input-transition theme-transition" />
              </div>
              <div class="field">
                <label class="theme-transition">{{ $t('settings.profile.email') }}</label>
                <input type="email" v-model="store.profile.email" class="input-transition theme-transition" />
              </div>
              <div class="field">
                <label class="theme-transition">{{ $t('settings.profile.occupation') }}</label>
                <input type="text" v-model="store.profile.occupation" class="input-transition theme-transition" />
              </div>
              <div class="field">
                <label class="theme-transition">{{ $t('settings.profile.timezone') }}</label>
                <select v-model="store.profile.timezone" class="input-transition theme-transition" @change="store.setTimezone(store.profile.timezone)">
                  <option value="GMT-12">GMT-12 (Línea de cambio de fecha)</option>
                  <option value="GMT-11">GMT-11 (Islas Samoa)</option>
                  <option value="GMT-10">GMT-10 (Hawái)</option>
                  <option value="GMT-9">GMT-9 (Alaska)</option>
                  <option value="GMT-8">GMT-8 (Hora de la costa del Pacífico)</option>
                  <option value="GMT-7">GMT-7 (Hora de montaña)</option>
                  <option value="GMT-6">GMT-6 (América Central)</option>
                  <option value="GMT-5">GMT-5 (Lima, Perú)</option>
                  <option value="GMT-4">GMT-4 (Caracas, La Paz)</option>
                  <option value="GMT-3">GMT-3 (São Paulo, Buenos Aires)</option>
                  <option value="GMT-2">GMT-2 (Atlántico Medio)</option>
                  <option value="GMT-1">GMT-1 (Azores)</option>
                  <option value="GMT">GMT (Londres, Dublín)</option>
                  <option value="GMT+1">GMT+1 (París, Madrid, Berlín)</option>
                  <option value="GMT+2">GMT+2 (Estambul, El Cairo)</option>
                  <option value="GMT+3">GMT+3 (Moscú, Nairobi)</option>
                  <option value="GMT+4">GMT+4 (Dubai)</option>
                  <option value="GMT+5">GMT+5 (Pakistán, Tashkent)</option>
                  <option value="GMT+5:30">GMT+5:30 (India)</option>
                  <option value="GMT+6">GMT+6 (Bangladés)</option>
                  <option value="GMT+7">GMT+7 (Tailandia, Bangkok)</option>
                  <option value="GMT+8">GMT+8 (China, Hong Kong, Singapur)</option>
                  <option value="GMT+9">GMT+9 (Japón, Seúl)</option>
                  <option value="GMT+10">GMT+10 (Sídney)</option>
                  <option value="GMT+11">GMT+11 (Islas Salomón)</option>
                  <option value="GMT+12">GMT+12 (Nueva Zelanda, Fiji)</option>
                </select>
              </div>
            </div>

            <button class="btn btn-primary save-btn hover-lift theme-transition" @click="store.updateProfile()">
              {{ $t('settings.profile.saveChanges') }}
            </button>
          </section>

          <section class="card animate-fade-in-up delay-1 theme-transition">
            <h3 class="card-title theme-transition">{{ $t('settings.privacy.title') }}</h3>
            <div class="toggle-list">
              <div class="toggle-row">
                <div>
                  <p class="toggle-label theme-transition">{{ $t('settings.privacy.pinLock') }}</p>
                  <p class="toggle-desc theme-transition">{{ $t('settings.privacy.pinLockDesc') }}</p>
                </div>
                <label class="switch hover-scale">
                  <input
                    v-if="store.userSettings"
                    type="checkbox"
                    v-model="pinLockModel"
                  />
                  <span class="slider theme-transition"></span>
                </label>
              </div>
              <div class="toggle-row">
                <div>
                  <p class="toggle-label theme-transition">{{ $t('settings.privacy.darkMode') }}</p>
                  <p class="toggle-desc theme-transition">{{ $t('settings.privacy.darkModeDesc') }}</p>
                </div>
                <label class="switch hover-scale">
                  <input
                    type="checkbox"
                    v-model="darkModeModel"
                  />
                  <span class="slider theme-transition"></span>
                </label>
              </div>
              <div class="toggle-row">
                <div>
                  <p class="toggle-label theme-transition">{{ $t('settings.privacy.habitReminders') }}</p>
                  <p class="toggle-desc theme-transition">{{ $t('settings.privacy.habitRemindersDesc') }}</p>
                </div>
                <label class="switch hover-scale">
                  <input
                    v-if="store.userSettings"
                    type="checkbox"
                    v-model="habitRemindersModel"
                  />
                  <span class="slider theme-transition"></span>
                </label>
              </div>

              <div v-if="store.userSettings && store.userSettings.habitRemindersEnabled" class="reminder-time-row">
                <div>
                  <p class="toggle-label theme-transition">{{ $t('settings.privacy.reminderTime') || 'Hora de recordatorios' }}</p>
                  <p class="toggle-desc theme-transition">{{ $t('settings.privacy.reminderTimeDesc') || 'Establece la hora para recibir recordatorios de hábitos' }}</p>
                </div>
                <input
                  type="time"
                  v-model="store.userSettings.reminderTime"
                  @change="store.setReminderTime(store.userSettings.reminderTime)"
                  class="time-input input-transition theme-transition"
                />
              </div>
            </div>
          </section>
        </div>

        <div class="col">
          <section class="card card-subscription animate-fade-in-up delay-2 theme-transition">
            <h3 class="card-title accent">{{ $t('settings.subscription.title') }}</h3>
            <p class="plan-text theme-transition">{{ $t('settings.subscription.currentPlan') }}: <span class="theme-transition">{{ store.profile.planName }}</span></p>
            <ul class="plan-features">
              <li class="ok theme-transition">✓ {{ $t('settings.subscription.features.journal') }}</li>
              <li class="ok theme-transition">✓ {{ $t('settings.subscription.features.habits') }}</li>
              <li :class="store.profile.isPremium ? 'ok' : 'ko'" class="theme-transition">
                {{ store.profile.isPremium ? '✓' : '✗' }} {{ $t('settings.subscription.features.pdf') }}
              </li>
              <li :class="store.profile.isPremium ? 'ok' : 'ko'" class="theme-transition">
                {{ store.profile.isPremium ? '✓' : '✗' }} {{ $t('settings.subscription.features.clinical') }}
              </li>
            </ul>
            <button class="btn btn-primary full hover-lift theme-transition" v-if="!store.profile.isPremium">
              {{ $t('settings.subscription.upgrade') }}
            </button>
          </section>

          <section class="card animate-fade-in-up delay-3 theme-transition">
            <h3 class="card-title theme-transition">{{ $t('settings.support.title') }}</h3>
            <div class="stack">
              <button class="btn btn-outline full hover-lift theme-transition">{{ $t('settings.support.ticket') }}</button>
              <button class="btn btn-outline full hover-lift theme-transition">{{ $t('settings.support.faq') }}</button>
            </div>
          </section>

          <section class="card danger animate-fade-in-up delay-4 theme-transition">
            <h3 class="card-title danger-title">{{ $t('settings.dangerZone.title') }}</h3>
            <p class="danger-desc theme-transition">
              {{ $t('settings.dangerZone.warning') }}
            </p>
            <button class="btn btn-danger full hover-lift theme-transition">{{ $t('settings.dangerZone.deleteAccount') }}</button>
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
import { onMounted, computed } from 'vue'
import { useSettingsStore } from '../../application/settings.store'
import Layout from '@/shared/presentation/components/layout.vue'

const store = useSettingsStore()

const pinLockModel = computed({
  get: () => !!store.userSettings?.pinLockEnabled,
  set: (value) => store.setPinLockEnabled(value)
})

const darkModeModel = computed({
  get: () => !!store.darkMode,
  set: (value) => store.setDarkMode(value)
})

const habitRemindersModel = computed({
  get: () => !!store.userSettings?.habitRemindersEnabled,
  set: (value) => store.setHabitRemindersEnabled(value)
})

onMounted(async () => {
  await store.fetchProfile('u1')
})
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
.animate-scale-in { animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }
.delay-4 { animation-delay: 0.4s; }

.hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
.hover-lift:hover { transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }

.hover-scale { transition: transform 0.2s ease; }
.hover-scale:hover { transform: scale(1.05); }

.input-transition { transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease, color 0.2s ease; }

.spinner { border: 3px solid #f3f3f3; border-top: 3px solid #6366f1; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; margin-right: 12px; }

.container { max-width: 1100px; margin: 0 auto; padding: 32px 32px 64px 32px; }
.grid { display: grid; grid-template-columns: 1fr 320px; gap: 24px; }
@media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
.col { display: flex; flex-direction: column; gap: 24px; }

.card {
  background: var(--bg-surface);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  transition: box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  color: var(--text-primary);
  border: 1px solid var(--border-light);
}

.card:hover { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }

.card-subscription {
  background: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid rgba(99, 102, 241, 0.2);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.06);
}

:global(.dark-mode) .card-subscription {
  background: #0f1724;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 10px 30px rgba(2,6,23,0.75);
}

.card-title { font-size: 16px; font-weight: 600; margin-bottom: 16px; color: var(--text-primary); }

.accent { color: #047857; margin-bottom: 4px; font-weight: 700; }
:global(.dark-mode) .card-subscription .accent { color: #34d399; }


.profile-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }

.avatar {
  width: 64px; height: 64px; border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-hover)); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; font-weight: 600; box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.4);
}

.username { font-weight: 500; margin-bottom: 8px; color: var(--text-primary); }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }

.field label {
  display: block; font-size: 13px; color: var(--text-secondary); margin-bottom: 6px;
  transition: color 0.3s ease;
}

.field input {
  width: 100%; padding: 8px 12px; border: 1px solid var(--border-color);
  border-radius: 8px; font-size: 14px; background: var(--bg-surface);
  color: var(--text-primary);
}
.field input:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
.field input:disabled { background: var(--bg-surface-secondary); color: var(--text-muted); cursor: not-allowed; }

.field select {
  width: 100%; padding: 8px 12px; border: 1px solid var(--border-color);
  border-radius: 8px; font-size: 14px; background: var(--bg-surface);
  color: var(--text-primary);
}
.field select:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
.field select:disabled { background: var(--bg-surface-secondary); color: var(--text-muted); cursor: not-allowed; }

.reminder-time-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 12px 0;
  border-top: 1px solid var(--border-light);
  margin-top: 12px;
}

.time-input {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  background: var(--bg-surface);
  color: var(--text-primary);
  flex-shrink: 0;
}

.time-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
}

.save-btn { margin-top: 24px; }
.btn { display: inline-block; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; border: 1px solid transparent; transition: all 0.2s ease; }
.btn-sm { padding: 4px 12px; font-size: 13px; }
.btn-primary { background: #6366f1; color: #fff; }
.btn-primary:hover { background: #4f46e5; }
:global(.dark-mode) .card-subscription .btn-primary {
  background: #111827;
  color: #fff;
}
:global(.dark-mode) .card-subscription .btn-primary:hover {
  background: #1f2937;
}

.btn-outline {
  background: var(--bg-surface); color: var(--text-primary);
  border-color: var(--border-color);
}
.btn-outline:hover { background: var(--bg-surface-secondary); }
.btn-danger { background: var(--bg-surface); color: #ef4444; border-color: #fca5a5; }
.btn-danger:hover { background: #fef2f2; }
.full { width: 100%; }
.stack { display: flex; flex-direction: column; gap: 12px; }
.toggle-list { display: flex; flex-direction: column; gap: 20px; }
.toggle-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }

.toggle-label { font-size: 14px; color: var(--text-primary); transition: color 0.2s ease; }
.toggle-row:hover .toggle-label { color: #6366f1; }
.toggle-desc { font-size: 13px; color: var(--text-secondary); transition: color 0.3s ease; }

.switch { position: relative; display: inline-block; width: 40px; height: 22px; flex-shrink: 0; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; inset: 0; background: var(--border-color); border-radius: 22px; transition: 0.3s cubic-bezier(0.4, 0.0, 0.2, 1); }
.slider::before { content: ""; position: absolute; height: 18px; width: 18px; left: 2px; top: 2px; background: #fff; border-radius: 50%; transition: 0.3s cubic-bezier(0.4, 0.0, 0.2, 1); box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
.switch input:checked + .slider { background: #34d399; }
.switch input:checked + .slider::before { transform: translateX(18px); }

.plan-text { color: var(--text-secondary); font-size: 14px; margin-bottom: 16px; }
.plan-text span { color: var(--text-primary); font-weight: 600; }

.plan-features { list-style: none; margin-bottom: 20px; }
.plan-features li { font-size: 14px; padding: 5px 0; color: var(--text-secondary); transition: transform 0.2s ease; }
.plan-features li:hover { transform: translateX(4px); }
.plan-features .ok { color: var(--accent-primary); }
.plan-features .ko { color: #ef4444; }

.danger { border: 2px solid #fca5a5; }
.danger-title { color: #ef4444; margin-bottom: 8px; }
.danger-desc { font-size: 13px; color: var(--text-secondary); margin-bottom: 16px; transition: color 0.3s ease; }

:global(.dark-mode) .danger {
  border: 1px solid rgba(248,113,113,0.18);
  background: rgba(248,113,113,0.02);
  box-shadow: 0 6px 18px rgba(2,6,23,0.35);
}

:global(.dark-mode) .danger-title {
  color: #fb7185;
}

:global(.dark-mode) .btn-danger {
  background: transparent;
  color: #fb7185;
  border-color: rgba(248,113,113,0.18);
}
.loading-state { display: flex; justify-content: center; align-items: center; height: 60vh; font-size: 18px; color: var(--text-secondary); }

</style>