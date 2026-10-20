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
git clone https://github.com/DQI-Group-Meetings/DQI-Group-Meetings.github.io.git
cd DQI-Group-Meetings.github.io
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

Maintainers and coding agents should run a local server after content, documentation, layout, style, or behavior changes whenever the environment permits it. A host-bound command that works well for local testing is:

```bash
bundle exec jekyll serve --host 127.0.0.1
```

Then open this URL in your browser:

```text
http://localhost:4000/
```

The site is served from the root path because `_config.yml` sets:

```yaml
baseurl: ""
```

That setting matches the GitHub Pages organization site URL:

```text
https://dqi-group-meetings.github.io/
```

If you fork this repository as a project site instead of an organization root site, you will probably need to update `baseurl` in `_config.yml`.

## Building Without Serving

To generate the static site without starting a local server, run:

```bash
bundle exec jekyll build
```

Jekyll writes the generated website into `_site/`. You usually do not edit `_site/` directly. Treat it as generated output.

## Validating Meeting Content

Run the event validation script before committing meeting changes:

```bash
ruby scripts/validate_events.rb
```

The script checks:

- Every event has `title`, `date`, and `speaker`.
- The date in the filename matches the `date` field in front matter.
- If `tags` is present, it is written as a YAML list.
- If `time` is present, it uses 24-hour `HH:MM` format.
- If `additional_notes` is present, it is written as a string.
- Local file links in `files.path` point to files that exist under `assets/`.
- If `thumbnail` is present and points to a local file, that file exists.
- Future events have a `room` value.

If the script reports issues, fix the listed event files and run it again.

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
|   |-- thumbnails/
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
- The next upcoming meetings.
- The interactive calendar.

The page uses Liquid code to read all events from `site.events`, sort them by date, and pass event data into JavaScript. Liquid renders a build-time fallback for the next-meetings list, then `assets/js/upcoming-meetings.js` re-renders that list in the browser from the current GMT/UTC date so meetings move from upcoming to past without waiting for a GitHub Pages rebuild.

The browser script first requests `https://gettimeapi.dev/v1/time?timezone=UTC`, which documents CORS support for browser GET requests. If that request fails, it falls back to the visitor's browser date.

### `archive.html`

This page lists all meetings grouped by year.

It uses the same `_events/` data, but presents it as a browsable archive instead of a calendar.

The archive also includes client-side filters for text search, status, year, and selected tags. Search covers titles, speakers, and tags. Tag pills in each archive row are buttons; clicking a tag toggles that tag as selected. Multiple selected tags combine with boolean AND logic and also combine with the other controls. Jekyll renders `data-*` attributes on each archive row, and `assets/js/archive-filters.js` reads those attributes to show or hide matching events in the browser.

### `_events/`

This folder contains one Markdown file per meeting.

Each event file starts with YAML front matter, followed by the meeting notes. Example:

```text
---
title: Tensor Networks Discussion
date: 2026-05-06
speaker: Alice Smith
room: 2A1
time: "12:00"
additional_notes: "sample text here"
tags:
  - tensor networks
  - numerics
thumbnail:
  path: /assets/thumbnails/2026-05-06/thumbnail.png
  alt: Tensor network diagram
files:
  - label: Slides
    path: /assets/files/2026-05-06/slides.pdf
---

Short summary of the meeting goes here.

Thumbnail adapted from [Reference label](https://example.com/reference).
```

The front matter is machine-readable metadata. The text after the second `---` is the human-readable body of the meeting page.

The `room` field is optional. When present, it appears in the event header together with the date and speaker.

The `time` field is optional. Use 24-hour `HH:MM` format, wrapped in quotes:

```yaml
time: "12:00"
```

When present, `time` appears in the homepage Next Meetings panel for the immediate next meeting only.

Thumbnail images in the homepage Next Meetings panel also appear only for the immediate next meeting. Do not show thumbnails beside the second or third upcoming meeting.

The `additional_notes` field is optional. Use it for short scheduling notes in the homepage Next Meetings panel:

```yaml
additional_notes: "Bring printed notes."
```

When present, `additional_notes` appears as `Notes: ...` for any event listed in the Next Meetings panel.

The `thumbnail` field is optional. Use it for a custom-picked small figure beside archive rows, the immediate next meeting on the homepage, and near the top of the event page:

```yaml
thumbnail:
  path: /assets/thumbnails/2026-05-06/thumbnail.png
  alt: Short description of the figure
```

A path string is also supported:

```yaml
thumbnail: /assets/thumbnails/2026-05-06/thumbnail.png
```

Store custom-picked local thumbnails under `assets/thumbnails/YYYY-MM-DD/`. Keep slides, PDFs, and other event attachments under `assets/files/YYYY-MM-DD/`.

