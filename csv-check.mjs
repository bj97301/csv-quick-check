const LIMIT = 300;

export function checkCsv(source) {
  if (!source.trim()) throw new Error('Paste a CSV with a header and at least one product row.');
  if (source.length > 200000) throw new Error('This free check accepts up to 200,000 characters.');
  const text = source.replace(/^\uFEFF/, '');
  const rows = [];
  let row = [], cell = '', quoted = false, afterQuote = false;
  function finishCell() { row.push(cell); cell = ''; afterQuote = false; }
  function finishRow() { finishCell(); rows.push(row); row = []; }
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') { quoted = false; afterQuote = true; }
      else cell += c;
      continue;
    }
    if (afterQuote && ![',', '\r', '\n'].includes(c)) throw new Error(`Unexpected text after a closing quote at character ${i + 1}.`);
    if (c === '"') {
      if (cell !== '') throw new Error(`Unexpected quote at character ${i + 1}.`);
      quoted = true;
    } else if (c === ',') finishCell();
    else if (c === '\r' || c === '\n') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      finishRow();
    } else cell += c;
  }
  if (quoted) throw new Error('A quoted field is missing its closing quote.');
  if (cell !== '' || row.length || afterQuote) finishRow();
  if (rows.length < 2) throw new Error('Include a header and at least one product row.');
  const [headers, ...data] = rows;
  if (data.length > LIMIT) throw new Error(`Found ${data.length} product rows. The free check supports up to ${LIMIT}.`);
  if (headers.length > 100) throw new Error('The free check supports up to 100 columns.');
  const issues = [];
  const add = (row, column, detail) => issues.push({row, column, detail});
  const names = new Map();
  headers.forEach((header, index) => {
    const key = header.trim();
    if (!key) add(1, index + 1, 'Blank column heading.');
    if (names.has(key)) add(1, index + 1, `Heading repeats column ${names.get(key)} after trimming outer spaces.`);
    else names.set(key, index + 1);
    if (/^\s*[=+\-@]/.test(header)) add(1, index + 1, 'Heading starts with a spreadsheet formula marker.');
  });
  const seenRows = new Map(), identifiers = new Map();
  const idColumns = headers.map((header, index) => /^(sku|variant sku|asin|id)$/i.test(header.trim()) ? index : -1).filter(index => index >= 0);
  data.forEach((values, index) => {
    const rowNumber = index + 2;
    if (values.length !== headers.length) add(rowNumber, null, `Has ${values.length} fields; the header has ${headers.length}.`);
    const exact = JSON.stringify(values);
    if (seenRows.has(exact)) add(rowNumber, null, `Exact duplicate of row ${seenRows.get(exact)}.`);
    else seenRows.set(exact, rowNumber);
    values.forEach((value, column) => {
      if (!value.trim()) add(rowNumber, column + 1, 'Blank value. Check whether this field is required.');
      if (/^\s*[=+\-@]/.test(value)) add(rowNumber, column + 1, 'Starts with =, +, - or @. Review safely before opening in a spreadsheet.');
      if (value !== value.trim()) add(rowNumber, column + 1, 'Outer whitespace. Confirm before changing it.');
    });
    for (const column of idColumns) {
      const value = values[column];
      if (value === undefined || value.trim() === '') continue;
      const key = JSON.stringify([column, value]);
      if (identifiers.has(key)) add(rowNumber, column + 1, `Identifier repeats row ${identifiers.get(key)}. Check whether that is intended.`);
      else identifiers.set(key, rowNumber);
    }
  });
  return {rowCount: data.length, columnCount: headers.length, issues};
}
