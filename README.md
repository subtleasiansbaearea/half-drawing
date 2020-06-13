# TODO:
required:
[] - add routing via react
nice to have:
[] - make it responsive
[] - clean up code

## About
[Node.js](https://expressjs.com/en/4x/api.html#app) backend, [React](https://reactjs.org/docs/react-api.html) frontend


## Project Structure
- root
  - server.js
  - frontend
    - ~frontend code~

## How to Run locally:
```
npm install
npm run dev
```

## How to Deploy:
This app is deployed on heroku.You will need [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).
```
$ heroku login
$ git add .
$ git commit -am "make it better"
$ git push heroku [branch to deploy]
```
Check https://half-drawing.herokuapp.com/ for updates
Use:
`heroku logs --tail`
to see deployment logs to debug any deployment issues