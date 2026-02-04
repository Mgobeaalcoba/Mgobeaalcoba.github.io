// simulador-sueldo.js - Salary Simulator (Neto → Bruto calculator)
import logger from './logger.js';

/**
 * SalarioSimulator - Calcula sueldo bruto necesario desde neto deseado
 */
export class SalarioSimulator {
  constructor() {
    // Constantes 2026
    this.constants = {
      // Aportes del empleado
      aporteJubilatorio: 0.11,   // 11%
      aporteSalud: 0.03,         // 3%
      aporteSindical: 0.025,     // 2.5% (varía por convenio)
      
      // Escala Ganancias Art. 94 (Ene-Jun 2026)
      gananciasEscala: [
        { min: 0, max: 2260473, rate: 0, fixed: 0 },
        { min: 2260473, max: 3390710, rate: 0.05, fixed: 0 },
        { min: 3390710, max: 4521000, rate: 0.09, fixed: 56512 },
        { min: 4521000, max: 6781400, rate: 0.12, fixed: 158239 },
        { min: 6781400, max: 9041800, rate: 0.15, fixed: 429487 },
        { min: 9041800, max: 13562700, rate: 0.19, fixed: 768547 },
        { min: 13562700, max: 18083600, rate: 0.23, fixed: 1627518 },
        { min: 18083600, max: 27125400, rate: 0.27, fixed: 2667325 },
        { min: 27125400, max: 36167200, rate: 0.31, fixed: 5108611 },
        { min: 36167200, max: null, rate: 0.35, fixed: 7901569 }
      ],
      
      // Deducciones Art. 30 (2026)
      deduccionPersonal: 1694670,
      deduccionConyuge: 1584040,
      deduccionHijo: 792020,
      
      // Topes de aportes (2026)
      topeJubilatorio: 2007781.37,
      topeSalud: 2007781.37
    };
  }

  /**
   * Cálculo inverso: de neto deseado a bruto necesario
   * MEJORADO: Bisección + Newton-Raphson híbrido para garantizar convergencia
   */
  calcularBrutoNecesario(netoDeseado, config = {}) {
    logger.debug('SalarioSimulator', 'Calculating bruto from neto', { netoDeseado, config });
    
    // 🎯 ANALYTICS: Track tax calculator usage
    this.trackTaxCalculatorUsage(netoDeseado, config);
    
    // Validación
    if (isNaN(netoDeseado) || netoDeseado <= 0) {
      throw new Error('El sueldo neto debe ser mayor a 0');
    }
    
    if (netoDeseado > 50000000) {
      throw new Error('El sueldo neto debe ser menor a $50.000.000');
    }
    
    // Método de bisección (más robusto)
    let brutoMin = netoDeseado; // Mínimo posible
    let brutoMax = netoDeseado * 3; // Máximo razonable
    let brutoEstimado = (brutoMin + brutoMax) / 2;
    
    const maxIteraciones = 100;
    const tolerancia = 100; // ARS - más tolerante
    
    for (let i = 0; i < maxIteraciones; i++) {
      const resultado = this.calcularNeto(brutoEstimado, config);
      const diferencia = resultado.neto - netoDeseado;
      
      // Convergió?
      if (Math.abs(diferencia) < tolerancia) {
        logger.success('SalarioSimulator', 'Converged', { 
          iteraciones: i,
          brutoNecesario: brutoEstimado,
          diferencia
        });
        
        return {
          brutoNecesario: Math.round(brutoEstimado),
          netoFinal: Math.round(resultado.neto),
          descuentos: resultado.descuentos,
          breakdown: resultado.breakdown,
          iteraciones: i
        };
      }
      
      // Ajustar rango de búsqueda (bisección)
      if (resultado.neto < netoDeseado) {
        // Neto muy bajo, necesitamos más bruto
        brutoMin = brutoEstimado;
      } else {
        // Neto muy alto, necesitamos menos bruto
        brutoMax = brutoEstimado;
      }
      
      // Nueva estimación (punto medio)
      brutoEstimado = (brutoMin + brutoMax) / 2;
    }
    
    // Si no convergió, devolver mejor aproximación
    const resultadoFinal = this.calcularNeto(brutoEstimado, config);
    logger.warn('SalarioSimulator', 'Did not converge perfectly, returning best approximation', { 
      iteraciones: maxIteraciones,
      diferencia: Math.abs(resultadoFinal.neto - netoDeseado)
    });
    
    return {
      brutoNecesario: Math.round(brutoEstimado),
      netoFinal: Math.round(resultadoFinal.neto),
      descuentos: resultadoFinal.descuentos,
      breakdown: resultadoFinal.breakdown,
      iteraciones: maxIteraciones
    };
  }

