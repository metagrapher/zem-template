import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Ok, Fail, isOk } from '../src/lib/Result.ts'

test('Result Core: Ok should create success value', () => {
  const res = Ok(42)
  assert.equal(isOk(res), true)
  if (isOk(res)) assert.equal(res.value, 42)
})

test('Result Core: Fail should create error value', () => {
  const res = Fail('error')
  assert.equal(isOk(res), false)
})

test('Result Functional: map should transform value', () => {
  // @ts-ignore
  const res = Ok(21).map(n => n * 2)
  if (isOk(res)) assert.equal(res.value, 42)
})

test('Result Functional: flatMap should chain Results', () => {
  // @ts-ignore
  const res = Ok(21).flatMap(n => Ok(n * 2))
  if (isOk(res)) assert.equal(res.value, 42)
})
