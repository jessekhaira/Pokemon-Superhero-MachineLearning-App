import keras 
import re 

def data_preprocess_pipeline(text):
    with open('pokemonNames.txt', 'r') as f:
        data = f.read()
    # remove spaces 
    tokenized = text.lower().split('\n')
    # remove empty spaces
    tokenized = list(filter(lambda x: x, tokenized))
    # for sentence in tokenized data
    for i,sentence in enumerate(tokenized):
        tokenized[i] = re.sub(r'\s+', '', sentence)
    return tokenized

def create_poke_maps(text):
    unique_chars = set(text) 
    char_to_index = {c:i for i,c in enumerate(unique_chars)}
    index_to_char = {i:c for i,c in enumerate(unique_chars)}
    return char_to_index, index_to_char

