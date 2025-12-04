/**
 * Utility functions for detecting and processing job numbers
 */

/**
 * Detects if the input text matches a job number pattern
 * Pattern: "job-" followed by alphanumeric characters and hyphens (case-insensitive)
 * Examples: "JOB-20251204-A5E92", "job-2025-123", "JOB-ABC-123"
 * Triggers as soon as "job-" is typed (case-insensitive)
 */
export function isJobNumberPattern(text: string): boolean {
  if (!text || text.trim().length === 0) {
    return false;
  }

  const trimmedText = text.trim();
  
  // Check if text starts with "job-" (case-insensitive) and contains only
  // alphanumeric characters and hyphens after the prefix
  // This will trigger as soon as user types "job-" or "JOB-"
  const jobNumberPattern = /^job-[a-z0-9-]*$/i;
  
  return jobNumberPattern.test(trimmedText);
}

/**
 * Converts job number text to uppercase
 * Only converts the job number portion if pattern is detected
 */
export function convertJobNumberToUppercase(text: string): string {
  if (!isJobNumberPattern(text)) {
    return text;
  }

  // Convert entire text to uppercase if it matches job number pattern
  return text.toUpperCase();
}

