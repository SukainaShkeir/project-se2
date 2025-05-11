// src/__tests__/parsers/csvParser.test.ts

import { parseCsv } from '../src/parsers/csvParser'; // Adjust path if needed
import * as path from 'path';
import * as fs from 'fs'; // Import fs for file operations during tests

describe('CSV Parser', () => {
    // --- Define Paths ---
    // Assumes your test execution context makes __dirname relative to the test file
    const dataDir = path.resolve(__dirname, '../../data'); // Path to actual data
    const testDataDir = path.resolve(__dirname, '../data'); // Path to test-specific data

    const validCsvPath = path.join(dataDir, 'stores.csv');
    const emptyCsvPath = path.join(testDataDir, 'empty.csv');
    const headerOnlyCsvPath = path.join(testDataDir, 'header_only.csv');
    const malformedCsvPath = path.join(testDataDir, 'malformed.csv');
    const nonExistentPath = path.join(testDataDir, 'nonexistent.csv');

    // --- Test Setup Helper ---
    // Helper function to create temporary files for tests
    const createTestFile = (filePath: string, content: string) => {
        // Ensure the directory exists (optional, good practice)
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, content, 'utf-8');
    };

    // --- Test Teardown Helper ---
    // Helper function to delete temporary files after tests
    const cleanupTestFile = (filePath: string) => {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    };

    // --- Test Cases ---

    it('should parse a valid CSV file correctly', () => {
        // Assuming stores.csv exists in src/data with the content from the example
        const result = parseCsv(validCsvPath); // No async/await needed

        expect(Array.isArray(result)).toBe(true);
        // Adjust expected length based on your actual stores.csv file
        expect(result.length).toBe(3);

        // Check specific content of the first row (adjust keys/values as needed)
        expect(result[0]).toEqual({
            StoreID: '1',
            StoreName: 'Main Street Goods',
            Location: '123 Main St',
            Manager: 'Alice'
        });

        // Check specific content of other rows (adjust keys/values as needed)
        expect(result[1]).toEqual({
            StoreID: '2',
            StoreName: 'Downtown Corner',
            Location: '456 Market Ave',
            Manager: 'Bob'
        });
         expect(result[2]).toEqual({
             StoreID: '3',
             StoreName: 'Westside Mart',
             Location: '789 Plaza Blvd',
             Manager: 'Charlie'
         });
    });

    it('should return an empty array for an empty CSV file', () => {
        createTestFile(emptyCsvPath, ''); // Create the empty file
        const result = parseCsv(emptyCsvPath); // No async/await
        expect(result).toEqual([]);
        cleanupTestFile(emptyCsvPath); // Clean up the created file
    });

    it('should return an empty array for a CSV file with only headers', () => {
        createTestFile(headerOnlyCsvPath, 'ID,Name,Value\n'); // Create file with header
        const result = parseCsv(headerOnlyCsvPath); // No async/await
        expect(result).toEqual([]);
        cleanupTestFile(headerOnlyCsvPath); // Clean up
    });

    it('should throw an error if the CSV file does not exist', () => {
        // Use expect().toThrow() for synchronous error checking
        expect(() => parseCsv(nonExistentPath)).toThrow(
            `CSV file not found at path: ${nonExistentPath}`
        );
        // Alternative, less specific check:
        // expect(() => parseCsv(nonExistentPath)).toThrow(/file not found/);
    });

    // This test's expectations depend heavily on how robust your CSV parser is.
    // The basic example parser provided earlier has simple behavior for malformed lines.
    it('should handle malformed CSV rows based on parser logic', () => {
        const malformedContent = 'Header1,Header2\nValue1,Value2\nValue3,Value4,ExtraValue5\nOnlyValue6';
        createTestFile(malformedCsvPath, malformedContent);

        const result = parseCsv(malformedCsvPath); // No async/await

        expect(result.length).toBe(3); // Assuming it processes all lines with data

        // Row 1: Correct
        expect(result[0]).toEqual({ Header1: 'Value1', Header2: 'Value2' });

        // Row 2: Extra column (basic split(',') parser likely ignores it)
        expect(result[1]).toEqual({ Header1: 'Value3', Header2: 'Value4' });

        // Row 3: Missing column (basic split(',') parser likely assigns null or undefined)
        expect(result[2]).toEqual({ Header1: 'OnlyValue6', Header2: null }); // Or undefined, depending on implementation detail

        cleanupTestFile(malformedCsvPath); // Clean up
    });

    // Add more tests if needed (e.g., CSV with quoted fields, escaped commas, different delimiters if supported)
});