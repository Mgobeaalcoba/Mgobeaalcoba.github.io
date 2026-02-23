---
slug: automatizar-reportes-python
date: 2026-06-14
---

Cada lunes a las 9am, el equipo recibía el mismo Excel de métricas de la semana. Yo lo preparaba manualmente los viernes: 2 horas de trabajo repetitivo. Lo automaticé con Python y ahora el Excel llega solo, con datos frescos, y yo uso esas 2 horas para algo útil.

## El sistema de reportes automatizado

El pipeline tiene tres partes:
1. **Extracción**: datos desde BigQuery
2. **Formateo**: Excel con gráficos y colores
3. **Distribución**: email automático con el reporte adjunto

## Paso 1: Extraer datos de BigQuery

```python
from google.cloud import bigquery
import pandas as pd
from datetime import datetime, timedelta

def get_weekly_metrics() -> dict[str, pd.DataFrame]:
    client = bigquery.Client()
    
    last_monday = datetime.now() - timedelta(days=datetime.now().weekday() + 7)
    last_sunday = last_monday + timedelta(days=6)
    
    start_date = last_monday.strftime('%Y-%m-%d')
    end_date = last_sunday.strftime('%Y-%m-%d')
    
    queries = {
        'sales_by_country': f"""
            SELECT
              country,
              SUM(gmv) as total_gmv,
              COUNT(*) as total_orders,
              COUNT(DISTINCT seller_id) as active_sellers,
              ROUND(SUM(gmv) / COUNT(*), 2) as avg_ticket
            FROM `analytics.orders`
            WHERE DATE(created_at) BETWEEN '{start_date}' AND '{end_date}'
            GROUP BY country
            ORDER BY total_gmv DESC
        """,
        'daily_trend': f"""
            SELECT
              DATE(created_at) as date,
              SUM(gmv) as gmv,
              COUNT(*) as orders
            FROM `analytics.orders`
            WHERE DATE(created_at) BETWEEN '{start_date}' AND '{end_date}'
            GROUP BY 1
            ORDER BY 1
        """,
        'top_sellers': f"""
            SELECT
              seller_id,
              seller_name,
              SUM(gmv) as gmv,
              COUNT(*) as orders,
              RANK() OVER (ORDER BY SUM(gmv) DESC) as rank
            FROM `analytics.orders` o
            JOIN `analytics.sellers` s USING (seller_id)
            WHERE DATE(created_at) BETWEEN '{start_date}' AND '{end_date}'
            GROUP BY seller_id, seller_name
            QUALIFY rank <= 20
        """,
    }
    
    return {
        name: client.query(query).to_dataframe()
        for name, query in queries.items()
    }
```

## Paso 2: Generar el Excel con formato profesional

```python
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils.dataframe import dataframe_to_rows
from openpyxl.chart import BarChart, LineChart, Reference

def create_weekly_report(data: dict[str, pd.DataFrame], output_path: str):
    wb = openpyxl.Workbook()
    
    # Estilos reutilizables
    header_font = Font(bold=True, color="FFFFFF", size=11)
    header_fill = PatternFill(start_color="1F4E79", end_color="1F4E79", fill_type="solid")
    alt_fill = PatternFill(start_color="D6E4F0", end_color="D6E4F0", fill_type="solid")
    
    def style_header_row(ws, row: int, num_cols: int):
        for col in range(1, num_cols + 1):
            cell = ws.cell(row=row, column=col)
            cell.font = header_font
            cell.fill = header_fill
            cell.alignment = Alignment(horizontal="center", vertical="center")
    
    def add_dataframe_to_sheet(ws, df: pd.DataFrame, start_row: int = 1):
        for r_idx, row in enumerate(dataframe_to_rows(df, index=False, header=True)):
            for c_idx, value in enumerate(row, 1):
                cell = ws.cell(row=start_row + r_idx - 1, column=c_idx, value=value)
                if r_idx == 1:
                    cell.font = header_font
                    cell.fill = header_fill
                elif r_idx % 2 == 0:
                    cell.fill = alt_fill
        
        # Auto-ajustar columnas
        for col in ws.columns:
            max_len = max(len(str(cell.value or "")) for cell in col)
            ws.column_dimensions[col[0].column_letter].width = min(max_len + 4, 40)
    
    # Sheet 1: Ventas por País
    ws_countries = wb.active
    ws_countries.title = "Por País"
    add_dataframe_to_sheet(ws_countries, data['sales_by_country'])
    
    # Agregar gráfico de barras
    chart = BarChart()
    chart.title = "GMV por País"
    chart.y_axis.title = "GMV ($)"
    n_rows = len(data['sales_by_country']) + 1
    data_ref = Reference(ws_countries, min_col=2, min_row=1, max_row=n_rows)
    cats = Reference(ws_countries, min_col=1, min_row=2, max_row=n_rows)
    chart.add_data(data_ref, titles_from_data=True)
    chart.set_categories(cats)
    ws_countries.add_chart(chart, "G2")
    
    # Sheet 2: Tendencia Diaria
    ws_trend = wb.create_sheet("Tendencia Semanal")
    add_dataframe_to_sheet(ws_trend, data['daily_trend'])
    
    # Gráfico de línea para tendencia
    line_chart = LineChart()
    line_chart.title = "Evolución Diaria"
    n_rows_trend = len(data['daily_trend']) + 1
    data_ref_trend = Reference(ws_trend, min_col=2, min_row=1, max_row=n_rows_trend)
    line_chart.add_data(data_ref_trend, titles_from_data=True)
    ws_trend.add_chart(line_chart, "E2")
    
    # Sheet 3: Top Sellers
    ws_sellers = wb.create_sheet("Top Sellers")
    add_dataframe_to_sheet(ws_sellers, data['top_sellers'])
    
    wb.save(output_path)
    print(f"Reporte guardado en {output_path}")
```

