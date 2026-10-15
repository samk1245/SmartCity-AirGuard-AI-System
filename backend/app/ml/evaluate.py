import numpy as np
from typing import Dict, Any
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score

def compute_regression_metrics(
    y_true: np.ndarray, 
    y_pred: np.ndarray,
    baseline_pred: np.ndarray = None
) -> Dict[str, Any]:
    """
    Computes standard regression evaluation metrics comparing predictions to ground truth.
    Also calculates percentage improvement over baseline.
    """
    mae = float(mean_absolute_error(y_true, y_pred))
    rmse = float(root_mean_squared_error(y_true, y_pred))
    r2 = float(r2_score(y_true, y_pred))

    # Avoid zero division in MAPE
    mask = y_true > 0
    mape = float(np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])) * 100) if np.any(mask) else 0.0

    metrics = {
        "mae": round(mae, 2),
        "rmse": round(rmse, 2),
        "r2": round(r2, 4),
        "mape_percent": round(mape, 2)
    }

    if baseline_pred is not None:
        base_mae = float(mean_absolute_error(y_true, baseline_pred))
        base_rmse = float(root_mean_squared_error(y_true, baseline_pred))
        mae_improvement = ((base_mae - mae) / base_mae) * 100 if base_mae > 0 else 0.0

        metrics["baseline_mae"] = round(base_mae, 2)
        metrics["baseline_rmse"] = round(base_rmse, 2)
        metrics["mae_improvement_percent"] = round(mae_improvement, 2)

    return metrics
