---
slug: automatizar-reportes-python
date: 2026-06-14
---

Todos los lunes a las 9am, el equipo recibía un email con un Excel adjunto. Para generarlo, alguien bajaba datos de 3 sistemas distintos, los pegaba en una planilla, aplicaba fórmulas, hacía los gráficos, lo formateaba, y lo enviaba. 40 minutos cada semana. 40 horas al año. Más los viernes con el reporte quincenal, y los primeros de cada mes con el reporte mensual.

Con Python y 2 días de trabajo, automatizamos todo eso. Acá está el sistema completo.

## La arquitectura del sistema de reportes

```
[Fuentes de datos] → [Extracción Python] → [Transformación Pandas] → [Generación de reporte] → [Distribución]
     ↓                      ↓                       ↓                       ↓                       ↓
  PostgreSQL            SQLAlchemy               cálculos              openpyxl/jinja2         smtplib/
  Google Sheets         gspread                  formateo              reportlab/weasyprint     Slack API
  REST APIs             requests                                        matplotlib/plotly
```

## Paso 1: Extracción de múltiples fuentes

```python
# extractors.py
import pandas as pd
from sqlalchemy import create_engine
import gspread
from google.oauth2.service_account import Credentials
import requests

class DataExtractor:
    def __init__(self, db_url: str, sheets_creds_path: str):
        self.engine = create_engine(db_url)
        self.gc = gspread.service_account(filename=sheets_creds_path)
    
    def extraer_ventas_db(self, fecha_inicio: str, fecha_fin: str) -> pd.DataFrame:
        query = """
            SELECT 
                DATE(created_at) as fecha,
                seller_id,
                category_id,
                SUM(amount) as gmv,
                COUNT(*) as orders,
                COUNT(DISTINCT buyer_id) as unique_buyers
            FROM orders
            WHERE created_at BETWEEN :inicio AND :fin
              AND status = 'completed'
            GROUP BY 1, 2, 3
        """
        return pd.read_sql(query, self.engine, params={"inicio": fecha_inicio, "fin": fecha_fin})
    
    def extraer_objetivos_sheets(self, sheet_name: str) -> pd.DataFrame:
        spreadsheet = self.gc.open(sheet_name)
        worksheet = spreadsheet.sheet1
        data = worksheet.get_all_records()
        return pd.DataFrame(data)
    
    def extraer_mercado_api(self, endpoint: str) -> pd.DataFrame:
        response = requests.get(
            endpoint,
            headers={"Authorization": f"Bearer {self.api_token}"},
            timeout=30,
        )
        response.raise_for_status()
        return pd.DataFrame(response.json()["data"])
```

## Paso 2: Transformación y análisis

```python
# transformers.py
import pandas as pd
import numpy as np

def calcular_metricas_semanales(df_ventas: pd.DataFrame, df_objetivos: pd.DataFrame) -> pd.DataFrame:
    """Calcula métricas semanales con comparación vs objetivos."""
    
    # Agrupación semanal
    df_ventas["semana"] = pd.to_datetime(df_ventas["fecha"]).dt.to_period("W")
    
    metricas = df_ventas.groupby("semana").agg(
        gmv=("gmv", "sum"),
        orders=("orders", "sum"),
        unique_buyers=("unique_buyers", "sum"),
    ).reset_index()
    
    # Calcular variaciones semana a semana
    metricas["gmv_sem_anterior"] = metricas["gmv"].shift(1)
    metricas["variacion_gmv_pct"] = (
        (metricas["gmv"] / metricas["gmv_sem_anterior"] - 1) * 100
    ).round(1)
    
    # Merge con objetivos
    metricas = metricas.merge(
        df_objetivos.rename(columns={"semana": "semana", "objetivo_gmv": "objetivo"}),
        on="semana",
        how="left",
    )
    metricas["cumplimiento_pct"] = (metricas["gmv"] / metricas["objetivo"] * 100).round(1)
    
    return metricas

def calcular_top_sellers(df_ventas: pd.DataFrame, top_n: int = 10) -> pd.DataFrame:
    """Top vendedores del período."""
    return (
        df_ventas.groupby("seller_id")
        .agg(gmv=("gmv", "sum"), orders=("orders", "sum"))
        .sort_values("gmv", ascending=False)
        .head(top_n)
        .reset_index()
    )
```

## Paso 3: Generar el Excel con openpyxl

