export interface ResumeType {
  /** The single stable path, consumed by every resume CTA on the site. */
  filePath: string;
  downloadLabel: string;
  viewLabel: string;
  fileType: string;
  /**
   * Shown before the visitor commits to the download, so it lives in the data
   * rather than being computed at runtime.
   */
  fileSize: string;
}
