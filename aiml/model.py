import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer
import joblib

# Dataset generation functions
def snellen_chart():
    return np.random.choice([2, 1.3333, 1, 0.8, 0.6667, 0.5, 0.4, 0.2857, 0.2, 0.1])

def astigmatism_test():
    return np.random.choice([1, 0])

def blur_sensitivity():
    return np.random.uniform(0.1, 1.0)

def myopia_risk(snellen, astigmatism, blur):
    risk = 0

    # Snellen Chart Risk
    if snellen <= 0.4:
        risk += 2.0  # High risk
    elif 0.4 < snellen <= 0.8:
        risk += 1.0  # Mild risk
    else:
        risk += 0.5  # No risk

    # Astigmatism Risk
    if astigmatism == 1:
        risk += 1  # High risk
    else:
        risk += 0.5  # No risk

    # Blur Sensitivity Risk
    if blur > 0.8:
        risk += 1.8  # High risk
    elif 0.5 < blur <= 0.8:
        risk += 1.0  # Mild risk
    else:
        risk += 0.5  # No risk

    # Normalize risk to range 0 to 1
    normalized_risk = risk / 4.8  # Max possible risk is 5.3

    # Define thresholds for severity levels
    if normalized_risk >= 0.75:
        return "High Risk"
    elif 0.5 <= normalized_risk < 0.80:
        return "Mild Risk"
    else:
        return "No Risk"

# Generate dataset
def generate_dataset(n=1000):
    data = []
    for _ in range(n):
        snellen = snellen_chart()
        astigmatism = astigmatism_test()
        blur = blur_sensitivity()

        myopia = myopia_risk(snellen, astigmatism, blur)

        data.append({
            'Snellen Chart': snellen,
            'Astigmatism': astigmatism,
            'Blur Sensitivity': blur,
            'Myopia Risk': myopia
        })
    return pd.DataFrame(data)

# Generate dataset
df = generate_dataset(n=10000)

# Preprocessing
numerical_features = ['Snellen Chart', 'Blur Sensitivity']
categorical_features = ['Astigmatism']

preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numerical_features),
    ])

# Split data
X = df.drop(columns=['Myopia Risk'])
y = df['Myopia Risk']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Build the TensorFlow model
def build_model(input_shape):
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(64, activation='relu', input_shape=(input_shape,)),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(32, activation='relu'),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(3, activation='softmax')  # 3 output classes
    ])
    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
    return model

# Preprocess data
X_train_processed = preprocessor.fit_transform(X_train)
X_test_processed = preprocessor.transform(X_test)

# Convert target labels to numeric categories
def map_risk_to_numeric(risk):
    mapping = {"No Risk": 0, "Mild Risk": 1, "High Risk": 2}
    return risk.map(mapping)

y_train_numeric = map_risk_to_numeric(y_train)
y_test_numeric = map_risk_to_numeric(y_test)

# Train the model
model = build_model(X_train_processed.shape[1])
model.fit(X_train_processed, y_train_numeric, epochs=10, batch_size=32, validation_split=0.2)

# Save preprocessor
joblib.dump(preprocessor, 'preprocessor.pkl')

# Save model
model.save('myopia_risk_model.h5')

print("Model and preprocessor saved as 'myopia_risk_model.h5' and 'preprocessor.pkl'.")
