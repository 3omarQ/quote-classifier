import tensorflow as tf

# Load your original Keras model
model = tf.keras.models.load_model("model.keras")

# Convert to TFLite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

# Save the new model
with open("model.tflite", "wb") as f:
    f.write(tflite_model)

print("Model converted successfully!")