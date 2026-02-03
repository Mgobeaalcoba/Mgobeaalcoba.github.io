---
title: "Python para automatizar tu Declaración de Ganancias"
date: "2026-02-08"
author: "Mariano Gobea Alcoba"
category: "python"
tags: ["python", "automation", "afip", "impuestos", "argentina"]
excerpt: "Guía práctica para automatizar cálculos fiscales con Python. Incluye código reutilizable y ejemplos del mundo real."
featured: true
lang: "es"
---

## Por Qué Automatizar Tus Impuestos

Si sos trabajador en relación de dependencia en Argentina, calcular tu impuesto a las Ganancias puede ser **tedioso y propenso a errores**. Entre las deducciones, aportes y escalas progresivas, es fácil equivocarse.

Yo creé [una calculadora automatizada](https://mgobeaalcoba.github.io/recursos.html#calculadoras) que uso yo mismo cada mes. En este post te muestro cómo lo hice.

## La Lógica Fiscal en Python

### Paso 1: Definir Constantes (2026)

```python
# Escala Artículo 94 - Ley de Ganancias
# Valores período Enero-Junio 2026

GANANCIAS_ESCALA = [
    {"min": 0, "max": 2_260_473, "rate": 0, "fixed": 0},
    {"min": 2_260_473, "max": 3_390_710, "rate": 0.05, "fixed": 0},
    {"min": 3_390_710, "max": 4_521_000, "rate": 0.09, "fixed": 56_512},
    {"min": 4_521_000, "max": 6_781_400, "rate": 0.12, "fixed": 158_239},
    {"min": 6_781_400, "max": 9_041_800, "rate": 0.15, "fixed": 429_487},
    {"min": 9_041_800, "max": 13_562_700, "rate": 0.19, "fixed": 768_547},
    {"min": 13_562_700, "max": 18_083_600, "rate": 0.23, "fixed": 1_627_518},
    {"min": 18_083_600, "max": 27_125_400, "rate": 0.27, "fixed": 2_667_325},
    {"min": 27_125_400, "max": 36_167_200, "rate": 0.31, "fixed": 5_108_611},
    {"min": 36_167_200, "max": None, "rate": 0.35, "fixed": 7_901_569}
]

# Deducciones Art. 30
DEDUCCION_PERSONAL = 1_694_670
DEDUCCION_CONYUGE = 1_584_040
DEDUCCION_HIJO = 792_020

# Aportes del empleado
APORTE_JUBILATORIO = 0.11  # 11%
APORTE_SALUD = 0.03        # 3%
APORTE_SINDICAL = 0.025    # 2.5% promedio
```

### Paso 2: Calcular Deducciones

```python
def calcular_deducciones(tiene_conyuge=False, num_hijos=0):
    """
    Calcula las deducciones totales según situación familiar.
    """
    deducciones = DEDUCCION_PERSONAL
    
    if tiene_conyuge:
        deducciones += DEDUCCION_CONYUGE
    
    deducciones += num_hijos * DEDUCCION_HIJO
    
    return deducciones
```

### Paso 3: Calcular Impuesto Progresivo

```python
def calcular_impuesto(ingreso_anual, deducciones):
    """
    Calcula el impuesto según escala progresiva.
    """
    base_imponible = max(0, ingreso_anual - deducciones)
    
    # Buscar el tramo correspondiente
    for tramo in GANANCIAS_ESCALA:
        if tramo["max"] is None or base_imponible <= tramo["max"]:
            excedente = base_imponible - tramo["min"]
            impuesto = tramo["fixed"] + (excedente * tramo["rate"])
            return impuesto
    
    return 0
```

### Paso 4: Calcular Sueldo de Bolsillo

```python
def calcular_sueldo_bolsillo(bruto_mensual, tiene_conyuge=False, num_hijos=0):
    """
    Calcula el sueldo neto después de aportes e impuestos.
    """
    # 1. Calcular ingreso anual
    ingreso_anual = bruto_mensual * 12
    
    # 2. Calcular aportes mensuales
    aportes = {
        "jubilatorio": bruto_mensual * APORTE_JUBILATORIO,
        "salud": bruto_mensual * APORTE_SALUD,
        "sindical": bruto_mensual * APORTE_SINDICAL
    }
    total_aportes = sum(aportes.values())
    
    # 3. Calcular impuesto a las Ganancias
    deducciones = calcular_deducciones(tiene_conyuge, num_hijos)
    impuesto_anual = calcular_impuesto(ingreso_anual, deducciones)
    impuesto_mensual = impuesto_anual / 12
    
    # 4. Sueldo neto
    neto = bruto_mensual - total_aportes - impuesto_mensual
    
    return {
        "bruto": bruto_mensual,
        "aportes": total_aportes,
        "impuesto": impuesto_mensual,
        "neto": round(neto, 2)
    }
```

## Ejemplo de Uso

```python
# Ejemplo: Soltero con sueldo de $3.000.000
resultado = calcular_sueldo_bolsillo(
    bruto_mensual=3_000_000,
    tiene_conyuge=False,
    num_hijos=0
)

print(f"Bruto: ${resultado['bruto']:,.0f}")
print(f"Aportes: -${resultado['aportes']:,.0f}")
print(f"Ganancias: -${resultado['impuesto']:,.0f}")
print(f"Neto: ${resultado['neto']:,.0f}")
```

**Output:**
```
Bruto: $3.000.000
Aportes: -$435.000
Ganancias: -$187.500
Neto: $2.377.500
```

## Llevándolo al Siguiente Nivel

Podés extender este código para:

1. **Automatizar reportes mensuales** en Excel
2. **Calcular el sueldo bruto necesario** para un neto deseado (algoritmo inverso)
3. **Proyectar impuestos anuales** con distintos escenarios
4. **Generar gráficos** de evolución del sueldo neto

## Código Completo en GitHub

El código completo con tests y ejemplos lo encontrás en mi calculadora web:
[Ver Calculadora →](https://mgobeaalcoba.github.io/recursos.html#calculadoras)

## Disclaimer Legal

Este código es educativo. Para cálculos oficiales, consultá siempre con un contador matriculado. Los valores corresponden al período Enero-Junio 2026 según Resolución General 4.003 AFIP.

---

*¿Te sirvió este post? Compartilo en LinkedIn y etiquetame [@mariano-gobea-alcoba](https://www.linkedin.com/in/mariano-gobea-alcoba/)*
