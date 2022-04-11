let token;

function loginAjax(event) {
    const username = document.getElementById("username").value; // Get the username from the form
    const password = document.getElementById("password").value; // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password };

    fetch("login.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(function(data){
            if(data.success){
            //console.log( "You've been logged in!");
            showEvents();
            document.getElementById("box").hidden = true;
            document.getElementById("event_btn").hidden = false;
            document.getElementById("logout_btn").hidden = false;
            document.getElementById("invite_btn").hidden = false;
            document.getElementById("search").hidden = false;
            token = data.token;
         //console.log(token);
         //updateCalendar();
        } else {
            //console.log(`You were not logged in ${data.message}`);
        }
        });
}




// register a new user
function newregister(username, password) {
    data = {'username': username, 'password': password};
    fetch("register.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
            })
            .then(response => response.json())
            .then(function(data){
                if(data.success == "success"){
                    //console.log( "You've been registered!");
                    //console.log(username, password);
                    //console.log(data);
                    token = data.token;
                    //console.log(token);
                    document.getElementById("box").hidden = true;
                    document.getElementById("event_btn").hidden = false;
                    document.getElementById("logout_btn").hidden = false;
                    document.getElementById("invite_btn").hidden = false;
                    document.getElementById("search").hidden = false;
            } else {
                //console.log(`${data.message}`);
            }
            });
}


// add an event
function addEvent(event) {
    document.getElementById("event_btn").hidden = true;
    document.getElementById("add_event").hidden = false;
    document.getElementById("removeadd").hidden = false;
    document.getElementById("removeadd").addEventListener("click", clearAddEvent, false);
    //console.log("button clicked");
}

// use regex to get the event information
function parseEvent(event) {
    const dateRegex = /(\d{4})-(\d{2})-(\d{2})/g;
    const date = document.getElementById("date").value;
    const dateMatch = dateRegex.exec(date);
    const year = dateMatch[1];
    const month = dateMatch[2];
    const day = dateMatch[3];
    
    const eventName = document.getElementById("event_name").value;
    
    const timeRegex = /(\d{2}):(\d{2})/g;
    const time = document.getElementById("time").value;
    const timeMatch = timeRegex.exec(time);
    let hour = timeMatch[1];
    const minute = timeMatch[2];
    let apm = 0;
    
    if(hour > 12){
        hour = hour - 12;
        apm = 1;
    }
    
    const end_timeRegex = /(\d{2}):(\d{2})/g;
    const endtime = document.getElementById("end_time").value;
    const end_timeMatch = end_timeRegex.exec(endtime);
    let end_hour = end_timeMatch[1];
    const end_minute = end_timeMatch[2];
    let end_apm = 0;
    
    if(end_hour > 12){
        end_hour = end_hour - 12;
        end_apm = 1;
    }
    
    let tag = $('#tag').val();
    //console.log(tag);
    let invite = 1;
    let share = document.getElementById("share").value;
    
    if (share == "") {
        invite = 0;
        //console.log("share is blank");
    }
    
    //console.log("" + month + "/" + day + "/" + year + " " + hour + ":" + minute + " " + apm);
    //console.log(end_hour + ":" + end_minute + " " + apm);
    const data = {'token': token, 'share': share, 'invite': invite, 'tag':tag, 'event_name': eventName, 'year': year, 'month': month, 'day': day, 'hour': hour, 'minute': minute, 'apm': apm, 'end_hour': end_hour, 'end_minute': end_minute, 'end_apm': end_apm};
    
    fetch("addEvent.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
    })
        .then(response => response.json())
        .then(function(data){
            if(data.success){
            //console.log( "Event Successfully Added");
            clearAddEvent();
          
        } else {
            //console.log(`${data.message}`);
            //console.log("fail");
        }
    });
        
    showEvents();
    document.getElementById("event_btn").hidden = false;
    document.getElementById("removeadd").hidden = true;
}

let eventclass = [];

