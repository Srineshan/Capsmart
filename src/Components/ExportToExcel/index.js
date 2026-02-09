import * as XLSX from 'xlsx';

// Excel sheet names: max 31 chars, cannot contain \ / * ? : [ ]
const SANITIZE_SHEET_NAME_RE = /[\\/*?:\[\]]/g;
const MAX_SHEET_NAME_LENGTH = 31;

/**
 * Sanitize and truncate a string for use as an Excel sheet name. Ensures uniqueness.
 * @param {string} name - Raw title
 * @param {Set<string>} usedNames - Set of already-used sheet names (mutated to add new name)
 * @returns {string}
 */
const sanitizeSheetName = (name, usedNames = new Set()) => {
  if (!name || typeof name !== 'string') return 'Sheet';
  let safe = name.replace(SANITIZE_SHEET_NAME_RE, ' ').replace(/\s+/g, ' ').trim();
  if (!safe) return 'Sheet';
  safe = safe.substring(0, MAX_SHEET_NAME_LENGTH);
  let final = safe;
  let n = 1;
  while (usedNames.has(final)) {
    const suffix = ` (${n})`;
    final = (safe.substring(0, MAX_SHEET_NAME_LENGTH - suffix.length) + suffix).substring(0, MAX_SHEET_NAME_LENGTH);
    n += 1;
  }
  usedNames.add(final);
  return final;
};

/**
 * Find the title for a report section: nearest preceding element with tableTitleTextStyle (title on top of table).
 * If none (e.g. map of tables), use report title.
 * @param {Element} element - Table or section container
 * @param {Element} container - Report root (e.g. .Report)
 * @param {string} reportTitle - Fallback when no table title is found
 * @returns {string}
 */
const getTitleForElement = (element, container, reportTitle) => {
  if (!element || !container) return reportTitle || 'Report';
  let parent = element.parentElement;
  while (parent && parent !== container) {
    const siblings = Array.from(parent.children);
    const idx = siblings.indexOf(element);
    // Prefer tableTitleTextStyle (title on top of this table)
    for (let i = idx - 1; i >= 0; i--) {
      const el = siblings[i];
      const titleEl = el.matches?.('[class*="tableTitleTextStyle"]') ? el : el.querySelector?.('[class*="tableTitleTextStyle"]');
      if (titleEl) {
        const text = (titleEl.textContent || '').trim();
        if (text) return text;
      }
    }
    element = parent;
    parent = parent.parentElement;
  }
  return reportTitle || 'Report';
};

/**
 * Prepend the sheet title as a heading row at the top of the data.
 * @param {string} title - Title to show as heading (full text, not truncated)
 * @param {Array<Array>} rows - Data rows
 * @returns {Array<Array>}
 */
const rowsWithHeading = (title, rows) => {
  if (!title || !rows?.length) return rows || [];
  const colCount = Math.max(...rows.map((r) => r.length), 1);
  const headingRow = [title, ...Array(Math.max(0, colCount - 1)).fill('')];
  return [headingRow, ...rows];
};

const REPORTING_PERIOD_LABEL = 'Reporting Period used for this report';

/**
 * Find "Reporting Period used for this report" in the container and return [label, value] or null.
 * @param {Element} container - Report root
 * @returns {[string, string]|null}
 */
const extractReportingPeriodItem = (container) => {
  if (!container) return null;
  const candidates = container.querySelectorAll('[class*="reportRunByTextStyle"]');
  for (let i = 0; i < candidates.length; i++) {
    const text = (candidates[i].textContent || '').trim();
    if (!text.includes(REPORTING_PERIOD_LABEL)) continue;
    const afterColon = text.indexOf(' : ');
    const value = afterColon >= 0 ? text.slice(afterColon + 3).trim() : text;
    return [REPORTING_PERIOD_LABEL, value];
  }
  return null;
};

/**
 * Extract "Reporting Parameters Applied" section from the report container.
 * Includes "Reporting Period used for this report" when present.
 * Returns array of rows: [["Reporting Parameters Applied"], ["Label", "Value"], ...]
 * @param {Element} container - Report root (e.g. .Report)
 * @returns {Array<Array<string>>}
 */
const extractReportingParams = (container) => {
  if (!container) return [];
  const rows = [];
  const reportingPeriodItem = extractReportingPeriodItem(container);
  const paramsContainer = container.querySelector('[class*="reportTypeParamsBackground"]');

  if (paramsContainer) {
    const headingEl = paramsContainer.querySelector('[class*="entityNameBolderStyle"]');
    if (headingEl) {
      const heading = (headingEl.textContent || '').trim();
      if (heading) rows.push([heading]);
    }
    if (reportingPeriodItem) rows.push(reportingPeriodItem);
    const grid = paramsContainer.querySelector('[class*="grid3"]') || paramsContainer.querySelector('[class*="grid2"]') || paramsContainer.querySelector('[class*="grid4"]');
    if (grid) {
      Array.from(grid.children).forEach((block) => {
        const labelEl = block.querySelector('[class*="reportRunByParamStyle"]');
        const valueEl = block.querySelector('[class*="reportTypeValueParamTextStyle"]') || block.querySelector('[class*="reportTypeValueTextStyle"]');
        if (labelEl) {
          const label = (labelEl.textContent || '').trim();
          const value = valueEl ? (valueEl.textContent || '').trim() : '';
          if (label || value) rows.push([label, value]);
        }
      });
    }
  } else if (reportingPeriodItem) {
    rows.push(['Reporting Parameters Applied']);
    rows.push(reportingPeriodItem);
  }
  return rows;
};

/**
 * Build sheet rows with title, reporting params, and table data.
 * @param {string} title - Sheet title
 * @param {Array<Array>} paramsRows - Rows from extractReportingParams (can be empty)
 * @param {Array<Array>} tableRows - Table data (header + body)
 * @returns {{ rows: Array<Array>, paramsRowCount: number }}
 */
const rowsWithHeadingAndParams = (title, paramsRows, tableRows) => {
  if (!tableRows?.length) return { rows: [], paramsRowCount: 0 };
  const colCount = Math.max(...tableRows.map((r) => r.length), 1);
  const pad = (row) => {
    const r = Array.isArray(row) ? [...row] : [row];
    while (r.length < colCount) r.push('');
    return r;
  };
  const out = [pad([title])];
  let paramsRowCount = 0;
  if (paramsRows?.length) {
    paramsRows.forEach((pr) => out.push(pad(pr)));
    paramsRowCount = paramsRows.length;
  }
  tableRows.forEach((r) => out.push(pad(r)));
  return { rows: out, paramsRowCount };
};

/**
 * Extract table data from a DOM element (e.g. .Report) and export to Excel.
 * Each <table> becomes a sheet. Chart data is not captured (only HTML tables).
 * @param {string} selector - CSS selector for the container (e.g. ".Report")
 * @param {string} filename - Output filename without extension
 * @param {string} [reportTitle] - Report title; used as sheet name when no title is found above a table
 */
// Extract data from HTML table
const extractHtmlTable = (table) => {
  const rows = [];
  const trs = table.querySelectorAll('tr');
  trs.forEach((tr) => {
    const row = [];
    const cells = tr.querySelectorAll('td, th');
    cells.forEach((cell) => {
      const text = (cell.textContent || '').trim();
      row.push(text);
    });
    if (row.length) rows.push(row);
  });
  return rows;
};

// Extract data from ReportsTable component (div-based)
const extractReportsTable = (container) => {
  const rows = [];

  // Find header row (headingBackground)
  const headerDiv = container.querySelector('[class*="headingBackground"]');
  if (headerDiv) {
    const headerRow = [];
    // Get all direct children divs with reportRunByTextStyle
    const headerCells = Array.from(headerDiv.children).filter(child =>
      child.className && (child.className.includes('reportRunByTextStyle') || child.textContent.trim())
    );
    if (headerCells.length === 0) {
      // Fallback: get all text nodes or direct children
      headerDiv.childNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          const text = (node.textContent || '').trim();
          if (text) headerRow.push(text);
        }
      });
    } else {
      headerCells.forEach((cell) => {
        const text = (cell.textContent || '').trim();
        if (text) headerRow.push(text);
      });
    }
    if (headerRow.length) rows.push(headerRow);
  }

  // Find data rows (row1Background or row2Background)
  const dataRows = container.querySelectorAll('[class*="row1Background"], [class*="row2Background"]');
  console.log('ReportsTable: Found', dataRows.length, 'data rows');

  dataRows.forEach((rowDiv, rowIndex) => {
    const row = [];

    // Get all cells with reportTypeValueTextStyle class - these are the actual data cells
    // We need to get them in order, so we'll traverse direct children and find the cell within each
    const directChildren = Array.from(rowDiv.children);
    console.log(`ReportsTable: Row ${rowIndex + 1} has ${directChildren.length} direct children`);

    directChildren.forEach((child, childIndex) => {
      // Find the actual cell div with reportTypeValueTextStyle class
      // Structure: <a> or <div> wrapper -> <div class="reportTypeValueTextStyle">value</div>
      let cellElement = null;

      if (child.tagName === 'A') {
        // Anchor tag - find the cell div inside it (should be first/only div)
        cellElement = child.querySelector('[class*="reportTypeValueTextStyle"]');
      } else if (child.tagName === 'DIV') {
        // Check if this div itself is the cell
        const classStr = typeof child.className === 'string' ? child.className :
          (child.className?.baseVal || '');
        if (classStr.includes('reportTypeValueTextStyle')) {
          cellElement = child;
        } else {
          // Find the cell div inside this wrapper div
          cellElement = child.querySelector('[class*="reportTypeValueTextStyle"]');
        }
      }

      // Extract text ONLY from the cell element itself
      if (cellElement) {
        // Get text content directly - the cell div should only contain the value
        // Based on ReportsTable structure: <div class="reportTypeValueTextStyle">value</div>
        // The value is directly in the div, so textContent should work
        let cellText = (cellElement.textContent || '').trim();

        // Clean up: remove extra whitespace and newlines
        cellText = cellText.replace(/\s+/g, ' ').trim();

        // Handle dash as empty
        if (cellText === '-' || cellText === '—' || cellText === '') {
          row.push('');
        } else {
          row.push(cellText);
        }
      } else {
        // No cell found - add empty cell to maintain column alignment
        row.push('');
      }
    });

    // Ensure row has same number of columns as header (pad with empty strings if needed)
    if (rows.length > 0 && rows[0].length > 0) {
      const expectedCols = rows[0].length; // Header column count
      while (row.length < expectedCols) {
        row.push(''); // Pad with empty cells
      }
      // Trim if too many columns - this ensures proper column alignment
      if (row.length > expectedCols) {
        row = row.slice(0, expectedCols);
      }
    }

    // Only add row if it has at least one non-empty cell, or if we have headers to match
    if (row.length > 0) {
      rows.push(row);
      console.log(`ReportsTable: Row ${rowIndex + 1} extracted with ${row.length} cells:`, row.slice(0, 5)); // Log first 5 cells only
    } else {
      console.warn(`ReportsTable: Row ${rowIndex + 1} has no extractable cells.`);
    }
  });

  return rows;
};

