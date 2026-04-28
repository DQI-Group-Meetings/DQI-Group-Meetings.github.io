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

  function renderCalendar() {
    const monthStart = new Date(visibleYear, visibleMonth, 1);
    const monthEnd = new Date(visibleYear, visibleMonth + 1, 0);
    const leadingDays = (monthStart.getDay() + 6) % 7;
    const totalCells = Math.ceil((leadingDays + monthEnd.getDate()) / 7) * 7;

    title.textContent = monthStart.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric"
    });
    days.innerHTML = "";

    for (let index = 0; index < totalCells; index += 1) {
      const dayNumber = index - leadingDays + 1;
      const date = new Date(visibleYear, visibleMonth, dayNumber);
      const dateKey = sameDateKey(date);
      const dayEvents = eventsForDate(dateKey);
      const cell = document.createElement("div");
      cell.className = "calendar-day";

      if (date.getMonth() !== visibleMonth) {
        cell.classList.add("is-muted");
      }

      if (dateKey === sameDateKey(now)) {
        cell.classList.add("is-today");
      }

      const number = document.createElement("span");
      number.className = "day-number";
      number.textContent = date.getDate();
      cell.appendChild(number);

      dayEvents.forEach((event) => {
        const link = document.createElement("a");
        link.className = "calendar-event";
        link.href = event.url;
        link.textContent = event.speaker ? `${event.speaker}: ${event.title}` : event.title;
        cell.appendChild(link);
      });

      days.appendChild(cell);
    }
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
