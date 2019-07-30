import { calendar_v3 } from "googleapis";
import CalendarService from "../domain/interfaces/calendar.service";
import CalendarEvent from "../domain/model/calendar-event";

const moment = require("moment");
const fs = require("mz/fs");
const readline = require("readline");
const { google } = require("googleapis");

export default class GoogleCalendarService implements CalendarService {
    get tokenPath(): string {
        return `static/${this.calendarName}-token.json`.replace(/\/-/, "/");
    }
    // If modifying these scopes, delete token.json.
    private SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
    // The file token.json stores the user's access and refresh tokens, and is
    // created automatically when the authorization flow completes for the first
    // time.
    private CREDENTIALS_PATH = "static/credentials.json";

    constructor(private calendarName: string) {}

    public getCalendarName() {
        return this.calendarName;
    }

    public getEventsOfTheDay(): Promise<CalendarEvent[]> {
        return fs
            .readFile(this.CREDENTIALS_PATH)
            .catch((err: string) =>
                Promise.reject(
                    new Error("Error loading client secret file: " + err)
                )
            )
            .then((content: string) => {
                return this.authorize(
                    JSON.parse(content),
                    this.listEvents.bind(this)
                );
                // Authorize a client with credentials, then call the Google Calendar API.
            });
    }

    public createAuthClient(credentials) {
        const {
            client_secret,
            client_id,
            redirect_uris
        } = credentials.installed;
        return new google.auth.OAuth2(
            client_id,
            client_secret,
            redirect_uris[0]
        );
    }

    public askCode(): Promise<string> {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        return new Promise(resolve => {
            rl.question("Enter the code from that page here: ", code => {
                rl.close();
                resolve(code);
            });
        });
    }

    public fetchToken(oAuth2Client, code): Promise<any> {
        return new Promise((resolve, reject) => {
            oAuth2Client.getToken(code, (e, token) => {
                if (e) {
                    return reject(new Error(e));
                }
                // Store the token to disk for later program executions
                fs.writeFile(this.tokenPath, JSON.stringify(token), err => {
                    if (err) {
                        return reject(new Error(err));
                    }
                    console.log("Token stored to", this.tokenPath);
                });
                resolve(token);
            });
        });
    }

    public getRawEvents(auth): Promise<calendar_v3.Schema$Event[]> {
        const calendar = new calendar_v3.Calendar({ auth });
        return new Promise((resolve, reject) =>
            calendar.events.list(
                {
                    calendarId: "primary",
                    singleEvents: true,
                    timeMax: this.endOfDay(new Date()).toISOString(),
                    timeMin: this.startOfDay(new Date()).toISOString()
                },
                (err, res) => {
                    if (err) {
                        reject(new Error("The API returned an error: " + err));
                    }
                    resolve(res.data.items);
                }
            )
        );
    }

    public startOfDay(date: Date): Date {
        return moment
            .utc(date)
            .startOf("day")
            .toDate();
    }

    public endOfDay(date: Date): Date {
        return moment
            .utc(date)
            .endOf("day")
            .toDate();
    }

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    private async authorize(
        credentials,
        callback: (authClient) => any
    ): Promise<CalendarEvent[]> {
        const oAuth2Client = this.createAuthClient(credentials);

        let token;
        try {
            token = await fs.readFile(this.tokenPath);
        } catch {
            token = await this.getAccessToken(oAuth2Client);
        }

        oAuth2Client.setCredentials(JSON.parse(token));
        return callback(oAuth2Client);
    }

    /**
     * Get and store new token after prompting for user authorization
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     */
    private async getAccessToken(oAuth2Client): Promise<any> {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: "offline",
            scope: this.SCOPES
        });
        console.log("Authorize this app by visiting this url:", authUrl);

        const code = await this.askCode();
        return this.fetchToken(oAuth2Client, code);
    }

    /**
     * Lists the events of a day on the user's calendar.
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    private listEvents(auth): Promise<CalendarEvent[]> {
        return this.getRawEvents(auth).then(items =>
            items.map(event => {
                const start = new Date(
                    event.start.dateTime || event.start.date
                );
                return new CalendarEvent(
                    event.summary,
                    start,
                    !!event.start.date
                );
            })
        );
    }
}
