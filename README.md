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
   tags:
     - topic
   files:
     - label: Slides
       path: /assets/files/2026-05-06/slides.pdf
   ---
   ```

3. Put PDFs or slides in `assets/files/YYYY-MM-DD/`.

4. Write the meeting notes below the front matter.
