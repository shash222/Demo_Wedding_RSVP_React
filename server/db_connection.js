var mysql = require('mysql');
const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;
const fs = require('fs');
const https = require('https');

const httpsOptions = {
	cert: fs.readFileSync("/etc/letsencrypt/live/hashmi.site/fullchain.pem"),
	key: fs.readFileSync("/etc/letsencrypt/live/hashmi.site/privkey.pem")
}

https.createServer(httpsOptions, app).listen(port);

//app.listen(port);

app.use(cors());
app.use(express.json());


const mysqlConfig = JSON.parse(fs.readFileSync('./mysql_connection_config.txt', 'utf8'))

var connection = mysql.createConnection(mysqlConfig);

connection.connect((err) => {
    if (err) console.log("there was an error");
    
})

function getReturnValue(result){
    var returnValue = {
        success: false,
        name: "",
        city: "",
        email: "",
        dateSubmitted: "",
        dateUpdated: "",
        invitedEvents: [],
        eventsAttending: [],
        numberOfInvitees: {},
        numberAttending: {},
    };

    returnValue.success = true;
    returnValue.name = result[0].FullName;
    returnValue.city = result[0].City;
    returnValue.email = result[0].Email || "";
    var dateSubmitted = result[0].DateSubmitted || "";
    if (dateSubmitted !== ""){
	var dateSubmittedSplit = JSON.stringify(dateSubmitted).split("T");
	returnValue.dateSubmitted = JSON.parse(`${dateSubmittedSplit[0]} ${dateSubmittedSplit[1].substring(0, dateSubmittedSplit[1].indexOf(".000Z"))}"`)
	    
    }
    returnValue.dateUpdated = result[0].DateUpdated || "";
    // var mehndiInv = result[0].MehndiInv;
    var baraatInv = result[0].BaraatInv;
    var walimahInv = result[0].WalimahInv;
    // if (mehndiInv){
    //     returnValue.invitedEvents.push("Mehndi");

    //     // Get number of people invited
    //     returnValue.numberOfInvitees["Mehndi"] = {
    //         total: result[0].TotalGuestsMehndi,
    //         children: result[0].ChildrenInvMehndi,
    //         adults: result[0].AdultsInvMehndi
    //     }

    //     // Get number of people RSVP'd
    //     returnValue.numberAttending["Mehndi"] = {
    //         children: result[0].ChildrenAttMehndi || 0,
    //         adults: result[0].AdultsAttMehndi || 0
    //     }

    //     // Get if family is attending
    //     if (result[0].MehndiAtt) returnValue.eventsAttending.push("Mehndi");
    // }
    if (baraatInv){
        returnValue.invitedEvents.push("Baraat");

        // Get number of people invited
        returnValue.numberOfInvitees["Baraat"] = {
            total: result[0].TotalGuestsBaraat,
            children: result[0].ChildrenInvBaraat,
            adults: result[0].AdultsInvBaraat
        }

        // Get number of people RSVP'd
        returnValue.numberAttending["Baraat"] = {
            children: result[0].ChildrenAttBaraat || 0,
            adults: result[0].AdultsAttBaraat || 0
        }

        // Get if family is attending
        if (result[0].BaraatAtt) returnValue.eventsAttending.push("Baraat");
    } 
    if (walimahInv){
        returnValue.invitedEvents.push("Walimah");

        // Get number of people invited
        returnValue.numberOfInvitees["Walimah"] = {
            total: result[0].TotalGuestsWalimah,
            children: result[0].ChildrenInvWalimah,
            adults: result[0].AdultsInvWalimah
        }

        // Get number of people RSVP'd
        returnValue.numberAttending["Walimah"] = {
            children: result[0].ChildrenAttWalimah || 0,
            adults: result[0].AdultsAttWalimah || 0
        }

        // Get if family is attending
        if (result[0].WalimahAtt) returnValue.eventsAttending.push("Walimah");
    }
    return returnValue;

}

app.get("/api/validateLogin/:name/:city", (req, res) => {
    var name = req.params.name;
    var city = req.params.city;
    var sql = `SELECT * FROM invited WHERE fullname = ? AND city = ? AND active = 1`;
    connection.query(sql, [name, city], (err, result) => {
        var returnValue = "";
        var success = 0;
        if (result.length !== 0){
            success = 1;
            returnValue = getReturnValue(result);
        }
	    console.log(returnValue);
        var accessLogSql = `INSERT INTO accessLog SET Name="${name}", City="${city}", Success=${success}, date="${getDateTime()}"`
        connection.query(accessLogSql, (err, result) => { });
        res.send(returnValue);
    })
})

function getNumberAttendingQuery(numberAttending, invitedEvents){
    var sql = ``;
    Object.keys(numberAttending).map((event) => {
        sql += `ChildrenAtt${event} = ${numberAttending[event].children}, `
        sql += `AdultsAtt${event} = ${numberAttending[event].adults}, `
        invitedEvents.splice(invitedEvents.indexOf(event), 1);
    })
    invitedEvents.map((event) => {
        sql += `ChildrenAtt${event} = 0, `
        sql += `AdultsAtt${event} = 0, `        
    })
    return sql;
}

function getEventsAttendingQuery(eventsAttending, invitedEvents){
    var sql = ``;
    eventsAttending.map((event) => {
        sql += `${event}Att = 1, `;
        invitedEvents.splice(invitedEvents.indexOf(event), 1);
    })
    invitedEvents.map(event => {
        sql += `${event}Att = 0, `;
    })
    return sql;
}

app.post("/api/updateDB", (req, res) => {

    var name = req.body.name;
    var city = req.body.city;
    var email = req.body.email;
    var dateSubmitted = req.body.dateSubmitted;
    var dateUpdated = req.body.dateUpdated;

    // in order to make a copy of req.body.invitedEvents by value and not reference, need to duplicate it as such
    var invitedEvents = [...req.body.invitedEvents];
    var numberAttending = req.body.numberAttending;
    var eventsAttending = req.body.eventsAttending;

    var numberAttendingQuery = getNumberAttendingQuery(numberAttending, invitedEvents);
    invitedEvents = [...req.body.invitedEvents]
    var eventsAttendingQuery = getEventsAttendingQuery(eventsAttending, invitedEvents);
    

    var sql = 
        `UPDATE invited SET Email = "${email}", ${eventsAttendingQuery}${numberAttendingQuery}DateSubmitted = "${dateSubmitted}", DateUpdated = "${dateUpdated}" WHERE FullName = "${name}" And City = "${city}"`;
    console.log("\n\n", sql, "\n\n");
    connection.query(sql, (err) => {
        if (err) res.send("Error");
	else res.send("Success");
    })
})

function getDateTime(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var dayOfMonth = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if (String(month).length === 1) month = "0" + month;
    if (String(dayOfMonth).length === 1) dayOfMonth = "0" + dayOfMonth;
    if (String(hour).length === 1) hour = "0" + hour;
    if (String(minute).length === 1) minute = "0" + minute;
    if (String(second).length === 1) second = "0" + second;
    var dateTime = (`${year}-${month}-${dayOfMonth} ${hour}:${minute}:${second}`)
    return dateTime;
}

