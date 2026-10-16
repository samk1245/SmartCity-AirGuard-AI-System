#!/usr/bin/env python3
"""
SmartCity AirGuard AI — Interactive Command-Line Interface (CLI)
Provides researchers, environmentalists, and engineers direct terminal access
to real-time urban AQI metrics, ML forecasts, and training pipelines.
"""

import argparse
import sys
from datetime import datetime
from app.db.database import SessionLocal
from app.models.models import City, Station, AirQualityObservation
from app.ml.train import train_and_save_model
from app.ml.predict import generate_forecast
from app.services.analytics_service import get_historical_analytics

ASCII_BANNER = r"""
   ___  _        ___                         _     _     ___ 
  / _ \(_)      / _ \                       | |   / \   |_ _|
 / /_\ \_ _ __ / /_\ \_   _  __ _ _ __  __| |  / _ \   | | 
 |  _  | | '__||  _  | | | |/ _` | '__|/ _` | / ___ \  | | 
 | | | | | |   | | | | |_| | (_| | |  | (_| |/ /   \ \_| |_ 
 \_| |_/_|_|   \_| |_/\__,_|\__,_|_|   \__,_//_/     \_\___|
 Intelligent Urban Pollution Prediction & Monitoring Engine
"""

def print_banner():
    print(ASCII_BANNER)

def cmd_current(args):
    db = SessionLocal()
    try:
        query = db.query(Station).filter(Station.is_active == True)
        if args.city and args.city.lower() != "all":
            query = query.join(City).filter(City.name.ilike(f"%{args.city}%"))

        stations = query.all()
        if not stations:
            print(f"[-] No stations found matching city '{args.city}'.")
            return

        print(f"\n[+] Real-Time Urban Observations ({len(stations)} Stations Reporting)")
        print("=" * 80)
        print(f"{'Station Name':<32} {'City':<14} {'AQI':<6} {'Category':<14} {'PM2.5':<8} {'PM10':<8}")
        print("-" * 80)

        for st in stations:
            latest = db.query(AirQualityObservation)\
                .filter(AirQualityObservation.station_id == st.id)\
                .order_by(AirQualityObservation.timestamp.desc())\
                .first()

            if latest:
                c_name = st.city.name if st.city else "India"
                pm25_str = f"{latest.pm25:.1f}" if latest.pm25 else "—"
                pm10_str = f"{latest.pm10:.1f}" if latest.pm10 else "—"
                print(f"{st.name[:30]:<32} {c_name:<14} {int(latest.aqi):<6} {latest.aqi_category:<14} {pm25_str:<8} {pm10_str:<8}")

        print("=" * 80)
    finally:
        db.close()

def cmd_forecast(args):
    db = SessionLocal()
    try:
        station = None
        if args.station:
            station = db.query(Station).filter(
                (Station.code.ilike(args.station)) | (Station.name.ilike(f"%{args.station}%"))
            ).first()
        else:
            station = db.query(Station).first()

        if not station:
            print(f"[-] Station '{args.station}' not found.")
            return

        print(f"\n[+] Generating {args.hours}-Hour Forward Forecast for: {station.name} ({station.city.name if station.city else 'India'})")
        res = generate_forecast(station_id=station.id, horizon_hours=args.hours, db=db)

        print("=" * 75)
        print(f"Current AQI: {int(res['current_aqi'])} ({res['current_category']}) | Model: {res['model_version']}")
        print("-" * 75)
        print(f"{'Horizon':<8} {'Target Time':<22} {'Pred AQI':<10} {'Category':<14} {'90% Conf Bound':<16}")
        print("-" * 75)

        for pt in res['forecasts']:
            t_str = pt['target_time'].strftime("%Y-%m-%d %H:%M")
            conf_str = f"[{pt['confidence_lower']:.0f} - {pt['confidence_upper']:.0f}]"
            print(f"+{pt['horizon_hours']}h{'':<5} {t_str:<22} {int(pt['predicted_aqi']):<10} {pt['predicted_category']:<14} {conf_str:<16}")

        print("=" * 75)
        print(f"[*] Advisory: {res['caveats']}\n")
    finally:
        db.close()

def cmd_train(args):
    print(f"\n[+] Initiating Machine Learning Model Training ({args.algo})...")
    res = train_and_save_model(model_type=args.algo)
    print("\n[+] Model Training Complete!")
    print(f"  • Model Type:      {res['model_name']}")
    print(f"  • Version ID:      {res['version']}")
    print(f"  • Train Samples:   {res['train_samples']:,}")
    print(f"  • Test Samples:    {res['test_samples']:,} (Held-out chronological)")
    print(f"  • MAE:             {res['metrics']['mae']} AQI points")
    print(f"  • Baseline MAE:    {res['metrics']['baseline_mae']} AQI points")
    print(f"  • Improvement:     {res['metrics']['mae_improvement_percent']}% over Baseline Dummy\n")

def main():
    parser = argparse.ArgumentParser(
        description="SmartCity AirGuard AI — Terminal Interface"
    )
    subparsers = parser.add_subparsers(dest="command", help="Available subcommands")

    # Current AQI command
    p_curr = subparsers.add_parser("current", help="Inspect real-time city or national station readings")
    p_curr.add_argument("--city", type=str, default="All", help="Filter by city name (e.g. Delhi, Mumbai, Prayagraj)")

    # Forecast command
    p_fore = subparsers.add_parser("forecast", help="Generate forward multi-horizon predictions")
    p_fore.add_argument("--station", type=str, default="", help="Station code or name (e.g. DEL-AV-01, Civil Lines)")
    p_fore.add_argument("--hours", type=int, default=24, help="Forecast horizon in hours (1-72)")

    # Train command
    p_train = subparsers.add_parser("train", help="Trigger chronological model retraining")
    p_train.add_argument("--algo", type=str, default="HistGradientBoosting", choices=["HistGradientBoosting", "RandomForest"])

    args = parser.parse_args()

    print_banner()

    if args.command == "current":
        cmd_current(args)
    elif args.command == "forecast":
        cmd_forecast(args)
    elif args.command == "train":
        cmd_train(args)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
