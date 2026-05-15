<template>
  <Layout>
    <div class="journal-page">
      <div class="page-header">
        <h1>Tu Historial Emocional</h1>


      </div>

      <div class="journal-grid">

        <div class="left-panel">
          <div class="card">
            <JournalFilters
                @change-state="handleMoodChange"
            />
            <JournalCalendar
                :selectedMood="selectedMood"
            />
          </div>
        </div>

        <div class="right-panel">
          <JournalEntryCard
              v-for="entry in entries"
              :key="entry.id"
              :entry="entry"
          />

        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import Layout from '../../../shared/presentation/components/layout.vue'
import JournalCalendar from '../components/JournalCalendar.vue'
import JournalFilters from '../components/JournalFilters.vue'
import JournalEntryCard from '../components/JournalEntryCard.vue'
import { ref } from 'vue'

const selectedMood = ref('Positivo')
const handleMoodChange = (mood) => {
  selectedMood.value = mood
}

const entries = [
  {
    id: 1,
    date: 'Domingo, 26 de Abril, 3:09 AM',
    category: 'Reflexión Personal',
    title: 'Insomnio y nuevos comienzos',
    content:
        'No he podido dormir, sigo pensando en la estructuración del nuevo proyecto. Aunque me siento un poco cansado físicamente, mentalmente estoy muy emocionado por lo que estamos construyendo con MindFlow. Mañana intentaré descansar mejor.',
    hasPreview: false
  },

  {
    id: 2,
    date: 'Jueves, 23 de Abril, 6:30 PM',
    category: 'Trabajo',
    title: 'Presentación del MVP',
    content:
        'Hoy tuvimos la presentación del proyecto. Me sentí muy abrumado al principio, la ansiedad estaba a tope, pero la guía de respiración de 4-7-8 que me sugirió la app me ayudó a centrarme justo antes de hablar.',
    hasPreview: false
  },

  {
    id: 3,
    date: 'Lunes, 20 de Abril, 9:00 PM',
    category: 'Estudios',
    title: 'Bloqueo mental total',
    content:
        'No logré concentrarme nada hoy. Siento que la procrastinación me está ganando y me frustra no haber avanzado en los diagramas de arquitectura.',
    hasPreview: false
  }
]
</script>

<style>
.journal-page {
  min-height: 100vh;

  background: #f5f7fb;

  padding: 28px;

  font-family: Inter, sans-serif;
}



.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 26px;
}

.page-header h1 {
  font-size: 20px;

  font-weight: 700;

  color: #2b2b2b;
}



.search-box input {
  width: 300px;

  height: 44px;

  padding: 0 18px;

  border-radius: 999px;

  border: 1px solid #e5e7eb;

  background: white;

  font-size: 14px;

  outline: none;

  transition: .2s ease;
}

.search-box input:focus {
  border-color: #5b8def;

  box-shadow:
      0 0 0 4px rgba(91,141,239,.12);
}



.journal-grid {
  display: grid;

  grid-template-columns: 365px 1fr;

  gap: 24px;

  align-items: start;
}



.card {
  background: white;

  border-radius: 18px;

  padding: 24px;

  border: 1px solid #edf0f5;

  box-shadow:
      0 1px 2px rgba(0,0,0,0.02),
      0 8px 24px rgba(0,0,0,0.03);
}



.right-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

</style>