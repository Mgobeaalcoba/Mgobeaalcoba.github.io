---
title: "Streamlit: De idea a dashboard en 30 minutos"
date: "2026-04-26"
author: "Mariano Gobea Alcoba"
category: "python"
tags: ["streamlit", "dashboards", "visualization", "python"]
excerpt: "Cómo construir dashboards interactivos profesionales sin saber frontend. Streamlit es la herramienta secreta de todo data team."
featured: false
lang: "es"
---

## Por Qué Streamlit es Revolucionario

Como data engineer, **odio escribir JavaScript**.

Streamlit me permite construir dashboards completos en **Python puro**, sin tocar HTML/CSS/JS.

## Tu Primer Dashboard en 10 Líneas

```python
import streamlit as st
import pandas as pd

st.title("Dashboard de Ventas")

# Upload file
uploaded_file = st.file_uploader("Subí tu CSV de ventas")

if uploaded_file:
    df = pd.read_csv(uploaded_file)
    st.dataframe(df)
    st.line_chart(df['ventas'])
```

Ejecutar:
```bash
streamlit run dashboard.py
```

**Listo. Dashboard funcionando en localhost:8501.**

## Features Poderosas

### 1. Widgets Interactivos

```python
# Selectbox
pais = st.selectbox("País", ['AR', 'BR', 'MX'])

# Slider
rango = st.slider("Rango de fechas", 0, 365, (0, 30))

# Multiselect
categorias = st.multiselect("Categorías", df['categoria'].unique())

# Filtrar data reactivamente
filtered = df[
    (df['pais'] == pais) &
    (df['categoria'].isin(categorias))
]

st.dataframe(filtered)
```

### 2. Gráficos con Plotly

```python
import plotly.express as px

fig = px.scatter(df, x='fecha', y='ventas', color='categoria',
                 title='Ventas por Categoría')

st.plotly_chart(fig, use_container_width=True)
```

### 3. Cache para Performance

```python
@st.cache_data(ttl=3600)  # Cache por 1 hora
def load_data():
    return pd.read_csv('large_file.csv')

df = load_data()  # Solo carga una vez
```

### 4. Sidebar para Filtros

```python
with st.sidebar:
    st.header("Filtros")
    pais = st.selectbox("País", paises)
    fecha_inicio = st.date_input("Desde")
    fecha_fin = st.date_input("Hasta")
```

### 5. Tabs para Organización

```python
tab1, tab2, tab3 = st.tabs(["Resumen", "Detalle", "Exportar"])

with tab1:
    st.metric("Ventas Totales", f"${total:,.0f}")
    st.metric("Promedio", f"${promedio:,.0f}")

with tab2:
    st.dataframe(df_detalle)

with tab3:
    csv = df.to_csv().encode('utf-8')
    st.download_button("Descargar CSV", csv, "ventas.csv")
```

## Dashboard Real: Análisis de Impuestos

```python
import streamlit as st
import pandas as pd
import plotly.express as px

st.set_page_config(page_title="Calculadora Ganancias", layout="wide")

st.title("📊 Análisis de Impuesto a las Ganancias")

# Sidebar inputs
with st.sidebar:
    st.header("Parámetros")
    salario_bruto = st.number_input("Salario Bruto Mensual", 1000000, 10000000, 3000000, step=100000)
    tiene_conyuge = st.checkbox("Cónyuge a cargo")
    num_hijos = st.number_input("Hijos", 0, 10, 0)

# Cálculos
deducciones = calcular_deducciones(tiene_conyuge, num_hijos)
impuesto = calcular_impuesto(salario_bruto * 12, deducciones)
neto = salario_bruto - impuesto / 12

# Métricas
col1, col2, col3 = st.columns(3)
with col1:
    st.metric("Bruto", f"${salario_bruto:,.0f}")
with col2:
    st.metric("Impuesto", f"-${impuesto/12:,.0f}")
with col3:
    st.metric("Neto", f"${neto:,.0f}", delta=f"{(neto/salario_bruto-1)*100:.1f}%")

# Gráfico de breakdown
fig = px.pie(values=[neto, impuesto/12], names=['Neto', 'Impuesto'])
st.plotly_chart(fig)
```

## Deploy a Producción

### Streamlit Cloud (Gratis)
1. Push a GitHub
2. Conectar en streamlit.io/cloud
3. Deploy automático

### Docker
```dockerfile
FROM python:3.11-slim

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . /app
WORKDIR /app

EXPOSE 8501
CMD ["streamlit", "run", "dashboard.py"]
```

## Alternativas

- **Dash (Plotly)**: Más control, más complejo
- **Panel (HoloViz)**: Más features, learning curve
- **Voila (Jupyter)**: Notebooks to apps
- **Streamlit**: **Mejor balance simplicidad/potencia**

## Tips Pro

### 1. Session State para Persistencia

```python
if 'counter' not in st.session_state:
    st.session_state.counter = 0

if st.button("Incrementar"):
    st.session_state.counter += 1

st.write(f"Contador: {st.session_state.counter}")
```

### 2. Custom CSS

```python
st.markdown("""
<style>
    .big-font {
        font-size: 50px !important;
    }
</style>
""", unsafe_allow_html=True)

st.markdown('<p class="big-font">Título Grande</p>', unsafe_allow_html=True)
```

### 3. Multi-Page Apps

```
app/
├── Home.py
└── pages/
    ├── 1_Ventas.py
    ├── 2_Usuarios.py
    └── 3_Analytics.py
```

Streamlit auto-detecta pages/ y crea navegación.

## Conclusión

Streamlit eliminó la fricción entre **"tengo idea"** y **"tengo dashboard funcionando"**.

Para data teams, es game-changer.

---

*¿Querés dashboards custom para tu negocio? [Consultoría BI](https://mgobeaalcoba.github.io/consulting.html)*
