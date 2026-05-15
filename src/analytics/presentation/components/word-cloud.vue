<template>
  <div class="premium-card word-cloud-container">
    <div class="card-header">
      <h3 class="card-title">{{ $t('analytics.components.wordCloud.title') }}</h3>
      <span class="mono-subtitle">NLP_ANALYSIS</span>
    </div>

    <div class="mock-word-cloud">
      <span style="font-size: 28px; color: var(--global-green); font-weight: 600; top: 30%; left: 20%;">{{ $t('analytics.components.wordCloud.words.calm') }}</span>
      <span style="font-size: 12px; color: #ef4444; font-weight: 600; top: 60%; left: 25%;">{{ $t('analytics.components.wordCloud.words.anxious') }}</span>
      <span style="font-size: 14px; color: var(--text-muted); top: 40%; left: 50%;">{{ $t('analytics.components.wordCloud.words.productive') }}</span>
      <span style="font-size: 32px; color: var(--global-blue); font-weight: 700; top: 50%; left: 45%;">{{ $t('analytics.components.wordCloud.words.grateful') }}</span>
      <span style="font-size: 14px; color: var(--text-dark); font-weight: 700; top: 35%; left: 75%;">{{ $t('analytics.components.wordCloud.words.family') }}</span>
      <span style="font-size: 18px; color: #f59e0b; font-weight: 600; top: 55%; left: 75%;">{{ $t('analytics.components.wordCloud.words.tired') }}</span>
    </div>
  </div>
</template>

<style scoped>
.premium-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 24px;
  box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.05), 0 0 0 1px rgba(15, 23, 42, 0.02) inset;
  padding: 32px;
  transition: all 0.4s ease;
}

.card-header { margin-bottom: 24px; }
.card-title { font-size: 18px; color: var(--text-dark); margin: 0 0 4px 0; font-weight: 700; }
.mono-subtitle { font-size: 9px; font-weight: 600; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase; }

.word-cloud-container { height: 380px; position: relative; display: flex; flex-direction: column; }
.mock-word-cloud { position: relative; flex: 1; width: 100%; display: flex; align-items: center; justify-content: center; }
.mock-word-cloud span { position: absolute; transform: translate(-50%, -50%); }
</style>