## Paso 3: Enviar por email automáticamente

```python
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email import encoders
import os

def send_report_email(
    report_path: str,
    recipients: list[str],
    week_dates: tuple[str, str]
):
    msg = MIMEMultipart()
    msg["From"] = os.getenv("EMAIL_FROM")
    msg["To"] = ", ".join(recipients)
    msg["Subject"] = f"📊 Reporte Semanal de Ventas — {week_dates[0]} al {week_dates[1]}"
    
    body = f"""
    Hola equipo,

    Adjunto el reporte de métricas de ventas correspondiente a la semana del {week_dates[0]} al {week_dates[1]}.

    El reporte incluye:
    - Ventas por país (GMV, órdenes, ticket promedio)
    - Tendencia diaria de la semana
    - Top 20 sellers del período

    Saludos,
    Data Team (automated)
    """
    msg.attach(MIMEText(body, "plain"))
    
    # Adjuntar el Excel
    with open(report_path, "rb") as f:
        attachment = MIMEBase("application", "octet-stream")
        attachment.set_payload(f.read())
    encoders.encode_base64(attachment)
    attachment.add_header(
        "Content-Disposition",
        f"attachment; filename={os.path.basename(report_path)}"
    )
    msg.attach(attachment)
    
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(os.getenv("EMAIL_FROM"), os.getenv("EMAIL_PASSWORD"))
        server.sendmail(os.getenv("EMAIL_FROM"), recipients, msg.as_string())
    
    print(f"Email enviado a {len(recipients)} destinatarios")

## El script principal
def main():
    data = get_weekly_metrics()
    
    report_path = f"/tmp/reporte_semanal_{datetime.now().strftime('%Y%m%d')}.xlsx"
    create_weekly_report(data, report_path)
    
    last_monday = datetime.now() - timedelta(days=datetime.now().weekday() + 7)
    last_sunday = last_monday + timedelta(days=6)
    
    send_report_email(
        report_path=report_path,
        recipients=["equipo@company.com", "director@company.com"],
        week_dates=(last_monday.strftime('%d/%m'), last_sunday.strftime('%d/%m/%Y'))
    )

if __name__ == "__main__":
    main()
```

## Automatizar con cron

```bash
# Correr todos los lunes a las 8am (hora Argentina)
0 8 * * 1 cd /home/user/weekly-report && python main.py >> /var/log/weekly-report.log 2>&1

# O en Cloud Scheduler (GCP) para serverless
gcloud scheduler jobs create http weekly-report \
  --schedule="0 11 * * 1" \
  --uri="https://us-central1-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/project/jobs/weekly-report:run" \
  --time-zone="America/Argentina/Buenos_Aires"
```

El resultado: 2 horas semanales liberadas, reporte más consistente, y el equipo lo recibe antes de que lleguen a la oficina.
