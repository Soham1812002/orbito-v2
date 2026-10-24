import apiClient from "./api";
import { showToast } from "@/lib/toast";

/**
 * Downloads a streamed file (e.g. CSV or Excel) from the backend API.
 * Uses native browser streaming download via Blob and dynamically extracts the RFC-compliant
 * filename provided by the backend's Content-Disposition header.
 *
 * @param endpoint The API endpoint (e.g. "/vehicles/export", "/users/export")
 * @param defaultFilename Fallback filename if backend does not specify one
 * @param params Optional query parameters (filters, date range, search)
 */
export async function downloadStreamFile(
  endpoint: string,
  defaultFilename: string,
  params?: Record<string, any>
): Promise<void> {
  try {
    showToast.info("Preparing export stream...");

    const response = await apiClient.get(endpoint, {
      params,
      responseType: "blob"
    });

    // Extract filename from Content-Disposition header if present
    let filename = defaultFilename;
    const disposition = response.headers["content-disposition"];
    if (disposition && disposition.includes("filename=")) {
      const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match && match[1]) {
        filename = decodeURIComponent(match[1].replace(/['"]/g, ""));
      }
    }

    // Create a temporary object URL and trigger download
    const contentType = String(response.headers["content-type"] || "text/csv;charset=utf-8;");
    const blob = new Blob([response.data], { type: contentType });
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);

    showToast.success(`Export downloaded: ${filename}`);
  } catch (error: any) {
    showToast.error(error.message || "Failed to download export. Please try again.");
    throw error;
  }
}