function Event(name, id, year, month, day, hour, minute, apm, end_hour, end_minute, end_apm, tag, share, invite){
    this.name = name;
    this.id = id;
    this.year = year;
    this.month = month;
    this.day = day;
    this.hour = hour;
    this.minute = minute;
    this.apm = apm;
    this.end_hour = end_hour;
    this.end_minute = end_minute;
    this.end_apm = end_apm;
    this.tag = tag;
    this.share = share;
    this.invite = invite;
}

// display events on the calendar
function showEvents() {
    let counter = 0;
    document.getElementById("display_events").innerHTML = "";
    //console.log(eventclass.length);
    for(let j = 0; j < eventclass.length; j++) {
        eventclass[j] = "";
    }
     fetch("displayEvent.php", {
            method: 'POST',
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(function(response){
            const jsonData = response;
            let i = 0;
            while(i < jsonData.multiple.length) {
                //console.log(jsonData.multiple[i]);
                //console.log(jsonData.ids[i]);
                    const year =  jsonData.years[i];
                    const month = jsonData.months[i];
                    const day = jsonData.days[i];
                    const hour = jsonData.hours[i];
                    const minute = jsonData.minutes[i];
                    const apm = jsonData.apms[i];
                    const end_hour = jsonData.end_hours[i];
                    const end_minute = jsonData.end_minutes[i];
                    const end_apm = jsonData.end_apms[i];
                    const tag = jsonData.tags[i];
                    const share = jsonData.shares[i];
                    const invite = jsonData.invites[i];
                eventclass[counter] = new Event(jsonData.multiple[i], jsonData.ids[i], year, month, day, hour, minute, apm, end_hour, end_minute, end_apm, tag, share, invite);              
                counter++;
                i++;
            }
            updateCalendar();
        });
}

// modify an event
function modEvent(eventID) {
    let name = "";
    let year = 0;
    let month = 0;
    let day = 0;
    let hour = 0;
    let minute = 0;
    let apm = 0;
    let end_hour = 0;
    let end_minute = 0;
    let end_apm = 0;
    let tag = 0;
    let invite = 0;
    let share = "";
    for(let i = 0; i < eventclass.length; i++) {
        if(eventclass[i].id == eventID){
             name = eventclass[i].name;
             year = eventclass[i].year;
             month = eventclass[i].month;
             day = eventclass[i].day;
             hour = eventclass[i].hour;
             minute = eventclass[i].minute;
             apm = eventclass[i].apm;
             end_hour = eventclass[i].end_hour;
             end_minute = eventclass[i].end_minute;
             end_apm = eventclass[i].end_apm;
             tag = eventclass[i].tag;
             invite = eventclass[i].invite;
             share = eventclass[i].share;
        }
    }
    
    if(share == null) {
        share = "";
    }
    
    if (hour < 10) {
        hour = "0"+hour;
    }
    if (end_hour < 10) {
        end_hour = "0"+end_hour;
    }
    
    if (minute < 10) {
        minute = "0"+minute;
    }
    if (end_minute < 10) {
        end_minute = "0"+end_minute;
    }
    
    //if (month < 10) {
    //    month = "0"+month;
    //}
    if (day < 10) {
        day = "0"+day;
    }

    if(apm == 0) {apm = "AM";}
    else {apm = "PM";}
    if (end_apm == 0) {end_apm = "AM";}
    else {end_apm = "PM"}
    
    document.getElementById("modify_event").hidden = false;
    document.getElementById("modify_event").innerHTML = "<div id='modeventbox'>Event Name: <input type='text' id='modevent_name' value="+name+" /> <br> Date: <input type='date' id='moddate'  min='0000-01-01' max='2118-10-24' value="+year+"-"+month+"-"+day+" /> <br>Start Time: <input type='time' id='modtime' min='0:00' max='23:59' value="+hour+":"+minute+" required/> <br>End Time: <input type='time' id='modend_time' min='0:00' max='23:59' value="+end_hour+":"+end_minute+" required/> <br>Share Event: <input type='text' id='modshare' value="+share+" ><br><select id='modtag' value="+tag+"><option> </option><option value='holiday'>Holiday</option><option value='birthday'>Birthday</option><option value='exam'>Exam</option><option value='important'>Important</option></select><br><button id='modevent' value="+eventID+">Enter</button><button id='cancel'>Cancel</button></div>";
    document.getElementById("modevent").addEventListener("click", temp, false);
    document.getElementById("cancel").addEventListener("click", clearEdit, false);
}

function temp(e) {
    // console.log(e.target.value);
    modify(e.target.value);
}

// edit an event
function modify(eventID){
    const dateRegex = /(\d{4})-(\d{2})-(\d{2})/g;
    const date = document.getElementById("moddate").value;
    const dateMatch = dateRegex.exec(date);
    const year = dateMatch[1];
    const month = dateMatch[2];
    const day = dateMatch[3];

    const eventName = document.getElementById("modevent_name").value;
    
    const timeRegex = /(\d{2}):(\d{2})/g;
    const time = document.getElementById("modtime").value;
    const timeMatch = timeRegex.exec(time);
    let hour = timeMatch[1];
    const minute = timeMatch[2];
    let apm = 0;
    
    if(hour > 12){
        hour = hour - 12;
        apm = 1;
    }
    
    const end_timeRegex = /(\d{2}):(\d{2})/g;
    const endtime = document.getElementById("modend_time").value;
    const end_timeMatch = end_timeRegex.exec(endtime);
    let end_hour = end_timeMatch[1];
    const end_minute = end_timeMatch[2];
    let end_apm = 0;
    
    if(end_hour > 12){
        end_hour = end_hour - 12;
        end_apm = 1;
    }
    
    let tag = $('#modtag').val();
    
    const share = $('#modshare').val();
    
    let invite = 1;
    
    if (share == "") {
        invite = 0;
        console.log("share is blank");
    }
    
    const data = {'token': token, 'invite': invite, 'share': share, 'event_name': eventName, 'year': year, 'month': month, 'day': day, 'hour': hour, 'minute': minute, 'apm': apm, 'end_hour': end_hour, 'end_minute': end_minute, 'end_apm': end_apm, 'eventID': eventID, 'tag': tag};
    fetch("editEvent.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(function(res) {
            if(res.modified){
            //console.log( "Event Successfully Modified");
            clearModEvent();
            showEvents();
          
            } else {
                //console.log(`${res.message}`);
                //console.log("fail");
            }
        });
}

// clear the values for editing an event
function clearModEvent() {
    document.getElementById("modevent_name").value = "";
    document.getElementById("moddate").value = "";
    document.getElementById("modtime").value = "";
    document.getElementById("modend_time").value = "";
    document.getElementById("modeventbox").hidden = true;
}

// gets the event id to modify the event
function modifyEvents(e) {
    const eventID = e.target.value;
    let x = document.createElement("INPUT");
    x.setAttribute("type", "text");
    
    //need to find the name of the event that has the same id as e.target.value
    
    for(let i = 0; i < eventclass.length; i++){
        if(eventclass[i].id == e.target.value){
            x.setAttribute("value", eventclass[i].name);
        }
    }
    modEvent(eventID);
}

function delEvent (eventID) {
    const data = { 'eventID': eventID, 'token': token};
    for(let i = 0; i < eventclass.length; i++) {
        if(eventclass[i].id == eventID) {
            //console.log(eventclass[i].name);
        }
    }
    fetch("deleteEvent.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' },
        })
        .then(response => response.json())
        .then(function(response){
            if(response.deleted){
                //console.log( "Event Successfully Deleted");
                //console.log(eventclass.length);
                for(let i = 0; i < eventclass.length; i++){
                    if(eventclass[i].id == eventID){
                        eventclass.splice(i, 1);
                        showEvents();
                        //console.log(eventclass.length);
                    }
                }
            } else {
            //console.log("did not delete");
            }   
        });
}

