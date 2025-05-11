import fs from 'fs/promises';

export async function parseJSON(filePath: string): Promise<any> {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (err: unknown) {
        if (err instanceof Error) {
            throw new Error(`Failed to parse JSON: ${err.message}`);
        } else {
            throw new Error('Failed to parse JSON due to an unknown error');
        }
    }
}
