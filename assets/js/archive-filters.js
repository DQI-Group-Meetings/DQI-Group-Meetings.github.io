(function () {
  const CURRENT_UTC_TIME_URL = "https://gettimeapi.dev/v1/time?timezone=UTC";
  const rows = Array.from(document.querySelectorAll(".event-row"));
  const sections = Array.from(document.querySelectorAll(".archive-year"));
  const tagButtons = Array.from(document.querySelectorAll(".tag-button"));
  const emptyMessage = document.getElementById("archive-empty");
  const activeTags = new Set();
  const controls = {
    search: document.getElementById("archive-search"),
    status: document.getElementById("archive-status"),
    year: document.getElementById("archive-year"),
    reset: document.getElementById("archive-reset")
  };

  if (!rows.length || !controls.search) {
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

  function normalize(value) {
    return (value || "").trim().toLowerCase();
  }

  function uniqueValues(attribute) {
    return Array.from(
      new Set(
        rows
          .map((row) => row.dataset[attribute] || "")
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));
  }

  function addOptions(select, values) {
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function rowTags(row) {
    return (row.dataset.tags || "")
      .split("|")
      .map(normalize)
      .filter(Boolean);
  }

  function refreshStatuses(today) {
    rows.forEach((row) => {
      const time = row.querySelector("time[datetime]");
      const eventDate = time ? time.getAttribute("datetime") : "";
      const status = eventDate >= today ? "upcoming" : "past";

      row.dataset.status = status;
      row.classList.toggle("is-upcoming", status === "upcoming");
    });
  }

  function rowMatches(row) {
    const search = normalize(controls.search.value);
    const status = controls.status.value;
    const year = controls.year.value;
    const tags = rowTags(row);

    return (
      (!search || (row.dataset.search || "").includes(search)) &&
      (!status || row.dataset.status === status) &&
      (!year || row.dataset.year === year) &&
      Array.from(activeTags).every((tag) => tags.includes(tag))
    );
  }

  function updateTagButtons() {
    tagButtons.forEach((button) => {
      const isActive = activeTags.has(normalize(button.dataset.tag));
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function updateSections() {
    let visibleRows = 0;

    rows.forEach((row) => {
      const isVisible = rowMatches(row);
      row.hidden = !isVisible;
      if (isVisible) {
        visibleRows += 1;
      }
    });

    sections.forEach((section) => {
      const hasVisibleRows = Array.from(section.querySelectorAll(".event-row")).some(
        (row) => !row.hidden
      );
      section.hidden = !hasVisibleRows;
    });

    if (emptyMessage) {
      emptyMessage.hidden = visibleRows > 0;
    }

    updateTagButtons();
  }

  addOptions(controls.year, uniqueValues("year").reverse());

  [
    controls.search,
    controls.status,
    controls.year
  ].forEach((control) => {
    control.addEventListener("input", updateSections);
    control.addEventListener("change", updateSections);
  });

  tagButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedTag = normalize(button.dataset.tag);
      if (activeTags.has(selectedTag)) {
        activeTags.delete(selectedTag);
      } else {
        activeTags.add(selectedTag);
      }
      updateSections();
    });
  });

  controls.reset.addEventListener("click", () => {
    controls.search.value = "";
    controls.status.value = "";
    controls.year.value = "";
    activeTags.clear();
    updateSections();
    controls.search.focus();
  });

  currentGmtDateKey().then((today) => {
    refreshStatuses(today);
    updateSections();
  });
})();
