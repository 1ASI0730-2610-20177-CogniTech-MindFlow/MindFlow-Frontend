<template>
  <Layout>
    <main class="container" v-if="store.profile">
      <div class="grid">
        <div class="col">
          <section class="card">
            <div class="profile-header">
              <div class="avatar">{{ store.profile.initial }}</div>
              <div>
                <p class="username">{{ store.profile.name }}</p>
                <button class="btn btn-outline btn-sm">Cambiar Avatar</button>
              </div>
            </div>

            <div class="form-grid">
              <div class="field">
                <label>Nombre Completo</label>
                <input type="text" v-model="store.profile.name" />
              </div>
              <div class="field">
                <label>Correo Electrónico</label>
                <input type="email" v-model="store.profile.email" />
              </div>
              <div class="field">
                <label>Ocupación</label>
                <input type="text" v-model="store.profile.occupation" />
              </div>
              <div class="field">
                <label>Zona Horaria</label>
                <input type="text" value="GMT-5 (Lima, Perú)" disabled />
              </div>
            </div>

            <button class="btn btn-primary save-btn" @click="store.updateProfile()">
              Guardar Cambios
            </button>
          </section>

          <section class="card">
            <h3 class="card-title">Privacidad y Experiencia</h3>
            <div class="toggle-list">
              <div class="toggle-row">
                <div>
                  <p class="toggle-label">Bloqueo por PIN (AES-256)</p>
                  <p class="toggle-desc">Solicitar código de 4 dígitos al abrir la app.</p>
                </div>
                <label class="switch">
                  <input type="checkbox" checked />
                  <span class="slider"></span>
                </label>
              </div>
              <div class="toggle-row">
                <div>
                  <p class="toggle-label">Modo Oscuro</p>
                  <p class="toggle-desc">Ideal para registrar emociones en la noche.</p>
                </div>
                <label class="switch">
                  <input type="checkbox" />
                  <span class="slider"></span>
                </label>
              </div>
              <div class="toggle-row">
                <div>
                  <p class="toggle-label">Recordatorios de Hábitos</p>
                  <p class="toggle-desc">Notificaciones push para hidratación y pausas.</p>
                </div>
                <label class="switch">
                  <input type="checkbox" checked />
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </section>
        </div>

        <div class="col">
          <section class="card card-dark">
            <h3 class="card-title accent">Suscripción</h3>
            <p class="plan-text">Plan Actual: <span>{{ store.profile.planName }}</span></p>
            <ul class="plan-features">
              <li class="ok">✓ IA Mood Journal</li>
              <li class="ok">✓ Gestor de Hábitos</li>
              <li :class="store.profile.isPremium ? 'ok' : 'ko'">
                {{ store.profile.isPremium ? '✓' : '✗' }} Exportación a PDF
              </li>
              <li :class="store.profile.isPremium ? 'ok' : 'ko'">
                {{ store.profile.isPremium ? '✓' : '✗' }} Reportes Clínicos
              </li>
            </ul>
            <button class="btn btn-primary full" v-if="!store.profile.isPremium">
              Mejorar a Premium
            </button>
          </section>

          <section class="card">
            <h3 class="card-title">Soporte Técnico</h3>
            <div class="stack">
              <button class="btn btn-outline full">Generar Ticket de Ayuda</button>
              <button class="btn btn-outline full">Centro de Preguntas (FAQ)</button>
            </div>
          </section>

          <section class="card danger">
            <h3 class="card-title danger-title">Zona de Peligro</h3>
            <p class="danger-desc">
              Eliminar tu cuenta purgará permanentemente todos tus registros encriptados.
            </p>
            <button class="btn btn-danger full">Eliminar mi cuenta</button>
          </section>
        </div>
      </div>
    </main>

    <div v-else class="loading-state">
      <p>Cargando configuración...</p>
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
  transition: all 0.15s;
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
  transition: 0.2s;
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
  transition: 0.2s;
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
  height: 100%;
  font-size: 18px;
  color: #6b7280;
}
</style>