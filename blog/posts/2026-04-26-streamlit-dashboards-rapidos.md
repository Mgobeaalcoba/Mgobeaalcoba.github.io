---
slug: streamlit-dashboards-rapidos
date: 2026-04-26
---

El scenario más común en Data Analytics: tenés los datos, tenés el análisis, pero necesitás mostrárselo a alguien que no sabe de Python ni de Jupyter. Streamlit resuelve ese gap en 30 minutos.

En este artículo construimos un dashboard de ventas funcional desde cero.

## ¿Qué es Streamlit?

Streamlit es una librería Python que convierte scripts en aplicaciones web interactivas. No necesitás saber HTML, CSS, ni JavaScript. Escribís Python y Streamlit genera el frontend automáticamente.

```bash
pip install streamlit
streamlit run mi_dashboard.py
# → Abre el browser en localhost:8501 automáticamente
```

## El dashboard que vamos a construir

Un dashboard de ventas con:
- KPIs en cards (GMV, órdenes, clientes únicos)
- Gráfico de tendencia temporal
- Top 10 vendedores
- Filtros interactivos (fecha, categoría, país)

## Paso 1: Los datos

```python
# dashboard.py
import streamlit as st
import pandas as pd
import plotly.express as px
import numpy as np
from datetime import datetime, timedelta

# Generamos datos de ejemplo (en producción vendrían de tu BD o warehouse)
@st.cache_data  # Cache para no regenerar en cada interacción
def cargar_datos():
    np.random.seed(42)
    n = 50_000
    
    fechas = pd.date_range("2025-01-01", "2026-01-31", periods=n)
    
    df = pd.DataFrame({
        "fecha": fechas,
        "seller_id": np.random.randint(1, 501, n),
        "seller_nombre": [f"Vendedor {i}" for i in np.random.randint(1, 501, n)],
        "buyer_id": np.random.randint(1, 10_001, n),
        "monto": np.random.exponential(2500, n).round(2),
        "categoria": np.random.choice(
            ["Electrónica", "Ropa", "Hogar", "Deportes", "Alimentos"], n
        ),
        "pais": np.random.choice(["Argentina", "Brasil", "México", "Colombia"], n,
                                  p=[0.4, 0.3, 0.2, 0.1]),
    })
    df["fecha"] = pd.to_datetime(df["fecha"])
    return df

df_completo = cargar_datos()
```

## Paso 2: Layout y filtros

```python
# Configuración de la página
st.set_page_config(
    page_title="Dashboard de Ventas",
    page_icon="📊",
    layout="wide",
)

st.title("📊 Dashboard de Ventas")
st.markdown("---")

# Sidebar con filtros
st.sidebar.header("Filtros")

# Filtro de fechas
col1, col2 = st.sidebar.columns(2)
fecha_inicio = col1.date_input(
    "Desde",
    value=datetime(2025, 10, 1),
    min_value=df_completo["fecha"].min().date(),
    max_value=df_completo["fecha"].max().date(),
)
fecha_fin = col2.date_input(
    "Hasta",
    value=df_completo["fecha"].max().date(),
    min_value=df_completo["fecha"].min().date(),
    max_value=df_completo["fecha"].max().date(),
)

# Filtro de categorías
categorias = st.sidebar.multiselect(
    "Categorías",
    options=df_completo["categoria"].unique(),
    default=df_completo["categoria"].unique(),
)

# Filtro de países
paises = st.sidebar.multiselect(
    "Países",
    options=df_completo["pais"].unique(),
    default=df_completo["pais"].unique(),
)

# Aplicar filtros
df = df_completo[
    (df_completo["fecha"].dt.date >= fecha_inicio) &
    (df_completo["fecha"].dt.date <= fecha_fin) &
    (df_completo["categoria"].isin(categorias)) &
    (df_completo["pais"].isin(paises))
]
```

## Paso 3: KPIs en cards

```python
# KPIs principales
st.subheader("Métricas clave")

col1, col2, col3, col4 = st.columns(4)

with col1:
    gmv_total = df["monto"].sum()
    st.metric(
        label="GMV Total",
        value=f"${gmv_total:,.0f}",
        delta="+12.3% vs período anterior",  # En prod: calcular dinámicamente
    )

with col2:
    total_ordenes = len(df)
    st.metric(
        label="Órdenes",
        value=f"{total_ordenes:,}",
        delta="+8.1%",
    )

with col3:
    compradores_unicos = df["buyer_id"].nunique()
    st.metric(
        label="Compradores únicos",
        value=f"{compradores_unicos:,}",
        delta="+5.4%",
    )

with col4:
    ticket_promedio = df["monto"].mean()
    st.metric(
        label="Ticket promedio",
        value=f"${ticket_promedio:,.0f}",
        delta="+3.8%",
    )
```