When a thumbnail is present, add its source note below the front matter using this exact template:

```markdown
Thumbnail adapted from [Reference label](https://example.com/reference).
```

For arXiv sources, use a compact label such as:

```markdown
Thumbnail adapted from [arXiv:2604.13027](https://arxiv.org/abs/2604.13027).
```

The `tags` field is optional. When present, prefer scientific topic labels such as `dual-unitary circuits`, `spectral statistics`, `quantum thermodynamics`, `quantum information`, `quantum many-body physics`, `integrability`, and `quantum hydrodynamics`.

Calendar, next-meetings, and archive entries link to the event page only when the event has detail content. Detail content means at least one `files` item or non-empty notes below the front matter. Events with only front matter still appear in lists, but their titles are plain text instead of links.

### `_layouts/`

Layouts are reusable page shells.

- `_layouts/default.html` contains the shared HTML document structure, header logo, site title, `Search` navigation link to the archive page, and stylesheet link.
- `_layouts/event.html` controls how each individual meeting page looks.

Event Markdown files automatically use the `event` layout because `_config.yml` sets that default for the `events` collection.

### `_includes/`

Includes are small reusable content snippets.

`_includes/general-info.md` contains the short description shown on the homepage.

### `assets/css/styles.css`

This file controls the visual design: layout, spacing, colors, calendar styling, event rows, tags, and responsive behavior.

### `assets/img/trinity-college-dublin-logo.svg`

This is the Trinity College Dublin logo displayed in the shared site header. It is shown as a non-linked image beside the site title.

### `assets/img/circuit-site.svg`

This is the decorative circuit image displayed on desktop inside the homepage intro box. It is shown as a translucent background layer behind the text and hidden on mobile.

### `assets/img/lattice-site.svg`

This is the decorative lattice image displayed on desktop inside the archive header box. It is shown as a translucent background layer behind the text and hidden on mobile.

### `assets/img/site-thumbnail.svg`

This is the browser tab icon, also called the favicon. `_layouts/default.html` links to it from the page `<head>`.

### `assets/js/calendar.js`

This file powers the interactive compact calendar strip.

The homepage writes event data into `window.DQI_EVENTS`. The JavaScript reads that data, renders only the meeting dates in the current month, and updates the strip when the previous, next, or today buttons are clicked.

Events without files or body notes are rendered as non-clickable labels. Clickable labels use a royal-blue pill style; non-clickable labels are plain text with no background.

The homepage also includes a Google Calendar subscription notice that links to the external Google Calendar.

The CSS, calendar JavaScript, and archive filter JavaScript links include a build-time `?v=...` query string. This helps browsers and GitHub Pages caches load the latest styles and scripts after a deployment.

### `assets/js/archive-filters.js`

This file powers the archive filters. It first refreshes each archive row's `data-status` from the same GMT/UTC date source used by the homepage, then populates the year dropdown from the rendered archive rows, applies search, select, and selected-tag filters, hides empty year sections, and shows a "No matching events" message when every event is filtered out.

### `assets/js/obsidian-callouts.js`

This file makes Obsidian-style callouts readable on the Jekyll site.

Use this syntax in event Markdown:

```markdown
> [!note|highlight-blue] Key Idea
> Inline math works: $E = mc^2$
>
> Display math works too:
> $$
> E = mc^2
> $$
>
> Normal **Markdown** works here.
```

This is still valid Markdown. Without JavaScript it appears as a normal blockquote, so the text remains readable. In the Jekyll site, the browser first receives a normal blockquote from Jekyll. Then `assets/js/obsidian-callouts.js` finds blockquotes whose first line starts with `[!...]` and converts them into styled callout boxes. If Kramdown parses the `|` in `[!note|highlight-blue]` as a tiny two-cell table, the script recognizes that shape as the callout marker too.

The preferred syntax is:

```markdown
> [!note|highlight-blue] Title
```

The `note` part keeps the same syntax working in Obsidian. The `highlight-blue` part is metadata used for custom color styling.

Supported highlight metadata values are:

```markdown
> [!note|highlight-red] Title
> [!note|highlight-green] Title
> [!note|highlight-turquoise] Title
> [!note|highlight-purple] Title
> [!note|highlight-blue] Title
```

Every line inside the callout must start with `>`, including blank lines and `$$` display-math delimiters.

The visual styling lives in `assets/css/styles.css` under the `.obsidian-callout` selectors. To add another color, add a new metadata class there, for example:

```css
.obsidian-highlight-orange {
  --callout-color: 230, 126, 34;
}
```

Then use it in Markdown:

```markdown
> [!note|highlight-orange] Example
> $a^2 + b^2 = c^2$
```

This feature is a sensitive compatibility point. It depends on Jekyll rendering the callout as a normal blockquote, then a small browser script converting that blockquote into styled HTML. It also depends on the CSS variables in `assets/css/styles.css` and MathJax in `_layouts/default.html`.

