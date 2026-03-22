const RESOURCE_BASE_URL =
  document.location.hostname === 'localhost' ?
    ''
  : 'https://media.githubusercontent.com/media/non-bin/juliusDeWaal/refs/heads/main'; // Github pages doesn't work with GitLFS

const table = document.getElementById('table');
const tableHeader = document.getElementById('table-header');
const tableBody = document.getElementById('table-body');
const columnDropdownContent = document.getElementById('columns-dropdown-menu');

let debug;

/**
 * @type {{category: string, name: string, visible: boolean, filtered: boolean, originalIndex: number, special: string|null, dropdownElement: HTMLAnchorElement}[]}
 */
let columns = [];

/**
 * @type {{element: HTMLTableRowElement, filtered: boolean, data: string[]}[]}
 */
let rows = [];

///////////////
// Functions //
///////////////

/**
 * Updates the table header based on the current column visibility and filtering states.
 */
const updateTableHeader = () => {
  const headerRow1 = document.createElement('tr');
  const headerRow2 = document.createElement('tr');
  let th;

  let spanCount = 2; // Add a column for the Open File button
  let currentCategory = null;
  columns.forEach((col) => {
    if (col.visible && !col.filtered) {
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
    if (col.visible && !col.filtered) {
      const th = document.createElement('th');
      th.textContent = col.name;
      headerRow2.appendChild(th);
    }
  });

  tableHeader.innerHTML = '';
  tableHeader.appendChild(headerRow1);
  tableHeader.appendChild(headerRow2);
};

/**
 * Creates table rows on initial load
 */
const loadTableBody = () => {
  tableBody.innerHTML = '';

  rows.forEach((row) => {
    const tr = document.createElement('tr');
    row.element = tr;
    tr.appendChild(document.createElement('td')).innerHTML =
      `<a href="${RESOURCE_BASE_URL}/drawings/${row.data[0]}.pdf" target="_blank"><span class="icon"><i class="mdi mdi-open-in-new"></i></span></a>`;
    for (let i = 0; i < columns.length; i++) {
      const td = document.createElement('td');
      if (columns[i].special === 'thumbnail')
        td.innerHTML = `<img class="thumbnail" src="${RESOURCE_BASE_URL}/thumbnails/${row.data[0]}.png" alt="Thumbnail">`;
      else if (columns[i].special === 'link')
        td.innerHTML = `<a href="${row.data[columns[i].originalIndex]}" target="_blank"><span class="icon"><i class="mdi mdi-open-in-new"></i></span></a>`;
      else {
        const div = td.appendChild(document.createElement('div'));
        div.textContent = row.data[columns[i].originalIndex];
      }
      td.style.display = columns[i].visible && !columns[i].filtered ? '' : 'none';
      tr.appendChild(td);
    }
    tr.style.display = row.filtered ? 'none' : '';
    tableBody.appendChild(tr);
  });
};

/**
 * Creates column visibility dropdown items on initial load
 */
const loadColumnDropdown = () => {
  columnDropdownContent.innerHTML = '';
  columns.forEach((column, i) => {
    const item = columnDropdownContent.appendChild(document.createElement('a'));
    column.dropdownElement = item;
    item.classList.add('dropdown-item');
    item.textContent = `${column.category} - ${column.name}`;
    item.dataset.columnIndex = i;

    if (column.visible) item.classList.add('is-visible');
    if (column.filtered) item.classList.add('is-filtered');
  });
};

/**
 * Updates the columns array based on dropdown item clicks and refreshes the table display.
 *
 * @param {Event} event Dropdown item click event
 */
const updateColumnVisibility = (event) => {
  // Update columns array based on clicked dropdown item
  columns[event.target.dataset.columnIndex].visible = !columns[event.target.dataset.columnIndex].visible;

  if (event.target.dataset.columnIndex == 0) {
    if (columns[event.target.dataset.columnIndex].visible) table.classList.add('thumbnails');
    else table.classList.remove('thumbnails');
  }
  updateTable();
};

/**
 * Updates the rows array based on filter input and refreshes the table display.
 *
 * @param {Event} event Row filter input event
 */
const updateRowFiltering = (event) => {
  // TODO
  updateTable();
};

/**
 * Updates the columns array based on column filter input and row content
 */
const updateColumnFiltering = () => {
  columns.forEach((column) => {
    if (column.special === 'thumbnail') {
      column.filtered = false;
      return;
    }
    column.filtered = !rows.some((row) => !row.filtered && row.data[column.originalIndex].length > 0);
  });
};

/**
 * Updates the display of rows and columns based on the current filtering and visibility states
 */
const updateTableBody = () => {
  rows.forEach((row) => {
    if (row.filtered) row.element.style.display = 'none';
    else {
      row.element.style.display = '';
      for (let i = 0; i < columns.length; i++) {
        const td = row.element.children[i + 1]; // +1 to skip the Open File column
        td.style.display = columns[i].visible && !columns[i].filtered ? '' : 'none';
      }
    }
  });
};

const updateColumnDropdown = () => {
  columns.forEach((column) => {
    const item = column.dropdownElement;
    item.classList.add('dropdown-item');
    item.textContent = `${column.category} - ${column.name}`;

    if (column.visible) item.classList.add('is-visible');
    else item.classList.remove('is-visible');
    if (column.filtered) item.classList.add('is-filtered');
    else item.classList.remove('is-filtered');
  });
};

/**
 * Run everything to update the table display based on the current state of columns and rows (run by filter and dropdown event handlers)
 */
const updateTable = () => {
  updateColumnFiltering();

  updateColumnDropdown();
  updateTableHeader();
  updateTableBody();
};

//////////////////
// Initial Load //
//////////////////

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

    columns.push({
      category: 'General',
      name: 'Thumbnail',
      visible: false,
      filtered: false,
      originalIndex: -1,
      special: 'thumbnail',
    });
    let category = null;
    for (let i = 0; i < results.data[1].length; i++) {
      category = results.data[0][i] || category || 'Uncategorized';

      const columnName = results.data[1][i].toLowerCase();
      let special = null;
      if (columnName.includes('link') || columnName.includes('video')) special = 'link';
      if (
        columnName.includes('height')
        || columnName.includes('length')
        || columnName.includes('width')
        || columnName.includes('bore')
        || columnName.includes('stroke')
      )
        special = 'length';
      if (columnName.includes('volume')) special = 'volume';

      columns.push({
        category,
        name: results.data[1][i],
        visible: true,
        filtered: false,
        originalIndex: i,
        special,
      });
    }

    for (let i = 2; i < results.data.length; i++) {
      rows.push({ filtered: false, data: results.data[i] });
    }

    loadTableBody();
    loadColumnDropdown();

    updateTable();
  },
  download: true,
  skipEmptyLines: true,
});

/////////////////////
// Event Listeners //
/////////////////////

// Toggle column dropdown
var columnsDropdown = document.getElementById('columns-dropdown');
document.getElementById('columns-dropdown-trigger').addEventListener('click', (event) => {
  event.stopPropagation();
  columnsDropdown.classList.toggle('is-active');
});

// Close dropdowns if clicking outside
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('dropdown-item')) updateColumnVisibility(event);
  else columnsDropdown.classList.remove('is-active');
});

// Close dropdowns if ESC pressed
document.addEventListener('keydown', (event) => {
  if (event.key === 'Esc' || event.key === 'Escape') columnsDropdown.classList.remove('is-active');
});
