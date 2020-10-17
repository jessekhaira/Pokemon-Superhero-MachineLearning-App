# Pokemon Machine Learning
## Description
This is a dynamic website I created deploying multiple deep learning models I trained related to the popular media franchise 
Pokémon. 

Specifically, I wanted to determine if an algorithm could recognize the original 156 pokémon given images of them. To that end, I scraped images from the web and obtained _ images of each Pokémon, and took a transfer learned model from xyz and trained it on the scraped data. 

I also wanted to train a language generating model for fun on all the different pokémon names, and see which new names an algorithm could come up with. To this end, I scraped all available pokémon names, and trained a model from scratch on the data. 

The tech stack used in the project includes react for the frontend, express for the backend, and various python libraries for scraping the data and for training the models. The express backend was responsible for providing access to the deep learning models through a REST API. 

The project is deployed and can be played around with at the following URL:  

## Features 
* User can input images on the home route and send them to an AI algorithm, which will return the pokemon it thinks it most likely is
* User can generate new pokemon names
* Random inspirational quotes are pulled from an API by react and displayed on the language generating models route
* Random images are included within the instructions for using the image recongition model, which are pulled from an API by react 

## Screenshots 
