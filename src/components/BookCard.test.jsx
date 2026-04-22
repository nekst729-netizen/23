import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import BookCard from './BookCard';
import * as api from '../services/api';

const mockBook = {
  id: 1,
  title: "Clean Code",
  isbn: "0132350882",
  pageCount: 464,
  authors: ["Robert C. Martin"]
};

describe('BookCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('показывает индикатор загрузки сначала', () => {
    vi.spyOn(api, 'fetchCoverBlob').mockReturnValue(new Promise(() => {}));
    render(<BookCard book={mockBook} />);
    expect(screen.getByText('⏳')).toBeInTheDocument();
  });

  it('показывает название книги и авторов', async () => {
    vi.spyOn(api, 'fetchCoverBlob').mockResolvedValue(null);
    render(<BookCard book={mockBook} />);
    
    await waitFor(() => {
      expect(screen.getByText('Clean Code')).toBeInTheDocument();
      expect(screen.getByText('Robert C. Martin')).toBeInTheDocument();
    });
  });

  it('показывает "Автор не указан" если authors пустой', async () => {
    const bookWithoutAuthors = { ...mockBook, authors: [] };
    vi.spyOn(api, 'fetchCoverBlob').mockResolvedValue(null);
    render(<BookCard book={bookWithoutAuthors} />);
    
    await waitFor(() => {
      expect(screen.getByText('Автор не указан')).toBeInTheDocument();
    });
  });

  it('показывает иконку 📚 если обложка не загрузилась', async () => {
    vi.spyOn(api, 'fetchCoverBlob').mockResolvedValue(null);
    render(<BookCard book={mockBook} />);
    
    await waitFor(() => {
      expect(screen.getByText('📚')).toBeInTheDocument();
    });
  });

  it('показывает изображение обложки если загрузилась', async () => {
    const mockBlob = new Blob(['image'], { type: 'image/jpeg' });
    vi.spyOn(api, 'fetchCoverBlob').mockResolvedValue(mockBlob);
    
    const { container } = render(<BookCard book={mockBook} />);
    
    await waitFor(() => {
      const img = container.querySelector('.card__img');
      expect(img).toBeInTheDocument();
    });
  });

  it('правильно отображает нескольких авторов', async () => {
    const bookWithMultipleAuthors = {
      ...mockBook,
      authors: ["Andrew Hunt", "David Thomas"]
    };
    vi.spyOn(api, 'fetchCoverBlob').mockResolvedValue(null);
    render(<BookCard book={bookWithMultipleAuthors} />);
    
    await waitFor(() => {
      expect(screen.getByText('Andrew Hunt, David Thomas')).toBeInTheDocument();
    });
  });

  it('имеет правильные CSS классы', async () => {
    vi.spyOn(api, 'fetchCoverBlob').mockResolvedValue(null);
    const { container } = render(<BookCard book={mockBook} />);
    
    await waitFor(() => {
      expect(container.querySelector('.card__title')).toBeInTheDocument();
      expect(container.querySelector('.card__authors')).toBeInTheDocument();
    });
  });
});