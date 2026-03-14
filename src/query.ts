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

export function query<T>(
  ...steps: Array<
    | Transform<T>
    | GroupTransform<T, keyof T>
    | Transform<Group<T, keyof T>>
  >
): Transform<T> | Transform<Group<T, keyof T>> {
  return (data: T[]): T[] | Group<T, keyof T>[] => {
    let result: any = data;
    
    for (const step of steps) {
      result = step(result);
    }
    
    return result;
  };
}

export function createWhere<T>(): Where<T> {
  return <K extends keyof T>(key: K, value: T[K]) => {
    return (data: T[]) => data.filter((item) => item[key] === value);
  };
}

export function createSort<T>(): Sort<T> {
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

export function createGroupBy<T>(): GroupBy<T> {
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

export function createHaving<T>(): Having<T> {
  return <K extends keyof T>(predicate: (group: Group<T, K>) => boolean) => {
    return (groups: Group<T, K>[]) => groups.filter(predicate);
  };
}