# Mower-Planner

## Description

Mower-Planner is a simple API and Cron job based on [NestJS](https://github.com/nestjs/nest) framework.
The goal is to be able to stop or resume an auto-mower activity based on weather forecast and especially rainfall or humidity. Why I needed that ? I live in a wet area with an uneven ground; many times the mower block itself because of ground was too wet. And it becames a pain in the *ss to see on app that it block itself and that I cannot unblock him...
The program is set to wake up at midnight and midday, inspect weather forecast and based on config, stop or resume mower planning. The API doesn't do much ... It is mostly here for testing purpose. But maybe in future a more complex app ?

The service relies on 2 API:
- https://openweathermap.org/ for weather service
- https://developer.husqvarnagroup.cloud/apis for mower service. Especially here Husqvarna mower service.

This project was also the opportunity to test Github Actions and Google Cloud Platform. So excuse me in advance if the quality of each is not "production ready". The app was mostly a playground to discover something else ...

## Technical part

### Installation & running app (locally)

```bash
$ npm install

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Support

Feel free to contribute, share, fork, use this program.