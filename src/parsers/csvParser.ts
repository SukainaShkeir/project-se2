import * as fs from 'fs';
import * as path from 'path'; 


type CsvRow = Record<string, any>;

export function parseCsv(filePath: string): CsvRow[] {
    let fileContent: string;

    // 1. Read the file content synchronously
    try {
        // Resolve the path to ensure it's absolute, helps avoid relative path issues
        const absolutePath = path.resolve(filePath);
        fileContent = fs.readFileSync(absolutePath, 'utf-8');
    } catch (error: any) {
        // Handle file not found specifically
        if (error.code === 'ENOENT') {
            throw new Error(`CSV file not found at path: ${filePath}`);
        }
        // Rethrow other read errors
        throw new Error(`Error reading CSV file ${filePath}: ${error.message}`);
    }


    const lines = fileContent.trim().split(/\r?\n/);

    if (lines.length === 0 || (lines.length === 1 && lines[0].trim() === '')) {
        return []; // No headers, no data
    }

    const headerLine = lines[0];
    const headers = headerLine.split(',').map(header => header.trim());

    if (headers.some(h => h === '')) {
        console.warn(`Warning: CSV file ${filePath} contains empty header columns.`);
    }
    if (headers.length === 0 || (headers.length === 1 && headers[0] === '')) {
         console.warn(`Warning: CSV file ${filePath} seems to have no valid headers.`);
        return []; // Treat as effectively header-only or invalid header
    }


    if (lines.length < 2) {
        return []; // Only headers, no data rows
    }

    const data: CsvRow[] = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        // Skip empty lines within the data
        if (line === '') {
            continue;
        }

        // Basic split, assumes no commas within data fields themselves.
        const values = line.split(',').map(value => value.trim());

        const entry: CsvRow = {};
        for (let j = 0; j < headers.length; j++) {
            const header = headers[j];
            // Assign value if it exists, otherwise assign null for missing columns
            // in this specific row compared to the header length
            entry[header] = values[j] !== undefined ? values[j] : null;
        }

         // Handle rows with more columns than headers (optional: decide how to handle)
         if (values.length > headers.length) {
             console.warn(`Warning: Row ${i + 1} in ${filePath} has more columns (${values.length}) than headers (${headers.length}). Extra columns ignored.`);
         }

        data.push(entry);
    }

    return data;
}