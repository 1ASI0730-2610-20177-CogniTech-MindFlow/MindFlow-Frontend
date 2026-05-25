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
.premium-card {
  background: linear-gradient(135deg, var(--bg-surface), var(--bg-surface-secondary));
  border: 1px solid var(--border-light);
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 32px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
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
  pointer-events: none;
}

.premium-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  border-color: rgba(99, 102, 241, 0.2);
}

.premium-card:hover::before {
  left: 100%;
}

.export-info {
  flex: 1;
  position: relative;
  z-index: 1;
}

.export-info h3 {
  margin: 0 0 8px 0;
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 800;
  transition: color 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  letter-spacing: -0.01em;
}

.export-info p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  transition: color 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-weight: 500;
}

.premium-card:hover .export-info h3,
.premium-card:hover .export-info p {
  color: var(--accent-primary);
}

.export-actions {
  display: flex;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.btn-outline {
  background: rgba(99, 102, 241, 0.05);
  border: 2px solid var(--border-color);
  color: var(--text-primary);
  padding: 11px 24px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.btn-outline::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.5s, height 0.5s;
}

.btn-outline:hover {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-hover));
  color: #ffffff;
  border-color: var(--accent-primary);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
}

.btn-outline:hover::before {
  width: 300px;
  height: 300px;
}

.btn-outline:active {
  transform: translateY(0);
}

.mono-text {
  font-size: 13px;
  letter-spacing: 0.08em;
  font-weight: 800;
  font-family: 'Courier New', monospace;
}

@media (max-width: 768px) {
  .premium-card {
    flex-direction: column;
    padding: 24px;
    text-align: center;
    gap: 24px;
  }

  .export-actions {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .btn-outline {
    padding: 12px;
  }
}
</style>