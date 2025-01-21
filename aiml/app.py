from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from collections import Counter
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)

# Dataset generation functions
def snellen_chart():
    return np.random.choice([2, 1.3333, 1, 0.8, 0.6667, 0.5, 0.4, 0.2857, 0.2, 0.1])

def astigmatism_test():
    return np.random.choice([1, 0])

def blur_sensitivity():
    return np.random.uniform(0.1, 1.0)

def myopia_risk(snellen, astigmatism, blur, age, gender, ethnicity, parental_myopia, screen_time, outdoor_activity,
                posture_scores, sleep_duration, light, diet, BMI, reading_dist):
    risk = 0
    if snellen <= 0.4:
        risk += 1.8
    if astigmatism == 1:
        risk += 1.0
    if blur > 0.7:
        risk += 1.5
    if age < 18:
        risk += 1.0
    if ethnicity == 'Asian':
        risk += 1.0
    if parental_myopia:
        risk += 1.0
    if screen_time > 8:
        risk += 1.0
    if outdoor_activity < 1.5:
        risk += 1.0
    if posture_scores == 'Poor':
        risk += 1.0
    if sleep_duration < 7:
        risk += 1.0
    if light in ['Dim', 'Excessive Blue Light']:
        risk += 1.0
    if diet == 'Poor':
        risk += 1.0
    if BMI == 'Obese':
        risk += 1.0
    if reading_dist == 'Close':
        risk += 1.0

    risk += np.random.uniform(-0.2, 0.2)
    return 1 if risk >= 8.9 else 0

# Generate dataset
def generate_dataset(n=1000):
    data = []
    for _ in range(n):
        snellen = snellen_chart()
        astigmatism = astigmatism_test()
        blur = blur_sensitivity()
        age = np.random.randint(5, 80)
        gender = np.random.choice(['Male', 'Female', 'Others'])
        ethnicity = np.random.choice(['Asian', 'Caucasian', 'Hispanic', 'African American'])
        parental_myopia = np.random.choice([True, False])
        screen_time = np.random.uniform(1, 12)
        outdoor_activity = np.random.uniform(0.5, 4)
        posture_scores = np.random.choice(['Optimal', 'Suboptimal', 'Poor'])
        sleep_duration = np.random.randint(1, 10)
        light = np.random.choice(['Dim', 'Bright', 'Excessive Blue Light'])
        diet = np.random.choice(['Poor', 'Healthy'])
        BMI = np.random.choice(['Obese', 'Normal'])
        reading_dist = np.random.choice(['Close', 'Far', 'Normal'])

        myopia = myopia_risk(snellen, astigmatism, blur, age, gender, ethnicity, parental_myopia, screen_time,
                             outdoor_activity, posture_scores, sleep_duration, light, diet, BMI, reading_dist)

        data.append({
            'Snellen Chart': snellen,
            'Astigmatism': astigmatism,
            'Blur Sensitivity': blur,
            'Age': age,
            'Gender': gender,
            'Ethnicity': ethnicity,
            'Parental Myopia': parental_myopia,
            'Screen Time': screen_time,
            'Outdoor Activity': outdoor_activity,
            'Posture': posture_scores,
            'Sleep Duration': sleep_duration,
            'Lights': light,
            'Diet': diet,
            'BMI': BMI,
            'Reading Distance': reading_dist,
            'Myopia Risk': myopia
        })
    return pd.DataFrame(data)

# Generate dataset
df = generate_dataset(n=10000)

# Preprocessing
categorical_features = ['Gender', 'Ethnicity', 'Parental Myopia', 'Posture', 'Lights', 'Diet', 'BMI', 'Reading Distance']
numerical_features = ['Snellen Chart', 'Astigmatism', 'Blur Sensitivity', 'Age', 'Screen Time', 'Outdoor Activity', 'Sleep Duration']

preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numerical_features),
        ('cat', OneHotEncoder(), categorical_features)
    ])

# Split data
X = df.drop(columns=['Myopia Risk'])
y = df['Myopia Risk']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Build the TensorFlow model
def build_model(input_shape):
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(128, activation='relu', input_shape=(input_shape,)),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(1, activation='sigmoid')
    ])
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    return model

# Preprocess data
X_train_processed = preprocessor.fit_transform(X_train)
X_test_processed = preprocessor.transform(X_test)

# Train the model
model = build_model(X_train_processed.shape[1])
model.fit(X_train_processed, y_train, epochs=10, batch_size=32, validation_split=0.2)

# Flask API
@app.route('/')
def home():
    return "Welcome to the Myopia Risk Prediction API!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        input_data = request.get_json()
        if 'features' not in input_data:
            return jsonify({'error': "Missing 'features' key in the input data"}), 400

        features = input_data['features']
        features_df = pd.DataFrame([features])
        features_processed = preprocessor.transform(features_df)

        prediction = model.predict(features_processed)
        final_prediction = int(prediction[0][0] > 0.5)

        return jsonify({
            'prediction': final_prediction,
            'message': 'Prediction successful'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
