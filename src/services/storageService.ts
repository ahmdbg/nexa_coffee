import { STORAGE_BACKUP_KEY, STORAGE_KEY } from '../constants';
import { createDemoData } from '../data/demoData';
import { nexadeskDataSchema } from '../schemas';
import type { NexaDeskData, ServiceResult } from '../types';

export interface StorageReadResult {
  status: 'ok' | 'initialized' | 'corrupted';
  data?: NexaDeskData;
  rawCorrupted?: string;
  error?: string;
}

class StorageService {
  validateData(raw: unknown): ServiceResult<NexaDeskData> {
    const parsed = nexadeskDataSchema.safeParse(raw);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return {
        success: false,
        error: firstIssue
          ? `${firstIssue.path.join('.')}: ${firstIssue.message}`
          : 'Invalid NexaDesk data structure.',
      };
    }
    return { success: true, data: parsed.data as NexaDeskData };
  }

  initializeOrLoad(): StorageReadResult {
    try {
      const rawText = window.localStorage.getItem(STORAGE_KEY);
      if (!rawText) {
        const seed = createDemoData();
        const saved = this.saveData(seed);
        if (!saved.success) {
          return {
            status: 'corrupted',
            error: saved.error ?? 'Failed to initialize local storage.',
          };
        }
        return { status: 'initialized', data: seed };
      }

      let parsedJson: unknown;
      try {
        parsedJson = JSON.parse(rawText);
      } catch {
        return {
          status: 'corrupted',
          rawCorrupted: rawText,
          error: 'Stored JSON is malformed and could not be parsed.',
        };
      }

      const validation = this.validateData(parsedJson);
      if (!validation.success || !validation.data) {
        return {
          status: 'corrupted',
          rawCorrupted: rawText,
          error: validation.error ?? 'Stored dataset failed schema validation.',
        };
      }

      return { status: 'ok', data: validation.data };
    } catch (err) {
      return {
        status: 'corrupted',
        error: err instanceof Error ? err.message : 'Unable to access browser Local Storage.',
      };
    }
  }

  getData(): ServiceResult<NexaDeskData> {
    try {
      const rawText = window.localStorage.getItem(STORAGE_KEY);
      if (!rawText) {
        return { success: false, error: 'No data found in Local Storage.' };
      }
      const parsed = JSON.parse(rawText);
      return this.validateData(parsed);
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to read Local Storage.',
      };
    }
  }

  saveData(data: NexaDeskData): ServiceResult<NexaDeskData> {
    const validation = this.validateData(data);
    if (!validation.success || !validation.data) {
      return {
        success: false,
        error: validation.error ?? 'Refused to persist invalid application state.',
      };
    }

    try {
      const serialized = JSON.stringify(validation.data);
      window.localStorage.setItem(STORAGE_KEY, serialized);
      return { success: true, data: validation.data };
    } catch (err) {
      const isQuota =
        err instanceof DOMException &&
        (err.name === 'QuotaExceededError' || err.code === 22);
      return {
        success: false,
        error: isQuota
          ? 'Browser storage quota exceeded. Please export a backup and free up space.'
          : err instanceof Error
          ? err.message
          : 'Failed to write to Local Storage.',
      };
    }
  }

  updateData(
    updater: (current: NexaDeskData) => NexaDeskData
  ): ServiceResult<NexaDeskData> {
    const currentResult = this.getData();
    if (!currentResult.success || !currentResult.data) {
      return {
        success: false,
        error: currentResult.error ?? 'Current application state is unavailable.',
      };
    }
    const nextData = updater(structuredClone(currentResult.data));
    return this.saveData(nextData);
  }

  createBackup(): ServiceResult<string> {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return { success: false, error: 'No active data to back up.' };
      }
      window.localStorage.setItem(STORAGE_BACKUP_KEY, raw);
      return { success: true, data: raw };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to create local backup.',
      };
    }
  }

  restoreBackup(): ServiceResult<NexaDeskData> {
    try {
      const backupRaw = window.localStorage.getItem(STORAGE_BACKUP_KEY);
      if (!backupRaw) {
        return { success: false, error: 'No local backup snapshot found.' };
      }
      const parsed = JSON.parse(backupRaw);
      const validation = this.validateData(parsed);
      if (!validation.success || !validation.data) {
        return { success: false, error: validation.error ?? 'Backup snapshot is invalid.' };
      }
      return this.saveData(validation.data);
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to restore backup.',
      };
    }
  }

  resetData(): ServiceResult<NexaDeskData> {
    this.createBackup();
    const freshDemo = createDemoData();
    return this.saveData(freshDemo);
  }

  exportData(): ServiceResult<string> {
    const current = this.getData();
    if (!current.success || !current.data) {
      return { success: false, error: current.error };
    }
    return {
      success: true,
      data: JSON.stringify(current.data, null, 2),
    };
  }

  importData(rawJsonText: string): ServiceResult<NexaDeskData> {
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawJsonText);
    } catch {
      return { success: false, error: 'Uploaded file is not valid JSON.' };
    }

    const validation = this.validateData(parsed);
    if (!validation.success || !validation.data) {
      return { success: false, error: validation.error };
    }

    const backupAttempt = this.createBackup();
    const saveResult = this.saveData(validation.data);
    if (!saveResult.success) {
      if (backupAttempt.success) {
        this.restoreBackup();
      }
      return saveResult;
    }
    return saveResult;
  }

  getStorageUsageBytes(): number {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? new Blob([raw]).size : 0;
    } catch {
      return 0;
    }
  }
}

export const storageService = new StorageService();
