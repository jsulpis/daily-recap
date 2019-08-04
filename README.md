<h1 align="center">Daily recap</h1>

<h3 align="center">Using APIs to gather information about your day and text-to-speech to say it.</h3>

<p align="center">
	<a href="https://travis-ci.org/jsulpis/daily-recap">
		<img alt="Build Status" src="https://travis-ci.org/jsulpis/daily-recap.svg?branch=master" />
	</a>
  <a href="https://sonarcloud.io/dashboard?id=daily-recap">
		<img alt="Quality Gate Status" src="https://sonarcloud.io/api/project_badges/measure?project=daily-recap&metric=alert_status" />
	</a>
  <a href="https://sonarcloud.io/dashboard?id=daily-recap">
		<img alt="Coverage" src="https://sonarcloud.io/api/project_badges/measure?project=daily-recap&metric=coverage" />
	</a>
</p>

<p align="center">
  <img class="repo-preview" src="https://raw.githubusercontent.com/jsulpis/daily-recap/master/preview.png" alt="Screenshot image"/>
</p>

## Features

The program says the followings:

- hello !
- the current date
- the current weather
- the events on your agenda
- the tasks on your todo list

_Note: Your can add more than one agenda and more than one todo lists._

#### Demo
Here is what my Raspberry Pi tells me every morning by running this program in a cron job:

<a href="https://juliensulpis-partage.s3.eu-west-3.amazonaws.com/demo_en.mp3" target="_blank">English</a> - 
<a href="https://juliensulpis-partage.s3.eu-west-3.amazonaws.com/demo_fr.mp3" target="_blank">French</a>

#### Warning 
This program does not work well on Windows, partly because of the `play-sound` library that requires additionnal software and config on Windows. However, you can use the `say` text-to-speech service rather than the Google one and this should work fine. See `index.ts`.



## Installation
```bash
git clone https://github.com/jsulpis/daily-recap.git
cd daily-recap && npm i
```



## Configuration
Since we are using several APIs here, I recommand you set them up one by one and comment some lines in the builder in the `index.ts` file to avoid calling the APIs that are not configured yet.

### Configuring OpenWeatherMap
You just need an API key to be able to use this service. To get one, sign up and follow the instructions on the [online documentation](https://openweathermap.org/api). 

Then put your API key in the `.env` file with the name `OPEN_WEATHER_API_KEY`.

Eventually, just write the name of your city and your country code in the `index.ts` file.

### Configuring Trello
You need an API key as well as a token to use Trello's RESTful API. You can get them [here](https://trello.com/app-key), but read also the [online documentation](https://developers.trello.com/docs/api-introduction).

Once you have your key and token, put them in the `.env` file with the name `TRELLO_API_KEY` and `TRELLO_TOKEN`.

Then, you need to get the id of the list(s) you want to get the cards from. To do this, I suggest you play with the API and get all the lists of your board, and find the ones that interest you. You can get the board id in the url in your board page. Once you have the id of your lists, put them in your `.env` file and reference them in `index.ts` with the name of the lists.

### Configuring Google Agenda
Things are getting a bit more complex when using Google products. Now you have to create a new Cloud Platform project,  enable the Google Calendar API and download the `credentials.json`at the end of this process. Google will tell you better than me how to do this in their [Quickstart Guide](https://developers.google.com/calendar/quickstart/nodejs).

Once you have your `credentials.json` file, put it in a `static` folder and run the program. It should prompt you to authorize the application to use your Google Agenda.

### Configuring Google Text-to-speech
This final step is also a bit tedious. You have to get another json file from Google. To do this, I will let you follow again the [Quickstart guide](https://cloud.google.com/text-to-speech/docs/quickstart-client-libraries#client-libraries-install-nodejs).

Once you have downloaded your json file, put it in the `static` folder and add a `GOOGLE_APPLICATION_CREDENTIALS` key in you `.env` file with the path of your json file.

You should be good to go ! Play with the `index.ts` file and set your locale to hear your daily recap in your language.



## Final steps !

This program brings you the biggest value when it runs every morning. This can be done using a cron job and I personally use my Raspberry PI to host it.

#### Compile the program
I have set up a build config but unfortunately, an error appears in the bundle. You can try it and if you find a workaround, please let me know !

So I just compile the typescript files using `npm run compile` and then copy the `static` folder, `locales` folder and `.env` files in the `dist` folder. It is then ready to start using `node index.js`.

#### Setting up a cron job
On my Raspberry, I have found that in order to play a sound in a cron job, we need to export a variable. So I put this in a `launch.sh` file alongside the other files:
```bash
#!/bin/bash
export XDG_RUNTIME_DIR="/run/user/1000"
cd /home/path/to/dist && /usr/local/bin/node index.js
```
Eventually I run this script in a new cron job that starts every day between monday and friday at 8:30 am. Run the command `crontab -e` to edit your cron jobs and insert the following:
```
30 8 * * 1-5 /home/path/to/launch.sh
```



## Contributing

Contributions are welcome ! If you improve this program, feel free to share it.

1. Fork the project (<https://github.com/jsulpis/daily-recap/fork>)
2. Clone it on your machine (`git clone https://github.com/yourName/daily-recap.git`)
3. Create your feature branch (`git checkout -b feature/awesomeFeature`)
4. Commit your changes (`git commit -am 'Add my awesome feature'`)
5. Push your branch (`git push origin feature/awesomeFeature`)
6. Open a new Pull Request



## License

Released under the [GPL-3.0](https://github.com/jsulpis/daily-recap/blob/master/LICENSE) license.