// Extract data from TableTwo component (div-based)
const extractTableTwo = (container, processedRows = new Set()) => {
  const rows = [];

  // Find header (tableHeader)
  const headerDiv = container.querySelector('[class*="tableHeader"]');
  if (headerDiv) {
    const headerRow = [];
    let headerCells = headerDiv.querySelectorAll('[class*="tableHeaderFontStyle"]');

    // If no cells with that class, get all direct children
    if (headerCells.length === 0) {
      headerCells = Array.from(headerDiv.children).filter(child =>
        child.tagName === 'DIV' && (child.textContent || '').trim()
      );
    }

    headerCells.forEach((cell) => {
      const text = (cell.textContent || '').trim();
      if (text) headerRow.push(text);
    });
    if (headerRow.length) rows.push(headerRow);
  }

  // Find data rows (tableData) - only get direct children of tableBodyScroll, not nested ones
  const tableBodyScroll = container.querySelector('[class*="tableBodyScroll"]');
  let dataRows = [];

  if (tableBodyScroll) {
    // Get only direct children with tableData class, not nested ones
    // React fragments don't create DOM nodes, so children should be direct
    dataRows = Array.from(tableBodyScroll.children).filter(child => {
      // Skip text nodes and non-element nodes
      if (child.nodeType !== 1) return false;

      const classStr = typeof child.className === 'string' ? child.className :
        (child.className?.baseVal || '');
      return classStr.includes('tableData');
    });
  } else {
    // Fallback: query all but filter out nested ones
    const allDataRows = container.querySelectorAll('[class*="tableData"]');
    dataRows = Array.from(allDataRows).filter(rowDiv => {
      // Only include if it's a direct child of tableBodyScroll
      const parent = rowDiv.parentElement;
      if (!parent) return false;

      const parentClass = typeof parent.className === 'string' ? parent.className :
        (parent.className?.baseVal || '');
      // Must be direct child of tableBodyScroll, not nested inside another tableData
      return parentClass.includes('tableBodyScroll') &&
        !rowDiv.querySelector('[class*="tableData"]'); // No nested tableData children
    });
  }

  // Remove duplicates by checking if row is already in processedRows
  // Also ensure we're not getting nested tableData divs
  dataRows = dataRows.filter((rowDiv, idx) => {
    // Skip if already processed
    if (processedRows.has(rowDiv)) {
      console.warn(`TableTwo: Row ${idx} already in processedRows, skipping`);
      return false;
    }

    // Ensure this is a direct child (not nested)
    const parent = rowDiv.parentElement;
    if (!parent) return false;

    const parentClass = typeof parent.className === 'string' ? parent.className :
      (parent.className?.baseVal || '');

    // Must be direct child of tableBodyScroll
    if (!parentClass.includes('tableBodyScroll')) {
      console.warn(`TableTwo: Row ${idx} parent is not tableBodyScroll, skipping`);
      return false;
    }

    // Don't check for nested tableData - the row itself has tableData class
    // This check was incorrectly skipping all rows

    return true;
  });

  console.log('TableTwo: Found', dataRows.length, 'unique data rows');

  dataRows.forEach((rowDiv, rowIndex) => {
    // Skip if this row has already been processed (avoid duplicates)
    if (processedRows.has(rowDiv)) {
      console.warn(`TableTwo: Row ${rowIndex + 1} already processed, skipping duplicate`);
      return;
    }
    processedRows.add(rowDiv);

    const row = [];

    // Get direct children - these are the cells created by tableDataValues.map()
    // React fragments don't create DOM nodes, so children should be direct
    let cells = Array.from(rowDiv.children);

    // Filter out any non-cell elements (like React fragment wrappers that might exist)
    cells = cells.filter(child => {
      // Skip empty text nodes
      if (child.nodeType === 3) return false;
      // Include divs, spans, and other element nodes
      return child.nodeType === 1;
    });

    // If no direct children, try finding cells by structure
    if (cells.length === 0) {
      // Try finding all divs that look like cells (direct children only)
      const potentialCells = Array.from(rowDiv.children).filter(child =>
        child.tagName === 'DIV' || child.tagName === 'SPAN'
      );
      if (potentialCells.length > 0) {
        cells = potentialCells;
      }
    }

    console.log(`TableTwo: Row ${rowIndex + 1} has ${cells.length} cells`);

    // Skip rows with no cells
    if (cells.length === 0) {
      console.warn(`TableTwo: Row ${rowIndex + 1} has 0 cells. Skipping.`);
      return;
    }

    cells.forEach((cell, cellIndex) => {
      let cellText = '';

      // Each cell is from tableDataValues.map()
      // Extract the main text content, excluding tooltips/icons
      // Clone to avoid modifying original
      const clone = cell.cloneNode(true);

      // Remove tooltips, popovers, and other UI elements that shouldn't be in the export
      clone.querySelectorAll('[class*="Tooltip"], [class*="tooltip"], [class*="Mui"], [role="tooltip"], [aria-owns], svg, [class*="Popover"], [class*="popover"], [class*="Popover-paper"]').forEach(el => el.remove());

      // Get text content from the cleaned clone
      cellText = (clone.textContent || '').trim();

      // Clean up: remove extra whitespace and newlines
      cellText = cellText.replace(/\s+/g, ' ').trim();

      // Handle special cases
      if (cellText === '-' || cellText === '—') {
        row.push('');
      } else {
        row.push(cellText || '');
      }
    });

    // If still no cells found, skip this row (don't create rows from text splitting)
    if (row.length === 0) {
      console.warn(`TableTwo: Row ${rowIndex + 1} has no extractable cells. Skipping.`);
      return; // Skip this row entirely
    }

    // Ensure row has same number of columns as header (pad with empty strings if needed)
    if (rows.length > 0 && rows[0].length > 0) {
      const expectedCols = rows[0].length; // Header column count
      while (row.length < expectedCols) {
        row.push(''); // Pad with empty cells
      }
      // Trim if too many columns
      if (row.length > expectedCols) {
        row.splice(expectedCols);
      }

      // Filter out duplicate rows: rows where the first (and only) non-empty cell 
      // matches the last column of the previous row - these are fragment wrappers
      const nonEmptyCells = row.filter(cell => cell && cell.trim() !== '');
      if (nonEmptyCells.length === 1 && expectedCols > 1) {
        // Check if this single cell matches the last column of the previous row
        const lastRow = rows[rows.length - 1];
        if (lastRow && lastRow.length > 0) {
          const lastCellOfPreviousRow = lastRow[lastRow.length - 1];
          if (lastCellOfPreviousRow && row[0] === lastCellOfPreviousRow) {
            console.warn(`TableTwo: Row ${rowIndex + 1} appears to be a duplicate fragment (single cell matches previous row's last column). Skipping.`);
            return; // Skip this duplicate row
          }
        }
        // Only skip if it's clearly a duplicate - otherwise keep single-cell rows
        // (some tables might legitimately have single-cell rows)
      }
    }

    if (row.length > 0) {
      rows.push(row);
      console.log(`TableTwo: Row ${rowIndex + 1} extracted with ${row.length} cells:`, row);
    } else {
      console.warn(`TableTwo: Row ${rowIndex + 1} has no extractable cells.`);
    }
  });

  return rows;
};

