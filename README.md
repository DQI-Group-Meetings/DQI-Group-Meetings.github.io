# DQI Group Meetings

Static Jekyll site for browsing DQI group meeting logs.

## Adding a meeting

1. Add a Markdown file in `_events/`, for example:

   ```text
   _events/2026-05-06-speaker-name.md
   ```

2. Add front matter:

   ```yaml
   ---
   title: Meeting title
   date: 2026-05-06
   speaker: Speaker Name
   room: 1D1
   time: "12:00"
   additional_notes: "sample text here"
   tags:
     - topic
   thumbnail:
     path: /assets/thumbnails/2026-05-06/thumbnail.png
     alt: Short description of the figure
   files:
     - label: Slides
       path: /assets/files/2026-05-06/slides.pdf
   ---
   ```

3. Put PDFs and slides in `assets/files/YYYY-MM-DD/`.

4. Put optional custom-picked thumbnails in `assets/thumbnails/YYYY-MM-DD/`.

5. If a thumbnail is present, add its attribution note below the front matter using this template:

   ```markdown
   Thumbnail adapted from [Reference label](https://example.com/reference).
   ```

6. Write any other meeting notes below the front matter.

7. Check that the entries are valid:

   ```bash
   ruby scripts/validate_events.rb
   ```

   If the script reports issues, fix the listed event files and run it again.
