export type Transform<T> = (data: T[]) => T[];

export type Where<T> = <K extends keyof T>(
  key: K,
  value: T[K]
) => Transform<T>;

export type Sort<T> = <K extends keyof T>(
  key: K
) => Transform<T>;

export interface Group<T, K> {
  key: T[K];
  items: T[];
}

export type GroupBy<T> = <K extends keyof T>(
  key: K
) => Transform<Group<T, K>>;

export type GroupTransform<T, K> = (data: Group<T, K>[]) => Group<T, K>[];

export type Having<T> = <K extends keyof T>(
  predicate: (group: Group<T, K>) => boolean
) => GroupTransform<T, K>;

type QueryState = 
  | 'initial'
  | 'hasWhere'
  | 'hasGroupBy'
  | 'hasHaving'
  | 'hasSort';

type AllowedNext<Current extends QueryState, Op extends string> = 
  Op extends 'where' 
    ? Current extends 'initial' | 'hasWhere' 
      ? 'hasWhere' 
      : never
    : Op extends 'groupBy'
      ? Current extends 'hasWhere' | 'initial' 
        ? 'hasGroupBy' 
        : never
    : Op extends 'having'
      ? Current extends 'hasGroupBy' 
        ? 'hasHaving' 
        : never
    : Op extends 'sort'
      ? Current extends 'hasHaving' | 'hasGroupBy' | 'hasWhere' | 'initial' | 'hasSort'
        ? 'hasSort' 
        : never
      : never;

type QueryBuilder<T, State extends QueryState = 'initial'> = {
  where: <K extends keyof T>(key: K, value: T[K]) => QueryBuilder<T, AllowedNext<State, 'where'>>;
  groupBy: <K extends keyof T>(key: K) => QueryBuilder<T, AllowedNext<State, 'groupBy'>>;
  having: <K extends keyof T>(predicate: (group: Group<T, K>) => boolean) => QueryBuilder<T, AllowedNext<State, 'having'>>;
  sort: <K extends keyof T>(key: K) => QueryBuilder<T, AllowedNext<State, 'sort'>>;
  build: () => Transform<T>;
};

function createWhere<T>(): Where<T> {
  return <K extends keyof T>(key: K, value: T[K]) => {
    return (data: T[]) => data.filter((item) => item[key] === value);
  };
}

function createSort<T>(): Sort<T> {
  return <K extends keyof T>(key: K) => {
    return (data: T[]) => {
      return [...data].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        
        if (aVal < bVal) return -1;
        if (aVal > bVal) return 1;
        return 0;
      });
    };
  };
}

function createGroupBy<T>(): GroupBy<T> {
  return <K extends keyof T>(key: K) => {
    return (data: T[]) => {
      const groups = new Map<any, Group<T, K>>();
      
      for (const item of data) {
        const keyValue = item[key];
        const existingGroup = groups.get(keyValue);
        
        if (existingGroup) {
          existingGroup.items.push(item);
        } else {
          groups.set(keyValue, {
            key: keyValue,
            items: [item],
          });
        }
      }
      
      return Array.from(groups.values());
    };
  };
}

function createHaving<T>(): Having<T> {
  return <K extends keyof T>(predicate: (group: Group<T, K>) => boolean) => {
    return (groups: Group<T, K>[]) => groups.filter(predicate);
  };
}

export function query<T>(): QueryBuilder<T, 'initial'> {
  let transforms: Array<(data: any[]) => any[]> = [];
  let currentState: QueryState = 'initial';
  
  const builder = {
    where: <K extends keyof T>(key: K, value: T[K]) => {
      if (currentState !== 'initial' && currentState !== 'hasWhere') {
        throw new Error('where must come before groupBy');
      }
      transforms.push(createWhere<T>()(key, value));
      currentState = 'hasWhere';
      return builder;
    },
    
    groupBy: <K extends keyof T>(key: K) => {
      if (currentState !== 'initial' && currentState !== 'hasWhere') {
        throw new Error('groupBy must come after where');
      }
      transforms.push(createGroupBy<T>()(key));
      currentState = 'hasGroupBy';
      return builder;
    },
    
    having: <K extends keyof T>(predicate: (group: Group<T, K>) => boolean) => {
      if (currentState !== 'hasGroupBy') {
        throw new Error('having must come after groupBy');
      }
      transforms.push(createHaving<T>()(predicate as any));
      currentState = 'hasHaving';
      return builder;
    },
    
    sort: <K extends keyof T>(key: K) => {
      if (currentState === 'hasGroupBy' || currentState === 'hasHaving') {
        throw new Error('sort cannot be used after groupBy or having');
      }
      transforms.push(createSort<T>()(key));
      currentState = 'hasSort';
      return builder;
    },
    
    build: () => {
      return (data: T[]) => {
        let result: any[] = data;
        for (const transform of transforms) {
          result = transform(result);
        }
        return result as T[];
      };
    }
  };
  
  return builder as QueryBuilder<T, 'initial'>;
}