If callouts become plain blockquotes, check that `assets/js/obsidian-callouts.js` is loading. If LaTeX works but colors do not, check the CSS first. The callout colors intentionally use `rgba(var(--callout-color), 0.1)` style syntax; changing this to newer `rgb(... / ...)` syntax may break colors in some browsers.

### MathJax

`_layouts/default.html` loads MathJax v3 from jsDelivr. This lets TeX expressions render in event notes, including inside converted Obsidian callouts. The layout also defines common quantum notation macros: `\ket{}`, `\bra{}`, and `\braket{}{}`.

Inline math:

```markdown
$E = mc^2$
```

Display math:

```markdown
$$
E = mc^2
$$
```

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
room: 2A1
time: "12:00"
additional_notes: "sample text here"
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

External file links are also supported:

```yaml
files:
  - label: Presentation link
    path: https://example.com/slides
```

## Importing a Meeting Backlog

When importing old meetings from an external backlog, use a cautious workflow so mistakes are easy to revert.

Start with one meeting entry:

1. Create one Markdown file in `_events/`.
2. Copy only that meeting's files into `assets/files/YYYY-MM-DD/`.
3. Run the site locally and check the event page, archive, calendar, and file links.
4. Review the Git diff before importing more rows.

For each imported meeting, keep the same normal event structure:

```yaml
---
title: "Meeting topic"
date: 2025-03-03
speaker: "Speaker Name"
room: "2A1"
time: "12:00"
additional_notes: "sample text here"
tags:
  - quantum information
files:
  - label: "Presentation"
    path: "/assets/files/2025-03-03/slides.pdf"
---
```

Tags should usually describe the scientific content. Put the meeting room in the `room` front matter field. The topic should appear in the `title`, so do not duplicate it in the body.

## Publishing With GitHub Pages

This repository is designed to publish through GitHub Pages as an organization website.

The GitHub organization is:

```text
DQI-Group-Meetings
```

An organization is a shared GitHub owner. Instead of the repository belonging to one personal account, it belongs to the organization. People can be added to the organization or to this repository as collaborators so they can update the website.

The repository is:

```text
DQI-Group-Meetings/DQI-Group-Meetings.github.io
```

The repository name matters. A GitHub Pages repository named `ORGANIZATION.github.io` publishes at the root organization URL:

```text
https://dqi-group-meetings.github.io/
```

Because this is a root organization site, `_config.yml` uses an empty `baseurl`:

```yaml
url: "https://dqi-group-meetings.github.io"
baseurl: ""
```

For this repository, GitHub Pages should be configured as:

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/ (root)`

After pushing to `main`, GitHub Pages builds and publishes the site at:

```text
https://dqi-group-meetings.github.io/
```

## Updating the Website Repository

To update the website, edit the files in this repository, test locally, commit, and push to `main`.

For example:

```bash
git pull
bundle exec jekyll serve
```

Open the local site:

```text
http://localhost:4000/
```

After editing meeting files or site files, validate and build:

```bash
ruby scripts/validate_events.rb
bundle exec jekyll build
```

Then commit and push:

```bash
git status
git add .
git commit -m "Describe the update"
git push
```

After the push, GitHub Pages will rebuild the public website automatically. If the site does not update immediately, check the repository's Actions tab or Pages settings for the latest build status.

## Forking or Reusing the Project

If someone forks this project under a personal account or a different organization, their URL may look like a project site:

```text
https://OWNER.github.io/REPOSITORY-NAME/
```

In that case, update `_config.yml` to match the new owner and repository path:

```yaml
url: "https://OWNER.github.io"
baseurl: "/REPOSITORY-NAME"
```

If the fork is also renamed to `OWNER.github.io`, then it is a root user or organization site and `baseurl` should be empty:

```yaml
url: "https://OWNER.github.io"
baseurl: ""
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
- The URL is the organization root URL, `https://dqi-group-meetings.github.io/`.

### The local homepage loads without styling

Use the root local URL:

```text
http://localhost:4000/
```

If you changed `baseurl` for a fork, use the matching local URL for that `baseurl`.

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

## Keeping Documentation Updated

This repository has two kinds of project documentation:

- `AGENTS.md` is short context for future AI coding agents.
- `instructions/running-the-project.md` is the human-facing guide for maintainers and people who fork the project.

When changing a global feature, architecture, deployment behavior, content convention, or other important project behavior, update the documentation in the same change.

Use this rule of thumb:

- If a future AI agent needs to know it to work correctly, update `AGENTS.md`.
- If a human maintainer or someone forking the project needs to know it, update this guide.

Good documentation updates are concrete. Prefer exact file paths, commands, URLs, and short explanations over vague notes.
