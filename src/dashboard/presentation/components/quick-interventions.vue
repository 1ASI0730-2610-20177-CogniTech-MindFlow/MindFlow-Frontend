<template>
  <div class="dashboard-card theme-transition">
    <div class="header-row">
      <h3 class="card-title">{{ t('dashboard.quickInterventions.title') }}</h3>
    </div>

    <div class="interventions-list">
      <button class="intervention-card" style="--card-color: 16, 185, 129; --bar-color: var(--accent-success)" @click="activeExercise = 'breathing'">
        <div class="intervention-icon breathing-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6a6 6 0 1 0 6 6"/><path d="M12 10a2 2 0 1 0 2 2"/>
          </svg>
        </div>
        <div class="intervention-body">
          <span class="intervention-title">{{ t('dashboard.quickInterventions.breathing') }}</span>
          <span class="intervention-desc">{{ t('dashboard.quickInterventions.breathingDesc') }}</span>
        </div>
        <div class="intervention-meta">
          <span class="duration-badge">4-7-8</span>
          <svg class="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </button>

      <button class="intervention-card" style="--card-color: 99, 102, 241; --bar-color: var(--accent-primary)" @click="activeExercise = 'meditation'">
        <div class="intervention-icon meditation-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 2.992z"/><path d="M17 10a3 3 0 0 0-3-3"/><path d="M7 10a3 3 0 0 1 3-3"/>
          </svg>
        </div>
        <div class="intervention-body">
          <span class="intervention-title">{{ t('dashboard.quickInterventions.microMeditation') }}</span>
          <span class="intervention-desc">{{ t('dashboard.quickInterventions.microMeditationDesc') }}</span>
        </div>
        <div class="intervention-meta">
          <span class="duration-badge">3 min</span>
          <svg class="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </button>

      <button class="intervention-card" style="--card-color: 245, 158, 11; --bar-color: var(--accent-warning)" @click="activeExercise = 'grounding'">
        <div class="intervention-icon grounding-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 12h20"/><path d="M12 2v20"/><path d="m4.93 4.93 14.14 14.14"/><path d="m19.07 4.93-14.14 14.14"/>
          </svg>
        </div>
        <div class="intervention-body">
          <span class="intervention-title">{{ t('dashboard.quickInterventions.grounding') }}</span>
          <span class="intervention-desc">{{ t('dashboard.quickInterventions.groundingDesc') }}</span>
        </div>
        <div class="intervention-meta">
          <span class="duration-badge">5-4-3-2-1</span>
          <svg class="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </button>
    </div>
  </div>

  <Teleport to="body">
    <Transition name="exercise-fade">
      <div v-if="activeExercise" class="exercise-overlay" @click.self="stop">
        <div class="exercise-modal">
          <button class="exercise-close" @click="stop"><i class="pi pi-times"></i></button>

          <!-- Breathing 4-7-8 -->
          <template v-if="activeExercise === 'breathing'">
            <div class="exercise-circle" :class="breathingPhase" :key="breathingKey">
              <div class="circle-ring"></div>
              <div class="circle-inner">
                <span class="phase-label">{{ breathingLabel }}</span>
                <span class="phase-count">{{ timer }}</span>
              </div>
            </div>
            <p class="exercise-instruction">{{ breathingInstruction }}</p>
            <p class="exercise-round">{{ t('dashboard.interventions.round') }} {{ currentRound }}/4</p>
          </template>

          <!-- Meditation -->
          <template v-if="activeExercise === 'meditation'">
            <div class="exercise-circle meditation-active">
              <div class="circle-ring"></div>
              <div class="circle-inner">
                <i class="pi pi-sparkles meditation-icon"></i>
                <span class="phase-count">{{ formatTime(meditationTimer) }}</span>
              </div>
            </div>
            <p class="exercise-instruction">{{ meditationSteps[meditationStep] }}</p>
          </template>

          <!-- Grounding 5-4-3-2-1 -->
          <template v-if="activeExercise === 'grounding'">
            <div class="exercise-circle grounding-active" :key="'g' + groundingCurrent">
              <div class="circle-ring"></div>
              <div class="circle-inner">
                <span class="phase-count grounding-number">{{ groundingCurrent }}</span>
                <span class="phase-label">{{ groundingSense }}</span>
              </div>
            </div>
            <p class="exercise-instruction">{{ groundingInstruction }}</p>
            <div class="grounding-progress">
              <span v-for="n in 5" :key="n" class="grounding-dot" :class="{ active: n <= (6 - groundingCurrent), current: n === (6 - groundingCurrent) }"></span>
            </div>
            <button v-if="groundingCurrent > 0" class="exercise-next-btn" @click="nextGrounding">
              {{ t('dashboard.interventions.next') }}
            </button>
            <p v-else class="exercise-complete">{{ t('dashboard.interventions.complete') }}</p>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const activeExercise = ref(null)
