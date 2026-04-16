import validator from 'validator';

export class ValidationError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateUrl(url: string): void {
  if (!url || typeof url !== 'string') {
    throw new ValidationError('INVALID_URL', 'URL is required and must be a string');
  }

  const trimmedUrl = url.trim();
  
  if (!trimmedUrl) {
    throw new ValidationError('INVALID_URL', 'URL cannot be empty');
  }

  // Simple validation: must start with http:// or https://
  if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    throw new ValidationError('INVALID_URL', 'URL must start with http:// or https://');
  }

  // Basic URL structure check
  try {
    new URL(trimmedUrl);
  } catch (error) {
    throw new ValidationError('INVALID_URL', 'URL must be a valid HTTP or HTTPS URL');
  }
}

export function validateRequiredFields(data: any, fields: string[]): void {
  for (const field of fields) {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      throw new ValidationError('VALIDATION_ERROR', `${field} is required`);
    }
  }
}
