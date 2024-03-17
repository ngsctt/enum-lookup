import { readFile, writeFile, copyFile, rm, mkdir } from 'node:fs/promises';
import { join as pJoin } from 'node:path';
import dot from 'dot';

const json = await readFile('./additives.json', 'utf8');
const data = JSON.parse(json);

const templateContent = await readFile('./additive-template.html', 'utf8');
const template = dot.template(templateContent);

const numbers = Object.keys(data);

try {
  await rm('public', { recursive: true });
} catch (error) {
  log(error);
}
await mkdir('public');

numbers.forEach(async n => {
  const output = template({num: n, ...data[n]});
  await writeFile(pJoin('public', `${n}.html`), output);
});

await copyFile('./additives.json', pJoin('public', 'additives.json'));
await copyFile('./index.html', pJoin('public', 'index.html'));