import { describe, it, expectTypeOf } from 'vitest';
import type { DeepReadonly, PickedByType, EventHandlers } from './lab6';

describe('DeepReadonly', () => {
  it('должен сделать все свойства readonly', () => {
    type User = {
      id: number;
      name: string;
      profile: {
        email: string;
        address: {
          city: string;
          zip: number;
        };
      };
    };

    type ReadonlyUser = DeepReadonly<User>;

    expectTypeOf<ReadonlyUser>().toMatchTypeOf<{
      readonly id: number;
      readonly name: string;
      readonly profile: DeepReadonly<User['profile']>;
    }>();

    expectTypeOf<ReadonlyUser['profile']>().toMatchTypeOf<{
      readonly email: string;
      readonly address: DeepReadonly<User['profile']['address']>;
    }>();

    expectTypeOf<ReadonlyUser['profile']['address']>().toMatchTypeOf<{
      readonly city: string;
      readonly zip: number;
    }>();
  });

  it('должен работать с массивами', () => {
    type Data = {
      items: { id: number }[];
      tags: string[];
    };

    type ReadonlyData = DeepReadonly<Data>;

    expectTypeOf<ReadonlyData['items']>().toMatchTypeOf<readonly { readonly id: number }[]>();
    expectTypeOf<ReadonlyData['tags']>().toMatchTypeOf<readonly string[]>();
  });
});

describe('PickedByType', () => {
  it('должен выбрать только строковые свойства', () => {
    type Data = {
      id: number;
      name: string;
      age: number;
      email: string;
      isActive: boolean;
      city: string;
    };

    type StringProps = PickedByType<Data, string>;

    expectTypeOf<StringProps>().toMatchTypeOf<{
      name: string;
      email: string;
      city: string;
    }>();

    // Убеждаемся, что нет свойств других типов
    expectTypeOf<StringProps>().not.toMatchTypeOf<{ id: number }>();
    expectTypeOf<StringProps>().not.toMatchTypeOf<{ age: number }>();
    expectTypeOf<StringProps>().not.toMatchTypeOf<{ isActive: boolean }>();
  });

  it('должен выбрать только числовые свойства', () => {
    type Data = {
      id: number;
      name: string;
      age: number;
      score: number;
      email: string;
    };

    type NumberProps = PickedByType<Data, number>;

    expectTypeOf<NumberProps>().toMatchTypeOf<{
      id: number;
      age: number;
      score: number;
    }>();

    expectTypeOf<NumberProps>().not.toMatchTypeOf<{ name: string }>();
  });

  it('должен выбрать свойства с union типом', () => {
    type Data = {
      status: 'active' | 'inactive';
      id: number;
      name: string;
      flag: 'yes' | 'no';
    };

    type StringUnionProps = PickedByType<Data, 'active' | 'inactive'>;

    expectTypeOf<StringUnionProps>().toMatchTypeOf<{
      status: 'active' | 'inactive';
    }>();

    expectTypeOf<StringUnionProps>().not.toMatchTypeOf<{ flag: 'yes' | 'no' }>();
  });

  it('должен вернуть пустой объект, если нет подходящих свойств', () => {
    type Data = {
      id: number;
      age: number;
    };

    type StringProps = PickedByType<Data, string>;

    expectTypeOf<StringProps>().toEqualTypeOf<{}>();
  });
});

describe('EventHandlers', () => {
  it('должен сгенерировать правильные обработчики', () => {
    type Events = {
      click: MouseEvent;
      input: InputEvent;
      submit: SubmitEvent;
      change: Event;
    };

    type Handlers = EventHandlers<Events>;

    expectTypeOf<Handlers>().toMatchTypeOf<{
      onClick: (event: MouseEvent) => void;
      onInput: (event: InputEvent) => void;
      onSubmit: (event: SubmitEvent) => void;
      onChange: (event: Event) => void;
    }>();
  });

  it('должен работать с пользовательскими типами событий', () => {
    type CustomEvents = {
      userLogin: { userId: number; timestamp: Date };
      dataLoaded: { data: string[] };
      error: { message: string; code: number };
    };

    type Handlers = EventHandlers<CustomEvents>;

    expectTypeOf<Handlers>().toMatchTypeOf<{
      onUserLogin: (event: { userId: number; timestamp: Date }) => void;
      onDataLoaded: (event: { data: string[] }) => void;
      onError: (event: { message: string; code: number }) => void;
    }>();
  });

  it('должен правильно обрабатывать имена с несколькими словами', () => {
    type Events = {
      'user-login': { userId: number };
      'data-fetched': { url: string };
      'api_call': { endpoint: string };
    };

    type Handlers = EventHandlers<Events>;

    expectTypeOf<Handlers>().toMatchTypeOf<{
      onUserLogin: (event: { userId: number }) => void;
      onDataFetched: (event: { url: string }) => void;
      OnApiCall: (event: { endpoint: string }) => void;
    }>();
  });

  it('должен работать с void событиями', () => {
    type Events = {
      mounted: void;
      unmounted: void;
    };

    type Handlers = EventHandlers<Events>;

    expectTypeOf<Handlers>().toMatchTypeOf<{
      onMounted: (event: void) => void;
      onUnmounted: (event: void) => void;
    }>();
  });
});