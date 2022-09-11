export type Falsy = null | undefined | '' | false | 0
export function isTruthy<T>(v: T | Falsy): v is T {
  return v !== null && v !== undefined && v !== '' && v !== false && v !== 0
}
