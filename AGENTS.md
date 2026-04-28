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
- Event front matter includes `title`, `date`, `speaker`, `tags`, and optional `files`.
- Slides, notes, and related assets should go under `assets/files/YYYY-MM-DD/`.
- `_includes/general-info.md` contains the short homepage/site description.

## Current State

- The first Jekyll meeting calendar site has been pushed.
- GitHub Pages settings have been configured through the repository settings UI.
- The Pages build was observed running after configuration.
