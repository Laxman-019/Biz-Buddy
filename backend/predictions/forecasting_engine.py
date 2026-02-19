import pandas as pd
import numpy as np
from prophet import Prophet
from businesses.models import BusinessRecord
from predictions.model_manager import save_model

MIN_RECORDS_REQUIRED = 60

def train_user_model(user_id):

    records = BusinessRecord.objects.filter(
        user_id=user_id
    ).order_by('date')
    
    total_records = records.count()
    
    # Strict threshold
    
    if total_records < MIN_RECORDS_REQUIRED:
        return {
            "status" : "insufficient_data",
            "requored" : MIN_RECORDS_REQUIRED,
            "avaliable" : total_records
        }

  
    df = pd.DataFrame(list(records.values('date', 'sales')))
    df.columns = ['ds', 'y']

    df['ds'] = pd.to_datetime(df['ds'])
    df = df.sort_values("ds")
    
    # Fill missing dates
    
    df = df.set_index('ds').asfreq('D').fillna(0).reset_index()
    
    # improved prophet config
    model = Prophet(
        daily_seasonality = True,
        weekly_seasonality = True,
        yearly_seasonality = True,
        changepoint_prior_scale = 0.1
    )

    model.fit(df)
    save_model(model, user_id)
    
    # Generate 30 days forecast
    
    future = model.make_future_dataframe(periods=30)
    forecast = model.predict(future)
    
    forecast_30 = forecast.tail(30)
    
    # Calculate trend
    
    trend_change = (
        forecast_30['yhat'].iloc[-1] - forecast_30['yhat'].iloc[0]
    )
    
    trend_direction = "growing" if trend_change > 0 else "declining"
    
    # Confidence Estimation
    
    uncertainty = np.mean(
        forecast_30['yhat_upper'] - forecast_30['yhat_lower']
    )
    
    avg_prediction = np.mean(forecast_30['yhat'])
    
    confidence_score = max(
        0,
        min(
            100,
            100 - ((uncertainty / avg_prediction) * 100)
        )
    )



    return {
        "status" : "success",
        "trend" : trend_direction,
        "trend_value" : float(trend_change),
        "forecast_total" : float(forecast_30['yhat'].sum()),
        "confidence" : round(confidence_score, 2)
    }
