export type Result<T, E = Error> = {
  ok: boolean
  value?: T
  error?: E
  map: <U>(f: (t: T) => U) => Result<U, E>
  flatMap: <U>(f: (t: T) => Result<U, E>) => Result<U, E>
}

export const Ok = <T, E>(value: T): Result<T, E> => ({
  ok: true,
  value,
  map: (f) => Ok(f(value)),
  flatMap: (f) => f(value)
})

export const Fail = <T, E>(error: E): Result<T, E> => ({
  ok: false,
  error,
  map: () => Fail(error),
  flatMap: () => Fail(error)
})

export const isOk = <T, E>(res: Result<T, E>): res is Required<Pick<Result<T, E>, 'value'>> & { ok: true } => res.ok
export const isFail = <T, E>(res: Result<T, E>): res is Required<Pick<Result<T, E>, 'error'>> & { ok: false } => !res.ok
