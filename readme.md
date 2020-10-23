# Pokemon & Superhero Machine Learning
## Description
This is a dynamic website I created deploying multiple deep learning models I trained related to my 4 favourite superheros and the popular media franchise Pokémon.

Specifically, I wanted to determine if an algorithm could recognize my four favourite superheros given images of them. To that end, I scraped images from the web and obtained _ images of each superhero, and took a transfer learned model from xyz and trained it on the scraped data. 

I also trained a language generating model on all the different pokémon names. This model is deployed alongside the superhero recognition model in the app. 

The tech stack used in the project includes react for the frontend, express for the backend of the app, flask to serve the machine learning models, and various other python libraries for scraping the data and for training the models. So whenever a user sends an HTTP request for a prediction, that prediction goes to the express backend first, where it flows through a stack of middleware functions and if the request is valid, another request is dispatched to the flask backend to the machine learning model. 

The project is deployed and can be played around with at the following URL:  

## Features 
* User can input images on the home route and send them to an AI algorithm, which will return the superhero it thinks it most likely is
* User can generate new pokemon names
* Random inspirational quotes are pulled from an API by react and displayed on the language generating models route
* New quotes are able to be pulled from the API (if they don't already exist on the cache) or are pulled from the cache when the user clicks the "new quote" button 

## Screenshots 
