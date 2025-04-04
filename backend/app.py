#from markupsafe import escape
from flask import Flask, request, jsonify
import re
import qalsadi.lemmatizer
import arabicstopwords.arabicstopwords as stp
import joblib
import numpy as np
#from tensorflow.keras.models import load_model
#from tensorflow.keras.utils import to_categorical
import tflite_runtime.interpreter as tflite
from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from flask_cors import CORS
import math



def clean_quote(quote:str):
    quote=quote.strip().replace('  ',' ')
    return re.sub(r'[^ء-يa-zA-Z\s]', '', quote)

def remove_stopwords(quote:str):
    return ' '.join([word for word in quote.split() if word not in (stp.STOPWORDS)])

def lemmatize_text(quote:str ):
    lemmer = qalsadi.lemmatizer.Lemmatizer()
    return ' '.join(lemmer.lemmatize_text(quote))

def load_pipeline(load_path='./'):
    interpreter = tflite.Interpreter(model_path=f"{load_path}model.tflite")
    interpreter.allocate_tensors()
    vectorizer = joblib.load(f"{load_path}vectorizer.joblib")
    label_encoder = joblib.load(f"{load_path}label_encoder.joblib")
    return interpreter, vectorizer, label_encoder

def predict_quote_category(quote, interpreter, vectorizer, label_encoder):
    preprocessed_quote = lemmatize_text(remove_stopwords(clean_quote(quote)))
    X = vectorizer.transform([preprocessed_quote]).toarray().astype(np.float32)
    
    # Get input/output details
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    
    # Run inference
    interpreter.set_tensor(input_details[0]['index'], X)
    interpreter.invoke()
    pred_proba = interpreter.get_tensor(output_details[0]['index'])

    # Keep probabilities as floats for sorting
    probabilities = {
        cat: float(prob)
        for cat, prob in zip(label_encoder.classes_, pred_proba[0])
    }
    sorted_probabilities = sorted(
        probabilities.items(),
        key=lambda x: x[1],
        reverse=True
    )

    # Flask expects JSON-serializable types, so ensure all values are proper floats
    formatted_probabilities = [
        {'category': cat, 'probability': prob}
        for cat, prob in sorted_probabilities if cat is not None and not (isinstance(cat, float) and math.isnan(cat))
    ]

    return formatted_probabilities


app = Flask(__name__)
CORS(app)
interpreter, vectorizer, label_encoder = load_pipeline()

@app.route('/')
def index():
    return 'FLASK BACKEND'

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        quote = str(data['quote'])
        print(request.json)
        cleaned_quote=clean_quote(quote)
        without_stopwords_quote=remove_stopwords(cleaned_quote)
        lemmatized= lemmatize_text(without_stopwords_quote)
        probabilities = predict_quote_category(quote, interpreter, vectorizer, label_encoder)[0:5]

        response={
            "cleaned_quote":cleaned_quote,
            "without_stopwords":without_stopwords_quote,
            "normalized":lemmatized,
            "all_probabilities":probabilities
        }
        return response
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400


if __name__=="__main__":
    app.run()
