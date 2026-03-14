const tableHeader = document.getElementById('table-header');
const tableBody = document.getElementById('table-body');

Papa.parse('./catalog.csv', {
  delimiter: ',',
  quoteChar: '"',
  escapeChar: '"',
  header: false,
  dynamicTyping: false,
  worker: false,
  comments: false,
  complete: (results, _file) => {
    // console.log('Parsing complete:', results);

    if (results.errors.length > 0) {
      console.error('Parsing errors:', results.errors);
    }

    console.log(results.data);
    updateTableHeader([results.data[0], results.data[1]]);
    updateTableBody(results.data.slice(2));
  },
  download: true,
  skipEmptyLines: true,
});

function updateTableHeader(headerData) {
  tableHeader.innerHTML = '';
  const headerRow1 = tableHeader.appendChild(document.createElement('tr'));
  const headerRow2 = tableHeader.appendChild(document.createElement('tr'));
  let th;

  let spanCount = 2; // Add a columns for the Open File button and preview
  headerData[0].forEach((cell) => {
    if (cell) {
      if (th) {
        th.setAttribute('colspan', spanCount);
        headerRow1.appendChild(th);
        spanCount = 1;
      }
      th = document.createElement('th');
      th.textContent = cell;
    } else {
      spanCount++;
    }
  });
  if (th) {
    th.setAttribute('colspan', spanCount);
    headerRow1.appendChild(th);
  }

  headerRow2.appendChild(document.createElement('th')).textContent = 'Open File';
  headerRow2.appendChild(document.createElement('th')).textContent = 'Preview';
  headerData[1].forEach((cell) => {
    const th = document.createElement('th');
    th.textContent = cell;
    headerRow2.appendChild(th);
  });
}

function updateTableBody(bodyData) {
  tableBody.innerHTML = '';

  bodyData.forEach((row) => {
    const tr = document.createElement('tr');
    tr.appendChild(document.createElement('td')).innerHTML =
      `<a href="./drawings/${row[0]}.pdf" target="_blank"><span class="icon"><i class="mdi mdi-open-in-new"></i></span></a>`;
    tr.appendChild(document.createElement('td')).innerHTML =
      `<img class="thumbnail" src="./thumbnails/${row[0]}.png" alt="Thumbnail">`;
    row.forEach((cell) => {
      const td = document.createElement('td');
      td.textContent = cell;
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });
}
