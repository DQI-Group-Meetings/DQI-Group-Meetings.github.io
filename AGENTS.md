# Project Context

This repository contains a static Jekyll site for DQI group meeting logs.

## Site

- The site is deployed with GitHub Pages from the `main` branch and `/ (root)`.
- Expected public URL: `https://alves-gabriel.github.io/DQI-group-meetings/`.
- `_config.yml` sets:
  - `url: "https://alves-gabriel.github.io"`
  - `baseurl: "/DQI-group-meetings"`
  - `future: true`

## Content Model

- Meeting entries live in `_events/`.
- Event files use names like `_events/YYYY-MM-DD-speaker-name.md`.
- Event front matter includes `title`, `date`, `speaker`, optional `time`, optional `additional_notes`, optional `tags`, optional `room`, and optional `files`.
- Tags are optional. When present, prefer physics/QI topic labels over event status labels.
- Use domain tags such as `dual-unitary circuits`, `spectral statistics`, `quantum thermodynamics`, `quantum information`, `quantum many-body physics`, `integrability`, `quantum hydrodynamics`, and related topic labels when appropriate.
- Slides, notes, and related assets should go under `assets/files/YYYY-MM-DD/`.
- `files.path` may be either a local `/assets/...` path or an absolute external URL.
- `_includes/general-info.md` contains the short homepage/site description.
- Backlog imports should be done cautiously: start with one event entry and one attachment, verify the site, then batch-convert the rest only after the sample looks correct.

## Documentation Maintenance Directive

- Always keep this file updated when project context changes.
- When changing global features, architecture, deployment behavior, content conventions, or anything important for a future agent to understand, update `AGENTS.md` in the same change.
- When changing anything important for a human maintainer or someone forking the project, also update `instructions/running-the-project.md`.
- Prefer direct, structured notes that are easy for an agent to parse quickly: short sections, concrete file paths, exact commands, and stable URLs.
- Keep human-facing instructions beginner-friendly for someone with programming experience but little web or Jekyll experience.

## Current State

- The first Jekyll meeting calendar site has been pushed.
- GitHub Pages settings have been configured through the repository settings UI.
- The Pages build was observed running after configuration.
- A previous meeting backlog was batch-converted into 45 event files from 2023-05-31 through 2025-11-24.
- The import copied 23 local attachment files into `assets/files/YYYY-MM-DD/` and preserved 4 external presentation URLs.
- Imported meeting rooms are stored in event front matter as `room` and rendered in the event header under the date.
- Calendar, next-meetings, and archive entries are clickable only when the event has associated detail content: at least one `files` item or non-empty Markdown body notes. Events with only front matter render as plain text in lists. In the calendar, clickable entries use a royal-blue pill style and non-clickable entries render as plain text with no background.
- The homepage shows up to three next meetings. Optional `time` and `room` fields are shown only for the immediate next meeting. Optional `additional_notes` is shown for any next-meetings item that has it.
- The homepage includes a Google Calendar subscription notice that links to the external Google Calendar.
- CSS and calendar JavaScript asset URLs include a `?v={{ site.time | date: '%s' }}` cache-busting query string so GitHub Pages/browser caches pick up visual changes after each build.
- Event content can be validated locally with `ruby scripts/validate_events.rb`. The script checks required front matter, filename/date consistency, optional tag/time formatting, missing local file attachments, and missing rooms on future events.
