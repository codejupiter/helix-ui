import { gzipSync } from 'node:zlib';
import { statSync, readFileSync } from 'node:fs';

const budgets = [
  {
    label: 'ESM bundle',
    file: 'dist/index.js',
    maxRawBytes: 45 * 1024,
    maxGzipBytes: 10 * 1024,
  },
  {
    label: 'CJS bundle',
    file: 'dist/index.cjs',
    maxRawBytes: 48 * 1024,
    maxGzipBytes: 11 * 1024,
  },
  {
    label: 'CSS',
    file: 'dist/styles.css',
    maxRawBytes: 32 * 1024,
    maxGzipBytes: 5 * 1024,
  },
];

function format(bytes) {
  return `${(bytes / 1024).toFixed(2)} kB`;
}

let failed = false;

for (const budget of budgets) {
  const rawBytes = statSync(budget.file).size;
  const gzipBytes = gzipSync(readFileSync(budget.file)).length;

  const rawOk = rawBytes <= budget.maxRawBytes;
  const gzipOk = gzipBytes <= budget.maxGzipBytes;
  const status = rawOk && gzipOk ? 'OK' : 'FAIL';

  console.log(
    `${status} ${budget.label}: ${format(rawBytes)} raw / ${format(gzipBytes)} gzip ` +
      `(budget ${format(budget.maxRawBytes)} raw / ${format(budget.maxGzipBytes)} gzip)`
  );

  if (!rawOk || !gzipOk) {
    failed = true;
  }
}

if (failed) {
  process.exitCode = 1;
}
