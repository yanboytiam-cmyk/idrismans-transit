#!/usr/bin/env node

const fs = require('fs');

function readInput() {
  try {
    const raw = fs.readFileSync(0, 'utf8').trim();
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function normalize(file) {
  return String(file || '').replace(/\\/g, '/').replace(/^\.\//, '').toLowerCase();
}

function collectPaths(input) {
  const toolInput = input.tool_input || {};
  const paths = [];
  for (const key of ['file_path', 'path', 'target_file', 'filename']) {
    if (typeof toolInput[key] === 'string') paths.push(toolInput[key]);
  }
  if (Array.isArray(toolInput.files)) {
    for (const file of toolInput.files) if (typeof file === 'string') paths.push(file);
  }
  return paths;
}

const input = readInput();
const blocked = collectPaths(input).map(normalize).some((file) => file.endsWith('js/i18n.js'));

if (blocked) {
  const message = 'Direct edits to js/i18n.js are blocked. Edit locales/{fr,en,zh,es,de,ar}/common.json, then run node build_i18n.js.';
  console.log(JSON.stringify({
    hookSpecificOutput: {
      permissionDecision: 'deny'
    },
    systemMessage: message
  }));
  process.exit(0);
}
