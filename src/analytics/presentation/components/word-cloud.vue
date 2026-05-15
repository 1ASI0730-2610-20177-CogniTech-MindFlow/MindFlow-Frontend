<template>
  <div class="premium-card word-cloud-container theme-transition">
    <div class="card-header">
      <h3 class="card-title theme-transition">{{ $t('analytics.components.wordCloud.title') }}</h3>
      <span class="mono-subtitle">NLP_ANALYSIS</span>
    </div>

    <div class="mock-word-cloud">
      <span style="font-size: 28px; color: var(--global-green); font-weight: 600; top: 30%; left: 20%;">{{ $t('analytics.components.wordCloud.words.calm') }}</span>
      <span style="font-size: 12px; color: #ef4444; font-weight: 600; top: 60%; left: 25%;">{{ $t('analytics.components.wordCloud.words.anxious') }}</span>
      <span style="font-size: 14px; color: var(--text-muted); top: 40%; left: 50%;">{{ $t('analytics.components.wordCloud.words.productive') }}</span>
      <span style="font-size: 32px; color: var(--global-blue); font-weight: 700; top: 50%; left: 45%;">{{ $t('analytics.components.wordCloud.words.grateful') }}</span>
      <span style="font-size: 14px; color: var(--text-primary); font-weight: 700; top: 35%; left: 75%; transition: color 0.3s ease;">{{ $t('analytics.components.wordCloud.words.family') }}</span>
      <span style="font-size: 18px; color: #f59e0b; font-weight: 600; top: 55%; left: 75%;">{{ $t('analytics.components.wordCloud.words.tired') }}</span>
    </div>
  </div>
</template>

<style scoped>
.premium-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  box-shadow: var(--shadow-md);
  padding: 32px;
  transition: all 0.4s ease;
}

.card-header { margin-bottom: 24px; }
.card-title { font-size: 18px; color: var(--text-primary); margin: 0 0 4px 0; font-weight: 700; }
.mono-subtitle { font-size: 9px; font-weight: 600; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase; }

.word-cloud-container { height: 380px; position: relative; display: flex; flex-direction: column; }
.mock-word-cloud { position: relative; flex: 1; width: 100%; display: flex; align-items: center; justify-content: center; }
.mock-word-cloud span { position: absolute; transform: translate(-50%, -50%); }
</style>