import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn()
}
global.localStorage = localStorageMock

// Mock Bootstrap modal
global.bootstrap = {
    Modal: class {
        constructor() {
            this.show = vi.fn()
            this.hide = vi.fn()
        }
    }
}