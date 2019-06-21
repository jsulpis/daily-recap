import CalendarEvent from "../domain/model/calendar-event";
import CalendarAgent from "../domain/adapters/calendar-agent";

const moment = require("moment");
const fs = require("mz/fs");
const readline = require("readline");
const { google } = require("googleapis");
import { calendar_v3 } from "googleapis";

export default class GoogleCalendarAgent implements CalendarAgent {
  // If modifying these scopes, delete token.json.
  private SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  private TOKEN_PATH = "static/token.json";
  private CREDENTIALS_PATH = "static/credentials.json";

  getEventsOfTheDay(): Promise<CalendarEvent[]> {
    // Load client secrets from a local file.
    return fs
      .readFile(this.CREDENTIALS_PATH)
      .catch((err: string) =>
        console.error("Error loading client secret file:", err)
      )
      .then((content: string) => {
        return this.authorize(JSON.parse(content), this.listEvents.bind(this));
        // Authorize a client with credentials, then call the Google Calendar API.
      });
  }

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  private authorize(credentials, callback): Promise<CalendarEvent[]> {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Check if we have previously stored a token.
    return fs
      .readFile(this.TOKEN_PATH)
      .catch(err => this.getAccessToken(oAuth2Client, callback))
      .then((token: string) => {
        oAuth2Client.setCredentials(JSON.parse(token));
        return callback(oAuth2Client);
      });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  private getAccessToken(oAuth2Client, callback): Promise<CalendarEvent[]> {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: this.SCOPES
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    return rl.question("Enter the code from that page here: ", code => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error("Error retrieving access token", err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), err => {
          if (err) return console.error(err);
          console.log("Token stored to", this.TOKEN_PATH);
        });
        return callback(oAuth2Client);
      });
    });
  }

  /**
   * Lists the next 10 events on the user's primary calendar.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  private listEvents(auth): Promise<CalendarEvent[]> {
    return this.getRawEvents(auth)
      .then(items =>
        items.map(event => {
          const start = new Date(event.start.dateTime || event.start.date);
          console.log(`${start} - ${event.summary}`);
          return new CalendarEvent(event.summary, start);
        })
      )
      .catch(err => {
        console.error(err);
        return [];
      });
  }

  getRawEvents(auth): Promise<calendar_v3.Schema$Event[]> {
    const calendar = new calendar_v3.Calendar({ auth });
    return new Promise((resolve, reject) =>
      calendar.events.list(
        {
          calendarId: "primary",
          timeMin: this.startOfDay(new Date()).toISOString(),
          timeMax: this.endOfDay(new Date()).toISOString(),
          singleEvents: true
        },
        (err, res) => {
          if (err) reject(new Error("The API returned an error: " + err));
          resolve(res.data.items);
        }
      )
    );
  }

  startOfDay(date: Date): Date {
    return moment
      .utc(date)
      .startOf("day")
      .toDate();
  }

  endOfDay(date: Date): Date {
    return moment
      .utc(date)
      .endOf("day")
      .toDate();
  }
}
