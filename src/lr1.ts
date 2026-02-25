export interface User {
    id: number;
    name: string;
    email?: string;
    isActive: boolean;
}

export function createUser(id: number, name: string, email?: string, isActive: boolean = true): User {
    return {
        id,
        name,
        ...(email !== undefined ? { email } : {}),
        isActive
    };
}

const user1 = createUser(1, 'Дарья');
const user2 = createUser(2, 'Наталья', 'nata@gmail.com', false);
console.log('Задание 1:', { user1, user2 });

export type Genre = 'fiction' | 'non-fiction';

export interface Book {
    title: string;
    author: string;
    year?: number;
    genre: Genre;
}

export function createBook(book: Book): Book {
    return book;
}

const book1 = createBook({
    title: 'Война и мир',
    author: 'Лев Толстой',
    year: 1869,
    genre: 'fiction'
});

const book2 = createBook({
    title: 'Муму',
    author: 'Иван Тургенев',
    genre: 'non-fiction'
});

console.log('Задание 2:', { book1, book2 });

export function calculateArea(shape: 'circle', radius: number): number;
export function calculateArea(shape: 'square', side: number): number;
export function calculateArea(shape: 'circle' | 'square', param: number): number {
    if (shape === 'circle') {
        return Math.PI * param * param;
    } else {
        return param * param;
    }
}

console.log('Задание 3:', {
    circleArea: calculateArea('circle', 5),
    squareArea: calculateArea('square', 4)
});

export type Status = 'active' | 'inactive' | 'new';

export function getStatusColor(status: Status): string {
    switch (status) {
        case 'active':
            return 'green';
        case 'inactive':
            return 'gray';
        case 'new':
            return 'blue';
        default:
            const exhaustiveCheck: never = status;
            return exhaustiveCheck;
    }
}

console.log('Задание 4:', {
    active: getStatusColor('active'),
    inactive: getStatusColor('inactive'),
    new: getStatusColor('new')
});

export type StringFormatter = (str: string, uppercase?: boolean) => string;

export const capitalizeFirst: StringFormatter = (str: string, uppercase: boolean = false): string => {
    let result = str.charAt(0).toUpperCase() + str.slice(1);
    return uppercase ? result.toUpperCase() : result;
};

export const trimAndTransform: StringFormatter = (str: string, uppercase: boolean = false): string => {
    let result = str.trim();
    return uppercase ? result.toUpperCase() : result;
};

console.log('Задание 5:', {
    capitalizeFirst: capitalizeFirst('hello world'),
    capitalizeFirstUpper: capitalizeFirst('hello world', true),
    trimAndTransform: trimAndTransform('  hello world  '),
    trimAndTransformUpper: trimAndTransform('  hello world  ', true)
});

export function getFirstElement<T>(arr: T[]): T | undefined {
    return arr.length > 0 ? arr[0] : undefined;
}

const numbers = [1, 2, 3, 4, 5];
const strings = ['a', 'b', 'c', 'd'];
const emptyArray: number[] = [];

console.log('Задание 6:', {
    firstNumber: getFirstElement(numbers),
    firstString: getFirstElement(strings),
    firstEmpty: getFirstElement(emptyArray)
});

export interface HasId {
    id: number;
}

export function findById<T extends HasId>(items: T[], id: number): T | undefined {
    return items.find(item => item.id === id);
}

export interface Product extends HasId {
    name: string;
    price: number;
}

export const products: Product[] = [
    { id: 1, name: 'Ноутбук', price: 1000 },
    { id: 2, name: 'Мышь', price: 25 },
    { id: 3, name: 'Клавиатура', price: 75 }
];

export interface Person extends HasId {
    name: string;
    age: number;
}

export const people: Person[] = [
    { id: 101, name: 'Анна', age: 25 },
    { id: 102, name: 'Петр', age: 30 },
    { id: 103, name: 'Елена', age: 28 }
];

console.log('Задание 7:', {
    productById: findById(products, 1),
    personById: findById(people, 28),
    notFound: findById(products, 1000)
});