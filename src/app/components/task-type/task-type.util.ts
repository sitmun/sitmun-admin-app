/** Builds the read-only task type identifier shown in list and form screens. */
export function formatTaskTypeIdentifier(id: number, name?: string | null): string {
  return name ? `${id} (${name})` : `${id}`;
}
