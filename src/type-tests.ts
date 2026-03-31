import { expectTypeOf } from 'vitest';
import { query, type Group } from './query';

type User = {
  id: number;
  name: string;
  surname: string;
  age: number;
  city: string;
};

describe('Type tests - правильный порядок операторов', () => {
  it('должен компилироваться: where + where + sort', () => {
    const q = query<User>()
      .where('name', 'John')
      .where('surname', 'Doe')
      .sort('age')
      .build();
    
    expectTypeOf(q).toBeFunction();
    expectTypeOf(q).returns.toMatchTypeOf<User[]>();
  });

  it('должен компилироваться: where + sort + where', () => {
    const q = query<User>()
      .where('name', 'John')
      .sort('age')
      .where('surname', 'Doe')
      .build();
    
    expectTypeOf(q).toBeFunction();
    expectTypeOf(q).returns.toMatchTypeOf<User[]>();
  });

  it('должен компилироваться: sort + where', () => {
    const q = query<User>()
      .sort('age')
      .where('name', 'John')
      .build();
    
    expectTypeOf(q).toBeFunction();
    expectTypeOf(q).returns.toMatchTypeOf<User[]>();
  });

  it('должен компилироваться: where + groupBy + having', () => {
    const q = query<User>()
      .where('surname', 'Doe')
      .groupBy('city')
      .having((group) => group.items.length > 1)
      .build();
    
    expectTypeOf(q).toBeFunction();
    expectTypeOf(q).returns.toMatchTypeOf<Group<User, 'city'>[]>();
  });

  it('должен компилироваться: where + sort + groupBy + having', () => {
    const q = query<User>()
      .where('surname', 'Doe')
      .sort('age')
      .groupBy('city')
      .having((group) => group.items.length > 1)
      .build();
    
    expectTypeOf(q).toBeFunction();
  });

  it('должен компилироваться: только groupBy', () => {
    const q = query<User>()
      .groupBy('city')
      .build();
    
    expectTypeOf(q).toBeFunction();
    expectTypeOf(q).returns.toMatchTypeOf<Group<User, 'city'>[]>();
  });

  it('должен компилироваться: только where', () => {
    const q = query<User>()
      .where('name', 'John')
      .build();
    
    expectTypeOf(q).toBeFunction();
    expectTypeOf(q).returns.toMatchTypeOf<User[]>();
  });

  it('должен компилироваться: только sort', () => {
    const q = query<User>()
      .sort('age')
      .build();
    
    expectTypeOf(q).toBeFunction();
    expectTypeOf(q).returns.toMatchTypeOf<User[]>();
  });
});

describe('Type tests - НЕПРАВИЛЬНЫЙ порядок (должны быть ошибки компиляции)', () => {
  it('НЕ должен компилироваться: groupBy перед where', () => {
    query<User>().groupBy('city').where('name', 'John');
  });

  it('НЕ должен компилироваться: having без groupBy', () => {
    query<User>().where('name', 'John').having((g) => g.items.length > 1);
  });

  it('НЕ должен компилироваться: having перед groupBy', () => {
    query<User>().having((g) => g.items.length > 1).groupBy('city');
  });

  it('НЕ должен компилироваться: sort после groupBy', () => {
    query<User>().groupBy('city').sort('age');
  });

  it('НЕ должен компилироваться: sort после having', () => {
    query<User>().groupBy('city').having((g) => true).sort('age');
  });

  it('НЕ должен компилироваться: groupBy после having', () => {
    query<User>().having((g) => true).groupBy('city');
  });

  it('НЕ должен компилироваться: where после groupBy', () => {
    query<User>().groupBy('city').where('name', 'John');
  });
});