#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { runValidation } = require('../scripts/validate-idm-static-site');

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
  return paths.map(normalize);
}

function shouldValidate(paths) {
  return paths.some((file) => (
    file.endsWith('.html') ||
    file.startsWith('pages/') ||
    file.startsWith('locales/') ||
    file === 'build_i18n.js' ||
    file === 'js/i18n.js'
  ));
}

const input = readInput();
const cwd = input.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();
const paths = collectPaths(input);

if (!paths.length || !shouldValidate(paths)) {
  process.exit(0);
}

try {
  const result = runValidation({ root: path.resolve(cwd), strictHtml: false });
  if (result.errors.length) {
    const message = [
      'IdrisMans validation failed after edit.',
      ...result.errors.map((error) => `ERROR: ${error}`),
      'Fix these before finishing. Locale edits usually need: node build_i18n.js'
    ].join('\n');
    console.error(JSON.stringify({
      continue: true,
      suppressOutput: false,
      systemMessage: message
    }));
    process.exit(2);
  }
} catch (error) {
  console.error(JSON.stringify({
    continue: true,
    suppressOutput: false,
    systemMessage: `IdrisMans validation hook crashed: ${error.message}`
  }));
  process.exit(2);
}
