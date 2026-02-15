import pandas as pd
from prophet import Prophet
from businesses.models import BusinessRecord
from predictions.model_manager import save_model


def train_user_model(user_id):

    records = BusinessRecord.objects.filter(
        user_id=user_id
    ).order_by('date')

    if records.count() < 5:
        return None

    df = pd.DataFrame(list(records.values('date', 'sales')))
    df.columns = ['ds', 'y']

    df['ds'] = pd.to_datetime(df['ds'])
    df = df.sort_values("ds")

    # improved prophet config
    model = Prophet(
        daily_seasonality = True,
        weekly_seasonality = True,
        yearly_seasonality = True
    )

    model.fit(df)
    save_model(model, user_id)



    return model