// helper function to get to delete
function deleteEvents(e) {
    //console.log("delete button clicked");
    const eventID = e.target.value;
    delEvent(eventID);
}


(function(){Date.prototype.deltaDays=function(c){return new Date(this.getFullYear(),this.getMonth(),this.getDate()+c)};Date.prototype.getSunday=function(){return this.deltaDays(-1*this.getDay())}})();
function Week(c){this.sunday=c.getSunday();this.nextWeek=function(){return new Week(this.sunday.deltaDays(7))};this.prevWeek=function(){return new Week(this.sunday.deltaDays(-7))};this.contains=function(b){return this.sunday.valueOf()===b.getSunday().valueOf()};this.getDates=function(){for(var b=[],a=0;7>a;a++)b.push(this.sunday.deltaDays(a));return b}}
function Month(c,b){this.year=c;this.month=b;this.nextMonth=function(){return new Month(c+Math.floor((b+1)/12),(b+1)%12)};this.prevMonth=function(){return new Month(c+Math.floor((b-1)/12),(b+11)%12)};this.getDateObject=function(a){return new Date(this.year,this.month,a)};this.getWeeks=function(){var a=this.getDateObject(1),b=this.nextMonth().getDateObject(0),c=[],a=new Week(a);for(c.push(a);!a.contains(b);)a=a.nextWeek(),c.push(a);return c}};

