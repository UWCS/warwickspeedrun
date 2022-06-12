/** Animation for the stopwatch **/
function easing(t) {
    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
};

/** Countdown timer **/
const subCloseDate = new Date("2022-05-28T23:59:59Z").getTime();
const countDownDate = new Date("2022-06-18T12:00:00Z").getTime();

// Update the count down every 1 second
const x = setInterval(function () {

    // Get today's date and time
    const now = new Date().getTime();

    let subOrEventDate = now <= subCloseDate
    // Find the distance between now and the count down date
    const distance = (subOrEventDate ? subCloseDate : countDownDate) - now;

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    // Display the result in the countdown
    let daysText = days + (days === 1 ? " day" : " days");
    let hoursText = hours + (hours === 1 ? " hour" : " hours");
    let minutesText = minutes + (minutes === 1 ? " minute" : " minutes");

    let subText = subOrEventDate ? '<br><strong>Submissions close</strong> on <strong>{{ subs_close_date }}</strong> ' : ''

    document.getElementById("countdown").innerHTML = '<strong>WASD {{ event_year }}</strong> starts on <strong>{{ event_start_date }}</strong>' + subText + ' in <strong id="days">' + (days == 0 ? '' : daysText) + '</strong>' + (
        days >= 7 ? '.' : (days == 0 ? '' : ", ") + '<strong id="hours">' + hoursText + '</strong> and <strong id="mins">' + minutesText + '</strong>')

    // If the count down is finished, write some text
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("countdown").innerHTML = "WASD is now <strong><a href=\"https://twitch.tv/warwickspeedrun\">live on Twitch</a></strong>!"
    }
}, 1000);

(function () {
    let clock = document.getElementById('stopwatch-hand').getBoundingClientRect().bottom;
    const bodyRect = document.body.getBoundingClientRect().y;
    const clockBottom = clock - bodyRect;

    document.addEventListener('scroll', function (event) {
        let angle = easing((clockBottom - window.scrollY) / clockBottom);
        angle = 360 - (360 * angle);

        document.documentElement.style.setProperty('--stopwatch-rotation', angle + 'deg');
    });
})();

(function () {
    let clock = document.getElementById('stopwatch-hand').getBoundingClientRect().bottom;
    const bodyRect = document.body.getBoundingClientRect().y;
    const clockBottom = clock - bodyRect;

    document.addEventListener('scroll', function (event) {
        let angle = easing((clockBottom - window.scrollY) / clockBottom);
        angle = 360 - (360 * angle);

        document.documentElement.style.setProperty('--stopwatch-rotation', angle + 'deg');
    });
})();

function updateTimezone(val) {
    // Update column header
    const headers = document.getElementsByClassName("timezone-header");
    for (let i = 0; i < headers.length; i++) {
        headers[i].innerHTML = "UTC" + (val >= 0 ? "+" : "") + val;
    }
    
    // Init vars
    let dayind = -1;
    let prevhr = 25;
    const days = ["Fri", "Sat", "Sun", "Mon"]

    // Update rows
    const rows = document.getElementsByClassName("sch-row");
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        // Get time
        const bsttime = row.getElementsByClassName("bst-time")[0].innerHTML;
        const splittime = bsttime.split(":");
        
        // Update time
        let newhr = parseInt(splittime[0]) + parseInt(val)
        if (dayind == -1) dayind = newhr < 0 ? 0 : 1; // Initialize day index to Fri or Sat depending on first val

        if (newhr < 0) newhr += 24
        else if (newhr >= 24) newhr -= 24
        
        // Include day on day change
        let day = ""
        if (prevhr > newhr) {
            day = days[dayind] + "\n"
            dayind += 1;
        }
        // Construct new time
        const newtime = day + (newhr + ":" + splittime[1]);
        row.getElementsByClassName("var-time")[0].innerText = newtime;
        prevhr = newhr;
        
        // Update url to match
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("tz", val);
        history.replaceState(null, null, "?"+urlParams.toString());
    }
}

(function () {
    // On load, read timezone from url
    const urlParams = new URLSearchParams(window.location.search);
    const tz = urlParams.get("tz");
    if (tz !== null) {
        document.getElementById("offset").value = tz;
        updateTimezone(tz);
        document.getElementById("schedule").scrollIntoView();
    }
})();