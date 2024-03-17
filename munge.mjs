import { readFile, writeFile } from 'node:fs/promises';

const json = await readFile('./additives.json', 'utf8');
const data = JSON.parse(json);

const munged = {}

data.forEach(x => {
  const {'INS number': INS, ...og} = x;
  const entry = {};
  entry.names = og.Name.split(/,\s*/);
  if (og.Category) og.Category = og.Category.replace(/\s*\(FDA:\s*(.+)\)/, (m, n) => {
    entry.names.push(n);
    return '';
  }).replace(/(colour \(.*\))/, 'colour, $1');
  entry.categories = og.Category ? og.Category.split(/,\s*/) : [];
  entry.approval = {}
  entry.approval.AU = og.Aus === 'A' ? true : og.Aus === '' ? false : og.Aus;
  entry.approval.EU = og.EU === 'E' ? true : og.EU === '' ? false : og.EU;
  entry.approval.US = og.US === 'U' ? true : og.US === '' ? false : og.US;
  munged[INS] = entry;
});

console.log(munged);

const output = JSON.stringify(munged, null, 2);
await writeFile('./munged.json', output);