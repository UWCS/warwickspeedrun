/** Animation for the stopwatch **/
function easing(t) {
    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
};

/** Countdown timer **/
const subCloseDate = new Date("{{ sub_close_time }}").getTime();
const countDownDate = new Date("{{ count_down_time }}").getTime();
const endDate = new Date("{{ end_time }}").getTime();

(function () {
    // Find phase and hide correct bits

    // Get today's date and time
    const now = new Date().getTime();

    let phase = "phase-placeholder";
    if (now <= subCloseDate) phase = "phase-sub";
    else if (now <= countDownDate) phase = {% if schedule %} "phase-schedule" {% else %} "phase-sub-closed" {% endif %};
    else if (now <= endDate) phase = "phase-during";
    else phase = "phase-after";

    setPhase(phase);
})();

function setPhase(phase) {
    // Options for possible phases, phase-before is a special case to shorten the many before event options
    let options = ["phase-placeholder", "phase-sub", "phase-sub-closed", "phase-schedule", "phase-during", "phase-ended", "phase-before"]
    options.map(p => Array.prototype.map.call(document.getElementsByClassName(p), e => e.hidden = true));

    Array.prototype.map.call(document.getElementsByClassName(phase), e => e.hidden = false);
    const i = options.indexOf(phase)
    if (i != -1 && i < options.indexOf("phase-during"))
        Array.prototype.map.call(document.getElementsByClassName("phase-before"), e => e.hidden = false);
    console.log("Phase " + phase);
}

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

    document.getElementById("countdown").innerHTML = '<strong id="days">' + (days == 0 ? '' : daysText) + '</strong>' + (
        days >= 7 ? '.' : (days == 0 ? '' : ", ") + '<strong id="hours">' + hoursText + '</strong> and <strong id="mins">' + minutesText + '</strong>')

    // If the count down is finished, clear
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("countdown").innerHTML = ""
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

// For on page schedule, timezone adjusting
function updateTimezone(val) {
    const inp = document.getElementById("offset");
    if (inp.value != val) inp.value = val;

    // Update column header
    const headers = document.getElementsByClassName("timezone-header");
    for (let i = 0; i < headers.length; i++) {
        if (val == 1) headers[i].innerHTML = "BST"
        else headers[i].innerHTML = "UTC" + (val >= 0 ? "+" : "") + val;
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
        let newhr = parseInt(splittime[0]) - 1 + parseInt(val)  // -1 as BST is UTC+1
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
        updateTimezone(tz);
        document.getElementById("schedule").scrollIntoView();
    }
})();