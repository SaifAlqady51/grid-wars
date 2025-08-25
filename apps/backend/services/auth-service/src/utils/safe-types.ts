export type SafeResult<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export async function safeAsync<T>(
  promise: Promise<T>,
): Promise<SafeResult<T, unknown>> {
  try {
    const data = await promise;
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

export function safeSync<T>(fn: () => T): SafeResult<T, unknown> {
  try {
    const data = fn();
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function hasProperty<T extends string>(
  obj: unknown,
  prop: T,
): obj is Record<T, unknown> {
  return isRecord(obj) && prop in obj;
}

export function getPropertySafe<T>(obj: unknown, prop: string): T | undefined {
  if (isRecord(obj) && prop in obj) {
    return obj[prop] as T;
  }
  return undefined;
}
