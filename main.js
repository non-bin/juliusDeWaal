const tableHeader = document.getElementById('table-header');
const tableBody = document.getElementById('table-body');

let columns = [];
let rows = [];

Papa.parse('./catalog.csv', {
  delimiter: ',',
  quoteChar: '"',
  escapeChar: '"',
  header: false,
  dynamicTyping: false,
  worker: false,
  comments: false,
  complete: (results, _file) => {
    if (results.errors.length > 0) {
      console.error('Parsing errors:', results.errors);
    }

    columns.push({ category: 'General', name: 'Thumbnail', visible: false, originalIndex: -1, special: 'thumbnail' });
    let category = null;
    for (let i = 0; i < results.data[1].length; i++) {
      category = results.data[0][i] || category || 'Uncategorized';
      let column = { category, name: results.data[1][i], visible: true, originalIndex: i, special: null };
      columns.push(column);
    }

    rows = results.data.slice(2);

    updateTable();
  },
  download: true,
  skipEmptyLines: true,
});

var columnsDropdown = document.getElementById('columns-dropdown');
document.getElementById('columns-dropdown-trigger').addEventListener('click', function (event) {
  event.stopPropagation();
  columnsDropdown.classList.toggle('is-active');
});

// Close dropdowns if clicking outside
document.addEventListener('click', function (event) {
  if (!event.target.classList.contains('dropdown-item')) columnsDropdown.classList.remove('is-active');
});

// Close dropdowns if ESC pressed
document.addEventListener('keydown', function (event) {
  let e = event || window.event;
  if (e.key === 'Esc' || e.key === 'Escape') {
    columnsDropdown.classList.remove('is-active');
  }
});

function updateTable() {
  updateTableHeader();
  updateTableBody();
}

function updateTableHeader() {
  tableHeader.innerHTML = '';
  const headerRow1 = tableHeader.appendChild(document.createElement('tr'));
  const headerRow2 = tableHeader.appendChild(document.createElement('tr'));
  let th;

  let spanCount = 2; // Add a column for the Open File button
  let currentCategory = null;
  columns.forEach((col) => {
    if (col.visible) {
      if (col.category !== currentCategory) {
        currentCategory = col.category;
        if (th) {
          th.setAttribute('colspan', spanCount);
          headerRow1.appendChild(th);
          spanCount = 1;
        }
        th = document.createElement('th');
        th.textContent = col.category;
      } else {
        spanCount++;
      }
    }
  });
  if (th) {
    th.setAttribute('colspan', spanCount);
    headerRow1.appendChild(th);
  }

  headerRow2.appendChild(document.createElement('th')).textContent = 'Open File';
  columns.forEach((col) => {
    if (col.visible) {
      const th = document.createElement('th');
      th.textContent = col.name;
      headerRow2.appendChild(th);
    }
  });
}

function updateTableBody() {
  tableBody.innerHTML = '';

  rows.forEach((row) => {
    const tr = document.createElement('tr');
    tr.appendChild(document.createElement('td')).innerHTML =
      `<a href="https://media.githubusercontent.com/media/non-bin/juliusDeWaal/refs/heads/main/drawings/${row[0]}.pdf" target="_blank"><span class="icon"><i class="mdi mdi-open-in-new"></i></span></a>`;
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].visible) {
        const td = document.createElement('td');
        if (columns[i].special === 'thumbnail')
          td.innerHTML = `<img class="thumbnail" src="https://media.githubusercontent.com/media/non-bin/juliusDeWaal/refs/heads/main/thumbnails/${row[0]}.png" alt="Thumbnail">`;
        else td.textContent = row[columns[i].originalIndex];
        tr.appendChild(td);
      }
    }
    tableBody.appendChild(tr);
  });
}
