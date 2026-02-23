---
slug: python-automatizar-impuestos-argentina
date: 2026-02-08
---

Cada año, miles de trabajadores independientes y en relación de dependencia en Argentina pasan horas calculando su declaración de Ganancias manualmente. Escalas de la AFIP, deducciones, mínimo no imponible, retenciones... el proceso es tedioso y propenso a errores.

En este artículo te muestro cómo automaticé ese proceso con Python. El código que te voy a dar calcula exactamente lo mismo que la calculadora de AFIP, pero en segundos y con la posibilidad de hacer proyecciones y análisis.

## Lo que necesitás saber antes

El Impuesto a las Ganancias en Argentina para empleados en relación de dependencia (4ta categoría) se calcula así:

1. **Ingreso bruto anual** = sueldo bruto × 12 (simplificado)
2. **Deducciones**: aportes jubilatorios, obra social, sindicato, etc.
3. **Ganancia neta** = bruto − deducciones
4. **MNI** (Mínimo No Imponible) + Deducción especial
5. **Base imponible** = ganancia neta − MNI − deducción especial
6. **Impuesto** según escalas progresivas de AFIP

## Las escalas de AFIP 2026

```python
# Escalas actualizadas para el ejercicio fiscal 2026
ESCALAS_AFIP = [
    {"desde": 0,          "hasta": 419_281,    "fijo": 0,          "alicuota": 0.05},
    {"desde": 419_281,    "hasta": 838_561,    "fijo": 20_964,     "alicuota": 0.09},
    {"desde": 838_561,    "hasta": 1_257_842,  "fijo": 58_624,     "alicuota": 0.12},
    {"desde": 1_257_842,  "hasta": 1_677_122,  "fijo": 108_952,    "alicuota": 0.15},
    {"desde": 1_677_122,  "hasta": 2_515_683,  "fijo": 171_840,    "alicuota": 0.19},
    {"desde": 2_515_683,  "hasta": 3_354_244,  "fijo": 331_252,    "alicuota": 0.23},
    {"desde": 3_354_244,  "hasta": 5_031_366,  "fijo": 523_895,    "alicuota": 0.27},
    {"desde": 5_031_366,  "hasta": 6_708_488,  "fijo": 976_822,    "alicuota": 0.31},
    {"desde": 6_708_488,  "hasta": float('inf'),"fijo": 1_496_921,  "alicuota": 0.35},
]
```

## El motor de cálculo

