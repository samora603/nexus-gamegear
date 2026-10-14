export interface CategoryEditInput {
  name?: string
  displayTitle?: string
  cardLabel?: string
  sortOrder?: number
  published?: boolean
}

export interface CategoryWrite {
  name: string
  display_title: string
  card_label: string
  sort_order: number
  published: boolean
}

export interface PillDraft {
  id?: string | null
  label?: string
  published?: boolean
}

export interface StoredPill {
  id: string
  slug: string
}

export function validateCategoryEdit(
  input: CategoryEditInput,
): { ok: true; value: CategoryWrite } | { ok: false; field: string; message: string }

export function movePill<T>(pills: T[], index: number, direction: number): T[]

export function planPillWrites(
  existing: StoredPill[],
  drafts: PillDraft[],
):
  | {
      ok: true
      updates: { id: string; label: string; sort_order: number; published: boolean }[]
      inserts: { slug: string; label: string; sort_order: number; published: boolean }[]
      deletes: string[]
    }
  | { ok: false; errors: { index: number; message: string }[] }

export function mapCategoryWriteError(error: { code?: string; message?: string } | null): string | null

export function confirmAffectedRows(
  error: { code?: string; message?: string } | null,
  rows: { id?: string }[] | null | undefined,
  expectedCount: number,
): string | null
