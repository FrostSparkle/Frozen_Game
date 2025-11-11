import { JSDOM } from 'jsdom';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dom = new JSDOM(`<!DOCTYPE html><html><body><main id="test-output"></main></body></html>`, {
    url: 'http://localhost/'
});

globalThis.window = dom.window;
globalThis.document = dom.window.document;
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Element = dom.window.Element;
globalThis.Node = dom.window.Node;
globalThis.DOMTokenList = dom.window.DOMTokenList;
globalThis.CustomEvent = dom.window.CustomEvent;

const runnerUrl = pathToFileURL(path.join(__dirname, 'testRunner.js'));
const { run, reportError } = await import(runnerUrl.href);

try {
    await Promise.all([
        import(pathToFileURL(path.join(__dirname, 'wardrobe.test.js')).href),
        import(pathToFileURL(path.join(__dirname, 'characters.test.js')).href)
    ]);

    const result = await run();

    console.log(`Test summary: ${result.passed}/${result.total} passed`);

    const logEntries = Array.from(document.querySelectorAll('.test-result')).map((node) => node.textContent);
    logEntries.forEach((line) => console.log(line));
} catch (error) {
    reportError(error);
    console.error('Failed to execute tests', error);

    const logEntries = Array.from(document.querySelectorAll('.test-result')).map((node) => node.textContent);
    if (logEntries.length > 0) {
        logEntries.forEach((line) => console.log(line));
    }
}

