import numpy as np
import pandas as pd
from typing import Tuple, List, Dict, Any

FEATURE_COLUMNS = [
    "hour_sin", "hour_cos",
    "month_sin", "month_cos",
    "day_of_week",
    "aqi_lag_1", "aqi_lag_6", "aqi_lag_12", "aqi_lag_24",
    "aqi_roll_mean_6", "aqi_roll_mean_24", "aqi_roll_std_24",
    "pm25_lag_1", "pm25_lag_24",
    "temperature", "humidity", "wind_speed", "rainfall",
    "station_id"
]

def create_engineered_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Transforms raw air quality and meteorological observations into rich temporal
    and autoregressive features for ML training and forecasting.
    Carefully ensures no future leakage occurs: all rolling windows are closed on left/current.
    """
    df = df.copy()
    if not np.issubdtype(df["timestamp"].dtype, np.datetime64):
        df["timestamp"] = pd.to_datetime(df["timestamp"])

    # Sort strictly chronologically within each station
    df = df.sort_values(by=["station_id", "timestamp"]).reset_index(drop=True)

    # Cyclical hour and month encoding
    hour = df["timestamp"].dt.hour
    month = df["timestamp"].dt.month
    df["hour_sin"] = np.sin(2 * np.pi * hour / 24.0)
    df["hour_cos"] = np.cos(2 * np.pi * hour / 24.0)
    df["month_sin"] = np.sin(2 * np.pi * month / 12.0)
    df["month_cos"] = np.cos(2 * np.pi * month / 12.0)
    df["day_of_week"] = df["timestamp"].dt.dayofweek

    # Station-wise autoregressive lags and rolling statistics
    grouped = df.groupby("station_id")

    df["aqi_lag_1"] = grouped["aqi"].shift(1)
    df["aqi_lag_6"] = grouped["aqi"].shift(6)
    df["aqi_lag_12"] = grouped["aqi"].shift(12)
    df["aqi_lag_24"] = grouped["aqi"].shift(24)

    df["aqi_roll_mean_6"] = grouped["aqi"].transform(lambda s: s.shift(1).rolling(window=6, min_periods=3).mean())
    df["aqi_roll_mean_24"] = grouped["aqi"].transform(lambda s: s.shift(1).rolling(window=24, min_periods=12).mean())
    df["aqi_roll_std_24"] = grouped["aqi"].transform(lambda s: s.shift(1).rolling(window=24, min_periods=12).std().fillna(0))

    df["pm25_lag_1"] = grouped["pm25"].shift(1)
    df["pm25_lag_24"] = grouped["pm25"].shift(24)

    # Handle missing weather or drop initial lag warmup rows
    df = df.dropna(subset=["aqi_lag_24", "aqi"]).reset_index(drop=True)

    # Fill any sparse weather nulls with column medians
    weather_cols = ["temperature", "humidity", "wind_speed", "rainfall"]
    for wc in weather_cols:
        if wc in df.columns:
            df[wc] = df[wc].fillna(df[wc].median())

    return df

def chronological_train_test_split(
    df: pd.DataFrame, 
    test_ratio: float = 0.2
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Splits time series data chronologically across all stations so the model is
    tested strictly on the future held-out time horizon.
    """
    df = df.sort_values(by="timestamp").reset_index(drop=True)
    split_idx = int(len(df) * (1.0 - test_ratio))
    split_timestamp = df.iloc[split_idx]["timestamp"]

    train_df = df[df["timestamp"] < split_timestamp].copy()
    test_df = df[df["timestamp"] >= split_timestamp].copy()

    return train_df, test_df
