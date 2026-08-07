---
slug: python-automatizar-impuestos-argentina
date: 2026-02-08
---

Cuando cobro como freelancer, el proceso de calcular IVA, Ingresos Brutos y las retenciones de ARBA era una pesadilla mensual de 3-4 horas. Hoy lo automatizo con un script de Python que tarda 8 minutos. Acá el paso a paso.

## El problema

Como desarrollador independiente que factura en Argentina, cada mes tenía que:

1. Consolidar ingresos de múltiples clientes
2. Calcular IVA (21%) sobre servicios gravados
3. Calcular retenciones de IIGG (3-5% según el régimen)
4. Calcular Ingresos Brutos por provincia
5. Generar el resumen para el contador
6. Detectar si correspondía pagar algún anticipo

Todo esto manualmente en Excel. El problema: errores humanos, inconsistencias, y tiempo perdido que podría estar programando.

## La solución: pipeline en Python

### Estructura del proyecto

```
impuestos_ar/
├── data/
│   ├── facturas/          # PDFs descargados de AFIP
│   └── retenciones/       # CSVs de ARBA
├── output/
│   └── resumen_YYYY_MM.xlsx
├── src/
│   ├── afip_parser.py     # Parsea facturas PDF
│   ├── tax_calculator.py  # Cálculos impositivos
│   └── report_generator.py
└── main.py
```

### Paso 1: Parsear las facturas de AFIP

AFIP exporta facturas en PDF. Con `pdfplumber` se puede extraer el texto:

```python
import pdfplumber
import re
from dataclasses import dataclass
from decimal import Decimal

@dataclass
class Factura:
    numero: str
    fecha: str
    cuit_cliente: str
    neto: Decimal
    iva: Decimal
    total: Decimal
    tipo: str  # A, B, C, E

def parse_factura_pdf(path: str) -> Factura:
    with pdfplumber.open(path) as pdf:
        text = "\n".join(page.extract_text() for page in pdf.pages)
    
    # Extraer importe neto
    neto_match = re.search(r'Subtotal\s+\$?([\d,.]+)', text)
    neto = Decimal(neto_match.group(1).replace('.', '').replace(',', '.'))
    
    # Extraer IVA
    iva_match = re.search(r'I\.V\.A\. 21%\s+\$?([\d,.]+)', text)
    iva = Decimal(iva_match.group(1).replace('.', '').replace(',', '.')) if iva_match else Decimal(0)
    
    # Extraer CUIT del cliente
    cuit_match = re.search(r'CUIT:\s*(\d{2}-\d{8}-\d)', text)
    cuit = cuit_match.group(1) if cuit_match else "00-00000000-0"
    
    return Factura(
        numero=extract_numero(text),
        fecha=extract_fecha(text),
        cuit_cliente=cuit,
        neto=neto,
        iva=iva,
        total=neto + iva,
        tipo=extract_tipo(text)
    )
```

### Paso 2: Calcular las retenciones

```python
from decimal import Decimal, ROUND_HALF_UP
from enum import Enum

class AlicuotaIIGG(Enum):
    SERVICIOS = Decimal('0.03')
    BIENES = Decimal('0.06')

class TaxCalculator:
    MINIMO_RETENCION_IIGG = Decimal('2700')  # Actualizar según RG vigente
    
    def calcular_retencion_iigg(
        self, 
        importe_neto: Decimal,
        tipo: AlicuotaIIGG = AlicuotaIIGG.SERVICIOS
    ) -> Decimal:
        if importe_neto < self.MINIMO_RETENCION_IIGG:
            return Decimal(0)
        
        retencion = importe_neto * tipo.value
        return retencion.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    
    def calcular_iibb_caba(self, importe_neto: Decimal) -> Decimal:
        # CABA: 3% para servicios de software
        return (importe_neto * Decimal('0.03')).quantize(
            Decimal('0.01'), rounding=ROUND_HALF_UP
        )
    
    def calcular_iibb_provincia(
        self, 
        importe_neto: Decimal,
        provincia: str
    ) -> Decimal:
        alicuotas = {
            'CABA': Decimal('0.03'),
            'Buenos Aires': Decimal('0.035'),
            'Córdoba': Decimal('0.03'),
            'Mendoza': Decimal('0.025'),
        }
        alicuota = alicuotas.get(provincia, Decimal('0.03'))
        return (importe_neto * alicuota).quantize(
            Decimal('0.01'), rounding=ROUND_HALF_UP
        )
    
    def resumen_mes(self, facturas: list[Factura]) -> dict:
        total_neto = sum(f.neto for f in facturas)
        total_iva = sum(f.iva for f in facturas)
        total_retenciones = sum(
            self.calcular_retencion_iigg(f.neto) for f in facturas
        )
        
        return {
            'total_facturado': total_neto + total_iva,
            'total_neto': total_neto,
            'total_iva': total_iva,
            'retenciones_iigg': total_retenciones,
            'iibb_caba': self.calcular_iibb_caba(total_neto),
            'a_ingresar_iva': total_iva - total_retenciones * Decimal('0.21'),
            'cantidad_facturas': len(facturas),
        }
```

