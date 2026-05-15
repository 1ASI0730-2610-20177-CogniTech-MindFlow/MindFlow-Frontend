<template>
  <div class="dashboard-card">
    <div class="header-row">
      <h3 class="card-title">Resumen Semanal de Ánimo</h3>
      <router-link to="/analytics" class="view-all">Ver Reporte Completo</router-link>
    </div>

    <div class="mock-bar-chart">
      <div class="bar-group">
        <div class="bar color-yellow" style="height: 35%;"></div>
        <span class="day-label">L</span>
      </div>
      <div class="bar-group">
        <div class="bar color-red" style="height: 15%;"></div>
        <span class="day-label">M</span>
      </div>
      <div class="bar-group">
        <div class="bar color-green" style="height: 60%;"></div>
        <span class="day-label">X</span>
      </div>
      <div class="bar-group">
        <div class="bar color-green" style="height: 45%;"></div>
        <span class="day-label">J</span>
      </div>
      <div class="bar-group">
        <div class="bar color-light" style="height: 20%;"></div>
        <span class="day-label">V</span>
      </div>
      <div class="bar-group">
        <div class="bar color-none" style="height: 0%;"></div>
        <span class="day-label">S</span>
      </div>
      <div class="bar-group">
        <div class="bar color-none" style="height: 0%;"></div>
        <span class="day-label">D</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.view-all {
  font-size: 12px;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.mock-bar-chart {
  display: flex;
  align-items: flex-end;
  height: 120px;
  gap: 2px;
  padding-top: 20px;
}

.bar-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}

.bar {
  width: 100%;
  border-radius: 4px 4px 0 0;
}

.color-yellow { background: #fcd34d; }
.color-red { background: #f87171; }
.color-green { background: #6ee7b7; }
.color-light { background: #f1f5f9; }
.color-none { background: transparent; }

.day-label {
  font-size: 10px;
  color: #94a3b8;
  margin-top: 12px;
}
</style>