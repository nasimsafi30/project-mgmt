import { ALLOWED_FILE_TYPES, FILE_SIZE_LIMIT } from './constants';

interface UploadResult {
  success: boolean;
  url?: string;
  fileName?: string;
  fileSize?: number;
  error?: string;
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > FILE_SIZE_LIMIT) {
    return { valid: false, error: `File too large. Maximum size is ${FILE_SIZE_LIMIT / 1024 / 1024}MB` };
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: `File type "${file.type}" is not allowed` };
  }

  return { valid: true };
}

export async function uploadFile(file: File, taskId?: string): Promise<UploadResult> {
  const validation = validateFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    if (taskId) formData.append('taskId', taskId);

    const response = await fetch('/api/attachments/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Upload failed');

    const data = await response.json();
    return {
      success: true,
      url: data.url || URL.createObjectURL(file),
      fileName: file.name,
      fileSize: file.size,
    };
  } catch (error) {
    return { success: false, error: 'Upload failed' };
  }
}

export async function uploadMultipleFiles(files: File[], taskId?: string): Promise<UploadResult[]> {
  return Promise.all(files.map(file => uploadFile(file, taskId)));
}

export function getFileIcon(fileType: string): string {
  if (fileType.startsWith('image/')) return '🖼️';
  if (fileType === 'application/pdf') return '📄';
  if (fileType.includes('word')) return '📝';
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
  if (fileType.includes('zip') || fileType.includes('compressed')) return '📦';
  if (fileType.startsWith('text/')) return '📃';
  return '📎';
}