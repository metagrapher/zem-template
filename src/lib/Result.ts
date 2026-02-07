export type Result<T, E = Error> = 
  | { ok: true; value: T }
  | { ok: false; error: E }

export const Ok = <T, E>(value: T): Result<T, E> => ({ ok: true, value })
export const Fail = <T, E>(error: E): Result<T, E> => ({ ok: false, error })

export const isOk = <T, E>(res: Result<T, E>): res is { ok: true; value: T } => res.ok
export const isFail = <T, E>(res: Result<T, E>): res is { ok: false; error: E } => !res.ok
