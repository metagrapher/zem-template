import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execSafe } from '../scripts/sync-issues.mjs'

test('execSafe should return ok: true on success', async (t) => {
    const result = execSafe('echo test')
    assert.strictEqual(result.ok, true)
    assert.strictEqual(result.value, 'test')
})

test('execSafe should return ok: false on failure', async (t) => {
    const result = execSafe('non-existent-command')
    assert.strictEqual(result.ok, false)
    assert.ok(result.error)
})
