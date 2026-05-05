(function () {
  const CURRENT_UTC_TIME_URL = "https://gettimeapi.dev/v1/time?timezone=UTC";
  const events = window.DQI_EVENTS || [];
  const container = document.querySelector(".next-meetings");
  const panel = container ? container.closest(".calendar-panel") : null;

  if (!container || !panel) {
    return;
  }

  function localTodayKey() {
    const now = new Date();
    return [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0")
    ].join("-");
  }

  function timeoutController(milliseconds) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), milliseconds);
    return { controller, timeout };
  }

  async function currentGmtDateKey() {
    const request = timeoutController(2500);

    try {
      const response = await fetch(CURRENT_UTC_TIME_URL, {
        cache: "no-store",
        signal: request.controller.signal
      });

      if (!response.ok) {
        throw new Error(`Time API returned ${response.status}`);
      }

      const data = await response.json();
      if (/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
        return data.date;
      }

      if (data.iso8601) {
        return new Date(data.iso8601).toISOString().slice(0, 10);
      }
    } catch (error) {
      console.warn("Falling back to the browser date for meeting status.", error);
    } finally {
      window.clearTimeout(request.timeout);
    }

    return localTodayKey();
  }

  function formattedDate(dateKey) {
    const date = new Date(`${dateKey}T00:00:00`);
    return date.toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }

  function appendText(parent, text, className) {
    if (!text) {
      return;
    }

    const paragraph = document.createElement("p");
    if (className) {
      paragraph.className = className;
    }
    paragraph.textContent = text;
    parent.appendChild(paragraph);
  }

  function appendLabeledText(parent, label, text) {
    if (!text) {
      return;
    }

    const paragraph = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = `${label}:`;
    paragraph.append(strong, ` ${text}`);
    parent.appendChild(paragraph);
  }

  function renderTitle(parent, event) {
    const heading = document.createElement("h3");

    if (event.url) {
      const link = document.createElement("a");
      link.href = event.url;
      link.textContent = event.title;
      heading.appendChild(link);
    } else {
      const span = document.createElement("span");
      span.className = "event-title-static";
      span.textContent = event.title;
      heading.appendChild(span);
    }

    parent.appendChild(heading);
  }

  function renderEvent(event, index) {
    const article = document.createElement("article");
    article.className = `next-meeting${index === 0 ? " is-immediate" : ""}`;

    const media = document.createElement("div");
    media.className = "event-media";

    const time = document.createElement("time");
    time.dateTime = event.date;
    time.textContent = formattedDate(event.date);
    media.appendChild(time);

    if (index === 0 && event.thumbnailHtml) {
      const thumbnail = document.createElement("template");
      thumbnail.innerHTML = event.thumbnailHtml;
      media.appendChild(thumbnail.content.cloneNode(true));
    }

    const body = document.createElement("div");
    renderTitle(body, event);
    appendText(body, event.speaker, "event-speaker");

    if (index === 0) {
      appendLabeledText(body, "Time", event.time);
      appendLabeledText(body, "Room", event.room);
    }

    appendLabeledText(body, "Notes", event.notes);

    article.append(media, body);
    return article;
  }

  function renderUpcoming(today) {
    const upcoming = events
      .filter((event) => event.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 3);

    container.innerHTML = "";

    const staleEmptyMessage = Array.from(panel.children).find(
      (child) => child.tagName === "P" && child.textContent.trim() === "No upcoming events are listed yet."
    );

    if (staleEmptyMessage) {
      staleEmptyMessage.remove();
    }

    if (!upcoming.length) {
      const empty = document.createElement("p");
      empty.textContent = "No upcoming events are listed yet.";
      panel.appendChild(empty);
      return;
    }

    upcoming.forEach((event, index) => {
      container.appendChild(renderEvent(event, index));
    });
  }

  currentGmtDateKey().then(renderUpcoming);
}());
