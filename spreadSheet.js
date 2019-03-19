const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/drive',
                'https://www.googleapis.com/auth/spreadsheets'];

const TOKEN_PATH = 'token.json';

fs.readFile('credentials.json',(err, content)=>{
    if (err) return console.log('Err loading client secret file',err);
    authorize(JSON.parse(content), execute);
});

function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]
    );
    fs.readFile(TOKEN_PATH, (err, token)=>{
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    })
}

function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type : 'offline',
        scope : SCOPES
    });
    console.log('Authorize this app by visiting ths url : ', authUrl);
    const rl = readline.createInterface({
        input : process.stdin,
        output : process.stdout
    });
    rl.question('Enter the  code from that page here : ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token',err);
            oAuth2Client.setCredentials(token);
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('token stored to ', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}


function execute(auth) {
    var sheets = google.sheets({version : 'v4', auth});
    sheets.spreadsheets.get({
      "spreadsheetId": "[YOUR-SPREADSHEET-ID]"//TO-DO
    })
        .then(function(response) {
                var url = response.data.spreadsheetUrl;
                url = url.replace(/edit$/, '');
                var url_ext = 'export?exportFormat=pdf&format=pdf&portrait=false'
                url = url + url_ext;
                var file = fs.createWriteStream("landscape.pdf");
                var request = require('request');
                var headers = {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + auth.credentials.access_token,
                        'Content-Type': 'text/pdf'
                    }
                }

                var req = request(url, headers, function (err, res, body) {
                    res.on('data', (d) => {});
                    res.on('end', () => {
                        file.end();
                    })
                }).on('error', (e) => {
                    console.error(e);
                }).pipe(file);
                },
                function (err) {
                    console.error("Execute error", err);
                });
}