// For our purposes, we can keep the current month in a variable in the global scope
let currentMonth = new Month(2018, 9); // October 2017
const montharr = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// Change the month when the "next" button is pressed
document.getElementById("next_month_btn").addEventListener("click", function(event){
    document.getElementById("days").innerHTML = "";
	currentMonth = currentMonth.nextMonth(); // Previous month would be currentMonth.prevMonth()
	updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
	//alert("The new month is "+currentMonth.month+" "+currentMonth.year);
    document.getElementById("current_month").innerHTML = montharr[currentMonth.month];
    document.getElementById("current_year").innerHTML = currentMonth.year;
}, false);

// Change the month when the "prev" button is pressed
document.getElementById("prev_month_btn").addEventListener("click", function(event){
    document.getElementById("days").innerHTML = "";
	currentMonth = currentMonth.prevMonth(); // Previous month would be currentMonth.prevMonth()
	updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
	//alert("The new month is "+currentMonth.month+" "+currentMonth.year);
    document.getElementById("current_month").innerHTML = montharr[currentMonth.month];
    document.getElementById("current_year").innerHTML = currentMonth.year;
}, false);

let events = [];
function eventsDay(data) {
    fetch("eventOnCalendar.php", {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'content-type': 'application/json' }
            })
            .then(response => response.json())
            .then(function(response){
            const jsonData = response;
            const eventnames =  jsonData.multiple;
            const eventdays = jsonData.event_day;
            //console.log(jsonData);
            for(let j = 0; j <eventnames.length; j++){              
                events[eventdays[j]] = eventnames[j];
            }
    });
}

// view details of the event
function viewtime(e) {
    const eventID = e.target.value;
    for(let i = 0; i < eventclass.length; i ++) {
        let apm = "AM";
        if(eventclass[i].apm == 0) {
            apm = "AM";
        } else {
            apm = "PM";
        }
    
        let endapm = "AM";
        if(eventclass[i].end_apm == 0) {
            endapm = "AM";
        } else {
            endapm = "PM";
        }
        let tag = eventclass[i].tag;
        if(tag == null) {
            tag = "None";
        }
        if(eventclass[i].id == eventID) {
            alert("Name: " + eventclass[i].name +"\n Date: " + eventclass[i].month + "/" + eventclass[i].day + "/" + eventclass[i].year + "\n Time: "+ eventclass[i].hour + ":" + eventclass[i].minute + " " + apm + " - " + eventclass[i].end_hour + ":" + eventclass[i].end_minute + " " + endapm + "\n Tag: " + tag);
        }
    }
}


