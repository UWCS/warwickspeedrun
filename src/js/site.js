/** Animation for the stopwatch **/
function easing(t) {
    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
};

/** Countdown timer **/
const subCloseDate = new Date("{{ sub_close_time }}").getTime();
const countDownDate = new Date("{{ countdown_time }}").getTime();
const endDate = new Date("{{ end_time }}").getTime();

const findPhase = (function () {
    // Find phase and hide correct bits

    // Get today's date and time
    const now = new Date().getTime();

    let phase = "phase-placeholder";
    if (now <= subCloseDate) phase = "phase-sub";
    else if (now <= countDownDate) phase =  phase = {% if schedule %} "phase-schedule" {% else %} "phase-sub-closed" {% endif %};
    else if (now <= endDate) phase = "phase-during";
    else phase = "phase-after";

    setPhase(phase);
});

function setPhase(phase) {
    // Options for possible phases, phase-before is a special case to shorten the many before event options
    let options = ["phase-placeholder", "phase-sub", "phase-sub-closed", "phase-schedule", "phase-before", "phase-during", "phase-ended"]
    const i = options.indexOf(phase)
    const in_before = i != -1 && i <= options.indexOf("phase-before")

    options.map(p => {
        const show = p == phase || (in_before && p == "phase-before")
        Array.prototype.map.call(document.getElementsByClassName(p), e => e.hidden = (!show & !e.classList.contains(phase)))});
    console.log("Phase " + phase);

    let tl = document.getElementById("timeline");
    if (tl) {
        Array.prototype.map.call(tl.getElementsByClassName("tl-elem"), e => { e.hidden = false; e.classList.remove("complete") })
        tl.getElementsByClassName(phase)[0].classList.add("complete");
    }
}



const formatPlural = function(n, term) {
    if (n == 0) return "";
    if (n == 1) return `${n} ${term}`;
    else return `${n} ${term}s`;
}

const listStr = function(parts) {
    if (parts.length == 0) return "";
    if (parts.length == 1) return parts[0];
    var result = parts[0];
    for (var i = 1; i < parts.length-1; i++) {
        result += `, ${parts[i]}`;
    }
    result += ` and ${parts[parts.length-1]}`;
    return result;
}

const listStrNonEmpty = function(parts, max_numb) {
    filtered = parts.filter(Boolean);
    if (filtered.length > max_numb) {
        filtered = filtered.slice(0, max_numb);
    }
    return listStr(filtered);
}


// Update the count down every minute
const countdown = function () {

    // Get today's date and time
    const now = new Date().getTime();

    let subOrEventDate = now <= subCloseDate
    // Find the distance between now and the count down date
    const distance = (subOrEventDate ? subCloseDate : countDownDate) - now;

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / (1000));
    // Display the result in the countdown
    let daysText = formatPlural(days, "day");
    let hoursText = formatPlural(hours, "hour");
    let minutesText = formatPlural(minutes, "minute");
    let secondsText = formatPlural(seconds, "second");

    time_rem_str = listStrNonEmpty([daysText, hoursText, minutesText, secondsText], 2);
    if (days >= 7) time_rem_str = daysText;

    let cd = document.getElementById("countdown");
    if (!cd) return clearInterval(x);
    cd.innerHTML = `<strong>${time_rem_str}</strong>`;
    if (days == 0) {    // Once per sec if close
        clearInterval(x);
        x = setInterval(countdown, 1000);
    }
    // If the count down is finished, clear
    if (distance < 0) {
        clearInterval(x);
        cd.innerHTML = ""
        findPhase();
    }
};

let x = setInterval(countdown, 60000);
countdown();
findPhase();

(function () {
    let elem = document.getElementById('stopwatch-hand');
    if (!elem) return;
    let clock = elem.getBoundingClientRect().bottom;
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