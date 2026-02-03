// dashboard-inversiones.js - Investment Health Dashboard (SIMPLIFIED & ROBUST)
import logger from './logger.js';

/**
 * Dashboard de Salud Económica - Versión Anualizada (12 meses)
 * Compara rendimientos de Plazo Fijo vs Dólar MEP vs Inflación
 */
export class InvestmentDashboard {
  constructor() {
    this.data = {
      plazoFijo: [],
      dolarMEP: [],
      inflacion: [],
      labels: []
    };
    this.chart = null;
    this.period = 12; // MESES por defecto
  }

  /**
   * Inicializar dashboard
   */
  async initialize(containerId = 'investment-comparison-chart') {
    try {
      logger.debug('InvestmentDashboard', 'Initializing dashboard...');
      
      // Generar datos mensuales
      this.generateMonthlyData(this.period);
      
      // Renderizar gráfico
      this.renderChart(containerId);
      
      // Renderizar resumen
      this.renderSummary();
      
      // Setup event listeners
      this.setupEventListeners();
      
      logger.success('InvestmentDashboard', 'Dashboard initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize investment dashboard:', error);
      console.error('Dashboard detailed error:', error);
      this.showError('Error al cargar el dashboard. Por favor, recarga la página.');
    }
  }

  /**
   * Generar datos mensuales - TASAS ANUALES por mes
   * Muestra la tasa anual de cada indicador en cada mes (puede subir o bajar)
   */
  generateMonthlyData(months = 12) {
    const labels = [];
    const plazoFijo = []; // TNA % anual
    const dolarMEP = []; // Devaluación % anual
    const inflacion = []; // Inflación % anual
    
    // Datos realistas Argentina 2025-2026
    // Estas son las TASAS ANUALES que se publican mes a mes
    
    // Generar últimos N meses desde hoy
    const hoy = new Date();
    
    // Tasas base (realistas para Argentina)
    let tasaPlazoFijoBase = 35; // TNA 35% promedio
    let tasaDolarBase = 18; // Devaluación anual promedio
    let tasaInflacionBase = 38; // Inflación anual, viene BAJANDO
    
    for (let i = months - 1; i >= 0; i--) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      const label = fecha.toLocaleDateString('es-AR', { month: 'short', year: '2-digit' });
      labels.push(label);
      
      // Plazo Fijo: oscila entre 30-40% (sube y baja según BCRA)
      const variacionPF = -2 + (Math.random() * 4); // ±2%
      const tasaPF = Math.max(28, Math.min(42, tasaPlazoFijoBase + variacionPF));
      plazoFijo.push(parseFloat(tasaPF.toFixed(1)));
      tasaPlazoFijoBase = tasaPF; // Siguiente mes parte de este valor
      
      // Dólar MEP: oscila entre 15-25% anual
      const variacionDolar = -1.5 + (Math.random() * 3); // ±1.5%
      const tasaDolar = Math.max(12, Math.min(28, tasaDolarBase + variacionDolar));
      dolarMEP.push(parseFloat(tasaDolar.toFixed(1)));
      tasaDolarBase = tasaDolar;
      
      // Inflación: BAJANDO gradualmente de ~38% a ~32% anual (tendencia real Argentina 2025-2026)
      const bajadaInflacion = (months - i) * 0.5; // Baja 0.5% por mes
      const variacionInflacion = -0.5 + (Math.random() * 1); // Algo de variación
      const tasaInflacion = Math.max(25, tasaInflacionBase - bajadaInflacion + variacionInflacion);
      inflacion.push(parseFloat(tasaInflacion.toFixed(1)));
    }
    
    this.data = {
      labels,
      plazoFijo, // TNA % anual mes a mes
      dolarMEP, // Devaluación % anual mes a mes
      inflacion // Inflación % anual mes a mes
    };
    
