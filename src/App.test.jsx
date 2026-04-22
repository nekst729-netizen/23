import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import * as api from './services/api';

const mockBooks = [
  {
    id: 1,
    title: "Specification by Example",
    isbn: "1617290084",
    pageCount: 320,
    authors: ["Gojko Adzic"]
  },
  {
    id: 2,
    title: "Clean Code",
    isbn: "0132350882",
    pageCount: 464,
    authors: ["Robert C. Martin"]
  }
];

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('показывает текст загрузки при старте', () => {
    vi.spyOn(api, 'fetchBooks').mockReturnValue(new Promise(() => {}));
    render(<App />);
    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
  });

  it('показывает ошибку при неудачной загрузке', async () => {
    vi.spyOn(api, 'fetchBooks').mockRejectedValue(new Error('Network error'));
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Ошибка: Network error/i)).toBeInTheDocument();
    });
  });

  it('рендерит заголовок и список книг после загрузки', async () => {
    vi.spyOn(api, 'fetchBooks').mockResolvedValue(mockBooks);
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Каталог книг')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Specification by Example')).toBeInTheDocument();
    expect(screen.getByText('Clean Code')).toBeInTheDocument();
    expect(screen.getByText('Gojko Adzic')).toBeInTheDocument();
    expect(screen.getByText('Robert C. Martin')).toBeInTheDocument();
  });

  it('рендерит BookCard для каждой книги', async () => {
    vi.spyOn(api, 'fetchBooks').mockResolvedValue(mockBooks);
    const { container } = render(<App />);
    
    await waitFor(() => {
      const bookCards = container.querySelectorAll('.card__title');
      expect(bookCards).toHaveLength(2);
    });
  });
});