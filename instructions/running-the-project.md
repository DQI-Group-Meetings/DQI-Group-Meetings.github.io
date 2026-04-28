# Running and Maintaining This Website

This guide explains how this project works, how to run it locally, and how someone can fork it and publish their own version.

It assumes you have programming experience, but no previous web or Jekyll experience.

## What This Project Is

This repository is a static website for DQI group meeting logs.

"Static" means there is no backend server, database, login system, or runtime application process in production. The site is built from files in this repository into plain HTML, CSS, and JavaScript. GitHub Pages then serves those generated files on the web.

The project uses Jekyll, which is a static site generator. Jekyll reads:

- Markdown files for content.
- HTML layout files for page structure.
- Liquid template code for loops, variables, and includes.
- CSS for styling.
- JavaScript for the interactive calendar.

Then it builds a normal website.

## Prerequisites

Install these before running the project locally:

- Git, for cloning and pushing the repository.
- Ruby, preferably a recent stable Ruby version.
- Bundler, Ruby's dependency manager.
- A terminal.
- A text editor or IDE.

You can check whether Ruby and Bundler are installed with:

```bash
ruby --version
bundle --version
```

If `bundle` is missing, install Bundler with:

```bash
gem install bundler
```

## First-Time Setup

Clone the repository:

```bash
git clone https://github.com/alves-gabriel/DQI-group-meetings.git
cd DQI-group-meetings
```

Install the Ruby dependencies:

```bash
bundle install
```

The dependencies are listed in `Gemfile`. This project currently depends on Jekyll and `webrick`.

## Running the Site Locally

Start the local development server:

```bash
bundle exec jekyll serve
```

Then open this URL in your browser:

```text
http://localhost:4000/DQI-group-meetings/
```

The `/DQI-group-meetings/` part matters because `_config.yml` sets:

```yaml
baseurl: "/DQI-group-meetings"
```

That setting matches the GitHub Pages project URL:

```text
https://alves-gabriel.github.io/DQI-group-meetings/
```

If you fork this repository and rename it, you will probably need to update `baseurl` in `_config.yml`.

## Building Without Serving

To generate the static site without starting a local server, run:

```bash
bundle exec jekyll build
```

Jekyll writes the generated website into `_site/`. You usually do not edit `_site/` directly. Treat it as generated output.

## Project Architecture

The important files and folders are:

```text
.
|-- _config.yml
|-- index.html
|-- archive.html
|-- _events/
|-- _layouts/
|-- _includes/
|-- assets/
|   |-- css/
|   `-- js/
|-- Gemfile
`-- README.md
```

### `_config.yml`

This is the main Jekyll configuration file.

It defines the site title, description, public URL, base URL, and the custom `events` collection:

```yaml
collections:
  events:
    output: true
    permalink: /events/:name/
```

That tells Jekyll to read meeting files from `_events/` and generate a page for each one.

### `index.html`

This is the homepage.

It shows:

- The site intro.
- The next upcoming event.
- The interactive calendar.

The page uses Liquid code to read all events from `site.events`, sort them by date, and pass event data into JavaScript.

### `archive.html`

This page lists all meetings grouped by year.

It uses the same `_events/` data, but presents it as a browsable archive instead of a calendar.

### `_events/`

This folder contains one Markdown file per meeting.

Each event file starts with YAML front matter, followed by the meeting notes. Example:

```yaml
---
title: Tensor Networks Discussion
date: 2026-05-06
speaker: Alice Smith
tags:
  - tensor networks
  - numerics
files:
  - label: Slides
    path: /assets/files/2026-05-06/slides.pdf
---

Short summary of the meeting goes here.
```

The front matter is machine-readable metadata. The text after the second `---` is the human-readable body of the meeting page.

### `_layouts/`

Layouts are reusable page shells.

- `_layouts/default.html` contains the shared HTML document structure, navigation, and stylesheet link.
- `_layouts/event.html` controls how each individual meeting page looks.

Event Markdown files automatically use the `event` layout because `_config.yml` sets that default for the `events` collection.

### `_includes/`

Includes are small reusable content snippets.

`_includes/general-info.md` contains the short description shown on the homepage.

### `assets/css/styles.css`

This file controls the visual design: layout, spacing, colors, calendar styling, event rows, tags, and responsive behavior.

### `assets/js/calendar.js`

This file powers the interactive calendar.

The homepage writes event data into `window.DQI_EVENTS`. The JavaScript reads that data, renders the current month, and updates the calendar when the previous, next, or today buttons are clicked.

## Adding a New Meeting

Create a new file in `_events/`.

Use this naming pattern:

```text
_events/YYYY-MM-DD-speaker-name.md
```

Example:

```text
_events/2026-06-03-jane-doe.md
```

Add front matter:

```yaml
---
title: Meeting Title
date: 2026-06-03
speaker: Jane Doe
tags:
  - topic one
  - topic two
files:
  - label: Slides
    path: /assets/files/2026-06-03/slides.pdf
  - label: Handwritten notes
    path: /assets/files/2026-06-03/notes.pdf
---
```

Then write the notes below the front matter:

```markdown
Short summary of the meeting.

Additional notes, decisions, references, and follow-up items.
```

## Adding Files for a Meeting

Put files in a date-specific folder:

```text
assets/files/YYYY-MM-DD/
```

For example:

```text
assets/files/2026-06-03/slides.pdf
assets/files/2026-06-03/notes.pdf
```

Then reference them from the event front matter:

```yaml
files:
  - label: Slides
    path: /assets/files/2026-06-03/slides.pdf
```

Use paths that start with `/assets/...`. Jekyll's `relative_url` filter will combine those paths with the configured `baseurl`.

## Publishing With GitHub Pages

This repository is designed to publish through GitHub Pages.

For this repository, GitHub Pages should be configured as:

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/ (root)`

After pushing to `main`, GitHub Pages builds and publishes the site.

The expected public URL is:

```text
https://alves-gabriel.github.io/DQI-group-meetings/
```

If you fork the project, your URL will usually look like:

```text
https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPOSITORY-NAME/
```

In that case, update `_config.yml`:

```yaml
url: "https://YOUR-GITHUB-USERNAME.github.io"
baseurl: "/YOUR-REPOSITORY-NAME"
```

Then configure GitHub Pages in the fork's repository settings.

## Common Problems

### The site shows a 404 on GitHub Pages

Check:

- GitHub Pages is enabled in repository settings.
- The source is `Deploy from a branch`.
- The branch is `main`.
- The folder is `/ (root)`.
- The latest Pages build passed in the repository's Actions tab.
- The URL includes the repository name, for example `/DQI-group-meetings/`.

### The local homepage loads without styling

Use the full local URL:

```text
http://localhost:4000/DQI-group-meetings/
```

If you open `http://localhost:4000/` directly, links may not match the configured `baseurl`.

### A future event does not show up

This project sets `future: true` in `_config.yml`, so future-dated events should be included.

If an event is missing, check:

- The file is inside `_events/`.
- The front matter has a valid `date`.
- The file starts and ends its front matter with `---`.
- The local server has refreshed after your edit.

### A file link is broken

Check:

- The file exists under `assets/files/YYYY-MM-DD/`.
- The path in front matter matches the filename exactly.
- The path starts with `/assets/files/...`.

## Suggested Workflow

For ordinary edits:

```bash
git pull
bundle exec jekyll serve
```

Make changes, check them locally in the browser, then:

```bash
git status
git add .
git commit -m "Describe the change"
git push
```

After pushing, check the GitHub Actions tab or GitHub Pages settings to confirm the site rebuilt successfully.