```python
# excel_generator.py
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.chart import BarChart, Reference
from openpyxl.utils import get_column_letter
import pandas as pd

COLORS = {
    "header": "1E3A5F",
    "accent": "38BDF8",
    "positive": "22C55E",
    "negative": "EF4444",
    "neutral": "94A3B8",
    "bg": "0F172A",
}

class ExcelReportGenerator:
    def __init__(self):
        self.wb = openpyxl.Workbook()
        self.wb.remove(self.wb.active)  # Eliminar hoja por defecto
    
    def agregar_hoja_resumen(self, metricas: pd.DataFrame):
        ws = self.wb.create_sheet("Resumen Ejecutivo")
        
        # Título
        ws.merge_cells("A1:F1")
        ws["A1"] = "REPORTE SEMANAL DE VENTAS"
        ws["A1"].font = Font(bold=True, size=16, color="FFFFFF")
        ws["A1"].fill = PatternFill(fill_type="solid", fgColor=COLORS["header"])
        ws["A1"].alignment = Alignment(horizontal="center")
        ws.row_dimensions[1].height = 35
        
        # Headers
        headers = ["Semana", "GMV", "vs Semana Ant.", "Órdenes", "Compradores", "Cumplimiento"]
        for col, header in enumerate(headers, 1):
            cell = ws.cell(row=2, column=col, value=header)
            cell.font = Font(bold=True, color="FFFFFF")
            cell.fill = PatternFill(fill_type="solid", fgColor=COLORS["accent"])
            cell.alignment = Alignment(horizontal="center")
        
        # Datos
        for row_idx, (_, row) in enumerate(metricas.iterrows(), 3):
            ws.cell(row=row_idx, column=1, value=str(row["semana"]))
            
            # GMV formateado
            gmv_cell = ws.cell(row=row_idx, column=2, value=row["gmv"])
            gmv_cell.number_format = '$#,##0'
            
            # Variación con color condicional
            var_cell = ws.cell(row=row_idx, column=3, value=row.get("variacion_gmv_pct", None))
            var_cell.number_format = '+0.0%;-0.0%'
            if row.get("variacion_gmv_pct", 0) >= 0:
                var_cell.font = Font(color=COLORS["positive"])
            else:
                var_cell.font = Font(color=COLORS["negative"])
            
            ws.cell(row=row_idx, column=4, value=row["orders"]).number_format = '#,##0'
            ws.cell(row=row_idx, column=5, value=row["unique_buyers"]).number_format = '#,##0'
            ws.cell(row=row_idx, column=6, value=row.get("cumplimiento_pct", None)).number_format = '0.0%'
        
        # Ajustar anchos de columna
        for col in ws.columns:
            max_length = max(len(str(cell.value or "")) for cell in col)
            ws.column_dimensions[get_column_letter(col[0].column)].width = max(12, max_length + 2)
        
        # Agregar gráfico
        chart = BarChart()
        chart.type = "col"
        chart.title = "GMV Semanal"
        chart.y_axis.title = "GMV"
        
        data_ref = Reference(ws, min_col=2, min_row=2, max_row=ws.max_row)
        cats_ref = Reference(ws, min_col=1, min_row=3, max_row=ws.max_row)
        chart.add_data(data_ref, titles_from_data=True)
        chart.set_categories(cats_ref)
        
        ws.add_chart(chart, "H2")
        
        return ws
    
    def guardar(self, filepath: str):
        self.wb.save(filepath)
        print(f"Reporte guardado en: {filepath}")
```

## Paso 4: Envío por email

```python
# email_sender.py
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from pathlib import Path
import os

class EmailSender:
    def __init__(self, smtp_server: str, port: int, user: str, password: str):
        self.smtp_server = smtp_server
        self.port = port
        self.user = user
        self.password = password
    
    def enviar_reporte(
        self,
        destinatarios: list[str],
        asunto: str,
        cuerpo_html: str,
        adjunto_path: str,
    ):
        msg = MIMEMultipart("mixed")
        msg["From"] = self.user
        msg["To"] = ", ".join(destinatarios)
        msg["Subject"] = asunto
        
        # Cuerpo HTML
        msg.attach(MIMEText(cuerpo_html, "html"))
        
        # Adjunto
        with open(adjunto_path, "rb") as f:
            attachment = MIMEBase("application", "octet-stream")
            attachment.set_payload(f.read())
            encoders.encode_base64(attachment)
            attachment.add_header(
                "Content-Disposition",
                f"attachment; filename={Path(adjunto_path).name}",
            )
            msg.attach(attachment)
        
        with smtplib.SMTP(self.smtp_server, self.port) as server:
            server.starttls()
            server.login(self.user, self.password)
            server.sendmail(self.user, destinatarios, msg.as_string())
        
        print(f"Email enviado a: {', '.join(destinatarios)}")

# Template HTML del email
CUERPO_EMAIL = """
<html><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
<h2 style="color: #1E3A5F;">Reporte Semanal de Ventas</h2>
<p>Adjunto encontrás el reporte de la semana del <strong>{semana}</strong>.</p>
<h3 style="color: #38BDF8;">Highlights:</h3>
<ul>
  <li>GMV Total: <strong>${gmv:,.0f}</strong> ({variacion:+.1f}% vs semana anterior)</li>
  <li>Órdenes: <strong>{orders:,}</strong></li>
  <li>Cumplimiento del objetivo: <strong>{cumplimiento:.1f}%</strong></li>
</ul>
<p style="color: #666; font-size: 12px;">Este reporte fue generado automáticamente.</p>
</body></html>
"""
```

