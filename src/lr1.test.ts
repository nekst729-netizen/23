import { describe, it, expect } from 'vitest';
import {
  createUser,
  createBook,
  calculateArea,
  getStatusColor,
  capitalizeFirst,
  trimAndTransform,
  getFirstElement,
  findById,
  products,
  people,
} from './lr1';

describe('Test 1 - createUser', () => {
  it('should create a user with only required fields', () => {
    const user = createUser(54, 'Mira');
    expect(user).toEqual({ id: 54, name: 'Mira', isActive: true });
  });

  it('should create a user with email', () => {
    const user = createUser(55, 'John', 'john@example.com');
    expect(user).toEqual({ id: 55, name: 'John', email: 'john@example.com', isActive: true });
  });

  it('should create a user with email and custom isActive', () => {
    const user = createUser(56, 'Alice', 'alice@example.com', false);
    expect(user).toEqual({ id: 56, name: 'Alice', email: 'alice@example.com', isActive: false });
  });
});

describe('Test 2 - createBook', () => {
  it('should create a book without year', () => {
    const book = createBook({ 
      title: 'Love of Life, and Other Stories', 
      author: 'Jack London', 
      genre: 'non-fiction' 
    });
    expect(book).toEqual({
      title: 'Love of Life, and Other Stories',
      author: 'Jack London',
      genre: 'non-fiction'
    });
  });

  it('should create a book with year', () => {
    const book = createBook({ 
      title: 'Love of Life, and Other Stories', 
      author: 'Jack London', 
      year: 1905,
      genre: 'non-fiction' 
    });
    expect(book).toEqual({
      title: 'Love of Life, and Other Stories',
      author: 'Jack London',
      year: 1905,
      genre: 'non-fiction'
    });
  });

  it('should create a fiction book', () => {
    const book = createBook({ 
      title: '1984', 
      author: 'George Orwell', 
      year: 1949,
      genre: 'fiction' 
    });
    expect(book).toEqual({
      title: '1984',
      author: 'George Orwell',
      year: 1949,
      genre: 'fiction'
    });
  });
});

describe('Test 3 - calculateArea', () => {
  it('should calculate circle area', () => {
    expect(calculateArea('circle', 10)).toBeCloseTo(314.159, 2);
  });

  it('should calculate circle area with radius 5', () => {
    expect(calculateArea('circle', 5)).toBeCloseTo(78.54, 2);
  });

  it('should calculate square area', () => {
    expect(calculateArea('square', 4)).toBe(16);
  });

  it('should calculate square area with side 7', () => {
    expect(calculateArea('square', 7)).toBe(49);
  });
});

describe('Test 4 - getStatusColor', () => {
  it('should return green for active', () => {
    expect(getStatusColor('active')).toBe('green');
  });

  it('should return gray for inactive', () => {
    expect(getStatusColor('inactive')).toBe('gray');
  });

  it('should return blue for new', () => {
    expect(getStatusColor('new')).toBe('blue');
  });
});

describe('Test 5 - String Formatters', () => {
  describe('capitalizeFirst', () => {
    it('should capitalize first letter', () => {
      expect(capitalizeFirst('hello')).toBe('Hello');
    });

    it('should capitalize first letter and uppercase all when true', () => {
      expect(capitalizeFirst('hello world', true)).toBe('HELLO WORLD');
    });

    it('should handle empty string', () => {
      expect(capitalizeFirst('')).toBe('');
    });
  });

  describe('trimAndTransform', () => {
    it('should trim whitespace', () => {
      expect(trimAndTransform('  hello  ')).toBe('hello');
    });

    it('should trim and uppercase when true', () => {
      expect(trimAndTransform('  hello world  ', true)).toBe('HELLO WORLD');
    });

    it('should handle string with multiple spaces', () => {
      expect(trimAndTransform('  hello   world  ')).toBe('hello   world');
    });
  });
});

describe('Test 6 - getFirstElement', () => {
  it('should return first element of number array', () => {
    expect(getFirstElement([10, 20, 30])).toBe(10);
  });

  it('should return first element of string array', () => {
    expect(getFirstElement(['tata', 'pampam', 'tyty'])).toBe('tata');
  });

  it('should return undefined for empty array', () => {
    expect(getFirstElement([])).toBeUndefined();
  });

  it('should work with mixed types', () => {
    expect(getFirstElement([1, 'two', true])).toBe(1);
  });
});

describe('Test 7 - findById', () => {
  const testItems = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];

  it('should find object by id', () => {
    expect(findById(testItems, 1)).toEqual({ id: 1, name: 'Item 1' });
  });

  it('should return undefined when id not found', () => {
    expect(findById(testItems, 999)).toBeUndefined();
  });

  it('should find product by id from products array', () => {
    expect(findById(products, 1)).toEqual({ id: 1, name: 'Ноутбук', price: 1000 });
  });

  it('should find person by id from people array', () => {
    expect(findById(people, 101)).toEqual({ id: 101, name: 'Анна', age: 25 });
  });

  it('should return undefined for non-existent id in products', () => {
    expect(findById(products, 999)).toBeUndefined();
  });

  it('should work with empty array', () => {
    expect(findById([], 1)).toBeUndefined();
  });
});

describe('Integration tests', () => {
  it('should create user and find by id', () => {
    const user = createUser(100, 'Test User', 'test@example.com');
    const users = [user];
    expect(findById(users, 100)).toEqual(user);
  });

  it('should create book and verify genre type', () => {
    const book = createBook({
      title: 'Test Book',
      author: 'Test Author',
      genre: 'fiction'
    });
    expect(book.genre).toBe('fiction');
  });
});