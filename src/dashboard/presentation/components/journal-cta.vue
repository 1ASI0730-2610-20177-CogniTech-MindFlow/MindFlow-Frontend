<template>
  <div
    class="card journal-cta"
    role="button"
    tabindex="0"
    aria-label="Crear nueva entrada de diario"
    @click="goToJournal"
    @keydown.enter="goToJournal"
  >
    <div class="cta-content">
      <i class="pi pi-book cta-icon"></i>
      <h3>Nueva Entrada de Diario</h3>
      <p>Captura tus pensamientos y emociones</p>
      <div class="cta-arrow">
        <i class="pi pi-arrow-right"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goToJournal = () => router.push('/journal')
</script>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

.journal-cta {
  background: linear-gradient(135deg, #4F8DF5 0%, #6ED3A3 100%);
  border: none;
  cursor: pointer;
  overflow: hidden;
}

.journal-cta:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(79, 141, 245, 0.3);
}

.journal-cta:active { transform: translateY(-2px); }

.cta-content {
  text-align: center;
  color: #ffffff;
}

.cta-icon {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
}

.cta-content h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.cta-content p {
  font-size: 14px;
  opacity: 0.9;
  margin: 0 0 16px 0;
}

.cta-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transition: transform 0.2s;
}

.journal-cta:hover .cta-arrow { transform: translateX(4px); }

.cta-arrow i { font-size: 16px; }
</style>
