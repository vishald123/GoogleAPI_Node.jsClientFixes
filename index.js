const {google} = require('googleapis');
const path = require('path');

const key = require('./avsar-123-3ca693c19fea.json');
const CALENDAR_ID = 'vishal@avsarinfotech.com';
const jwtClient = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key,
    ['https://www.googleapis.com/auth/admin.directory.user',
        'https://www.googleapis.com/auth/admin.directory.group',    
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/calendar.events.readonly',
        'https://www.googleapis.com/auth/calendar.readonly'
    ]
);
jwtClient.authorize(function (err, tokens) {
    if (err) {
        console.log(err);
    }else{
        //console.log(tokens);
        return;
    }
    
});

  // Make an authorized request to list Calendar events.
//   const calendar = google.calendar('v3');
//     calendar.events.list({
//         auth: jwtClient,
//         calendarId: CALENDAR_ID
//     }, function (err, resp) {
//         if (err) {
//             console.log(err)
//         } else {
//             console.log(resp.data.items);
//         }
//     });

    const calendar = google.calendar('v3');
    calendar.events.insert({
        auth: jwtClient,
        calendarId: CALENDAR_ID,
        fields : '*',
        "resource": {
            "end": {
              "date": "2018-12-18"
            },
            "start": {
              "date": "2018-12-13"
            }
          }
    }, function (err, resp) {
        if (err) {
            console.log(err)
        } else {
            console.log(resp.data);
        }
    });
   

     