import requests
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    classification_report,
    accuracy_score,
    confusion_matrix,
    ConfusionMatrixDisplay
)
from fastapi import FastAPI
from pydantic import BaseModel

API_KEY = "D1D2LDS2J42I144O"
BASE_URL = "https://www.alphavantage.co/query"
SYMBOL = "AAPL"  # Change as needed


def fetch_stock_data(symbol, interval="15min", output_size="full"):
    params = {
        "function": "TIME_SERIES_INTRADAY",
        "symbol": symbol,
        "interval": interval,
        "apikey": API_KEY,
        "outputsize": output_size,
        "datatype": "json"
    }

    response = requests.get(BASE_URL, params=params)
    data = response.json()

    time_series_key = f'Time Series ({interval})'
    if time_series_key not in data:
        raise Exception("Invalid API response or rate limit exceeded")

    df = pd.DataFrame.from_dict(data[time_series_key], orient="index")
    df = df.rename(columns={
        '1. open': 'open',
        '2. high': 'high',
        '3. low': 'low',
        '4. close': 'close',
        '5. volume': 'volume'
    })

    df.index = pd.to_datetime(df.index)
    df = df.sort_index()
    df = df.astype(float)
    return df


def prepare_ml_data(df):
    df['returns'] = df['close'].pct_change()
    df['ma_5'] = df['close'].rolling(window=5).mean()
    df['ma_10'] = df['close'].rolling(window=10).mean()
    df['volatility'] = df['close'].rolling(window=10).std()
    df = df.dropna()

    df['target'] = (df['returns'].shift(-1) > 0).astype(int)

    features = ['open', 'high', 'low', 'close', 'volume', 'ma_5', 'ma_10', 'volatility']
    X = df[features]
    y = df['target']

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, shuffle=False)

    return X_train, X_test, y_train, y_test, df, features


def train_random_forest(X_train, y_train):
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    return model


def evaluate_model(model, X_test, y_test, features):
    y_pred = model.predict(X_test)

    print(" Accuracy Score:", accuracy_score(y_test, y_pred))
    print("\n Classification Report:\n", classification_report(y_test, y_pred))

    cm = confusion_matrix(y_test, y_pred)
    disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=["DOWN", "UP"])
    disp.plot(cmap=plt.cm.Blues)
    plt.title(" Confusion Matrix")
    plt.show()

    importances = model.feature_importances_
    importance_df = pd.DataFrame({
        'Feature': features,
        'Importance': importances
    }).sort_values(by="Importance", ascending=False)

    print("\n Feature Importance:")
    print(importance_df)

    sns.barplot(x="Importance", y="Feature", data=importance_df)
    plt.title(" Feature Importance - Random Forest")
    plt.tight_layout()
    plt.show()

    return y_pred

app = FastAPI()

class PredictionResponse(BaseModel):
    next_movement: str

@app.get("/predict", response_model=PredictionResponse)
def predict():
    df = fetch_stock_data(SYMBOL)
    X_train, X_test, y_train, y_test, df_processed, features = prepare_ml_data(df)
    model = train_random_forest(X_train, y_train)
    latest_input = X_test[-1].reshape(1, -1)
    latest_prediction = model.predict(latest_input)[0]
    movement = "UP" if latest_prediction == 1 else "DOWN"
    return PredictionResponse(next_movement=movement)


if __name__ == "__main__":
    print(" Fetching stock data...")
    df = fetch_stock_data(SYMBOL)

    print(" Preparing dataset...")
    X_train, X_test, y_train, y_test, df_processed, features = prepare_ml_data(df)

    print(" Training Random Forest model...")
    model = train_random_forest(X_train, y_train)

    print(" Evaluating Model:")
    y_pred = evaluate_model(model, X_test, y_test, features)

    latest_input = X_test[-1].reshape(1, -1)
    latest_prediction = model.predict(latest_input)[0]
    print(f"\n Next predicted movement: {' UP' if latest_prediction == 1 else ' DOWN'}")
