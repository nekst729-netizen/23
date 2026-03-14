import { describe, it, expect } from 'vitest';
import {
  query,
  createWhere,
  createSort,
  createGroupBy,
  createHaving,
  type User,
} from './query';

type User = {
  id: number;
  name: string;
  surname: string;
  age: number;
  city: string;
};

describe('query pipeline', () => {
  const users: User[] = [
    { id: 1, name: 'John', surname: 'Doe', age: 34, city: 'NY' },
    { id: 2, name: 'John', surname: 'Doe', age: 33, city: 'NY' },
    { id: 3, name: 'John', surname: 'Doe', age: 35, city: 'LA' },
    { id: 4, name: 'Mike', surname: 'Doe', age: 35, city: 'LA' },
  ];

  describe('Where + Sort', () => {
    it('должна фильтровать и сортировать пользователей', () => {
      const where = createWhere<User>();
      const sort = createSort<User>();

      const search = query<User>(
        where('name', 'John'),
        where('surname', 'Doe'),
        sort('age')
      );

      const result = search(users);

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe(2);
      expect(result[1].id).toBe(1);
      expect(result[2].id).toBe(3);
    });

    it('должна фильтровать по городу', () => {
      const where = createWhere<User>();

      const search = query<User>(where('city', 'NY'));
      const result = search(users);

      expect(result).toHaveLength(2);
      expect(result.every((u) => u.city === 'NY')).toBe(true);
    });
  });

  describe('GroupBy + Having', () => {
    it('должна группировать по городу и фильтровать группы', () => {
      const groupBy = createGroupBy<User>();
      const having = createHaving<User>();

      const groupAndFilter = query<User>(
        groupBy('city'),
        having((group) => group.items.length > 1)
      );

      const grouped = groupAndFilter(users);

      expect(grouped).toHaveLength(2);
      
      const nyGroup = grouped.find((g) => g.key === 'NY');
      const laGroup = grouped.find((g) => g.key === 'LA');
      
      expect(nyGroup?.items.length).toBe(2);
      expect(laGroup?.items.length).toBe(2);
    });

    it('должна фильтровать группы по возрасту', () => {
      const groupBy = createGroupBy<User>();
      const having = createHaving<User>();

      const pipeline = query<User>(
        where('surname', 'Doe'),
        groupBy('city'),
        having((group) => group.items.some((u) => u.age > 34))
      );

      const res = pipeline(users);

      expect(res.length).toBeGreaterThan(0);
      expect(res.every((g) => g.items.some((u) => u.age > 34))).toBe(true);
    });
  });

  describe('Комбинированный конвейер', () => {
    it('должна выполнять фильтрацию, группировку и having', () => {
      const where = createWhere<User>();
      const groupBy = createGroupBy<User>();
      const having = createHaving<User>();

      const pipeline = query<User>(
        where('surname', 'Doe'),
        groupBy('city'),
        having((group) => group.items.length >= 2)
      );

      const result = pipeline(users);

      expect(result.length).toBe(2);
      expect(result.every((g) => g.items.every((u) => u.surname === 'Doe'))).toBe(true);
    });
  });

  describe('Sort', () => {
    it('должна сортировать по возрастанию', () => {
      const sort = createSort<User>();

      const sorted = query<User>(sort('age'))(users);

      expect(sorted[0].age).toBe(33);
      expect(sorted[sorted.length - 1].age).toBe(35);
    });

    it('должна сортировать строки', () => {
      const sort = createSort<User>();

      const sorted = query<User>(sort('name'))(users);

      expect(sorted[0].name).toBe('John');
      expect(sorted[sorted.length - 1].name).toBe('Mike');
    });
  });

  describe('Edge cases', () => {
    it('должна работать с пустым массивом', () => {
      const where = createWhere<User>();
      const result = query<User>(where('name', 'John'))([]);
      expect(result).toHaveLength(0);
    });

    it('должна работать без шагов', () => {
      const result = query<User>()(users);
      expect(result).toEqual(users);
    });

    it('должна возвращать все элементы если фильтр не совпадает', () => {
      const where = createWhere<User>();
      const result = query<User>(where('name', 'NonExistent'))(users);
      expect(result).toHaveLength(0);
    });
  });
});

function where<T>(key: keyof T, value: any) {
  return createWhere<T>()(key, value);
}