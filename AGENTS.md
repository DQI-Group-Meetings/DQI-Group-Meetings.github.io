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
- The archive page includes client-side filters for text search, status, year, and selected tags. Search covers titles, speakers, and tags. Archive tag pills are buttons that toggle selected tags; multiple selected tags combine with boolean AND logic and also combine with the other controls. Filter behavior lives in `assets/js/archive-filters.js` and uses `data-*` attributes rendered by `archive.html`.
- Past/upcoming status is corrected in the browser from the current GMT/UTC date fetched from `https://gettimeapi.dev/v1/time?timezone=UTC`; if that request fails, the scripts fall back to the browser's local date. Liquid still renders a build-time fallback, but `assets/js/upcoming-meetings.js` re-renders the homepage next-meetings list from `window.DQI_EVENTS`, and `assets/js/archive-filters.js` refreshes archive row `data-status` values before filtering.
- The homepage includes a Google Calendar subscription notice that links to the external Google Calendar.
- The homepage intro includes a desktop-only decorative circuit SVG from `assets/img/circuit-site.svg`, placed inside the white header box as a translucent background layer.
- The archive header uses `assets/img/lattice-site.svg` as a desktop-only translucent background layer.
- The shared header displays a non-linked Trinity College Dublin SVG logo from `assets/img/trinity-college-dublin-logo.svg` next to the site title. The top-right navigation has a `Search` link pointing to the archive page.
- The browser tab icon uses `assets/img/site-thumbnail.svg`.
- CSS, calendar JavaScript, and archive filter JavaScript asset URLs include a `?v={{ site.time | date: '%s' }}` cache-busting query string so GitHub Pages/browser caches pick up visual changes after each build.
- Obsidian-style callouts in Markdown are supported in Jekyll pages with `assets/js/obsidian-callouts.js` and matching CSS in `assets/css/styles.css`. Use the Obsidian-compatible syntax `> [!note|highlight-blue] Title` followed by quoted Markdown lines. Jekyll first renders this as a normal blockquote; the browser script converts matching blockquotes into styled `.obsidian-callout` blocks. The same syntax remains readable in plain Markdown and works in Obsidian.
- The site layout loads MathJax v3 from jsDelivr so TeX inside event notes and converted Obsidian callouts can render in the browser. `_layouts/default.html` defines the quantum notation macros `\ket{}`, `\bra{}`, and `\braket{}{}`.
- Event content can be validated locally with `ruby scripts/validate_events.rb`. The script checks required front matter, filename/date consistency, optional tag/time formatting, missing local file attachments, missing local thumbnails, and missing rooms on future events.

## Obsidian Callout Implementation Details

This is a sensitive compatibility area. The syntax must work in Obsidian, remain readable as plain Markdown, and render nicely in the Jekyll site.

Use this Markdown form:

```markdown
> [!note|highlight-blue] Title
> Markdown and $LaTeX$ content.
```

Do not switch this to raw HTML `<div>` boxes. Raw HTML boxes break Obsidian Markdown/LaTeX rendering.

Jekyll/Kramdown usually renders that syntax as a normal `<blockquote>` whose first paragraph starts with the literal text `[!note|highlight-blue] Title`. It may also parse the `|` in the marker as a tiny two-cell table. The client-side file `assets/js/obsidian-callouts.js` handles both shapes and then:

- finds every `blockquote`;
- checks the first paragraph text, or the first two-cell table, against `/^\s*\[!([A-Za-z0-9_-]+)(?:\|([^\]]+))?\]\s*([^\n\r]*)\r?\n?/`;
- removes the marker paragraph/table;
- creates `.obsidian-callout-title` and `.obsidian-callout-content`;
- adds classes such as `.obsidian-callout` and `.obsidian-highlight-blue`;
- stores `data-callout` and `data-callout-metadata` for debugging.

The script intentionally uses broadly compatible browser APIs: `querySelectorAll`, `textContent`, `classList`, `dataset`, `document.addEventListener`, and `window.addEventListener`. Avoid fragile dependencies on `NodeFilter`, `TreeWalker`, or Markdown-renderer-specific generated markup unless you test them in the browser. A previous version using `document.createTreeWalker(..., NodeFilter.SHOW_TEXT)` was more fragile and made diagnosis harder.

The CSS in `assets/css/styles.css` must use classic comma-based color syntax with the comma-separated CSS variable:

```css
rgba(var(--callout-color), 0.1)
```

Do not use modern slash syntax here:

```css
rgb(var(--callout-color) / 10%)
```

That form did not work with the current `--callout-color: 65, 105, 225` values in the tested browser, causing converted callouts to have no visible colors or borders.

The final intended visual style has:

- a thin normal border around the whole callout;
- no thick left accent border;
- a colored title bar;
- a pale background.

## Callout Troubleshooting

If callouts stop showing colors or styling:

1. Confirm the generated page loads `assets/js/obsidian-callouts.js` and `assets/css/styles.css` from `_layouts/default.html`.
2. Hard-refresh the browser because these assets are cache-busted by `?v={{ site.time | date: '%s' }}` but a running local page may still hold old JS/CSS.
3. In the browser console, check `document.querySelectorAll('.obsidian-callout').length`.
4. If the count is zero, inspect the generated HTML. Jekyll should have produced blockquotes whose first paragraph starts with `[!note|highlight-blue]`.
5. If the count is nonzero but there are no colors, inspect CSS first. The likely culprit is incompatible color syntax or missing `.obsidian-highlight-*` rules.
6. If LaTeX renders but colors do not, MathJax is working and the issue is almost certainly the callout JavaScript/CSS path.
7. If colors work but LaTeX does not, inspect the MathJax config and script in `_layouts/default.html`.

For temporary manual testing, create an uncommitted `callout-test.md` page and remove it before handoff or commit. A useful debug trick is to add a temporary badge that displays `attr(data-obsidian-callouts)` from the `<html>` element; `assets/js/obsidian-callouts.js` sets that value after each transform pass.

This implementation can break if:

- Jekyll or Kramdown changes how blockquotes are rendered;
- the Markdown is converted by another renderer before this script sees it;
- browser compatibility changes around `classList`, `dataset`, or CSS custom properties;
- a strict Content Security Policy blocks inline MathJax config or external scripts from jsDelivr;
- MathJax loading order changes;
- a future refactor removes the script or CSS links from `_layouts/default.html`.
