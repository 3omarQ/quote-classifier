import tensorflow as tf
import tf2onnx

# Load Sequential model
model = tf.keras.models.load_model('model.keras')

# Convert Sequential to Functional API
input_layer = tf.keras.layers.Input(shape=model.input_shape[1:])
output_layer = model(input_layer)
functional_model = tf.keras.Model(inputs=input_layer, outputs=output_layer)

# Convert to ONNX
spec = [tf.TensorSpec(shape=(None,) + model.input_shape[1:], dtype=tf.float32)]
onnx_model, _ = tf2onnx.convert.from_keras(functional_model, input_signature=spec)

# Save ONNX model
with open("model.onnx", "wb") as f:
    f.write(onnx_model.SerializeToString())