// This updateCalendar() function only alerts the dates in the currently specified month.  You need to write
// it to modify the DOM (optionally using jQuery) to display the days and weeks in the current month.
function updateCalendar(){
    //events = [];
    document.getElementById("display_events").innerHTML = "";
    //document.getElementById("days").innerHTML = "";
    $("#days").empty();
	let weeks = currentMonth.getWeeks();
    
    const data = {'month': currentMonth.month+1, 'year': currentMonth.year};
    eventsDay(data);
    //console.log(currentMonth);
    let index = 0;
	for(let w in weeks){
		let days = weeks[w].getDates();
        index++;
		// days contains normal JavaScript Date objects.
		//alert("Week starting on "+days[0]);        
		//$("#days").append("<div class='calendar__week'>");
		for(let d in days){         
			// You can see console.log() output in your JavaScript debugging tool, like Firebug,
			// WebWit Inspector, or Dragonfly.
            const dayRegex = /(\d{2})/g;
            const dayMatch = dayRegex.exec(days[d])[1];
            //const data = {'day': dayMatch, 'month': currentMonth.month+1, 'year': currentMonth.year};
            let name ="";
            let namearray = [];
            let count = 0;
            for (let i = 0; i < eventclass.length; ++i) {
                //console.log(eventclass[i].name);
                //console.log(eventclass[i].day + " " + dayMatch);
                    const c = eventclass[i].tag;
                    let color;
                    if (c == 'holiday') {
                        color = 'green';
                    }
                    else if (c == 'birthday') {
                        color = 'pink';
                    }
                    else if (c == 'exam') {
                        color = 'blue';
                    }
                    else if (c == 'important') {
                        color = 'red';
                    }
                    else {
                        color = '#aab2b8';
                    }
                    //console.log(eventclass[i].name + " " + eventclass[i].month);
                    
                if (eventclass[i].day == dayMatch && currentMonth.month+1 == eventclass[i].month && currentMonth.year == eventclass[i].year) {
                    //console.log("entered");
                    if (eventclass[i].day < 7) {
                        if(index > 1) {
                            //console.log("less than 1");
                            //
                        }
                        else {
                            name= name.concat("<div id='eventbox'><span style='color:"+color+";'>" + eventclass[i].name + "</span> <button class='mod' id='modify_btn' value=" + eventclass[i].id +">Edit</button> <button class='del' id='delete_btn' value=" + eventclass[i].id +">Delete</button> <button class='time' id='time_btn' value=" + eventclass[i].id +">View Details</button></div>");
                            name = name.concat("<br>");
                            //console.log(eventclass[i].month);
                            //console.log("greater");
                        }
                        
                    }
                    else if (eventclass[i].day > 23) {
                        if(index < 3) {
                        //
                        }
                        else {
                            name= name.concat("<div id='eventbox'><span style='color:"+color+";'>" + eventclass[i].name + "</span> <button class='mod' id='modify_btn' value=" + eventclass[i].id +">Edit</button> <button class='del' id='delete_btn' value=" + eventclass[i].id +">Delete</button> <button class='time' id='time_btn' value=" + eventclass[i].id +">View Details</button></div>");
                            name = name.concat("<br>");
                            
                        }
                    }
                    else {
                    //sname = name.concat(eventclass[i].name);
                    // name= name.concat("<button class='mod' id='modify_btn' value=" + eventclass[i].id +">" + eventclass[i].name + "</button><p>");
                    name= name.concat("<div id='eventbox'><span style='color:"+color+";'>" + eventclass[i].name + "</span> <button class='mod' id='modify_btn' value=" + eventclass[i].id +">Edit</button> <button class='del' id='delete_btn' value=" + eventclass[i].id +">Delete</button> <button class='time' id='time_btn' value=" + eventclass[i].id +">View Details</button></div>");
                    name = name.concat("<br>");
                    //console.log("work");
                    //name = name + "\n" + "\n";
                    //namearray[count] = name;
                    //count ++;
                    }

                }
            }
                if(name == ""){
                    $("#days").append("<li><div class='box'>" + dayMatch + "</div></li>");
                } else {
                    
                    $("#days").append("<li><div class='box'>" + dayMatch + "<br>" +name + "</div></li>");
                }
            }
	}
            const mod_buttons = document.getElementsByClassName('mod');
            const del_buttons = document.getElementsByClassName('del');
            const time_buttons = document.getElementsByClassName('time');
            for ( let j in Object.keys( mod_buttons ) ) {
                mod_buttons[j].addEventListener("click", modifyEvents, false);
            }
            for ( let k in Object.keys( del_buttons ) ) {
                del_buttons[k].addEventListener("click", deleteEvents, false);
            }
            for ( let m in Object.keys( time_buttons ) ) {
                time_buttons[m].addEventListener("click", viewtime, false);
            }
            
}

