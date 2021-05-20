FROM python:3.8-slim-buster

COPY ML_Model_Serving/requirements /ml-service/ML_Model_Serving/requirements
COPY ML_Model_Serving/requirements.txt /ml-service/ML_Model_Serving/requirements.txt
WORKDIR /ml-service/ML_Model_Serving

RUN pip3 install -r requirements.txt

# setup.py is in root of directory, have to run dockerfile to containerize flask app in root 
# of directory
COPY ML_Model_Serving .
WORKDIR /ml-service
COPY setup.py .
ENV FLASK_APP=app.py
EXPOSE 5000

RUN pip3 install -e .
WORKDIR /ml-service/ML_Model_Serving
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