## Paso 4: Gráficos con Plotly

```python
st.markdown("---")

# Gráfico de tendencia temporal
col1, col2 = st.columns([2, 1])

with col1:
    st.subheader("Tendencia de GMV")
    
    df_diario = (
        df.groupby(df["fecha"].dt.date)
        .agg(gmv=("monto", "sum"), ordenes=("seller_id", "count"))
        .reset_index()
    )
    
    # Toggle entre GMV y órdenes
    metrica_seleccionada = st.radio(
        "Métrica",
        ["GMV", "Órdenes"],
        horizontal=True,
        label_visibility="collapsed",
    )
    
    y_col = "gmv" if metrica_seleccionada == "GMV" else "ordenes"
    
    fig_tendencia = px.line(
        df_diario,
        x="fecha",
        y=y_col,
        title=f"{metrica_seleccionada} diario",
        template="plotly_dark",
    )
    fig_tendencia.update_traces(line_color="#38bdf8")
    st.plotly_chart(fig_tendencia, use_container_width=True)

with col2:
    st.subheader("Por Categoría")
    
    df_cat = (
        df.groupby("categoria")["monto"].sum()
        .sort_values(ascending=True)
        .reset_index()
    )
    
    fig_cat = px.bar(
        df_cat,
        x="monto",
        y="categoria",
        orientation="h",
        template="plotly_dark",
        color="monto",
        color_continuous_scale="Blues",
    )
    fig_cat.update_layout(showlegend=False, coloraxis_showscale=False)
    st.plotly_chart(fig_cat, use_container_width=True)

# Top vendedores
st.markdown("---")
st.subheader("Top 10 Vendedores")

top_vendedores = (
    df.groupby(["seller_id", "seller_nombre"])
    .agg(
        gmv=("monto", "sum"),
        ordenes=("monto", "count"),
        ticket_promedio=("monto", "mean"),
    )
    .sort_values("gmv", ascending=False)
    .head(10)
    .reset_index()
)

top_vendedores["gmv"] = top_vendedores["gmv"].map("${:,.0f}".format)
top_vendedores["ticket_promedio"] = top_vendedores["ticket_promedio"].map("${:,.0f}".format)

st.dataframe(
    top_vendedores[["seller_nombre", "gmv", "ordenes", "ticket_promedio"]].rename(columns={
        "seller_nombre": "Vendedor",
        "gmv": "GMV Total",
        "ordenes": "Órdenes",
        "ticket_promedio": "Ticket Promedio",
    }),
    use_container_width=True,
    hide_index=True,
)
```

## Paso 5: Correr y deployar

```bash
# Desarrollo local
streamlit run dashboard.py

# Deploy en Streamlit Cloud (gratis para repos públicos)
# 1. Subir el código a GitHub
# 2. Ir a share.streamlit.io
# 3. Conectar el repo → automáticamente disponible en una URL pública

# Docker para producción propia
# docker run -p 8501:8501 streamlit/streamlit:latest streamlit run dashboard.py
```

## Funcionalidades avanzadas que vale la pena conocer

### Formularios (evitar re-runs en cada keystroke)

```python
with st.form("filtros_avanzados"):
    umbral_monto = st.number_input("Monto mínimo", min_value=0, value=100)
    seller_especifico = st.text_input("ID de vendedor (opcional)")
    submitted = st.form_submit_button("Aplicar")

if submitted:
    # Solo corre cuando el usuario hace click
    df_filtrado = df[df["monto"] >= umbral_monto]
    if seller_especifico:
        df_filtrado = df_filtrado[df_filtrado["seller_id"] == int(seller_especifico)]
```

### Estado de sesión

```python
if "contador_clics" not in st.session_state:
    st.session_state.contador_clics = 0

if st.button("Actualizar datos"):
    st.session_state.contador_clics += 1
    st.cache_data.clear()  # Limpiar cache para recargar datos

st.write(f"Datos actualizados {st.session_state.contador_clics} veces")
```

## Cuándo Streamlit NO es la solución

- **Dashboards para equipos grandes**: Looker, Tableau, o Metabase son más apropiados para decenas de usuarios con distintos roles
- **Reportes estáticos**: Para PDF o Excel, usá nbconvert o reportlab
- **Alta concurrencia**: Streamlit no está optimizado para cientos de usuarios simultáneos

---

En 30 minutos tenés un dashboard funcional que podés compartir con cualquier persona de la empresa. Eso es el valor principal de Streamlit: reducir la brecha entre el análisis y la comunicación de datos.
