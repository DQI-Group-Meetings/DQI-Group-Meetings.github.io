# Project Context

This repository contains a static Jekyll site for DQI group meeting logs.

## Site

- The site is deployed with GitHub Pages from the `main` branch and `/ (root)`.
- Expected public URL: `https://dqi-group-meetings.github.io/`.
- `_config.yml` sets:
  - `url: "https://dqi-group-meetings.github.io"`
  - `baseurl: ""`
  - `future: true`

## Content Model

- Meeting entries live in `_events/`.
- Event files use names like `_events/YYYY-MM-DD-speaker-name.md`.
- Event front matter includes `title`, `date`, `speaker`, optional `time`, optional `additional_notes`, optional `tags`, optional `room`, optional `thumbnail`, and optional `files`.
- Tags are optional. When present, prefer physics/QI topic labels over event status labels.
- Use domain tags such as `dual-unitary circuits`, `spectral statistics`, `quantum thermodynamics`, `quantum information`, `quantum many-body physics`, `integrability`, `quantum hydrodynamics`, and related topic labels when appropriate.
- Slides, notes, and related event attachments should go under `assets/files/YYYY-MM-DD/`.
- Custom-picked event thumbnails should go under `assets/thumbnails/YYYY-MM-DD/`.
- When adding a thumbnail, add front matter in this shape:
  `thumbnail: { path: "/assets/thumbnails/YYYY-MM-DD/name.ext", alt: "Short figure description" }`
- When adding a thumbnail, always add this attribution sentence in the event Markdown body, replacing the link label and URL as needed:
  `Thumbnail adapted from [Reference label](https://example.com/reference).`
- For arXiv sources, use a compact label such as:
  `Thumbnail adapted from [arXiv:2604.13027](https://arxiv.org/abs/2604.13027).`
- `files.path` may be either a local `/assets/...` path or an absolute external URL.
- `_includes/general-info.md` contains the short homepage/site description.
- Backlog imports should be done cautiously: start with one event entry and one attachment, verify the site, then batch-convert the rest only after the sample looks correct.

## Documentation Maintenance Directive

- Always keep this file updated when project context changes.
- When changing global features, architecture, deployment behavior, content conventions, or anything important for a future agent to understand, update `AGENTS.md` in the same change.
- When changing anything important for a human maintainer or someone forking the project, also update `instructions/running-the-project.md`.
- Prefer direct, structured notes that are easy for an agent to parse quickly: short sections, concrete file paths, exact commands, and stable URLs.
- Keep human-facing instructions beginner-friendly for someone with programming experience but little web or Jekyll experience.
- Do not add or expose passwords, email addresses, physical addresses, phone numbers, private URLs, tokens, or other private information about individuals or the institution anywhere in the repository. This applies to hidden files, HTML, Markdown, data files, layouts, includes, and all other project files, except for information that is intentionally part of backlog event entries such as speaker names.
- Do not copy copyrighted material into the repository without a clear reference or attribution. If a figure, text snippet, or image is borrowed, cite its source explicitly.
- Before any commit or handoff, scan the repository for accidental private-data leaks. Do this within the project folder without asking for permission.
- Keep commit messages free of sensitive or private information, including personal names, email addresses, file paths that reveal private data, tokens, or other confidential details.

## Current State

- The first Jekyll meeting calendar site has been pushed.
- GitHub Pages settings have been configured through the repository settings UI.
- The Pages build was observed running after configuration.
- A previous meeting backlog was batch-converted into 45 event files from 2023-05-31 through 2025-11-24.
- The import copied 23 local attachment files into `assets/files/YYYY-MM-DD/` and preserved 4 external presentation URLs.
- Imported meeting rooms are stored in event front matter as `room` and rendered in the event header under the date.
- Calendar, next-meetings, and archive entries are clickable only when the event has associated detail content: at least one `files` item or non-empty Markdown body notes. Events with only front matter render as plain text in lists. The homepage calendar is a compact monthly strip that shows only dates with meetings; clickable entries use a royal-blue pill style and non-clickable entries render as plain text with no background.
- The homepage shows up to three next meetings. Optional `time`, `room`, and thumbnail images are shown only for the immediate next meeting. Optional `additional_notes` is shown for any next-meetings item that has it.
- The archive page includes client-side filters for text search, status, and year. Search covers titles, speakers, and tags. Filter behavior lives in `assets/js/archive-filters.js` and uses `data-*` attributes rendered by `archive.html`.
- The homepage includes a Google Calendar subscription notice that links to the external Google Calendar.
- The homepage intro includes a desktop-only decorative circuit SVG from `assets/img/circuit-site.svg`, placed inside the white header box as a translucent background layer.
- The archive header uses `assets/img/lattice-site.svg` as a desktop-only translucent background layer.
- The shared header displays a non-linked Trinity College Dublin SVG logo from `assets/img/trinity-college-dublin-logo.svg` next to the site title. The top-right navigation has a `Search` link pointing to the archive page.
- The browser tab icon uses `assets/img/site-thumbnail.svg`.
- CSS, calendar JavaScript, and archive filter JavaScript asset URLs include a `?v={{ site.time | date: '%s' }}` cache-busting query string so GitHub Pages/browser caches pick up visual changes after each build.
- Event content can be validated locally with `ruby scripts/validate_events.rb`. The script checks required front matter, filename/date consistency, optional tag/time formatting, missing local file attachments, missing local thumbnails, and missing rooms on future events.
