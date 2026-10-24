import { Response } from "express";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { logger } from "../configs/logger.js";

export interface ExportColumn<T = any> {
  key: string;
  label: string;
  format?: (value: any, row: T) => string | number;
}

/**
 * Escapes a single CSV value according to RFC 4180:
 * - Wraps fields in double quotes if they contain commas, double quotes, or newlines.
 * - Doubles any internal double quotes (" -> "").
 */
export function escapeCsvCell(val: unknown): string {
  if (val === null || val === undefined) {
    return "";
  }
  const str = String(val);
  if (str.includes('"') || str.includes(",") || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Formats a record into a CSV row string according to column definitions.
 */
export function formatCsvRow<T = any>(row: T, columns: ExportColumn<T>[]): string {
  const cells = columns.map((col) => {
    const rawVal = (row as any)[col.key];
    const formatted = col.format ? col.format(rawVal, row) : rawVal;
    return escapeCsvCell(formatted);
  });
  return cells.join(",") + "\r\n";
}

/**
 * High-performance streaming CSV exporter.
 * Streams records directly to the Express response using Node.js stream pipeline
 * to ensure constant O(1) memory footprint regardless of dataset size.
 */
export async function streamCsvResponse<T = any>(
  res: Response,
  filename: string,
  columns: ExportColumn<T>[],
  fetchRows: (batchSize: number, offset: number) => Promise<T[]>,
  batchSize = 500
): Promise<void> {
  const safeFilename = filename.endsWith(".csv") ? filename : `${filename}.csv`;

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(safeFilename)}"`);
  res.setHeader("Transfer-Encoding", "chunked");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  // UTF-8 BOM so Microsoft Excel correctly decodes UTF-8 characters
  res.write("\uFEFF");

  // Write CSV header row
  const headerRow = columns.map((c) => escapeCsvCell(c.label)).join(",") + "\r\n";
  res.write(headerRow);

  let offset = 0;
  let hasMore = true;

  try {
    while (hasMore) {
      if (res.writableEnded || res.destroyed) {
        logger.warn(`Client disconnected during streaming export of ${safeFilename}`);
        break;
      }

      const rows = await fetchRows(batchSize, offset);
      if (!rows || rows.length === 0) {
        hasMore = false;
        break;
      }

      for (const row of rows) {
        const rowStr = formatCsvRow(row, columns);
        const canContinue = res.write(rowStr);
        if (!canContinue) {
          // Wait for stream drain if socket buffer is full
          await new Promise<void>((resolve) => res.once("drain", resolve));
        }
      }

      offset += rows.length;
      if (rows.length < batchSize) {
        hasMore = false;
      }
    }
  } catch (error) {
    logger.error(`Error during streaming CSV export: ${safeFilename}`, error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate CSV export stream" });
      return;
    }
  } finally {
    if (!res.writableEnded) {
      res.end();
    }
  }
}
