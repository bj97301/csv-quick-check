import {checkCsv} from './csv-check.mjs';

const input = document.querySelector('#csv-input');
const result = document.querySelector('#check-result');
const sample = 'SKU,Title,Price\n001,Travel mug,12.00\n002,,18.50\n001,Travel mug,12.00\n003, Canvas bag ,10.00\n';

function show(title, description, issues = []) {
  result.replaceChildren();
  const heading = document.createElement('h2');
  heading.textContent = title;
  const paragraph = document.createElement('p');
  paragraph.textContent = description;
  result.append(heading, paragraph);
  if (issues.length) {
    const list = document.createElement('ol');
    for (const issue of issues.slice(0, 50)) {
      const item = document.createElement('li');
      item.textContent = `Row ${issue.row}${issue.column ? `, column ${issue.column}` : ''}: ${issue.detail}`;
      list.append(item);
    }
    result.append(list);
    if (issues.length > 50) {
      const more = document.createElement('p');
      more.textContent = `Showing the first 50 of ${issues.length} findings.`;
      result.append(more);
    }
  }
}

function run() {
  try {
    const checked = checkCsv(input.value);
    show(`${checked.issues.length} findings in ${checked.rowCount} product rows`, `${checked.columnCount} columns checked. Row 1 is the header. Quoted multiline fields count as one record.`, checked.issues);
  } catch (error) {
    show('The check could not run', error.message);
  }
}

document.querySelector('#csv-check-form').addEventListener('submit', event => { event.preventDefault(); run(); });
document.querySelector('#try-csv-example').addEventListener('click', () => { input.value = sample; run(); });
document.querySelector('#clear-csv').addEventListener('click', () => { input.value = ''; show('Ready to check', 'Paste your CSV or try the fictional example.'); input.focus(); });
