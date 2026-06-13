import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from sklearn.linear_model import LinearRegression
import numpy as np

# ------------------ ⚙️ PAGE CONFIG ------------------
st.set_page_config(
    page_title="AI Healthcare Dashboard",
    page_icon="🏥",
    layout="wide"
)

# ------------------ 🎨 DARK STYLE ------------------
st.markdown("""
<style>
body { background-color: #0E1117; color: white; }
</style>
""", unsafe_allow_html=True)

# ------------------ 🏥 HEADER ------------------
st.markdown(
    "<h1 style='text-align: center; color: #4CAF50;'>AI-Powered Healthcare Analytics Dashboard</h1>",
    unsafe_allow_html=True
)

# ------------------ 📊 LOAD DATA ------------------
df = pd.read_csv("../data/sales.csv")

# ------------------ 🎛️ FILTERS ------------------
st.sidebar.header("🔎 Filters")

city = st.sidebar.selectbox("Select City", df["City"].unique())
medicine = st.sidebar.selectbox("Select Medicine", df["Medicine"].unique())

month_map = {
    "Jan":1,"Feb":2,"Mar":3,"Apr":4,"May":5,"Jun":6,
    "Jul":7,"Aug":8,"Sep":9,"Oct":10,"Nov":11,"Dec":12
}

months = list(month_map.keys())
selected_months = st.sidebar.multiselect("Select Months", months, default=months)

search = st.sidebar.text_input("🔍 Search Medicine")

# Apply filters
filtered_df = df.copy()
filtered_df = filtered_df[filtered_df["City"] == city]
filtered_df = filtered_df[filtered_df["Medicine"] == medicine]
filtered_df = filtered_df[filtered_df["Month"].isin(selected_months)]

if search:
    filtered_df = filtered_df[filtered_df["Medicine"].str.contains(search, case=False)]

# ------------------ 📊 KPI ------------------
st.subheader("📊 Key Performance Indicators")

col1, col2, col3 = st.columns(3)

col1.metric("💰 Total Sales", f"{df['Sales'].sum():,}")
col2.metric("📈 Avg Sales", f"{df['Sales'].mean():.0f}")
col3.metric("🏆 Max Sale", df['Sales'].max())

# ------------------ 📄 DATA ------------------
st.subheader("📋 Filtered Data")
st.write(filtered_df)

# ------------------ 🌐 3D GRAPH ------------------
fig3d = px.scatter_3d(
    filtered_df,
    x='Month',
    y='Medicine',
    z='Sales',
    color='Disease',
    size='Sales'
)

# ------------------ 📊 BAR ------------------
fig_bar = px.bar(df, x="Medicine", y="Sales", color="City")

col1, col2 = st.columns(2)

with col1:
    st.subheader("🌐 3D Visualization")
    st.plotly_chart(fig3d)

with col2:
    st.subheader("📊 Sales Comparison")
    st.plotly_chart(fig_bar)

# ------------------ 📈 TREND + ML ------------------
st.subheader("📈 Sales Trend & Prediction")

filtered_df["Month_num"] = filtered_df["Month"].map(month_map)

if len(filtered_df) > 2:
    filtered_df = filtered_df.sort_values("Month_num")

    X = filtered_df[["Month_num"]]
    y = filtered_df["Sales"]

    model = LinearRegression()
    model.fit(X, y)

    future = np.array([[7],[8],[9],[10],[11],[12]])
    pred = model.predict(future)

    fig2 = go.Figure()

    fig2.add_trace(go.Scatter(x=filtered_df["Month_num"], y=y,
                             mode='lines+markers', name='Actual'))

    fig2.add_trace(go.Scatter(x=[7,8,9,10,11,12], y=pred,
                             mode='lines+markers', name='Predicted'))

    st.plotly_chart(fig2)
    st.success(f"📈 Next Month Prediction: {int(pred[0])}")

# ------------------ 🔥 HEATMAP ------------------
st.subheader("🔥 Demand Heatmap")

pivot = df.pivot_table(values="Sales", index="Medicine", columns="Month", aggfunc="sum")
fig_heat = px.imshow(pivot, text_auto=True)
st.plotly_chart(fig_heat)

# ------------------ 🌍 MAP ------------------
st.subheader("🌍 Sales Map")

fig_map = px.scatter_mapbox(
    df,
    lat="Lat",
    lon="Lon",
    color="Medicine",
    size="Sales",
    hover_name="City",
    zoom=5,
    height=600,
    size_max=30
)

fig_map.update_layout(mapbox_style="open-street-map")
st.plotly_chart(fig_map)

# ------------------ 🤖 RECOMMENDATION ------------------
st.subheader("🤖 Suggested Medicine")

disease = st.selectbox("Select Disease", df["Disease"].unique())
rec = df[df["Disease"] == disease]["Medicine"].mode()[0]

st.success(f"💊 Recommended: {rec}")

# ------------------ 🚨 OUTLIERS ------------------
st.subheader("🚨 Outliers")

mean = df["Sales"].mean()
std = df["Sales"].std()
out = df[df["Sales"] > mean + 2*std]

st.write(out)

# ------------------ 💡 INSIGHTS ------------------
st.subheader("💡 Insights")

top_med = df.groupby("Medicine")["Sales"].sum().idxmax()
top_city = df.groupby("City")["Sales"].sum().idxmax()

st.info(f"🏆 Top Medicine: {top_med}")
st.info(f"🌆 Top City: {top_city}")

# ------------------ 📥 DOWNLOAD ------------------
st.download_button(
    "📥 Download Data",
    df.to_csv(index=False),
    "data.csv"
)

# ------------------ 🎬 ANIMATION ------------------
st.subheader("🎬 Monthly Animation")

fig_anim = px.scatter(df, x="City", y="Sales",
                      size="Sales", color="Medicine",
                      animation_frame="Month")

st.plotly_chart(fig_anim)

# ------------------ FOOTER ------------------
st.markdown("---")
st.markdown("<p style='text-align:center;'>🚀 Built for Data Science Project</p>", unsafe_allow_html=True)