## Paso 5: El orchestrador completo

```python
# run_report.py
import schedule
import time
from datetime import datetime, timedelta

from extractors import DataExtractor
from transformers import calcular_metricas_semanales, calcular_top_sellers
from excel_generator import ExcelReportGenerator
from email_sender import EmailSender

CONFIG = {
    "db_url": os.getenv("DATABASE_URL"),
    "sheets_creds": "credentials.json",
    "smtp_server": "smtp.gmail.com",
    "smtp_port": 587,
    "email_user": os.getenv("EMAIL_USER"),
    "email_pass": os.getenv("EMAIL_PASS"),
    "destinatarios": ["gerencia@empresa.com", "analytics@empresa.com"],
}

def generar_y_enviar_reporte():
    print(f"[{datetime.now()}] Iniciando generación de reporte...")
    
    # Período del reporte
    hoy = datetime.today()
    inicio = (hoy - timedelta(days=hoy.weekday() + 7)).strftime("%Y-%m-%d")
    fin = (hoy - timedelta(days=hoy.weekday() + 1)).strftime("%Y-%m-%d")
    
    # Extracción
    extractor = DataExtractor(CONFIG["db_url"], CONFIG["sheets_creds"])
    df_ventas = extractor.extraer_ventas_db(inicio, fin)
    df_objetivos = extractor.extraer_objetivos_sheets("Objetivos 2026")
    
    # Transformación
    metricas = calcular_metricas_semanales(df_ventas, df_objetivos)
    top_sellers = calcular_top_sellers(df_ventas)
    
    # Generación Excel
    generator = ExcelReportGenerator()
    generator.agregar_hoja_resumen(metricas)
    filepath = f"/tmp/reporte_ventas_{hoy.strftime('%Y%m%d')}.xlsx"
    generator.guardar(filepath)
    
    # Envío
    sender = EmailSender(CONFIG["smtp_server"], CONFIG["smtp_port"],
                         CONFIG["email_user"], CONFIG["email_pass"])
    
    ultima_semana = metricas.iloc[-1]
    sender.enviar_reporte(
        destinatarios=CONFIG["destinatarios"],
        asunto=f"Reporte Semanal de Ventas - {inicio} a {fin}",
        cuerpo_html=CUERPO_EMAIL.format(
            semana=f"{inicio} al {fin}",
            gmv=ultima_semana["gmv"],
            variacion=ultima_semana.get("variacion_gmv_pct", 0),
            orders=ultima_semana["orders"],
            cumplimiento=ultima_semana.get("cumplimiento_pct", 0),
        ),
        adjunto_path=filepath,
    )
    
    print(f"[{datetime.now()}] Reporte enviado exitosamente!")

# Scheduling: todos los lunes a las 8am
schedule.every().monday.at("08:00").do(generar_y_enviar_reporte)

print("Scheduler iniciado. Esperando el próximo lunes a las 8am...")
while True:
    schedule.run_pending()
    time.sleep(60)
```

## El impacto real

| Tarea | Antes | Después |
|-------|-------|---------|
| Reporte semanal | 40 min/semana | 0 min (automático) |
| Reporte quincenal | 60 min | 0 min |
| Reporte mensual | 90 min | 0 min |
| **Total mensual** | **~10 horas** | **~0 horas** |
| Errores humanos | Ocasionales | Ninguno |
| Distribución | Manual | Automática |

Las 10 horas mensuales que recuperamos no fueron solo tiempo — fueron energía cognitiva que se usaba en trabajo repetitivo y se redirigió a análisis de mayor valor.

---

El setup inicial tomó 2 días. El ROI fue positivo en la primera semana. Si tenés reportes manuales recurrentes en tu organización, este es probablemente el proyecto de automatización con mejor ratio esfuerzo/impacto que podés hacer.
