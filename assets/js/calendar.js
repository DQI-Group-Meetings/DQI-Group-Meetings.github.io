(function () {
  const events = window.DQI_EVENTS || [];
  const title = document.getElementById("calendar-title");
  const days = document.getElementById("calendar-days");
  const prev = document.getElementById("prev-month");
  const next = document.getElementById("next-month");
  const todayButton = document.getElementById("today-month");

  const now = new Date();
  let visibleYear = now.getFullYear();
  let visibleMonth = now.getMonth();

  function sameDateKey(date) {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");
  }

  function eventsForDate(dateKey) {
    return events.filter((event) => event.date === dateKey);
  }

  function eventsForMonth() {
    return events.filter((event) => {
      const eventDate = new Date(`${event.date}T00:00:00`);
      return eventDate.getFullYear() === visibleYear && eventDate.getMonth() === visibleMonth;
    });
  }

  function appendEventContent(eventElement, event) {
    if (event.speaker) {
      const speaker = document.createElement("strong");
      speaker.textContent = event.speaker;
      eventElement.appendChild(speaker);
      eventElement.append(event.title);
    } else {
      eventElement.textContent = event.title;
    }
  }

  function renderCalendar() {
    const monthStart = new Date(visibleYear, visibleMonth, 1);
    const monthEvents = eventsForMonth();

    title.textContent = monthStart.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric"
    });
    days.innerHTML = "";

    if (monthEvents.length === 0) {
      const empty = document.createElement("p");
      empty.className = "calendar-empty";
      empty.textContent = "No meetings listed for this month.";
      days.appendChild(empty);
      return;
    }

    const monthDateKeys = [...new Set(monthEvents.map((event) => event.date))];

    monthDateKeys.forEach((dateKey) => {
      const date = new Date(`${dateKey}T00:00:00`);
      const dayEvents = eventsForDate(dateKey);
      const item = document.createElement("article");
      item.className = "calendar-strip-item";

      if (dateKey === sameDateKey(now)) {
        item.classList.add("is-today");
      }

      const dateBlock = document.createElement("time");
      dateBlock.className = "calendar-strip-date";
      dateBlock.dateTime = dateKey;

      const weekday = document.createElement("span");
      weekday.className = "calendar-strip-weekday";
      weekday.textContent = date.toLocaleDateString(undefined, { weekday: "short" });

      const day = document.createElement("span");
      day.className = "calendar-strip-day";
      day.textContent = date.getDate();

      dateBlock.append(weekday, day);
      item.appendChild(dateBlock);

      const eventList = document.createElement("div");
      eventList.className = "calendar-strip-events";

      dayEvents.forEach((event) => {
        const eventElement = document.createElement(event.url ? "a" : "span");
        eventElement.className = event.url ? "calendar-event" : "calendar-event is-static";
        if (event.url) {
          eventElement.href = event.url;
        }
        appendEventContent(eventElement, event);
        eventList.appendChild(eventElement);
      });

      item.appendChild(eventList);
      days.appendChild(item);
    });
  }

  prev.addEventListener("click", () => {
    visibleMonth -= 1;
    if (visibleMonth < 0) {
      visibleMonth = 11;
      visibleYear -= 1;
    }
    renderCalendar();
  });

  next.addEventListener("click", () => {
    visibleMonth += 1;
    if (visibleMonth > 11) {
      visibleMonth = 0;
      visibleYear += 1;
    }
    renderCalendar();
  });

  todayButton.addEventListener("click", () => {
    visibleYear = now.getFullYear();
    visibleMonth = now.getMonth();
    renderCalendar();
  });

  renderCalendar();
}());
