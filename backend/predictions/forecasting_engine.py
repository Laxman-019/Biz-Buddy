import pandas as pd
from prophet import Prophet
from businesses.models import BusinessRecord
from predictions.model_manager import save_model
from ml.benchmark_engine import calculate_industry_growth


def train_user_model(user_id):

    records = BusinessRecord.objects.filter(
        user_id=user_id
    ).order_by('date')

    if records.count() < 5:
        return None

    df = pd.DataFrame(list(records.values('date', 'sales')))
    df.columns = ['ds', 'y']

    df['ds'] = pd.to_datetime(df['ds'])

    model = Prophet()
    model.fit(df)

    save_model(model, user_id)



    return model
