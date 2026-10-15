from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
import pandas as pd
import numpy as np
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.models import AirQualityObservation, Station, City

def get_historical_analytics(
    db: Session,
    station_id: Optional[int] = None,
    city_name: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    aggregation: str = "daily" # hourly, daily, weekly, monthly
) -> Dict[str, Any]:
    """
    Computes aggregated historical trends, pollutant summary statistics,
    correlation matrices, and detects high pollution peaks.
    """
    query = db.query(AirQualityObservation).join(Station)
    if city_name:
        query = query.join(City).filter(City.name.ilike(f"%{city_name}%"))
    if station_id:
        query = query.filter(AirQualityObservation.station_id == station_id)
    if start_date:
        query = query.filter(AirQualityObservation.timestamp >= start_date)
    if end_date:
        query = query.filter(AirQualityObservation.timestamp <= end_date)

    query = query.order_by(AirQualityObservation.timestamp.asc())
    records = query.all()

    if not records:
        return {
            "city": city_name,
            "station": str(station_id) if station_id else None,
            "total_records": 0,
            "start_time": None,
            "end_time": None,
            "summary_statistics": {},
            "trend_data": [],
            "correlations": None,
            "seasonal_highs": []
        }

    data = [
        {
            "timestamp": r.timestamp,
            "aqi": r.aqi,
            "pm25": r.pm25,
            "pm10": r.pm10,
            "no2": r.no2,
            "so2": r.so2,
            "co": r.co,
            "o3": r.o3,
            "temperature": r.temperature,
            "humidity": r.humidity,
            "wind_speed": r.wind_speed,
            "rainfall": r.rainfall,
        }
        for r in records
    ]
    df = pd.DataFrame(data)

    # 1. Summary Statistics for numerical variables
    pollutants = ["aqi", "pm25", "pm10", "no2", "so2", "co", "o3", "temperature", "humidity"]
    summary_stats = {}
    for p in pollutants:
        if p in df.columns:
            s = df[p].dropna()
            if not s.empty:
                summary_stats[p] = {
                    "mean": round(float(s.mean()), 1),
                    "min": round(float(s.min()), 1),
                    "max": round(float(s.max()), 1),
                    "std": round(float(s.std()), 1),
                    "median": round(float(s.median()), 1),
                }

    # 2. Time-series aggregation (daily, weekly, monthly)
    df["dt"] = pd.to_datetime(df["timestamp"])
    if aggregation == "weekly":
        df["period"] = df["dt"].dt.strftime("%Y-W%U")
    elif aggregation == "monthly":
        df["period"] = df["dt"].dt.strftime("%Y-%m")
    elif aggregation == "hourly":
        df["period"] = df["dt"].dt.strftime("%Y-%m-%d %H:00")
    else: # daily
        df["period"] = df["dt"].dt.strftime("%Y-%m-%d")

    agg_df = df.groupby("period").agg(
        avg_aqi=("aqi", "mean"),
        min_aqi=("aqi", "min"),
        max_aqi=("aqi", "max"),
        avg_pm25=("pm25", "mean"),
        avg_pm10=("pm10", "mean"),
        avg_no2=("no2", "mean"),
        sample_count=("aqi", "count")
    ).reset_index()

    trend_data = [
        {
            "period": row["period"],
            "avg_aqi": round(float(row["avg_aqi"]), 1),
            "min_aqi": round(float(row["min_aqi"]), 1),
            "max_aqi": round(float(row["max_aqi"]), 1),
            "avg_pm25": round(float(row["avg_pm25"]), 1) if pd.notnull(row["avg_pm25"]) else None,
            "avg_pm10": round(float(row["avg_pm10"]), 1) if pd.notnull(row["avg_pm10"]) else None,
            "avg_no2": round(float(row["avg_no2"]), 1) if pd.notnull(row["avg_no2"]) else None,
            "sample_count": int(row["sample_count"]),
        }
        for _, row in agg_df.iterrows()
    ]

    # 3. Correlation Matrix across pollutants and weather
    corr_cols = [c for c in ["pm25", "pm10", "no2", "so2", "co", "o3", "temperature", "humidity", "wind_speed"] if c in df.columns]
    corr_df = df[corr_cols].dropna().corr()
    corr_matrix = {}
    for col in corr_cols:
        corr_matrix[col] = {}
        for row_col in corr_cols:
            val = corr_df.loc[col, row_col] if (col in corr_df.index and row_col in corr_df.columns) else 0.0
            corr_matrix[col][row_col] = round(float(val), 2)

    # 4. Identify high pollution episodes (AQI > 250)
    high_episodes = df[df["aqi"] >= 250].sort_values(by="aqi", ascending=False).head(10)
    seasonal_highs = [
        {
            "timestamp": str(row["timestamp"]),
            "aqi": round(float(row["aqi"]), 1),
            "pm25": round(float(row["pm25"]), 1),
            "pm10": round(float(row["pm10"]), 1),
            "dominant": "PM2.5" if row["pm25"] > 100 else "PM10"
        }
        for _, row in high_episodes.iterrows()
    ]

    return {
        "city": city_name,
        "station": str(station_id) if station_id else None,
        "total_records": len(records),
        "start_time": records[0].timestamp,
        "end_time": records[-1].timestamp,
        "summary_statistics": summary_stats,
        "trend_data": trend_data,
        "correlations": {
            "pollutants": corr_cols,
            "matrix": corr_matrix
        },
        "seasonal_highs": seasonal_highs
    }
