type UpdateBodyToSelect<T> = Partial<Record<keyof T, boolean>>
export function updateBodyToSelect<T>(updateBody: any): UpdateBodyToSelect<T> {
  const select: UpdateBodyToSelect<T> = {}
  for (let key in updateBody) {
    select[key as keyof T] = true
  }
  return select
}
