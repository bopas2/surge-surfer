import numpy as np
import pandas as pd
import sklearn
from sklearn.ensemble import RandomForestClassifier

data = pd.read_csv("data.csv")
data = data.drop(columns=["Unnamed: 0", "driver_id", "ride_id", "event", "timestamp", "ride_distance", "ride_duration", "hour"])
X = data.drop(columns=["ride_prime_time"])
y = data["ride_prime_time"].astype(bool).astype(int)

model = RandomForestClassifier(class_weight={0: 1, 1: 1.1}, min_samples_split=480, random_state=0)
model.fit(X, y)

data2 = data.loc[data["ride_prime_time"] > 0]
X2 = data2.drop(columns=["ride_prime_time"])
y2 = data2["ride_prime_time"]

model2 = RandomForestClassifier(class_weight='balanced', min_samples_leaf=10, min_samples_split=148, random_state=0)
model2.fit(X2, y2)

def predict(day, intervals):
    y_pred = []
    for interval in intervals:
        param = np.array([day, interval]).reshape(1, -1)
        y_pred.append(model.predict(param)[0])
    surge_pred = []
    for i in range(len(intervals)):
        if y_pred[i]:
            param = np.array([day, intervals[i]]).reshape(1, -1)
            surge_pred.append(model2.predict(param)[0])
        else:
            surge_pred.append(0)
    return surge_pred