// Extract data from ReportsApplicantWithAllDataTable (card layout with label-value pairs)
const extractApplicantWithAllData = (container) => {
  const rows = [];
  // Cards: top-level divs with rejectionBorderStyle that contain twoColumnGrid (one per applicant)
  const allWithBorder = container.querySelectorAll('[class*="rejectionBorderStyle"]');
  const cards = Array.from(allWithBorder).filter((el) => {
    const hasGrid = el.querySelector('[class*="twoColumnGrid"]');
    const isTopCard = el.closest('[class*="rejectionBorderStyle"]') === el;
    return hasGrid && isTopCard;
  });

  if (cards.length === 0) return rows;

  const getClassStr = (node) => {
    if (!node || !node.className) return '';
    return typeof node.className === 'string' ? node.className : (node.className?.baseVal || '');
  };

  const getLabelValuePairsFromCard = (card) => {
    const grid = card.querySelector('[class*="twoColumnGrid"]');
    if (!grid) return [];

    const pairs = [];
    const children = Array.from(grid.children);

    children.forEach((child) => {
      const classStr = getClassStr(child);

      // Name row: only the row that contains the heading (rejectionHeadingTextStyle).
      // Do not match by "displayInRow" - twoColumnGridInner uses displayInRowCenter which would match.
      const isNameRow = child.querySelector('[class*="rejectionHeadingTextStyle"]');
      if (isNameRow) {
        const nameEl = child.querySelector('[class*="rejectionHeadingTextStyle"]');
        let name = nameEl ? (nameEl.textContent || '').trim().replace(/\s+/g, ' ') : '';
        name = name.replace(/,\s*$/, '').trim(); // remove trailing comma after name
        if (name) pairs.push({ label: 'Name', value: name });

        const typeEl = child.querySelector('[class*="rejectionTextStyle"]:not([class*="rejectionTextStyle1"])');
        const typeVal = typeEl ? (typeEl.textContent || '').trim().replace(/\s+/g, ' ') : '';
        if (typeVal) pairs.push({ label: 'Applicant Type', value: typeVal });

        const declinedEl = child.querySelector('[class*="declinedTextStyle"]');
        if (declinedEl) {
          const status = (declinedEl.textContent || '').trim();
          if (status) pairs.push({ label: 'Status', value: status });
        }
        return;
      }

      // twoColumnGridInner: label + value row (dynamic – works with any fields)
      // Prefer class-based selectors; fallback to structure (first child = label, second = value)
      if (classStr.includes('twoColumnGridInner')) {
        const labelEl = child.querySelector('[class*="rejectionTextStyle"]:not([class*="rejectionTextStyle1"])');
        let valueEl = child.querySelector('[class*="rejectionTextStyle1"]');
        const directChildren = Array.from(child.children).filter((n) => n.nodeType === 1);
        let label = labelEl ? (labelEl.textContent || '').trim().replace(/\s+/g, ' ').replace(/:?\s*$/, '') : '';
        let value = valueEl ? (valueEl.textContent || '').trim().replace(/\s+/g, ' ') : '';
        if (!label && directChildren.length >= 1) {
          label = (directChildren[0].textContent || '').trim().replace(/\s+/g, ' ').replace(/:?\s*$/, '');
        }
        if (!valueEl && directChildren.length >= 2) {
          value = (directChildren[1].textContent || '').trim().replace(/\s+/g, ' ');
        }
        if (label) pairs.push({ label, value: value || '' });
      }
    });

    return pairs;
  };

  const firstCardPairs = getLabelValuePairsFromCard(cards[0]);
  if (firstCardPairs.length === 0) return rows;

  const headers = firstCardPairs.map((p) => p.label);
  rows.push(headers);

  cards.forEach((card) => {
    const pairs = getLabelValuePairsFromCard(card);
    const valueByLabel = {};
    pairs.forEach((p) => { valueByLabel[p.label] = p.value; });
    const row = headers.map((h) => valueByLabel[h] ?? '');
    rows.push(row);
  });

  return rows;
};

