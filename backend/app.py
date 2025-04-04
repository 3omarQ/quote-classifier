from flask import Flask, request, jsonify
import re
import qalsadi.lemmatizer
import arabicstopwords.arabicstopwords as stp
import joblib
import numpy as np
from flask_cors import CORS
import math
import onnxruntime as ort

# Preprocessing functions remain unchanged
def clean_quote(quote: str):
    quote = quote.strip().replace('  ', ' ')
    return re.sub(r'[^ء-يa-zA-Z\s]', '', quote)

def remove_stopwords(quote: str):
    return ' '.join([word for word in quote.split() if word not in (stp.STOPWORDS)])

def lemmatize_text(quote: str):
    lemmer = qalsadi.lemmatizer.Lemmatizer()
    return ' '.join(lemmer.lemmatize_text(quote))

# Updated loading function
def load_pipeline(load_path='./'):
    sess = ort.InferenceSession(f'{load_path}model.onnx')
    vectorizer = joblib.load(f'{load_path}vectorizer.joblib')
    label_encoder = joblib.load(f'{load_path}label_encoder.joblib')
    return sess, vectorizer, label_encoder

# Updated prediction function
def predict_quote_category(quote, sess, vectorizer, label_encoder):
    preprocessed_quote = lemmatize_text(remove_stopwords(clean_quote(quote)))
    X = vectorizer.transform([preprocessed_quote]).toarray().astype(np.float32)

    input_name = sess.get_inputs()[0].name
    output_name = sess.get_outputs()[0].name
    pred_proba = sess.run([output_name], {input_name: X})[0]

    probabilities = {
        cat: float(prob)
        for cat, prob in zip(label_encoder.classes_, pred_proba[0])
    }
    sorted_probabilities = sorted(
        probabilities.items(),
        key=lambda x: x[1],
        reverse=True
    )

    formatted_probabilities = [
        {'category': cat, 'probability': prob}
        for cat, prob in sorted_probabilities if cat is not None
    ]

    return formatted_probabilities

# Flask app setup remains the same
app = Flask(__name__)
CORS(app)
model_sess, vectorizer, label_encoder = load_pipeline()

@app.route('/')
def index():
    return 'FLASK BACKEND (ONNX)'

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        quote = str(data['quote'])
        cleaned_quote=clean_quote(quote) if quote else ""
        without_stopwords=remove_stopwords(cleaned_quote) if cleaned_quote else ""
        normalized=lemmatize_text(without_stopwords) if without_stopwords else ""
        probabilities = predict_quote_category(quote, model_sess, vectorizer, label_encoder)[0:5]
        
        return jsonify({
            "cleaned_quote":cleaned_quote,
            "without_stopwords":without_stopwords,
            "normalized":normalized,
            "all_probabilities": probabilities
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == "__main__":
    app.run()