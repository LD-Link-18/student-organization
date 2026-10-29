/**
 * Downloads `rows` (the first one being the headings) as a CSV file that opens in Excel with Turkish
 * characters intact (UTF-8 with BOM). The forms are public, so a value that starts like a formula (=, +, -, @)
 * gets a leading ' to stay text instead of running in the spreadsheet.
 */
export function downloadCsv(name: string, rows: string[][]) {
  const cell = (v: string) => `"${(/^[=+\-@\t\r]/.test(v) ? `'${v}` : v).replaceAll('"', '""')}"`;
  const text = rows.map((r) => r.map(cell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["﻿" + text], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

/** 5321234567 → +90 532 123 45 67 */
export const formatPhone = (p: string) => `+90 ${p.slice(0, 3)} ${p.slice(3, 6)} ${p.slice(6, 8)} ${p.slice(8)}`;
