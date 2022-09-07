# Resume Website

## Website can be accessed at: michaelcullenpersonal.nw.r.appspot.com

## Description

This is a website built using Flask. It is a simple resume website, that descripes some example projects (with links to github) and a resume and contact page.

![alt text](https://github.com/MichaelCullen2011/ResumeWebsite/blob/main/screenshot.png?raw=true)

## Getting Started

### Installing

To look at the code just fork this repo and install requirements.txt using
```
pip install -r 'src/requirements.txt'
```

### Executing program

To run the Flask server, from the project .venv simply run
```
cd src
python3 flask run main.py --port=8080
```

### Executing program

To push to google app engine
```
cd src
gcloud app deploy --project [GCP_PROJECT_NAME] 
```

### Executing program

To build the Docker container
```
docker build -t resumewebsite .
```

Or to run docker-compose to dynamically update the container with website changes
```
docker-compose build
docker-compose up -d
```

Server can be accessed at localhost:8080 or 127.0.0.1:8080

## Authors

Contributors names and contact info

ex. Michael Cullen
