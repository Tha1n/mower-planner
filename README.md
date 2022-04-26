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

First, you need to create a file that will contains the secrets for Mower-Planner app. This file will be `config/secrets/secrets.env`. App is configure to read it.
The content will be sort of:
```env
WEATHER_API_TOKEN="YourWeatherApiToken"
# My Home Data
WEATHER_API_LAT="Latitude of your Home"
WEATHER_API_LNG="Longitude of your Home"

# Husqvarna APP Data
HUSQ_APP_KEY="Husqvarna API KEY (see Husqvarna docs to know about it)"
HUSQ_APP_SECRET="Husqvarna API SECRET (see Husqvarna docs to know about it)"
# Husqvarna USER Data
HUSQ_USER="Husqvarna user"
HUSQ_PWD="Husqvarna password"
# Husqvarna MOWER Data
HUSQ_MOWER_ID="Your mower ID"
```

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