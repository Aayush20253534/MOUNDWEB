import { describe, expect, it } from 'vitest';
import { createApp } from './app.js';
describe('API foundation', () => { it('constructs an Express application', () => expect(typeof createApp()).toBe('function')); });
