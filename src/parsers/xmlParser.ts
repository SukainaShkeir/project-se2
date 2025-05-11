import fs from 'fs/promises';
import { parseStringPromise } from 'xml2js';

export async function parseXML(filePath: string): Promise<any> {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const result = await parseStringPromise(content, { explicitArray: false });
        return result;
    } catch (err: unknown) {
        if (err instanceof Error) {
            throw new Error(`Failed to parse XML: ${err.message}`);
        } else {
            throw new Error('Failed to parse XML due to an unknown error');
        }
    }
}