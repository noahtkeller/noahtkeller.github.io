mc.factory('Calendar', ['googleCalendar',
    function (googleCalendar) {

        var userCalendars = {};
        var hardCalendars = {};
        var calsubs = [];
        var activeCalendarId = '';

        var CalendarDate = new Date();
        CalendarDate.setHours(0);
        CalendarDate.setMinutes(0);
        CalendarDate.setSeconds(0);
        CalendarDate.setMilliseconds(0);

        var months = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"]; // For formatting

        var monthName = function (month) {
            return months[month];
        };

        var formatDate = function formatDate(millis) {
            // So the formatting stays consistent
            var date = CalendarDate;
            if (typeof millis === 'number')
                date = new Date(millis);
            else if (typeof millis === 'object')
                date = millis;
            var dd = doubleZero(date.getDate());
            var mm = monthName(date.getMonth());
            var year = date.getFullYear();
            return mm + ' ' + dd + ', ' + year;
        };

        var format12Hour = function format12Hour(date) {
            date = date === null || date === undefined ? CalendarDate : date;
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
        };

        var doubleZero = function doubleZero(num, numZeroes) {
            var zeroes = "0";
            if (numZeroes === true)
                zeroes = "00";
            else if (typeof numZeroes === "number")
                for (var i = 2; i <= numZeroes; i++)
                    zeroes += "0";
            if (num < 10 || (numZeroes > 0 || numZeroes === true))
                return (num < 0 ? '-' : '') + zeroes + Math.abs(num);
            return '' + num;
        };

        var dateTimeString = function dateTimeString(date) {
            if (typeof date === "number")
                date = new Date(date);
            date = date === null || date === undefined || !(date instanceof Date) ? CalendarDate : date;
            var dateTimeString = '';
            dateTimeString = date.getFullYear() + '-' + doubleZero((date.getMonth() + 1)) + '-';
            dateTimeString += doubleZero(date.getDate()) + 'T';
            dateTimeString += doubleZero(date.getHours()) + ':' + doubleZero(date.getMinutes());
            dateTimeString += ':' + doubleZero(date.getSeconds()) + '.' + doubleZero(date.getMilliseconds(), true);
            return dateTimeString;
        };

        var listCalendars = function listCalendars() {
            googleCalendar.listCalendars().then(function (cals) {
                cals.forEach(function (cal) {
                    for (var tz in jstz.olson.timezones)
                        if (jstz.olson.timezones[tz] === cal.timeZone)
                            cal.timeZone = doubleZero(parseInt(tz.split(',')[0]) / 60) + ':00';
                    addCalendar({
                        id: cal.id,
                        events: {},
                        timeZone: cal.timeZone
                    });
                    loadAllEvents(cal.id);
                });
            });
        };

        var activeCalendar = function activeCalendar(calId) {
            if (typeof calId === 'string')
                return activeCalendarId = calId;
            if (activeCalendarId === '')
                return null;
            return getById(activeCalendarId);
        };

        var getById = function getById(calendarId) {
            calendarId = calendarId === '' ? activeCalendarId : calendarId;
            for (var uc in userCalendars)
                if (userCalendars[uc].id === calendarId)
                    return userCalendars[uc];
            for (var uc in hardCalendars)
                if (hardCalendars[uc].id === calendarId)
                    return hardCalendars[uc];
            return null;
        };

        var getDate = function getDate() {
            return CalendarDate;
        };

        var setDate = function setDate(newDate) {
            CalendarDate = new Date(Date.parse(newDate));
            loadAllEvents();
        };

        var createEvent = function createEvent(event, callback) {
            if (activeCalendarId === '')
                return;
            var tz = activeCalendar().timeZone;
            event.calendarId = activeCalendarId;
            event.start.dateTime += tz;
            event.end.dateTime += tz;
            console.log(event);
            googleCalendar.createEvent(event).then(callback);
        };

        var loadEvent = function loadEvent(calId, event) {
            calId = calId === null || typeof calId !== "string" ? activeCalendarId : calId;
            getById(calId).events[event.id] = event;
        };

        var loadAllEvents = function loadAllEvents(id) {
            var doLoad = function (id) {
                resetEvents(id);
                var timeMin = dateTimeString(CalendarDate) + getById(id).timeZone;
                var timeMax = dateTimeString(new Date(CalendarDate).setDate(CalendarDate.getDate() + 1)) + getById(id).timeZone;
                googleCalendar.listEvents({
                    calendarId: id,
                    timeMax: timeMax,
                    timeMin: timeMin,
                    singleEvents: true
                }).then(function (events) {
                    events.forEach(function (event) {
                        var startTime = new Date(event.start.dateTime);
                        var endTime = new Date(event.end.dateTime);
                        event.start = format12Hour(startTime);
                        event.end = format12Hour(endTime);
                        loadEvent(id, event);
                    });
                });
            };
            if (id === null || id === undefined) {
                for (var c in userCalendars)
                    doLoad(userCalendars[c].id);
                for (var c in hardCalendars)
                    doLoad(hardCalendars[c].id);
            } else
                doLoad(id);
        };

        var resetEvents = function resetEvents(calId) {
            if (calId !== undefined)
                getById(calId).events = {};
        };

        var getCalendar = function getCalendar(calId, sub, callback) {
            sub = sub === undefined ? false : sub;
            if (typeof sub === 'function')
                calsubs.push(sub);
            var cals = {};
            if (calId === undefined || calId === null) {
                for (var uc in userCalendars)
                    if (cals[uc] === undefined)
                        cals[uc] = userCalendars[uc];
                for (var hc in hardCalendars)
                    if (cals[hc] === undefined)
                        cals[hc] = hardCalendars[hc];
            } else
                cals = getById(calId);

            return typeof callback === 'function' ? callback(cals) : cals;
        };

        var addCalendar = function addCalendar(id, hardCoded) {
            var calendar = typeof id === 'object' ? id : {id: id, timeZone: 'Z', events: {}};
            id = calendar.id;
            hardCoded = hardCoded === undefined ? false : hardCoded;
            for (var s in calsubs)
                if (typeof calsubs[s] === 'function')
                    calsubs[s](calendar);
            if (hardCoded)
                hardCalendars[id] = calendar;
            else
                userCalendars[id] = calendar;
            return calendar;
        };

        return {
            formatDate: formatDate,
            format12Hour: format12Hour,
            dateTimeString: dateTimeString,
            listCalendars: listCalendars,
            activeCalendar: activeCalendar,
            getById: getById,
            getDate: getDate,
            setDate: setDate,
            createEvent: createEvent,
            loadEvent: loadEvent,
            loadAllEvents: loadAllEvents,
            resetEvents: resetEvents,
            getCalendar: getCalendar,
            addCalendar: addCalendar,
            clearUserCalendars: function () {
                userCalendars = {};
            },
            loadHardCalendars: function () {
                console.log('I don\'t know how to load hardcode an account in Angular :(');
            }
        };
    }
]);