```python
from dataclasses import dataclass
from typing import Optional
import json

@dataclass
class ParametrosGanancias:
    sueldo_bruto_mensual: float
    cargas_familia: int = 0        # hijos a cargo
    conyuge: bool = False
    otros_ingresos_anuales: float = 0.0
    deducciones_extra: float = 0.0

# Valores 2026 (se actualizan por RG AFIP)
MNI_ANUAL = 3_091_035
DEDUCCION_ESPECIAL = 14_835_768  # empleado en relación de dependencia
DEDUCCION_CONYUGE = 2_862_748
DEDUCCION_HIJO = 1_443_246
APORTE_JUBILATORIO = 0.11  # 11%
APORTE_OBRA_SOCIAL = 0.03  # 3%
APORTE_INSSJP = 0.03       # PAMI

def calcular_ganancias(params: ParametrosGanancias) -> dict:
    """
    Calcula el impuesto a las Ganancias 4ta categoría.
    Retorna un dict con el desglose completo.
    """
    # Ingreso bruto anual
    ingreso_bruto_anual = params.sueldo_bruto_mensual * 13  # incluye SAC
    ingreso_bruto_anual += params.otros_ingresos_anuales
    
    # Deducciones de ley
    aporte_jubilatorio = ingreso_bruto_anual * APORTE_JUBILATORIO
    aporte_obra_social = ingreso_bruto_anual * APORTE_OBRA_SOCIAL
    aporte_inssjp = ingreso_bruto_anual * APORTE_INSSJP
    
    total_deducciones_ley = (
        aporte_jubilatorio + 
        aporte_obra_social + 
        aporte_inssjp +
        params.deducciones_extra
    )
    
    # Ganancia neta
    ganancia_neta = ingreso_bruto_anual - total_deducciones_ley
    
    # Deducciones personales
    deduccion_personal = MNI_ANUAL + DEDUCCION_ESPECIAL
    if params.conyuge:
        deduccion_personal += DEDUCCION_CONYUGE
    deduccion_personal += params.cargas_familia * DEDUCCION_HIJO
    
    # Base imponible
    base_imponible = max(0, ganancia_neta - deduccion_personal)
    
    # Impuesto según escalas
    impuesto_anual = _aplicar_escala(base_imponible)
    
    # Resultados
    impuesto_mensual = impuesto_anual / 12
    sueldo_neto = params.sueldo_bruto_mensual - (impuesto_mensual + 
                  params.sueldo_bruto_mensual * (APORTE_JUBILATORIO + 
                  APORTE_OBRA_SOCIAL + APORTE_INSSJP))
    
    tasa_efectiva = (impuesto_anual / ingreso_bruto_anual * 100) if ingreso_bruto_anual > 0 else 0
    
    return {
        "ingreso_bruto_anual": ingreso_bruto_anual,
        "total_deducciones_ley": total_deducciones_ley,
        "ganancia_neta": ganancia_neta,
        "deduccion_personal": deduccion_personal,
        "base_imponible": base_imponible,
        "impuesto_anual": impuesto_anual,
        "impuesto_mensual": impuesto_mensual,
        "sueldo_neto_mensual": sueldo_neto,
        "tasa_efectiva_pct": round(tasa_efectiva, 2),
        "paga_ganancias": base_imponible > 0,
    }


def _aplicar_escala(base_imponible: float) -> float:
    """Aplica las escalas progresivas de AFIP."""
    if base_imponible <= 0:
        return 0.0
    
    for escala in ESCALAS_AFIP:
        if base_imponible <= escala["hasta"]:
            excedente = base_imponible - escala["desde"]
            return escala["fijo"] + excedente * escala["alicuota"]
    
    # No debería llegar acá si las escalas están bien definidas
    ultima = ESCALAS_AFIP[-1]
    excedente = base_imponible - ultima["desde"]
    return ultima["fijo"] + excedente * ultima["alicuota"]
```

## Ejemplo de uso

```python
# Caso 1: Empleado sin cargas de familia
resultado = calcular_ganancias(ParametrosGanancias(
    sueldo_bruto_mensual=2_000_000
))

print(f"Sueldo bruto: ${resultado['ingreso_bruto_anual']:,.0f} anual")
print(f"Base imponible: ${resultado['base_imponible']:,.0f}")
print(f"Impuesto anual: ${resultado['impuesto_anual']:,.0f}")
print(f"Impuesto mensual: ${resultado['impuesto_mensual']:,.0f}")
print(f"Sueldo neto: ${resultado['sueldo_neto_mensual']:,.0f}")
print(f"Tasa efectiva: {resultado['tasa_efectiva_pct']}%")

# Caso 2: Con cónyuge y 2 hijos
resultado_familia = calcular_ganancias(ParametrosGanancias(
    sueldo_bruto_mensual=2_000_000,
    cargas_familia=2,
    conyuge=True
))
print(f"\nCon familia - Impuesto mensual: ${resultado_familia['impuesto_mensual']:,.0f}")
```

## Análisis de escenarios múltiples

Lo más útil es poder comparar qué pasa con distintos sueldos:

