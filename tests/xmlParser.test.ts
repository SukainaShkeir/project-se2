// src/__tests__/parsers/xmlParser.test.ts
import { parseXML } from '../src/parsers/xmlParser';
import * as path from 'path';
import * as fs from 'fs';

describe('XML Parser', () => {
    const validXmlPath = path.resolve(__dirname, '../../data/stores.xml');
    const emptyXmlPath = path.resolve(__dirname, '../data/empty.xml');
    const invalidXmlPath = path.resolve(__dirname, '../data/invalid.xml');
    const nonExistentPath = path.resolve(__dirname, '../data/nonexistent.xml');

    // Remember parseXML is async
    it('should parse a valid XML file correctly', async () => {
        const result = await parseXML(validXmlPath);
        // Expectations depend heavily on xml2js options (explicitArray, explicitRoot, mergeAttrs)
        // With explicitRoot: false, explicitArray: false, mergeAttrs: true:
         expect(result.store).toBeDefined();
         expect(Array.isArray(result.store)).toBe(true); // Even with explicitArray:false, multiple identical tags at the same level become an array
         expect(result.store.length).toBe(2);

         // Check first store
         expect(result.store[0].StoreID).toBe('X1'); // Attribute merged
         expect(result.store[0].StoreName).toBe('Book Nook');
         expect(result.store[0].Location).toBe('77 Reading Lane');
         expect(result.store[0].Manager).toBe('Frank');
         expect(result.store[0].Sections.Section).toEqual(['Fiction', 'Non-Fiction']); // Nested structure

         // Check second store
         expect(result.store[1].StoreID).toBe('X2');
         expect(result.store[1].StoreName).toBe('Coffee Spot');
         expect(result.store[1].Sections.Section).toEqual(['Hot Drinks', 'Pastries']);
    });

    it('should throw an error for an empty XML file', async () => {
        fs.writeFileSync(emptyXmlPath, ''); // Create empty file
        // Use await expect(...).rejects.toThrow(...) for async functions
        await expect(parseXML(emptyXmlPath)).rejects.toThrow(`XML file is empty: ${emptyXmlPath}`);
        fs.unlinkSync(emptyXmlPath); // Clean up
    });

    it('should throw an error for invalid XML content', async () => {
        fs.writeFileSync(invalidXmlPath, '<root><unclosed></root>'); // Create invalid file
        await expect(parseXML(invalidXmlPath)).rejects.toThrow(/Error parsing XML file/);
         // Check for a more specific error message if needed (depends on xml2js output)
         await expect(parseXML(invalidXmlPath)).rejects.toThrow("Non-whitespace before first tag"); // Example specific error
         fs.unlinkSync(invalidXmlPath); // Clean up
    });

    it('should throw an error if the XML file does not exist', async () => {
        await expect(parseXML(nonExistentPath)).rejects.toThrow(`XML file not found at path: ${nonExistentPath}`);
    });
});