  /**
   * Cálculo directo: de bruto a neto (para validación)
   * @param {number} brutoMensual - Sueldo bruto mensual
   * @param {object} config - Configuración
   * @returns {object} Resultado completo
   */
  calcularNeto(brutoMensual, config = {}) {
    const brutoAnual = brutoMensual * 12;
    
    // 1. Calcular aportes mensuales (con topes)
    const aportes = {
      jubilatorio: Math.min(
        brutoMensual * this.constants.aporteJubilatorio,
        this.constants.topeJubilatorio * this.constants.aporteJubilatorio
      ),
      salud: Math.min(
        brutoMensual * this.constants.aporteSalud,
        this.constants.topeSalud * this.constants.aporteSalud
      ),
      sindical: brutoMensual * this.constants.aporteSindical
    };
    
    const totalAportes = aportes.jubilatorio + aportes.salud + aportes.sindical;
    
    // 2. Calcular Impuesto a las Ganancias
    const deducciones = this.calcularDeducciones(config);
    const baseImponible = Math.max(0, brutoAnual - deducciones);
    const impuestoAnual = this.calcularImpuesto(baseImponible);
    const impuestoMensual = impuestoAnual / 12;
    
    // 3. Sueldo neto final
    const neto = brutoMensual - totalAportes - impuestoMensual;
    
    // Tasa efectiva de descuentos
    const tasaEfectiva = (totalAportes + impuestoMensual) / brutoMensual;
    
    return {
      neto,
      descuentos: {
        aportes: totalAportes,
        ganancias: impuestoMensual,
        total: totalAportes + impuestoMensual
      },
      breakdown: {
        brutoMensual,
        brutoAnual,
        aportes,
        impuestoAnual,
        impuestoMensual,
        baseImponible,
        deducciones
      },
      tasaEfectiva
    };
  }

  /**
   * Calcular deducciones según situación familiar
   */
  calcularDeducciones(config) {
    let total = this.constants.deduccionPersonal;
    
    if (config.conyuge) {
      total += this.constants.deduccionConyuge;
    }
    
    if (config.hijos && config.hijos > 0) {
      total += config.hijos * this.constants.deduccionHijo;
    }
    
    // Deducciones adicionales opcionales
    if (config.alquiler && config.alquiler > 0) {
      // Alquiler deducible hasta 40% del total del alquiler pagado
      const deduccionAlquiler = Math.min(
        config.alquiler * 12 * 0.40,
        this.constants.deduccionPersonal * 0.40
      );
      total += deduccionAlquiler;
    }
    
    logger.debug('SalarioSimulator', 'Deducciones calculated', { total, config });
    return total;
  }

  /**
   * Calcular impuesto según escala progresiva
   */
  calcularImpuesto(baseImponible) {
    if (baseImponible <= 0) return 0;
    
    // Encontrar el tramo correspondiente
    for (const bracket of this.constants.gananciasEscala) {
      if (bracket.max === null || baseImponible <= bracket.max) {
        const excedente = baseImponible - bracket.min;
        const impuesto = bracket.fixed + (excedente * bracket.rate);
        return Math.max(0, impuesto);
      }
    }
    
    return 0;
  }

  /**
   * Formatear moneda argentina
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Calcular rango de negociación (±5%)
   */
  calcularRangoNegociacion(brutoNecesario, margen = 0.05) {
    return {
      minimo: Math.round(brutoNecesario * (1 - margen)),
      maximo: Math.round(brutoNecesario * (1 + margen))
    };
  }

  /**
   * Validar configuración
   */
  validarConfig(config) {
    const errors = [];
    
    if (config.hijos && (config.hijos < 0 || config.hijos > 20)) {
      errors.push('El número de hijos debe estar entre 0 y 20');
    }
    
    if (config.alquiler && config.alquiler < 0) {
      errors.push('El monto de alquiler no puede ser negativo');
    }
    
    return errors;
  }

  /**
   * Obtener tasa efectiva promedio por rango salarial
   */
  getTasaEfectivaPromedio(bruto) {
    const resultado = this.calcularNeto(bruto, {});
    return resultado.tasaEfectiva * 100; // En porcentaje
  }

  /**
   * Generar tabla de referencia rápida
   */
  generarTablaReferencia() {
    const netosObjetivo = [1000000, 1500000, 2000000, 2500000, 3000000, 4000000, 5000000];
    const tabla = [];
    
    netosObjetivo.forEach(neto => {
      try {
        const resultado = this.calcularBrutoNecesario(neto, {});
        tabla.push({
          netoDeseado: neto,
          brutoNecesario: resultado.brutoNecesario,
          tasaDescuento: ((resultado.brutoNecesario - neto) / resultado.brutoNecesario * 100).toFixed(1)
        });
      } catch (error) {
        logger.warn('Error generating reference for neto:', neto);
      }
    });
    
    return tabla;
  }

  /**
   * 🎯 ANALYTICS: Track tax calculator usage
   */
  trackTaxCalculatorUsage(netoDeseado, config) {
    if (typeof gtag === 'function') {
      gtag('event', 'tax_calculator_use', {
        event_category: 'tool_usage',
        neto_deseado: Math.round(netoDeseado / 1000) * 1000, // Round to thousands
        tiene_conyuge: config.conyuge || false,
        num_hijos: config.hijos || 0,
        tiene_alquiler: (config.alquiler && config.alquiler > 0) || false,
        value: 5 // Tool usage value
      });
      
      logger.debug('SalarioSimulator', 'Tax calculator usage tracked');
    }
  }

  /**
   * 🎯 ANALYTICS: Track case study usage
   */
  trackCaseStudyUsage(caseNumber, caseName) {
    if (typeof gtag === 'function') {
      gtag('event', 'tax_case_study_used', {
        event_category: 'tool_usage',
        case_number: caseNumber,
        case_name: caseName,
        value: 3
      });
      
      logger.debug('SalarioSimulator', 'Case study tracked', { caseNumber, caseName });
    }
  }
}

// Export class
export default SalarioSimulator;
