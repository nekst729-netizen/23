import { readFile, writeFile } from 'node:fs/promises';

export function csvToJSON(input: string[], delimiter: string): object[] {
  if (!input || input.length === 0) {
    throw new Error('Input array is empty');
  }

  const headers = input[0].split(delimiter);
  const result: object[] = [];

  for (let i = 1; i < input.length; i++) {
    const values = input[i].split(delimiter);

    if (values.length !== headers.length) {
      throw new Error(
        `Line ${i + 1}: expected ${headers.length} columns, got ${values.length}`
      );
    }

    const obj: Record<string, any> = {};
    for (let j = 0; j < headers.length; j++) {
      const key = headers[j]?.trim() || '';
      let value: any = values[j]?.trim() || '';

      if (!isNaN(Number(value)) && value !== '') {
        value = Number(value);
      }

      obj[key] = value;
    }

    result.push(obj);
  }

  return result;
}

export async function formatCSVFileToJSONFile(
  input: string,
  output: string,
  delimiter: string
): Promise<void> {
  const fileContent = await readFile(input, 'utf-8');
  const lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== '');
  const jsonData = csvToJSON(lines, delimiter);
  await writeFile(output, JSON.stringify(jsonData, null, 2), 'utf-8');
}