// Extract data from mdReportCard layout (appointmentHistorySummary, medical directives, etc.)
const extractMdReportCard = (container) => {
  const rows = [];
  const cards = Array.from(container.querySelectorAll('[class*="mdReportCard"]')).filter(
    (el) => el.closest('[class*="mdReportCard"]') === el
  );
  if (cards.length === 0) return rows;

  const getLabelValuePairsFromCard = (card) => {
    const pairs = [];

    const nameEl = card.querySelector('[class*="mdTitle"]');
    if (nameEl) {
      let name = (nameEl.textContent || '').trim().replace(/\s+/g, ' ');
      name = name.replace(/^\d+\.\s*/, '').trim();
      if (name) pairs.push({ label: 'Name', value: name });
    }

    const idEl = card.querySelector('[class*="mdId"]');
    if (idEl) {
      const id = (idEl.textContent || '').trim().replace(/\s+/g, ' ');
      if (id) pairs.push({ label: 'ID', value: id });
    }

    const descEl = card.querySelector('[class*="mdDesc"]');
    if (descEl) {
      const desc = (descEl.textContent || '').trim().replace(/\s+/g, ' ');
      if (desc) pairs.push({ label: 'Description', value: desc });
    }

    card.querySelectorAll('[class*="mdGrid"]').forEach((grid) => {
      const labelEl = grid.querySelector('[class*="mdLabel"]');
      const valueEl = grid.querySelector('[class*="mdValue"]');
      const label = labelEl ? (labelEl.textContent || '').trim().replace(/\s+/g, ' ').replace(/:?\s*$/, '') : '';
      const value = valueEl ? (valueEl.textContent || '').trim().replace(/\s+/g, ' ') : '';
      if (label) pairs.push({ label, value: value || '' });
    });

    card.querySelectorAll('[class*="mdLabel"]').forEach((labelEl) => {
      if (labelEl.closest('[class*="mdGrid"]')) return;
      const parent = labelEl.parentElement;
      if (!parent) return;
      const valueEl = parent.querySelector('[class*="mdValue"]');
      const label = (labelEl.textContent || '').trim().replace(/\s+/g, ' ').replace(/:?\s*$/, '');
      let value = '';
      if (valueEl) {
        const children = Array.from(valueEl.children).filter((c) => c.nodeType === 1);
        if (children.length > 1) {
          value = children.map((c) => (c.textContent || '').trim().replace(/\s+/g, ' ')).filter(Boolean).join('\n\n');
        } else {
          value = (valueEl.textContent || '').trim().replace(/\s+/g, ' ');
        }
      }
      if (label && !pairs.some((p) => p.label === label)) pairs.push({ label, value: value || '' });
    });

    return pairs;
  };

  const firstCardPairs = getLabelValuePairsFromCard(cards[0]);
  if (firstCardPairs.length === 0) return rows;

  const headers = firstCardPairs.map((p) => p.label);
  rows.push(headers);

  cards.forEach((card) => {
    const pairs = getLabelValuePairsFromCard(card);
    const valueByLabel = {};
    pairs.forEach((p) => { valueByLabel[p.label] = p.value; });
    const row = headers.map((h) => valueByLabel[h] ?? '');
    rows.push(row);
  });

  return rows;
};

