#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"
require "yaml"

ROOT = File.expand_path("..", __dir__)
EVENTS_DIR = File.join(ROOT, "_events")
REQUIRED_FIELDS = %w[title date speaker].freeze

def add_issue(issues, file, message)
  issues << "#{file}: #{message}"
end

def front_matter_for(path)
  content = File.read(path)
  match = content.match(/\A---\s*\n(.*?)\n---\s*\n?/m)
  return [nil, content] unless match

  [match[1], content[match[0].length..] || ""]
end

def blank?(value)
  value.nil? || (value.respond_to?(:empty?) && value.empty?)
end

def local_file_exists?(path)
  File.file?(File.join(ROOT, path.to_s.sub(%r{\A/}, "")))
end

issues = []
today = Date.today
event_paths = Dir.glob(File.join(EVENTS_DIR, "*.md")).sort

add_issue(issues, "_events", "no event Markdown files found") if event_paths.empty?

event_paths.each do |path|
  relative_path = path.delete_prefix("#{ROOT}/")
  filename = File.basename(path)
  filename_date = filename[/\A\d{4}-\d{2}-\d{2}/]

  front_matter, = front_matter_for(path)
  if front_matter.nil?
    add_issue(issues, relative_path, "missing YAML front matter")
    next
  end

  data = YAML.safe_load(
    front_matter,
    permitted_classes: [Date, Time],
    aliases: false
  ) || {}

  REQUIRED_FIELDS.each do |field|
    add_issue(issues, relative_path, "missing required field `#{field}`") if blank?(data[field])
  end

  event_date =
    begin
      Date.parse(data["date"].to_s)
    rescue ArgumentError, TypeError
      nil
    end

  if event_date.nil?
    add_issue(issues, relative_path, "invalid `date` value")
  elsif filename_date != event_date.strftime("%Y-%m-%d")
    add_issue(issues, relative_path, "filename date does not match front matter date #{event_date}")
  end

  tags = data["tags"]
  add_issue(issues, relative_path, "`tags` must be a YAML list") if tags && !tags.is_a?(Array)

  time = data["time"]
  if time && !time.to_s.match?(/\A\d{2}:\d{2}\z/)
    add_issue(issues, relative_path, "`time` should use 24-hour HH:MM format")
  end

  additional_notes = data["additional_notes"]
  if additional_notes && !additional_notes.is_a?(String)
    add_issue(issues, relative_path, "`additional_notes` must be a string")
  end

  if event_date && event_date >= today && blank?(data["room"])
    add_issue(issues, relative_path, "future event is missing `room`")
  end

  thumbnail = data["thumbnail"]
  thumbnail_path = thumbnail.is_a?(Hash) ? thumbnail["path"] : thumbnail
  if !blank?(thumbnail_path) && !thumbnail_path.to_s.include?("://") && !local_file_exists?(thumbnail_path)
    add_issue(issues, relative_path, "local thumbnail file does not exist: `#{thumbnail_path}`")
  end

  files = data["files"]
  next if blank?(files)

  unless files.is_a?(Array)
    add_issue(issues, relative_path, "`files` must be a YAML list")
    next
  end

  files.each_with_index do |file, index|
    unless file.is_a?(Hash)
      add_issue(issues, relative_path, "`files` item #{index + 1} must be a mapping")
      next
    end

    label = file["label"]
    file_path = file["path"]
    add_issue(issues, relative_path, "`files` item #{index + 1} is missing `label`") if blank?(label)
    add_issue(issues, relative_path, "`files` item #{index + 1} is missing `path`") if blank?(file_path)
    next if blank?(file_path) || file_path.to_s.include?("://")

    unless file_path.to_s.start_with?("/assets/")
      add_issue(issues, relative_path, "`files` path `#{file_path}` should start with `/assets/`")
    end

    local_path = File.join(ROOT, file_path.to_s.sub(%r{\A/}, ""))
    add_issue(issues, relative_path, "local file does not exist: `#{file_path}`") unless File.file?(local_path)
  end
end

if issues.empty?
  puts "Validated #{event_paths.length} event files. No issues found."
  exit 0
end

puts "Found #{issues.length} event validation issue#{issues.length == 1 ? '' : 's'}:"
issues.each { |issue| puts "- #{issue}" }
exit 1
