FROM python:3.9-slim

ENV PYTHONUNBUFFERED True

WORKDIR /app
COPY requirements.txt .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . .
ENV FLASK_APP=src/main.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_DEBUG=True

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0", "--port=8080"]