const intervalId = ref(null)

// === BREATHING 4-7-8 ===
const breathingPhase = ref('inhale')
const breathingKey = ref(0)
const timer = ref(4)
const currentRound = ref(1)
const breathingLabel = ref('')
const breathingInstruction = ref('')

const breathingSequence = [
  { phase: 'inhale', duration: 4, label: () => t('dashboard.interventions.inhale'), instruction: () => t('dashboard.interventions.inhaleDesc') },
  { phase: 'hold', duration: 7, label: () => t('dashboard.interventions.hold'), instruction: () => t('dashboard.interventions.holdDesc') },
  { phase: 'exhale', duration: 8, label: () => t('dashboard.interventions.exhale'), instruction: () => t('dashboard.interventions.exhaleDesc') }
]

function startBreathing() {
  let seqIndex = 0
  currentRound.value = 1
  setBreathingStep(seqIndex)

  intervalId.value = setInterval(() => {
    timer.value--
    if (timer.value <= 0) {
      seqIndex++
      if (seqIndex >= breathingSequence.length) {
        seqIndex = 0
        currentRound.value++
        if (currentRound.value > 4) {
          stop()
          return
        }
      }
      setBreathingStep(seqIndex)
    }
  }, 1000)
}

function setBreathingStep(index) {
  const step = breathingSequence[index]
  breathingPhase.value = step.phase
  breathingKey.value++
  timer.value = step.duration
  breathingLabel.value = step.label()
  breathingInstruction.value = step.instruction()
}

// === MEDITATION ===
const meditationTimer = ref(180)
const meditationStep = ref(0)
const meditationSteps = computed(() => [
  t('dashboard.quickInterventions.meditation.step1'),
  t('dashboard.quickInterventions.meditation.step2'),
  t('dashboard.quickInterventions.meditation.step3'),
  t('dashboard.quickInterventions.meditation.step4'),
  t('dashboard.quickInterventions.meditation.step5')
])

function startMeditation() {
  meditationTimer.value = 180
  meditationStep.value = 0
  intervalId.value = setInterval(() => {
    meditationTimer.value--
    const stepDuration = 36
    meditationStep.value = Math.min(Math.floor((180 - meditationTimer.value) / stepDuration), meditationSteps.length - 1)
    if (meditationTimer.value <= 0) stop()
  }, 1000)
}

function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

// === GROUNDING 5-4-3-2-1 ===
const groundingCurrent = ref(5)
const groundingSenses = [
  { sense: () => t('dashboard.interventions.see'), instruction: () => t('dashboard.interventions.seeDesc') },
  { sense: () => t('dashboard.interventions.touch'), instruction: () => t('dashboard.interventions.touchDesc') },
  { sense: () => t('dashboard.interventions.hear'), instruction: () => t('dashboard.interventions.hearDesc') },
  { sense: () => t('dashboard.interventions.smell'), instruction: () => t('dashboard.interventions.smellDesc') },
  { sense: () => t('dashboard.interventions.taste'), instruction: () => t('dashboard.interventions.tasteDesc') }
]
const groundingSense = ref('')
const groundingInstruction = ref('')

function startGrounding() {
  groundingCurrent.value = 5
  setGroundingStep()
}

function setGroundingStep() {
  const idx = 5 - groundingCurrent.value
  if (idx < groundingSenses.length) {
    groundingSense.value = groundingSenses[idx].sense()
    groundingInstruction.value = groundingSenses[idx].instruction()
  }
}

function nextGrounding() {
  groundingCurrent.value--
  if (groundingCurrent.value <= 0) return
  setGroundingStep()
}

// === LIFECYCLE ===
function stop() {
  if (intervalId.value) clearInterval(intervalId.value)
  intervalId.value = null
  activeExercise.value = null
}

watch(activeExercise, (val) => {
  if (val === 'breathing') startBreathing()
  else if (val === 'meditation') startMeditation()
  else if (val === 'grounding') startGrounding()
})

onUnmounted(() => stop())
</script>

<style scoped>
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.live-badge {
  font-size: 11px;
  font-weight: 600;
  color: var(--accent-success);
  letter-spacing: 0.03em;
  animation: pulse 2s infinite;
}

.interventions-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.intervention-card {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 14px 16px;
  border-radius: 14px;
  background: var(--bg-surface-secondary);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: left;
  font: inherit;
  position: relative;
  overflow: hidden;
}

.intervention-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  border-radius: 14px 0 0 14px;
  opacity: 0;
  transition: opacity 0.3s;
  background: var(--bar-color);
}

.intervention-card:hover {
  transform: translateX(4px);
  border-color: transparent;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  background: linear-gradient(135deg, rgba(var(--card-color), 0.06), var(--bg-surface-secondary));
}

.intervention-card:hover::before {
  opacity: 1;
}

.intervention-card:hover .arrow {
  opacity: 1;
  transform: translateX(0);
}