// Format worksheet: set column widths, freeze rows, format title/params/header
// paramsRowCount = number of rows for "Reporting Parameters Applied" (heading + param rows)
const formatWorksheet = (ws, rows, paramsRowCount = 0) => {
  if (!rows || rows.length === 0) return;

  // Calculate column widths based on content
  const colWidths = [];
  const maxCols = Math.max(...rows.map(row => row.length));

  for (let col = 0; col < maxCols; col++) {
    let maxLength = 10; // Minimum width
    rows.forEach((row, rowIndex) => {
      const cellValue = row[col];
      if (cellValue !== undefined && cellValue !== null) {
        const cellLength = String(cellValue).length;
        if (rowIndex === 0) maxLength = Math.max(maxLength, cellLength * 1.2);
        else maxLength = Math.max(maxLength, cellLength);
      }
    });
    colWidths.push({ wch: Math.min(Math.max(maxLength, 10), 50) });
  }

  ws['!cols'] = colWidths;

  // Freeze title + params + table header so they stay visible and are not included in sort
  const tableHeaderRowIndex = 1 + paramsRowCount;
  const freezeRowCount = 2 + paramsRowCount; // title + params + table header
  try {
    ws['!freeze'] = {
      xSplit: 0,
      ySplit: freezeRowCount,
      topLeftCell: XLSX.utils.encode_cell({ r: freezeRowCount, c: 0 }),
      activePane: "bottomRight",
      state: "frozen"
    };
  } catch (e) {
    console.warn('Freeze panes not supported in this version of SheetJS');
  }

  // Autofilter from table header row so sorting only affects data rows
  if (rows.length > tableHeaderRowIndex) {
    const dataEndRow = rows.length - 1;
    const dataEndCol = Math.max(0, maxCols - 1);
    try {
      ws['!autofilter'] = {
        ref: XLSX.utils.encode_range({ s: { r: tableHeaderRowIndex, c: 0 }, e: { r: dataEndRow, c: dataEndCol } })
      };
    } catch (e) {
      console.warn('Autofilter not set:', e);
    }
  }

  // Title style: bold, larger font, background - used for Report title and Reporting Parameters Applied
  const titleStyle = {
    font: { bold: true, sz: 14 },
    fill: { fgColor: { rgb: "D0D0D0" } },
    alignment: { horizontal: "left", vertical: "center", wrapText: false },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    }
  };

  // Style row 0 as sheet heading (Report title): bold, larger font, background
  if (rows.length > 0) {
    const headingRow = rows[0];
    headingRow.forEach((_, colIndex) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });
      const cell = ws[cellAddress] || { t: 's', v: headingRow[colIndex] ?? '' };
      ws[cellAddress] = { ...cell, s: titleStyle };
    });
  }

  // Style "Reporting Parameters Applied" heading (row 1) as title when params exist: bold, same look as Report title
  if (paramsRowCount > 0 && rows.length > 1) {
    const paramsHeadingRow = rows[1];
    paramsHeadingRow.forEach((_, colIndex) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 1, c: colIndex });
      const cell = ws[cellAddress] || { t: 's', v: paramsHeadingRow[colIndex] ?? '' };
      ws[cellAddress] = { ...cell, s: titleStyle };
    });
  }

  // Style table header row (column names)
  if (rows.length > tableHeaderRowIndex) {
    const headerRow = rows[tableHeaderRowIndex];
    const headerStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: "E8E8E8" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      }
    };
    headerRow.forEach((_, colIndex) => {
      const cellAddress = XLSX.utils.encode_cell({ r: tableHeaderRowIndex, c: colIndex });
      const cell = ws[cellAddress] || { t: 's', v: headerRow[colIndex] ?? '' };
      ws[cellAddress] = { ...cell, s: headerStyle };
    });
  }
};

