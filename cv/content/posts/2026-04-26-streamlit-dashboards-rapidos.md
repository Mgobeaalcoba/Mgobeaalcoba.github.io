---
slug: streamlit-dashboards-rapidos
date: 2025-11-30
---

Streamlit permite construir dashboards interactivos de datos en horas, no días. Sin JavaScript, sin CSS, solo Python. Acá cómo construir un dashboard de métricas de ventas completo en menos de 100 líneas de código.

## Por qué Streamlit

La alternativa tradicional para un dashboard interno era: React + D3.js + una API en FastAPI + auth + deployment. Meses de trabajo para algo que el equipo de negocio iba a mirar una vez por semana.

Streamlit colapsa todo eso en Python puro.

## El dashboard completo

```python
import streamlit as st
import pandas as pd
import plotly.express as px
from datetime import datetime, timedelta
from google.cloud import bigquery

st.set_page_config(
    page_title="Sales Dashboard",
    page_icon="📊",
    layout="wide"
)

@st.cache_data(ttl=3600)  # Cache por 1 hora
def load_data(start_date: str, end_date: str) -> pd.DataFrame:
    client = bigquery.Client()
    query = f"""
    SELECT
      DATE(created_at) as date,
      country,
      category,
      SUM(gmv) as total_gmv,
      COUNT(*) as orders,
      COUNT(DISTINCT seller_id) as active_sellers
    FROM `my-project.analytics.orders`
    WHERE DATE(created_at) BETWEEN '{start_date}' AND '{end_date}'
    GROUP BY 1, 2, 3
    """
    return client.query(query).to_dataframe()

# Sidebar con filtros
st.sidebar.title("Filtros")
date_range = st.sidebar.date_input(
    "Período",
    value=(datetime.now() - timedelta(days=30), datetime.now()),
    max_value=datetime.now()
)

countries = st.sidebar.multiselect(
    "Países",
    options=["AR", "BR", "MX", "CO", "CL"],
    default=["AR", "BR", "MX"]
)

# Cargar datos
df = load_data(str(date_range[0]), str(date_range[1]))
df_filtered = df[df["country"].isin(countries)]

# KPIs principales
col1, col2, col3, col4 = st.columns(4)

with col1:
    total_gmv = df_filtered["total_gmv"].sum()
    st.metric("GMV Total", f"${total_gmv:,.0f}", delta="+12%")

with col2:
    total_orders = df_filtered["orders"].sum()
    st.metric("Órdenes", f"{total_orders:,}", delta="+8%")

with col3:
    avg_ticket = total_gmv / total_orders if total_orders > 0 else 0
    st.metric("Ticket Promedio", f"${avg_ticket:,.2f}", delta="+3%")

with col4:
    active_sellers = df_filtered["active_sellers"].sum()
    st.metric("Sellers Activos", f"{active_sellers:,}", delta="+15%")

# Gráficos
st.subheader("Evolución temporal")
fig_time = px.line(
    df_filtered.groupby("date")["total_gmv"].sum().reset_index(),
    x="date",
    y="total_gmv",
    title="GMV Diario",
    labels={"total_gmv": "GMV", "date": "Fecha"}
)
st.plotly_chart(fig_time, use_container_width=True)

col_left, col_right = st.columns(2)

with col_left:
    fig_country = px.pie(
        df_filtered.groupby("country")["total_gmv"].sum().reset_index(),
        values="total_gmv",
        names="country",
        title="GMV por País"
    )
    st.plotly_chart(fig_country)

with col_right:
    fig_category = px.bar(
        df_filtered.groupby("category")["total_gmv"].sum().reset_index().nlargest(10, "total_gmv"),
        x="total_gmv",
        y="category",
        orientation="h",
        title="Top 10 Categorías"
    )
    st.plotly_chart(fig_category)

# Tabla de datos
st.subheader("Detalle por País y Categoría")
pivot = df_filtered.pivot_table(
    values="total_gmv",
    index="category",
    columns="country",
    aggfunc="sum",
    fill_value=0
)
st.dataframe(pivot.style.format("${:,.0f}"), use_container_width=True)
```

## Deploy

```bash
# requirements.txt
streamlit==1.31.0
pandas==2.1.0
plotly==5.18.0
google-cloud-bigquery==3.14.0

# Correr local
streamlit run dashboard.py

# Deploy en GCP Cloud Run
gcloud run deploy sales-dashboard \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

## Autenticación simple con secrets

```python
import streamlit as st

def check_password():
    def password_entered():
        if st.session_state["password"] == st.secrets["password"]:
            st.session_state["password_correct"] = True
        else:
            st.session_state["password_correct"] = False

    if "password_correct" not in st.session_state:
        st.text_input("Password", type="password", on_change=password_entered, key="password")
        return False
    elif not st.session_state["password_correct"]:
        st.text_input("Password", type="password", on_change=password_entered, key="password")
        st.error("Password incorrecto")
        return False
    else:
        return True

if check_password():
    main_dashboard()
```

## Resultado

100 líneas de Python. Un dashboard interactivo con filtros, KPIs, gráficos y tablas. Deploy en Cloud Run en 5 minutos. El equipo de negocio lo usa todos los lunes.

Sin JavaScript. Sin CSS. Solo Python.
