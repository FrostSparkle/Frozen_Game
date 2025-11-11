const tests = [];
const output = document.getElementById('test-output') || createOutputContainer();

function createOutputContainer() {
    const container = document.createElement('main');
    container.id = 'test-output';
    document.body.appendChild(container);
    return container;
}

function writeResult(message, status) {
    const entry = document.createElement('div');
    entry.className = `test-result ${status}`;
    entry.textContent = message;
    output.appendChild(entry);
}

export function test(name, fn) {
    tests.push({ name, fn });
}

export function assert(condition, message = 'Assertion failed') {
    if (!condition) {
        throw new Error(message);
    }
}

export function assertEqual(actual, expected, message = '') {
    if (actual !== expected) {
        throw new Error(message || `Expected "${expected}" but received "${actual}"`);
    }
}

export function reportError(error) {
    writeResult(`⚠ Test runner error — ${error.message}`, 'fail');
    console.error('Test runner encountered an error', error);
}

export async function run() {
    let passed = 0;
    for (const { name, fn } of tests) {
        try {
            await fn();
            writeResult(`✓ ${name}`, 'pass');
            passed += 1;
        } catch (error) {
            writeResult(`✗ ${name} — ${error.message}`, 'fail');
            console.error(`Test failed: ${name}`, error);
        }
    }

    const summary = document.createElement('div');
    summary.className = 'test-summary';
    summary.textContent = `Passed ${passed}/${tests.length} tests`;
    output.prepend(summary);

    return { passed, total: tests.length };
}

