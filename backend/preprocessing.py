import re
import qalsadi.lemmatizer
import arabicstopwords.arabicstopwords as stp

def clean_quote(quote:str):
    quote=quote.strip().replace('  ',' ')
    return re.sub(r'[^ء-يa-zA-Z\s]', '', quote)

def remove_stopwords(quote:str):
    return ' '.join([word for word in x.split() if word not in (stp.STOPWORDS)])

def lemmatize_text(quote:str ):str
    lemmer = qalsadi.lemmatizer.Lemmatizer()
    return ' '.join(lemmer.lemmatize_text(quote))

def predict(quote:str):
    #find a way to vectorize the data here, or do the vectorization in an embedding layer of the network?