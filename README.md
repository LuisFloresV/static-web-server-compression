# Static files web server with built-in compression


This repository is an example implementation of the project described in the repo [streams-workshop](https://github.com/lmammino/streams-workshop)


As usually to experiment with it follow the next steps:

```npm install & npm start```

You will be able to request the static files inside the public folder *(create one and add your files)* that can be served with the next compression:

- br
- gzip
- deflate

Just send a get request to ```localhost:3000/file.ext``` with the Accept-Encoding header

--- 

#### This is only an experiment, not a production version.