export const toExcel = (selector, filename, reportTitle = 'Report') => {
  try {
    const container = document.querySelector(selector);
    if (!container) {
      console.error('Excel export: Container not found for selector:', selector);
      alert('Could not find report content to export.');
      return;
    }

    const wb = XLSX.utils.book_new();
    const usedSheetNames = new Set();
    const reportingParamsRows = extractReportingParams(container);

    // 1. Extract HTML tables
    const htmlTables = container.querySelectorAll('table');
    console.log('Excel export: Found', htmlTables.length, 'HTML tables');

    htmlTables.forEach((table) => {
      const rows = extractHtmlTable(table);
      if (rows.length > 0) {
        const title = getTitleForElement(table, container, reportTitle);
        const { rows: dataRows, paramsRowCount } = rowsWithHeadingAndParams(title, reportingParamsRows, rows);
        const ws = XLSX.utils.aoa_to_sheet(dataRows);
        formatWorksheet(ws, dataRows, paramsRowCount);
        const sheetName = sanitizeSheetName(title, usedSheetNames);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        console.log(`Excel export: Added HTML table sheet "${sheetName}" with ${rows.length} rows`);
      }
    });

    // 2. Extract ReportsTable components (div-based tables)
    // Use a Set to track processed containers and avoid duplicates
    const processedReportsTables = new Set();
    const reportsTableContainers = container.querySelectorAll('[class*="marginTop40"]');
    reportsTableContainers.forEach((reportsTableContainer) => {
      // Skip if already processed (avoid nested duplicates)
      if (processedReportsTables.has(reportsTableContainer)) {
        return;
      }

      // Check if this container has ReportsTable structure
      if (reportsTableContainer.querySelector('[class*="headingBackground"]') ||
        reportsTableContainer.querySelector('[class*="row1Background"]')) {
        // Mark as processed
        processedReportsTables.add(reportsTableContainer);

        const rows = extractReportsTable(reportsTableContainer);
        if (rows.length > 0) {
          // Verify rows structure: each row should be an array of cells
          console.log(`Excel export: ReportsTable has ${rows.length} rows, first row has ${rows[0]?.length || 0} columns`);

          const title = getTitleForElement(reportsTableContainer, container, reportTitle);
          const { rows: dataRows, paramsRowCount } = rowsWithHeadingAndParams(title, reportingParamsRows, rows);
          const ws = XLSX.utils.aoa_to_sheet(dataRows);
          formatWorksheet(ws, dataRows, paramsRowCount);
          const sheetName = sanitizeSheetName(title, usedSheetNames);
          XLSX.utils.book_append_sheet(wb, ws, sheetName);
          console.log(`Excel export: Added ReportsTable sheet "${sheetName}" with ${rows.length} rows`);
        }
      }
    });

    // 3. Extract TableTwo components
    const tableTwoContainers = container.querySelectorAll('[class*="tableBodyScroll"], [class*="tableHeader"]');
    const processedContainers = new Set();
    const processedRows = new Set(); // Track processed rows to avoid duplicates

    tableTwoContainers.forEach((tableTwoContainer) => {
      // Find parent container to avoid duplicates
      const parent = tableTwoContainer.closest('[class*="tableBodyScroll"]')?.parentElement ||
        tableTwoContainer.closest('[class*="tableHeader"]')?.parentElement;
      if (parent && !processedContainers.has(parent)) {
        processedContainers.add(parent);
        const rows = extractTableTwo(parent, processedRows);
        if (rows.length > 0) {
          const title = getTitleForElement(parent, container, reportTitle);
          const { rows: dataRows, paramsRowCount } = rowsWithHeadingAndParams(title, reportingParamsRows, rows);
          const ws = XLSX.utils.aoa_to_sheet(dataRows);
          formatWorksheet(ws, dataRows, paramsRowCount);
          const sheetName = sanitizeSheetName(title, usedSheetNames);
          XLSX.utils.book_append_sheet(wb, ws, sheetName);
          console.log(`Excel export: Added TableTwo sheet "${sheetName}" with ${rows.length} rows`);
        }
      }
    });

    // 4. Extract ReportsApplicantWithAllDataTable (card layout with label-value pairs)
    const applicantWithAllDataRows = extractApplicantWithAllData(container);
    if (applicantWithAllDataRows.length > 0) {
      const applicantSection = container.querySelector('[class*="applicantWithAllData"], [class*="ReportApplicantWithAllData"]') || container;
      const title = getTitleForElement(applicantSection, container, reportTitle);
      const { rows: dataRows, paramsRowCount } = rowsWithHeadingAndParams(title, reportingParamsRows, applicantWithAllDataRows);
      const ws = XLSX.utils.aoa_to_sheet(dataRows);
      formatWorksheet(ws, dataRows, paramsRowCount);
      const sheetName = sanitizeSheetName(title, usedSheetNames);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      console.log(`Excel export: Added ApplicantWithAllData sheet "${sheetName}" with ${applicantWithAllDataRows.length} rows`);
    }

    // 5. Extract mdReportCard layout (appointmentHistorySummary, medical directives, etc.)
    const mdReportCardRows = extractMdReportCard(container);
    if (mdReportCardRows.length > 0) {
      const mdReportSection = container.querySelector('[class*="mdReportCard"], [class*="appointmentHistorySummary"]') || container;
      const title = getTitleForElement(mdReportSection, container, reportTitle);
      const { rows: dataRows, paramsRowCount } = rowsWithHeadingAndParams(title, reportingParamsRows, mdReportCardRows);
      const ws = XLSX.utils.aoa_to_sheet(dataRows);
      formatWorksheet(ws, dataRows, paramsRowCount);
      const sheetName = sanitizeSheetName(title, usedSheetNames);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      console.log(`Excel export: Added MdReportCard sheet "${sheetName}" with ${mdReportCardRows.length} rows`);
    }

    if (wb.SheetNames.length === 0) {
      console.error('Excel export: No sheets created');
      alert('No data found to export. Make sure the report has loaded.');
      return;
    }

    const outFilename = `${filename || 'report'}.xlsx`;
    console.log('Excel export: Writing file:', outFilename, 'with', wb.SheetNames.length, 'sheets');
    XLSX.writeFile(wb, outFilename);
    console.log('Excel export: File download initiated');
  } catch (e) {
    // Fallback: export CSV (opens in Excel) if xlsx fails
    console.error('Excel export failed:', e);
    console.warn('Falling back to CSV export');
    exportCsvFromTables(selector, filename);
  }
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const escapeCsvCell = (value) => {
  const s = String(value ?? '');
  // Quote if it contains comma, quote, or newline
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
};

const exportCsvFromTables = (selector, filename) => {
  const container = document.querySelector(selector);
  if (!container) return;

  let fileIndex = 0;

  // HTML tables
  const htmlTables = container.querySelectorAll('table');
  htmlTables.forEach((table) => {
    const rows = extractHtmlTable(table);
    if (rows.length > 0) {
      const csv = rows.map((r) => r.map(escapeCsvCell).join(',')).join('\n');
      const outFilename = `${filename || 'report'}_Table_${++fileIndex}.csv`;
      downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), outFilename);
    }
  });

  // ReportsTable components
  const reportsTableContainers = container.querySelectorAll('[class*="marginTop40"]');
  reportsTableContainers.forEach((reportsTableContainer) => {
    if (reportsTableContainer.querySelector('[class*="headingBackground"]') ||
      reportsTableContainer.querySelector('[class*="row1Background"]')) {
      const rows = extractReportsTable(reportsTableContainer);
      if (rows.length > 0) {
        const csv = rows.map((r) => r.map(escapeCsvCell).join(',')).join('\n');
        const outFilename = `${filename || 'report'}_Table_${++fileIndex}.csv`;
        downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), outFilename);
      }
    }
  });

  // TableTwo components
  const tableTwoContainers = container.querySelectorAll('[class*="tableBodyScroll"], [class*="tableHeader"]');
  const processedContainers = new Set();
  tableTwoContainers.forEach((tableTwoContainer) => {
    const parent = tableTwoContainer.closest('[class*="tableBodyScroll"]')?.parentElement ||
      tableTwoContainer.closest('[class*="tableHeader"]')?.parentElement;
    if (parent && !processedContainers.has(parent)) {
      processedContainers.add(parent);
      const rows = extractTableTwo(parent);
      if (rows.length > 0) {
        const csv = rows.map((r) => r.map(escapeCsvCell).join(',')).join('\n');
        const outFilename = `${filename || 'report'}_Table_${++fileIndex}.csv`;
        downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), outFilename);
      }
    }
  });

  // ReportsApplicantWithAllDataTable (card layout)
  const applicantWithAllDataRows = extractApplicantWithAllData(container);
  if (applicantWithAllDataRows.length > 0) {
    const csv = applicantWithAllDataRows.map((r) => r.map(escapeCsvCell).join(',')).join('\n');
    const outFilename = `${filename || 'report'}_Table_${++fileIndex}.csv`;
    downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), outFilename);
  }

  // mdReportCard layout (appointmentHistorySummary, medical directives, etc.)
  const mdReportCardRows = extractMdReportCard(container);
  if (mdReportCardRows.length > 0) {
    const csv = mdReportCardRows.map((r) => r.map(escapeCsvCell).join(',')).join('\n');
    const outFilename = `${filename || 'report'}_Table_${++fileIndex}.csv`;
    downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), outFilename);
  }
};
