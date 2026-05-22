<template>
  <div class="premium-card export-banner">
    <div class="export-info">
      <h3>{{ $t('analytics.components.export.title') }}</h3>
      <p>{{ $t('analytics.components.export.desc') }}</p>
    </div>
    <div class="export-actions">
      <button class="btn-outline">
        <span class="mono-text">PDF</span>
      </button>
      <button class="btn-outline">
        <span class="mono-text">CSV</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.premium-card { background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.8); border-radius: 20px; box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.04); padding: 28px 36px; display: flex; justify-content: space-between; align-items: center; transition: all 0.4s ease; }
.premium-card:hover { transform: translateY(-2px); box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.08); }

.export-info h3 { margin: 0 0 6px 0; color: var(--text-dark); font-size: 18px; font-weight: 700; }
.export-info p { margin: 0; color: var(--text-muted); font-size: 14px; }

.export-actions { display: flex; gap: 12px; }

.btn-outline { background: transparent; border: 1px solid rgba(15, 23, 42, 0.1); color: var(--text-dark); padding: 10px 24px; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; }
.btn-outline:hover { background: var(--text-dark); color: #ffffff; border-color: var(--text-dark); }
.mono-text { font-size: 12px; letter-spacing: 0.05em; font-weight: 700; }

@media (max-width: 768px) {
  .premium-card { flex-direction: column; padding: 24px; text-align: center; gap: 24px; }
  .export-actions { width: 100%; display: grid; grid-template-columns: 1fr 1fr; }
  .btn-outline { padding: 12px; }
}
</style>