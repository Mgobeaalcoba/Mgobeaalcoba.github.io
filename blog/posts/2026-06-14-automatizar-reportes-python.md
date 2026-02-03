---
title: "Cómo automaticé 40 horas mensuales de reportes con Python"
date: "2026-06-14"
author: "Mariano Gobea Alcoba"
category: "automation"
tags: ["python", "automation", "reports", "productivity"]
excerpt: "De Excel manual a reportes automatizados en PDF y Email. El proceso completo que implementé en múltiples clientes."
featured: true
lang: "es"
---

## El Problema: Reportes Manuales

**Escenario típico en PyMEs:**
- Juan pasa 8 horas cada semana armando reportes en Excel
- Copia datos de 5 sistemas diferentes
- Hace cálculos manualmente
- Formatea todo a mano
- Envía por email uno por uno

**Costo:** 40 horas/mes = $400-600 USD de tiempo perdido.

## La Solución: Automatización Completa

```python
# reporte_automatico.py
import pandas as pd
from fpdf import FPDF
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

def generar_reporte_ventas():
    # 1. Extraer datos de múltiples fuentes
    ventas = extraer_ventas_db()
    gastos = extraer_gastos_api()
    objetivos = leer_objetivos_excel()
    
    # 2. Consolidar y calcular
    df = pd.merge(ventas, gastos, on='mes')
    df['margen'] = (df['ventas'] - df['gastos']) / df['ventas'] * 100
    df['vs_objetivo'] = (df['ventas'] / objetivos['target'] - 1) * 100
    
    # 3. Generar PDF
    pdf = crear_pdf_reporte(df)
    
    # 4. Enviar por email
    enviar_reporte_email(pdf, destinatarios=[
        'gerente@empresa.com',
        'jefe_ventas@empresa.com'
    ])
```

## Paso 1: Extraer Datos

```python
import psycopg2
import requests
import pandas as pd

def extraer_ventas_db():
    conn = psycopg2.connect(
        host="db.empresa.com",
        database="ventas",
        user="readonly_user",
        password=os.getenv('DB_PASSWORD')
    )
    
    query = """
        SELECT 
            DATE_TRUNC('month', fecha) as mes,
            SUM(monto) as ventas_total,
            COUNT(*) as num_transacciones
        FROM ventas
        WHERE fecha >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months')
        GROUP BY 1
        ORDER BY 1
    """
    
    return pd.read_sql(query, conn)

def extraer_gastos_api():
    response = requests.get(
        'https://api.empresa.com/gastos',
        headers={'Authorization': f'Bearer {os.getenv("API_KEY")}'},
        params={'desde': '2026-01-01'}
    )
    
    return pd.DataFrame(response.json())
```

## Paso 2: Generar PDF Profesional

```python
from fpdf import FPDF
import matplotlib.pyplot as plt

def crear_pdf_reporte(df):
    pdf = FPDF()
    pdf.add_page()
    
    # Header
    pdf.set_font('Arial', 'B', 16)
    pdf.cell(0, 10, 'Reporte de Ventas Mensual', ln=True, align='C')
    pdf.ln(10)
    
    # Resumen ejecutivo
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, 'Resumen Ejecutivo', ln=True)
    pdf.set_font('Arial', '', 10)
    
    ultimo_mes = df.iloc[-1]
    pdf.cell(0, 8, f"Ventas: ${ultimo_mes['ventas_total']:,.0f}", ln=True)
    pdf.cell(0, 8, f"Margen: {ultimo_mes['margen']:.1f}%", ln=True)
    pdf.cell(0, 8, f"vs Objetivo: {ultimo_mes['vs_objetivo']:+.1f}%", ln=True)
    pdf.ln(10)
    
    # Gráfico
    plt.figure(figsize=(10, 6))
    plt.plot(df['mes'], df['ventas_total'], marker='o')
    plt.title('Evolución de Ventas')
    plt.ylabel('Ventas (ARS)')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig('ventas_chart.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    # Insertar gráfico en PDF
    pdf.image('ventas_chart.png', x=10, y=pdf.get_y(), w=190)
    
    # Tabla de datos
    pdf.ln(85)
    pdf.set_font('Arial', 'B', 10)
    pdf.cell(40, 8, 'Mes', 1)
    pdf.cell(40, 8, 'Ventas', 1)
    pdf.cell(40, 8, 'Margen %', 1, ln=True)
    
    pdf.set_font('Arial', '', 9)
    for _, row in df.iterrows():
        pdf.cell(40, 8, str(row['mes'])[:10], 1)
        pdf.cell(40, 8, f"${row['ventas_total']:,.0f}", 1)
        pdf.cell(40, 8, f"{row['margen']:.1f}%", 1, ln=True)
    
    # Guardar
    filename = f"reporte_ventas_{datetime.now().strftime('%Y%m%d')}.pdf"
    pdf.output(filename)
    
    return filename
```

