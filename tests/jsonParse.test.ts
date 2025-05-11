// src/__tests__/parsers/jsonParser.test.ts

// Make sure you import the correct function name (parseJSON)
import { parseJSON } from '../src/parsers/jsonParser';
import * as path from 'path';
// Use fs/promises for consistency if doing async file operations in tests too
import * as fs from 'fs/promises';
// Or use synchronous fs for setup/teardown if preferred
// import * as fsSync from 'fs';

describe('JSON Parser (Async)', () => {
    // --- Define Paths ---
    const dataDir = path.resolve(__dirname, '../../data');
    const testDataDir = path.resolve(__dirname, '../data');

    const validJsonPath = path.join(dataDir, 'stores.json');
    const emptyJsonPath = path.join(testDataDir, 'empty.json'); // Need to create this
    const invalidJsonPath = path.join(testDataDir, 'invalid.json'); // Need to create this
    const nonExistentPath = path.join(testDataDir, 'nonexistent.json');

    // --- Test Setup/Teardown Helpers (Async version) ---
    const createTestFile = async (filePath: string, content: string) => {
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, content, 'utf-8');
    };

    const cleanupTestFile = async (filePath: string) => {
        try {
            await fs.unlink(filePath);
        } catch (error: any) {
            // Ignore errors if file doesn't exist (e.g., test failed before cleanup)
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
    };

    // --- Test Cases ---

    // Mark the test function as 'async'
    it('should parse a valid JSON file correctly', async () => {
        // Use 'await' when calling the async parseJSON function
        const result = await parseJSON(validJsonPath);

        // Now 'result' holds the actual parsed data (the array), not the Promise
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2); // Access .length on the resolved array - THIS IS THE FIX
        expect(result[0].StoreName).toBe('Digital Central');
        expect(result[0].Services).toEqual(['Electronics', 'Gadgets']);
        expect(result[1].StoreID).toBe(102);
        expect(result[1].Location).toBe('50 Tech Road');
    });

    // Use async/await for setup/teardown if using async helpers
    it('should throw an error for invalid JSON content', async () => {
        const invalidContent = '{"key": "value",'; // Malformed JSON
        await createTestFile(invalidJsonPath, invalidContent);

        // For testing async functions that throw errors, use await expect().rejects
        await expect(parseJSON(invalidJsonPath))
            .rejects // Expect the promise returned by parseJSON to be rejected
            .toThrow(/Failed to parse JSON: Unexpected end of JSON input/); // Check error message

        await cleanupTestFile(invalidJsonPath);
    });

    it('should throw an error if the JSON file does not exist', async () => {
        // Ensure the file really doesn't exist before the test
        await cleanupTestFile(nonExistentPath);

        await expect(parseJSON(nonExistentPath))
            .rejects
            // Check the error message thrown by your parseJSON function
            // It likely includes the original fs error message
            .toThrow(/Failed to parse JSON: ENOENT: no such file or directory/);
    });

    // Decide how to handle an empty file. JSON.parse('') throws.
    // Your current implementation will throw.
    it('should throw an error for an empty JSON file', async () => {
        await createTestFile(emptyJsonPath, ''); // Create empty file
        await expect(parseJSON(emptyJsonPath))
              .rejects
              .toThrow(/Failed to parse JSON: Unexpected end of JSON input/); // JSON.parse('') throws this
        await cleanupTestFile(emptyJsonPath);
    });

     it('should parse JSON with various data types', async () => {
        const complexJsonPath = path.join(testDataDir, 'complex.json');
        const complexData = {
            name: "Test",
            count: 123,
            isActive: true,
            items: [1, "two", null],
            nested: { id: "abc" },
            isNull: null
        };
        await createTestFile(complexJsonPath, JSON.stringify(complexData));

        const result = await parseJSON(complexJsonPath); // Await the result

        expect(result).toEqual(complexData); // Compare the resolved object
        await cleanupTestFile(complexJsonPath);
     });
});