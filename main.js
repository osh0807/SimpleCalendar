let loggedin = sessionStorage.getItem("username","logintrue");
if (loggedin) {
    //hide stuff
        document.getElementById('register').style.display = "none"
        document.getElementById('Login').style.display = "none"
        document.getElementById('logout').style.display = "inline";
}


var d = new Date();
mNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// mSizes = [31,28,31,30,31,30,31,31,30,31,30,31];
// dNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRU', 'SAT'];
getM = d.getMonth();
getY = d.getFullYear();

var calendar = [];

var weeks = [
    $('#1stW')[0],
    $('#2ndW')[0],
    $('#3rdW')[0],
    $('#4thW')[0],
    $('#5thW')[0],
    $('#6thW')[0],
]

$.each(weeks, function (i, v) {

    var week = [];
    $.each(v.children, function (j, w) {
        week.push(w);
    });
    calendar.push(week);
});

var curM = new Month(getY, getM);
updateCalendar();

function updateCalendar() {
    var month = curM.month;
    var year = curM.year;

    var weeks = curM.getWeeks();
    for (var w in weeks) {
        var days = weeks[w].getDates();

        for (var d in days) {
            var day = days[d];
            var date = day.getDate();

            var cell = calendar[w][d];

            

            if (day.getMonth() != month) {
                cell.textContent = "";
            } else {
                var text = document.createTextNode;
                text.id = date;
                cell.textContent = date;
                cell.classList.add("text");

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

            }
        }
    }

    if (weeks.length < 6) {
        for (var d in days) {
            var cell = calendar[5][d];
            cell.textContent = "";
            cell.classList.add("hide");
        }
    }
    else {
        for (var d in days) {
            var cell = calendar[5][d];
            cell.classList.remove("hide");
        }
    }

    document.getElementById("month").textContent = mNames[month];
    document.getElementById("year").textContent = year;
}

document.getElementById("prevM").addEventListener("click", function () {
    curM = curM.prevMonth();
    updateCalendar();
}, false);

document.getElementById("nextM").addEventListener("click", function () {
    curM = curM.nextMonth();
    updateCalendar();
}, false);

document.addEventListener("DOMContentLoaded", updateCalendar, false);