## Paso 3: Enviar por Email

```python
def enviar_reporte_email(pdf_path, destinatarios):
    # Configuración SMTP (Gmail)
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    email_from = os.getenv('EMAIL_FROM')
    email_password = os.getenv('EMAIL_APP_PASSWORD')
    
    # Crear mensaje
    msg = MIMEMultipart()
    msg['From'] = email_from
    msg['To'] = ', '.join(destinatarios)
    msg['Subject'] = f'Reporte de Ventas - {datetime.now().strftime("%B %Y")}'
    
    # Body
    body = """
    Hola,
    
    Adjunto encontrarás el reporte de ventas del mes.
    
    Highlights:
    - Ventas totales: [ver PDF]
    - Margen promedio: [ver PDF]
    - Comparación vs objetivo: [ver PDF]
    
    Saludos,
    Sistema Automatizado
    """
    msg.attach(MIMEText(body, 'plain'))
    
    # Adjuntar PDF
    with open(pdf_path, 'rb') as f:
        attachment = MIMEBase('application', 'pdf')
        attachment.set_payload(f.read())
        encoders.encode_base64(attachment)
        attachment.add_header('Content-Disposition', f'attachment; filename={pdf_path}')
        msg.attach(attachment)
    
    # Enviar
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(email_from, email_password)
        server.send_message(msg)
    
    print(f"Reporte enviado a {len(destinatarios)} destinatarios")
```

## Paso 4: Schedulear con Cron

```bash
# crontab -e

# Ejecutar cada lunes a las 8am
0 8 * * 1 /usr/bin/python3 /path/to/reporte_automatico.py

# Ejecutar el 1 de cada mes a las 9am
0 9 1 * * /usr/bin/python3 /path/to/reporte_automatico.py
```

## Mejoras Avanzadas

### 1. HTML Email con Gráficos Embebidos

```python
import plotly.graph_objects as go

# Crear gráfico interactivo
fig = go.Figure(data=[go.Bar(x=df['mes'], y=df['ventas'])])

# Convertir a HTML
html_graph = fig.to_html(include_plotlyjs='cdn')

# Email con HTML
msg.attach(MIMEText(html_graph, 'html'))
```

### 2. Dashboard en Google Sheets

```python
import gspread
from google.oauth2.service_account import Credentials

# Conectar a Google Sheets
creds = Credentials.from_service_account_file('credentials.json')
client = gspread.authorize(creds)

# Actualizar sheet
sheet = client.open('Reporte Ventas').sheet1
sheet.update('A1', df.values.tolist())
```

### 3. Alertas Condicionales

```python
def enviar_con_alertas(df, destinatarios):
    ultimo_mes = df.iloc[-1]
    
    # Check conditions
    alertas = []
    if ultimo_mes['vs_objetivo'] < -10:
        alertas.append("⚠️ VENTAS 10% BAJO OBJETIVO")
    
    if ultimo_mes['margen'] < 20:
        alertas.append("⚠️ MARGEN CRÍTICO (<20%)")
    
    # Asunto con alertas
    subject = "Reporte Ventas"
    if alertas:
        subject += " - " + " ".join(alertas)
    
    # Enviar con subject modificado
    msg['Subject'] = subject
```

## ROI: Casos Reales

### Cliente 1: E-commerce
- **Antes:** 10 horas/semana en reportes
- **Después:** 0 horas (100% automatizado)
- **Ahorro:** $800/mes

### Cliente 2: Consultora
- **Antes:** 15 horas/mes en reports a clientes
- **Después:** 30 min/mes (solo review)
- **Ahorro:** $1,200/mes

### MercadoLibre
- **Antes:** 5 analistas generando reportes semanales
- **Después:** 1 pipeline automatizado
- **Ahorro:** $15,000/mes

## Stack Recomendado

Para reportes automáticos:
- **Data:** Pandas, Polars
- **Viz:** Plotly, Matplotlib
- **PDF:** FPDF, ReportLab
- **Email:** smtplib (built-in)
- **Schedule:** Cron, Airflow, Prefect

## Conclusión

Automatizar reportes no es difícil: **es necesario**.

Si alguien en tu equipo pasa >5 horas/mes en reportes manuales, **automatizalo**.

El código que mostré se paga solo en 2 semanas.

---

*¿Querés automatizar tus reportes? [Hablemos](https://calendly.com/mariano-gobea-mercadolibre/30min)*
