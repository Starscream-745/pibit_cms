import validator from 'validator';

/**
 * Sanitizes user input to prevent XSS attacks
 * Escapes HTML entities and removes potentially dangerous characters
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Escape HTML entities to prevent XSS
  let sanitized = validator.escape(input);
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  return sanitized;
}

/**
 * Sanitizes description field specifically
 * Allows more characters but still prevents XSS
 */
export function sanitizeDescription(description: string): string {
  if (!description || typeof description !== 'string') {
    return '';
  }

  // Escape HTML but preserve line breaks
  let sanitized = validator.escape(description);
  
  // Trim excessive whitespace but preserve intentional spacing
  sanitized = sanitized.trim();
  
  return sanitized;
}

/**
 * Sanitizes all string fields in an object
 * EXCEPT URLs which should not be escaped
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Don't sanitize URLs - they need special characters like &, ?, =
      if (key === 'url') {
        sanitized[key] = value.trim();
      } else if (key === 'description') {
        sanitized[key] = sanitizeDescription(value);
      } else {
        sanitized[key] = sanitizeInput(value);
      }
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized as T;
}
