FROM python:3.8-slim-buster

COPY requirements /ml-service/requirements
COPY requirements.txt /ml-service
WORKDIR /ml-service

RUN pip3 install -r requirements.txt

COPY . .
ENV FLASK_APP=app.py
EXPOSE 5000

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