### Paso 3: Parsear retenciones de ARBA

ARBA permite descargar un CSV con las retenciones sufridas:

```python
import pandas as pd

def parse_retenciones_arba(csv_path: str) -> pd.DataFrame:
    df = pd.read_csv(
        csv_path,
        encoding='latin-1',
        sep=';',
        decimal=',',
        thousands='.'
    )
    
    df.columns = [col.strip().lower().replace(' ', '_') for col in df.columns]
    df['fecha'] = pd.to_datetime(df['fecha'], format='%d/%m/%Y')
    df['importe'] = df['importe'].astype(float)
    
    return df[['fecha', 'cuit_agente', 'importe', 'tipo_retencion']]
```

### Paso 4: Generar el reporte Excel

```python
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment

def generar_reporte(resumen: dict, facturas: list, mes: str, output_path: str):
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Resumen Mensual"
    
    # Header
    ws['A1'] = f"Resumen Impositivo - {mes}"
    ws['A1'].font = Font(bold=True, size=14)
    
    # Datos del resumen
    filas = [
        ("Total Facturado (con IVA)", resumen['total_facturado']),
        ("Total Neto", resumen['total_neto']),
        ("IVA Cobrado", resumen['total_iva']),
        ("Retenciones IIGG Sufridas", resumen['retenciones_iigg']),
        ("IIBB a Pagar (CABA)", resumen['iibb_caba']),
        ("IVA a Ingresar (Estimado)", resumen['a_ingresar_iva']),
    ]
    
    for i, (label, valor) in enumerate(filas, start=3):
        ws[f'A{i}'] = label
        ws[f'B{i}'] = float(valor)
        ws[f'B{i}'].number_format = '$#,##0.00'
    
    wb.save(output_path)
```

### El script principal

```python
import os
from pathlib import Path
from datetime import datetime

def main():
    mes = datetime.now().strftime("%Y-%m")
    facturas_dir = Path("data/facturas")
    
    # Parsear todas las facturas del mes
    facturas = []
    for pdf_file in facturas_dir.glob("*.pdf"):
        factura = parse_factura_pdf(str(pdf_file))
        facturas.append(factura)
    
    print(f"Procesadas {len(facturas)} facturas")
    
    # Calcular impuestos
    calc = TaxCalculator()
    resumen = calc.resumen_mes(facturas)
    
    # Generar reporte
    output_path = f"output/resumen_{mes}.xlsx"
    generar_reporte(resumen, facturas, mes, output_path)
    
    print(f"Reporte generado: {output_path}")
    print(f"Total facturado: ${resumen['total_facturado']:,.2f}")
    print(f"IVA a ingresar: ${resumen['a_ingresar_iva']:,.2f}")
    print(f"IIBB CABA: ${resumen['iibb_caba']:,.2f}")

if __name__ == "__main__":
    main()
```

## Resultado

- **Antes**: 3-4 horas mensuales de trabajo manual + errores ocasionales
- **Después**: 8 minutos de ejecución del script + revisión de 10 minutos
- **Errores**: De ocasionales a cero (los números ahora siempre cuadran)

El script lo ejecuto al cierre de cada mes y el Excel lo mando directamente al contador.

---

**Dependencias**: `pdfplumber`, `pandas`, `openpyxl`, `decimal` (stdlib).