```python
import pandas as pd
import matplotlib.pyplot as plt

sueldos = range(500_000, 5_000_001, 100_000)

resultados = []
for sueldo in sueldos:
    r = calcular_ganancias(ParametrosGanancias(sueldo_bruto_mensual=sueldo))
    resultados.append({
        "sueldo_bruto": sueldo,
        "impuesto_mensual": r["impuesto_mensual"],
        "sueldo_neto": r["sueldo_neto_mensual"],
        "tasa_efectiva": r["tasa_efectiva_pct"],
        "paga_ganancias": r["paga_ganancias"],
    })

df = pd.DataFrame(resultados)

# ¿A partir de qué sueldo empezás a pagar?
primer_pago = df[df["paga_ganancias"]].iloc[0]
print(f"Empezás a pagar Ganancias con sueldo bruto: ${primer_pago['sueldo_bruto']:,.0f}")

# Visualización
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

axes[0].plot(df["sueldo_bruto"] / 1_000_000, df["tasa_efectiva"])
axes[0].set_xlabel("Sueldo bruto (millones de ARS)")
axes[0].set_ylabel("Tasa efectiva (%)")
axes[0].set_title("Tasa efectiva por sueldo")
axes[0].grid(True, alpha=0.3)

axes[1].plot(df["sueldo_bruto"] / 1_000_000, df["sueldo_neto"] / 1_000_000)
axes[1].set_xlabel("Sueldo bruto (millones de ARS)")
axes[1].set_ylabel("Sueldo neto (millones de ARS)")
axes[1].set_title("Sueldo neto por sueldo bruto")
axes[1].grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig("ganancias_analisis.png", dpi=150)
```

## Proyección anual con actualizaciones de sueldo

En Argentina, los sueldos se actualizan por paritarias durante el año. Podés proyectar cuánto vas a pagar en cada período:

```python
def proyectar_anual(sueldo_base: float, actualizaciones: list[dict]) -> pd.DataFrame:
    """
    actualizaciones = [
        {"mes": 3, "pct_aumento": 15},  # Marzo: +15%
        {"mes": 6, "pct_aumento": 20},  # Junio: +20%
        {"mes": 9, "pct_aumento": 18},  # Septiembre: +18%
    ]
    """
    sueldo_actual = sueldo_base
    meses = []
    sueldo_dict = {1: sueldo_base}
    
    for actualizacion in sorted(actualizaciones, key=lambda x: x["mes"]):
        sueldo_actual *= (1 + actualizacion["pct_aumento"] / 100)
        sueldo_dict[actualizacion["mes"]] = sueldo_actual
    
    # Llenar todos los meses
    ultimo_sueldo = sueldo_base
    for mes in range(1, 13):
        if mes in sueldo_dict:
            ultimo_sueldo = sueldo_dict[mes]
        r = calcular_ganancias(ParametrosGanancias(sueldo_bruto_mensual=ultimo_sueldo))
        meses.append({
            "mes": mes,
            "sueldo_bruto": ultimo_sueldo,
            "impuesto_mensual": r["impuesto_mensual"],
            "sueldo_neto": r["sueldo_neto_mensual"],
        })
    
    return pd.DataFrame(meses)

# Ejemplo
df_proyeccion = proyectar_anual(
    sueldo_base=1_500_000,
    actualizaciones=[
        {"mes": 3, "pct_aumento": 15},
        {"mes": 6, "pct_aumento": 18},
        {"mes": 9, "pct_aumento": 12},
    ]
)

print(df_proyeccion.to_string(index=False))
print(f"\nTotal impuesto anual: ${df_proyeccion['impuesto_mensual'].sum():,.0f}")
```

## Consideraciones importantes

- **Actualización de valores**: Los montos del MNI, deducciones especiales y escalas se actualizan periódicamente por resoluciones de AFIP. Siempre verificá los valores vigentes en [afip.gob.ar](https://www.afip.gob.ar).
- **SAC**: El cálculo del SAC (aguinaldo) tiene su propia mecánica — este código hace una aproximación con `× 13`.
- **Monotributistas**: Este cálculo aplica a empleados en relación de dependencia (4ta categoría). Los monotributistas tienen un sistema diferente.
- **Asesor impositivo**: Para decisiones fiscales importantes, siempre consultá con un contador.

---

El código completo está en mi GitHub. Con estos fundamentos podés construir simuladores más complejos, integrarlos a herramientas internas, o simplemente entender mejor tu recibo de sueldo.