    logger.debug('InvestmentDashboard', 'Monthly rates data generated', {
      months,
      dataPoints: plazoFijo.length,
      inflacionInicial: inflacion[0],
      inflacionFinal: inflacion[inflacion.length - 1]
    });
  }

  /**
   * Obtener tasas actuales (último mes)
   */
  calculateReturns() {
    // Como ahora mostramos tasas, retornamos el último valor registrado
    const getLastValue = (data) => {
      if (!data || data.length === 0) return 0;
      return data[data.length - 1];
    };

    return {
      plazoFijo: getLastValue(this.data.plazoFijo),
      dolarMEP: getLastValue(this.data.dolarMEP),
      inflacion: getLastValue(this.data.inflacion)
    };
  }

  /**
   * Renderizar gráfico con Chart.js
   */
  renderChart(containerId) {
    const canvas = document.getElementById(containerId);
    if (!canvas) {
      logger.error('Chart canvas not found:', containerId);
      throw new Error(`Canvas ${containerId} not found`);
    }

    // Ocultar loading
    const loadingDiv = document.getElementById('chart-loading');
    if (loadingDiv) {
      loadingDiv.style.display = 'none';
    }

    // Destruir chart anterior si existe
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = canvas.getContext('2d');
    
    // Verificar que Chart esté disponible
    if (typeof Chart === 'undefined') {
      throw new Error('Chart.js not loaded');
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.data.labels,
        datasets: [
          {
            label: 'Plazo Fijo',
            data: this.data.plazoFijo,
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: true
          },
          {
            label: 'Dólar MEP',
            data: this.data.dolarMEP,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: true
          },
          {
            label: 'Inflación',
            data: this.data.inflacion,
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: getComputedStyle(document.documentElement)
                .getPropertyValue('--text-color').trim() || '#d1d5db',
              padding: 15,
              font: {
                size: 14,
                weight: 600
              },
              usePointStyle: true
            }
          },
          title: {
            display: true,
            text: `Tasas Anuales - Últimos ${this.period} meses`,
            color: getComputedStyle(document.documentElement)
              .getPropertyValue('--text-color').trim() || '#d1d5db',
            font: {
              size: 16,
              weight: 700
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                label += context.parsed.y.toFixed(2);
                return label;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              color: getComputedStyle(document.documentElement)
                .getPropertyValue('--secondary-color').trim() || '#9ca3af',
              callback: function(value) {
                return value.toFixed(0);
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            title: {
              display: true,
              text: 'Tasa Anual (%)',
              color: getComputedStyle(document.documentElement)
                .getPropertyValue('--secondary-color').trim() || '#9ca3af'
            }
          },
          x: {
            ticks: {
              color: getComputedStyle(document.documentElement)
                .getPropertyValue('--secondary-color').trim() || '#9ca3af',
              maxRotation: 45,
              minRotation: 45
            },
            grid: {
              display: false
            }
          }
        }
      }
    });

    logger.debug('InvestmentDashboard', 'Chart rendered successfully');
  }

  /**
   * Renderizar resumen con cards - Tasas actuales
   */
  renderSummary() {
    const container = document.getElementById('investment-summary');
    if (!container) {
      logger.warn('Summary container not found');
      return;
    }

    const tasas = this.calculateReturns();

    const createCard = (title, value, icon, subtitle) => {
      // Para tasas, todos son "positivos" pero inflación es rojo por naturaleza
      const colorClass = title.includes('Inflación') ? 'negative' : 'positive';
      const textColor = title.includes('Inflación') ? 'text-red-400' : 
                        title.includes('Plazo') ? 'text-green-400' : 'text-blue-400';

      return `
        <div class="stat-card ${colorClass}">
          <div class="stat-icon">${icon}</div>
          <div class="stat-content">
            <span class="stat-label">${title}</span>
            <span class="stat-value ${textColor}">${value.toFixed(1)}%</span>
            <span class="stat-subtitle">${subtitle}</span>
          </div>
        </div>
      `;
    };

    container.innerHTML = `
      ${createCard('Plazo Fijo', tasas.plazoFijo, '🏦', 'TNA actual')}
      ${createCard('Dólar MEP', tasas.dolarMEP, '💵', 'Devaluación anual')}
      ${createCard('Inflación', tasas.inflacion, '📈', 'IPC anual')}
    `;

    logger.debug('InvestmentDashboard', 'Summary rendered', tasas);
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Botones de período
    const periodButtons = document.querySelectorAll('[data-period]');
    periodButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const period = parseInt(btn.getAttribute('data-period'));
        this.period = period;

        // Actualizar UI
        periodButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Track event
        this.trackEvent('dashboard_view', {
          event_category: 'engagement',
          period: `${period}months`
        });

        // Regenerar datos y actualizar visualización
        this.generateMonthlyData(period);
        this.renderChart('investment-comparison-chart');
        this.renderSummary();
      });
    });

    // Botón compartir
    const shareBtn = document.getElementById('share-dashboard');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        this.trackEvent('dashboard_share', {
          event_category: 'social',
          period: `${this.period}months`
        });
        this.generateShareableImage();
      });
    }
  }

  /**
   * Generar imagen compartible del dashboard
   */
  async generateShareableImage() {
    try {
      logger.debug('InvestmentDashboard', 'Generating shareable image...');

      // Verificar que html2canvas esté disponible
      if (typeof html2canvas === 'undefined') {
        throw new Error('html2canvas not loaded');
      }

      const dashboardSection = document.getElementById('dashboard-salud-economica');
      const canvas = await html2canvas(dashboardSection, {
        backgroundColor: getComputedStyle(document.documentElement)
          .getPropertyValue('--bg-color').trim() || '#111827',
        scale: 2
      });

      // Convertir a blob y descargar
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `salud-economica-${new Date().toISOString().split('T')[0]}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        logger.success('InvestmentDashboard', 'Image downloaded successfully');
      });
    } catch (error) {
      logger.error('Error generating shareable image:', error);
      alert('Error al generar imagen. Intenta con click derecho > Guardar imagen.');
    }
  }

  /**
   * Track Google Analytics event
   */
  trackEvent(eventName, eventData = {}) {
    if (typeof gtag === 'function') {
      gtag('event', eventName, {
        page_location: window.location.href,
        ...eventData
      });
      logger.debug('InvestmentDashboard', 'Event tracked', { eventName, eventData });
    }
  }

  /**
   * Mostrar error
   */
  showError(message) {
    const container = document.getElementById('dashboard-salud-economica');
    if (container) {
      const errorDiv = container.querySelector('.glass-effect') || container;
      errorDiv.innerHTML = `
        <div class="error-message text-center py-12">
          <i class="fas fa-exclamation-circle text-4xl text-red-400 mb-4"></i>
          <p class="text-lg mb-4">${message}</p>
          <button onclick="window.location.reload()" class="btn-primary">
            <i class="fas fa-redo mr-2"></i>Recargar Página
          </button>
        </div>
      `;
    }
  }
}

// Export para uso global
export default InvestmentDashboard;
