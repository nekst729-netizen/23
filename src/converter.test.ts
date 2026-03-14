import { describe, it, expect, vi, beforeEach } from 'vitest';
import { csvToJSON, formatCSVFileToJSONFile } from './converter';
import { readFile, writeFile } from 'node:fs/promises';

describe('csvToJSON', () => {
  it('должна корректно преобразовывать валидные данные', () => {
    const input = ['p1;p2;p3;p4', '1;A;b;c', '2;B;v;d'];
    const result = csvToJSON(input, ';');

    expect(result).toEqual([
      { p1: 1, p2: 'A', p3: 'b', p4: 'c' },
      { p1: 2, p2: 'B', p3: 'v', p4: 'd' }
    ]);
  });

  it('должна преобразовывать строки в числа когда возможно', () => {
    const input = ['id;name;value', '123;test;456'];
    const result = csvToJSON(input, ';');

    expect(result).toEqual([
      { id: 123, name: 'test', value: 456 }
    ]);
  });

  it('должна выбрасывать ошибку при несовпадении количества колонок', () => {
    const input = ['p1;p2;p3', '1;A']; // Ожидаем 3 колонки, а их 2
    expect(() => csvToJSON(input, ';')).toThrow(Error);
  });

  it('должна выбрасывать ошибку при пустом массиве', () => {
    expect(() => csvToJSON([], ';')).toThrow(Error);
  });

  it('должна обрабатывать строки с пробелами', () => {
    const input = ['p1;p2', ' 1 ; A '];
    const result = csvToJSON(input, ';');

    expect(result).toEqual([
      { p1: 1, p2: 'A' }
    ]);
  });
});

vi.mock('node:fs/promises');

describe('formatCSVFileToJSONFile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('должна читать файл, преобразовывать и записывать результат', async () => {
    const mockCsvContent = 'p1;p2\n1;A\n2;B';
    const inputPath = 'input.csv';
    const outputPath = 'output.json';
    const delimiter = ';';

    vi.mocked(readFile).mockResolvedValue(mockCsvContent);

    await formatCSVFileToJSONFile(inputPath, outputPath, delimiter);

    expect(readFile).toHaveBeenCalledTimes(1);
    expect(readFile).toHaveBeenCalledWith(inputPath, 'utf-8');

    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledWith(
      outputPath,
      expect.any(String),
      'utf-8'
    );

    const writtenData = vi.mocked(writeFile).mock.calls[0]?.[1];
    expect(writtenData).toBeDefined();
    const parsedData = JSON.parse(writtenData || '[]');
    expect(parsedData).toEqual([
      { p1: 1, p2: 'A' },
      { p1: 2, p2: 'B' }
    ]);
  });

  it('должна обрабатывать CSV с разным количеством строк', async () => {
    const mockCsvContent = 'id;name;value\n100;item1;50\n200;item2;75\n300;item3;100';
    const inputPath = 'data.csv';
    const outputPath = 'result.json';

    vi.mocked(readFile).mockResolvedValue(mockCsvContent);

    await formatCSVFileToJSONFile(inputPath, outputPath, ';');

    expect(writeFile).toHaveBeenCalledTimes(1);
    const writtenData = vi.mocked(writeFile).mock.calls[0]?.[1];
    const parsedData = JSON.parse(writtenData || '[]');
    
    expect(parsedData).toHaveLength(3);
    expect(parsedData[0]).toEqual({ id: 100, name: 'item1', value: 50 });
  });

  it('должна корректно работать с разными разделителями', async () => {
    const mockCsvContent = 'a,b,c\n1,2,3';
    const inputPath = 'test.csv';
    const outputPath = 'out.json';

    vi.mocked(readFile).mockResolvedValue(mockCsvContent);

    await formatCSVFileToJSONFile(inputPath, outputPath, ',');

    const writtenData = vi.mocked(writeFile).mock.calls[0]?.[1];
    const parsedData = JSON.parse(writtenData || '[]');
    
    expect(parsedData).toEqual([
      { a: 1, b: 2, c: 3 }
    ]);
  });
});