// clear the values for adding an event
function clearAddEvent() {
    document.getElementById("event_name").value = "";
    document.getElementById("date").value = "";
    document.getElementById("time").value = "";
    document.getElementById("end_time").value = "";
    document.getElementById("tag").value = "";
    document.getElementById("add_event").hidden = true;
    document.getElementById("event_btn").hidden = false;
}

// clear values upon logout
function clearLogout() {
    document.getElementById("event_name").value = "";
    document.getElementById("date").value = "";
    document.getElementById("time").value = "";
    document.getElementById("end_time").value = "";
    document.getElementById("tag").value = "";
    document.getElementById("add_event").hidden = true;
    document.getElementById("event_btn").hidden = true;
}

function clearEdit() {
    document.getElementById("modify_event").hidden = true;
}

// search by tag
function search(e) {
    document.getElementById("results").innerHTML = "";
    let tag = e.target.value;
    for(let i = 0; i< eventclass.length; i++) {
        if(eventclass[i].tag == tag) {
            $("#results").append(eventclass[i].name + "<button class='timesearch' id='time_btn' value=" + eventclass[i].id +">View Details</button> <br>");
        }
    }
    $("#results").append("<button id='clear_result'>Clear Search Results</button>");
    document.getElementById("clear_result").addEventListener("click", clearSearch, false);
    
    const search_buttons = document.getElementsByClassName("timesearch");
    for ( let m in Object.keys( search_buttons ) ) {
        search_buttons[m].addEventListener("click", viewtime, false);
    }
}

function clearSearch() {
    document.getElementById("results").innerHTML = "";
    document.getElementById("h").checked = false;
    document.getElementById("b").checked = false;
    document.getElementById("i").checked = false;
    document.getElementById("e").checked = false;
}

function logout() {
    fetch("logout.php", {
        method: 'POST',
        headers: { 'content-type': 'application/json' }
    })
        .then(response => response.json())
        .then(function(data){
            if(data.success){
            document.getElementById("password").value = "";
            document.getElementById("username").value = "";
            document.getElementById("display_events").innerHTML = "";
            document.getElementById("days").innerHTML = "";
            document.getElementById("invites").innerHTML = "";
            document.getElementById("new_user").innerHTML = "";
            document.getElementById("new_pwd").innerHTML = "";
            document.getElementById("h").checked = false;
            document.getElementById("b").checked = false;
            document.getElementById("i").checked = false;
            document.getElementById("e").checked = false;
            clearLogout();
            document.getElementById("modify_event").innerHTML = "";
            for (let i = 0; i < eventclass.length; ++i) {
                eventclass[i] = "";
            }
            updateCalendar();
            //document.getElementById("display_events").reset();
          
        } else {
            //console.log(`You were not logged out ${data.message}`);
        }});
        document.getElementById("box").hidden = false;
        document.getElementById("invite_btn").hidden = true;
        document.getElementById("logout_btn").hidden = true;
        document.getElementById("search").hidden = true;      
}


// event listeners for button
document.getElementById("login_btn").addEventListener("click", loginAjax, false); // Bind the AJAX call to button click
document.getElementById("logout_btn").addEventListener("click", logout, false);

document.getElementById("register_btn").addEventListener("click", newregister, false);
document.getElementById("event_btn").addEventListener("click", addEvent);
document.getElementById("enter").addEventListener("click", parseEvent);
document.getElementById("h").addEventListener("click", search);
document.getElementById("b").addEventListener("click", search);
document.getElementById("i").addEventListener("click", search);
document.getElementById("e").addEventListener("click", search);

updateCalendar();

document.getElementById("current_month").innerHTML = montharr[currentMonth.month];
document.getElementById("current_year").innerHTML = currentMonth.year;