.intervention-card:active {
  transform: translateX(2px) scale(0.97);
}

.intervention-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;
}

.intervention-card:hover .intervention-icon {
  transform: scale(1.08);
}

.breathing-icon {
  background: rgba(16, 185, 129, 0.12);
  color: var(--accent-success);
}

.meditation-icon {
  background: rgba(99, 102, 241, 0.12);
  color: var(--accent-primary);
}

.grounding-icon {
  background: rgba(245, 158, 11, 0.12);
  color: var(--accent-warning);
}

.intervention-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.intervention-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.intervention-desc {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.intervention-meta { flex-shrink: 0; display: flex; align-items: center; gap: 8px; }
.duration-badge { font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 6px; background: var(--bg-surface); color: var(--text-secondary); }
.arrow { opacity: 0; transform: translateX(-4px); transition: all 0.3s; color: var(--text-muted); }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }

/* Exercise Modal */
.exercise-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; }
.exercise-modal { display: flex; flex-direction: column; align-items: center; gap: 24px; padding: 48px; max-width: 400px; width: 100%; position: relative; }
.exercise-close { position: absolute; top: 8px; right: 8px; width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; z-index: 10; }
.exercise-close:hover { background: rgba(255,255,255,0.2); }

.exercise-circle { width: 200px; height: 200px; border-radius: 50%; position: relative; display: flex; align-items: center; justify-content: center; }
.circle-ring { position: absolute; inset: 0; border-radius: 50%; border: 3px solid rgba(255,255,255,0.1); }
.circle-inner { display: flex; flex-direction: column; align-items: center; gap: 4px; z-index: 1; }
.phase-label { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.8); text-transform: uppercase; letter-spacing: 0.1em; }
.phase-count { font-size: 48px; font-weight: 700; color: #fff; line-height: 1; }

/* Breathing phases */
.inhale { animation: breatheIn 4s ease-in-out; }
.hold { animation: breatheHold 7s ease; }
.exhale { animation: breatheOut 8s ease-in-out; }
.inhale .circle-ring { border-color: var(--accent-success); box-shadow: 0 0 40px rgba(16,185,129,0.4); }
.hold .circle-ring { border-color: var(--accent-primary); box-shadow: 0 0 40px rgba(99,102,241,0.4); }
.exhale .circle-ring { border-color: var(--accent-warning); box-shadow: 0 0 40px rgba(245,158,11,0.4); }

@keyframes breatheIn { from { transform: scale(0.8); } to { transform: scale(1.15); } }
@keyframes breatheHold { 0%,100% { transform: scale(1.15); } 50% { transform: scale(1.12); } }
@keyframes breatheOut { from { transform: scale(1.15); } to { transform: scale(0.8); } }

/* Meditation */
.meditation-active .circle-ring { border-color: var(--accent-primary); box-shadow: 0 0 60px rgba(99,102,241,0.3); animation: meditationPulse 4s ease-in-out infinite; }
.meditation-icon { font-size: 28px; color: rgba(255,255,255,0.9); animation: floatIcon 3s ease-in-out infinite; }
@keyframes meditationPulse { 0%,100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.05); opacity: 1; } }
@keyframes floatIcon { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }

/* Grounding */
.grounding-active { animation: groundingPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
.grounding-active .circle-ring { border-color: var(--accent-warning); box-shadow: 0 0 40px rgba(245,158,11,0.3); animation: groundingPulse 2s ease-in-out infinite; }
.grounding-number { font-size: 56px; }
@keyframes groundingPop { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes groundingPulse { 0%,100% { box-shadow: 0 0 40px rgba(245,158,11,0.3); } 50% { box-shadow: 0 0 60px rgba(245,158,11,0.5); } }
.grounding-progress { display: flex; gap: 8px; }
.grounding-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.2); transition: all 0.3s; }
.grounding-dot.active { background: var(--accent-warning); }
.grounding-dot.current { transform: scale(1.3); box-shadow: 0 0 12px rgba(245,158,11,0.5); }

.exercise-instruction { font-size: 16px; color: rgba(255,255,255,0.85); text-align: center; line-height: 1.6; max-width: 300px; margin: 0; }
.exercise-round { font-size: 13px; color: rgba(255,255,255,0.5); margin: 0; }
.exercise-complete { font-size: 18px; font-weight: 700; color: var(--accent-success); margin: 0; }
.exercise-next-btn { padding: 12px 32px; border-radius: 12px; border: none; background: var(--accent-warning); color: #fff; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s; }
.exercise-next-btn:hover { transform: scale(1.05); box-shadow: 0 4px 16px rgba(245,158,11,0.4); }

.exercise-fade-enter-active, .exercise-fade-leave-active { transition: opacity 0.3s; }
.exercise-fade-enter-from, .exercise-fade-leave-to { opacity: 0; }
</style>