function addEvent(event) {
    let content = document.getElementById("content").value;
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    let data = { 'content': content, 'start': start, 'end': end }
 
    fetch("addEvent.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())

    .then(function (data) {

      console.log(data.success ? "You've been logged in!" : `You were not logged in ${data.message}`)
      if (data.success) {
        alert("added");
        eventShow();
      }
      else {
        alert("try again. (if you are not logged-in, go ahead!");
      }
    });
}
document.getElementById("addbtn").addEventListener("click", addEvent, false);






// function deleteEvent(event) {
//     let content = document.getElementById("content").value;
//     let start = document.getElementById("start").value;
//     let end = document.getElementById("end").value;
//     let data = { 'content': content, 'start': start, 'end': end }
 
//     fetch("deleteEvent.php", {
//         method: 'POST',
//         body: JSON.stringify(data),
//         headers: {
//             'content-type': 'application/json',
//             'Accept': 'application/json'
//         }
//     })
//     .then(response => response.json())

//     .then(function (data) {

//       console.log(data.success ? "You've been logged in!" : `You were not logged in ${data.message}`)
//       if (data.success) {
//         alert("added");
       
//       }
//       else {
//         alert("try again. (if you are not logged-in, go ahead!");
//       }
//     });
// }
// document.getElementById("delete_btn").addEventListener("click", deleteEvent, false);







// function displayEvent() {
//     var year = curM.year;
//     var month = curM.month+1;
//     var dataString = "month=" + encodeURIComponent(month) + "&year=" + encodeURIComponent(year);
//     var xmlHttp = new XMLHttpRequest();
//     xmlHttp.open("POST", "bringEvent.php", true);
//     xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
//     xmlHttp.addEventListener("load", function(event){
//         var jsonData = JSON.parse(event.target.responseText);
//         var numOfEvents = jsonData.length;
//         if (numOfEvents !== 0) {
//           jsonData.forEach(function(sth){
//             var sth= sth;
//             var event_id = sth.enums;
//             var eventcontent = sth.eContents;
//             var day = sth.day;
//             var time = sth.time;
//             var day_id = day;

//             var showcontent = "<div class='events_display'><div class='btn-group'>";
//             showcontent += "<button type='button' id='event"+event_id+"'>"+eventcontent+"</button>";
//             showcontent += "<button type='button' dropdown-toggle dropdown-toggle-split' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><span class='sr-only'>Toggle Dropdown</span></button>";
//             showcontent += "<div class='dropdown-menu'><a class='dropdown-item'><button id='edit"+event_id+"' onClick='edit_event("+event_id+")'>Edit</button><div class='edit_input'><input type='text' size='15' name='name' id='edit_name" + event_id + "' placeholder='name' value='" + eventcontent + "' required/><input type='number' max='9999' min='1' size='10' id='edit_year"+ event_id + "' name='year' value='"+ year+ "' placeholder='year' required/><input type='number' max='12' min='1' size='10' id='edit_month"+ event_id + "' name='month' value='"+ month+ "' placeholder='month' required/><input type='number' max='31' min='1' size='10' id='edit_day"+ event_id + "' name='day' value='"+ day+ "' placeholder='day' required/><input type='time' id='edit_time"+ event_id + "' name='time' value='"+ time+ "' placeholder='time' required/><select name='tag' id='edit_tag"+ event_id +"'><option value='N'>None</option><option value='B'>Business</option><option value='F'>Family</option><option value='S'>School</option></select></div></a>";
            
//             showcontent += "<a class='dropdown-item'><button id='delete"+event_id+"' onClick='delete_event("+event_id+")'>Delete</button></a><div class='dropdown-divider'></div>";
//             showcontent += "<a class='dropdown-item'><button id='share"+event_id+"' onClick='share_event("+event_id+")'>share to</button><input type='text' size='15' name='share_username' id='share_username" + event_id + "' placeholder='username' required/><div class='dropdown-divider'></div></a>";
            
//             showcontent += "<a class='dropdown-item'>Time for this event: "+time+" </a>";
//             showcontent += "</div></div></div>";
//             $('.dropdown-menu select').click(function(e){
//               e.stopPropagation();
//             });
//             if (document.getElementById(id)){
//               document.getElementById(id).innerHTML += showcontent;
//             }
//           });
//         }
//     }, false);
//     xmlHttp.send(dataString);
//   } 
 

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

document.getElementById("search").addEventListener("click", search, false);





function eventShow(usernum){
    // //fetch data from eventFetch.php:
    $.post("bringEvent.php",{
      usernum: usernum,
      processData: false,
      contentType : false,
    },
    function(data){
      var returnData = $.parseJSON(JSON.stringify(data));
      //fetched information:
      var eContents = returnData.eContents;
      var startTs = returnData.startTs;
      var endTs = returnData.endTs;
      var enums = returnData.enums;
      //extract elements needed from HTML:
      var month = document.getElementById("month");
      var year = document.getElementById("year");
      var dates = document.getElementsByClassName("normal");

      for(var i = 0; i < startTs.length; ++i){
        //from each data string, only extract the date, month, year:
        const startRegex = /(\d{4})-(\d{2})-(\d{2}) (\d{2}:\d{2}:\d{2})/g;
        const endRegex = /(\d{2}:\d{2}:\d{2})/g;
        var startTimeArr = startRegex.exec(startTime[i]);
        var endTimeArr = endRegex.exec(endTime[i]);
        console.log(endTimeArr);
        var y = startTimeArr[1]; //year
        var m = startTimeArr[2]; //month
        var d = startTimeArr[3]; //day
        var t = startTimeArr[4];  //time
        var Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        //after extracting, append to the calendar as a child node:
        if(Months[m-1] == month[0] && y === year[0]){
          //button:
          var btn = document.createElement("button");
          var t = document.createTextNode("event");
          btn.appendChild(t);
          btn.setAttribute("class", "eventButton");
          document.getElementById("test").appendChild(btn);
          //info:
          var para = document.createElement("p");
          var t = document.createTextNode("title: " + eContents[i] + "start time: " + startTimeArr[0] + "end time: ");
          para.appendChild(t);
          para.setAttribute("class", "eventInfo");
          btn.appendChild(para);
          //eventnum:
          var p = document.createElement("p");
          var num = document.createTextNode(enums[i]);
          p.appendChild(num);
          p.setAttribute("id", "eventnum");
          btn.appendChild(p);
        }
        //pop up modal for viewing, modifying, and deleting when clicked on an event:
        // $(".eventButton").click(function(event){
        //   //on click, make modal appear/disappear:
        //   var modal = document.getElementById('myModal2');
        //   var span = document.getElementsByClassName("close2")[0];
        //   //add info on the modal:
        //   document.getElementById("eventInfo").textContent = $(this).children(".eventInfo").text();
        //   var e = eventnum[i];
        //   // e.attr('id', 'eventnum');
        //   $(this).append(e);
        //   //make it appear/disappear:s
        //   modal.style.display = "block";
        //   span.onclick = function() {
        //     modal.style.display = "none";
        //   }
        //   event.stopPropagation();
        // });
      }
    });
  }
//   document.addEventListener("DOMContentLoaded", eventShow, false);