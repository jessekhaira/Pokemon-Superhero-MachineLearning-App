# Pokemon & Superhero Machine Learning
## Description
This is a dynamic website I created deploying multiple deep learning models I trained related to my 4 favourite superheros and the popular media franchise Pokémon. The project is deployed and can be played around with at the following URL:  

Specifically, I wanted to determine if an algorithm could recognize my four favourite superheros given images of them. To that end, I scraped images from the web and obtained _ images of each superhero, and took a transfer learned model from xyz and trained it on the scraped data. 

I also trained a language generating model on all the different pokémon names. This model is deployed alongside the superhero recognition model in the app. 

The tech stack used in the project invovled react for the frontend, express for the backend of the app, flask to serve the machine learning models, and various other python libraries for scraping the data and for training the models. So whenever a user sends an HTTP request for a prediction, that prediction goes to the express backend first, where it flows through a stack of middleware functions and if the request is valid, another request is dispatched to the flask backend to the machine learning model. 

For details about the data scraping and machine learning models used, click [here](#ml_models)

## Features 
* User can input images on the home route and send them to an AI algorithm, which will return the superhero it thinks it most likely is
* User can generate new pokemon names
* Random inspirational quotes are pulled from an API by react, stored in a cache and displayed on the language generating models route
* New quotes are pulled from the cache and displayed when the user clicks the "new quote" button 
* Media queries make website responsive 

## Screenshots 


## Machine Learning Models<a name = "ml_models"></a> 
### Language Model
The total number of pokémon names is quite low, sitting at 898. This was not enough to train a deep architecture from scratch, so instead of utilizing a deep architecture, a single GRU cell was used in the model with a small number of hidden units to prevent overfitting. The dimension of the input was also quite low, with the vocabulary formed from the existing names, sitting at 34, so an embedding layer was not used. 

