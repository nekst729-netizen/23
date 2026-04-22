import React, { useEffect, useState } from 'react';
import BookCard from './components/BookCard';
import { fetchBooks } from './services/api';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks()
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="app">
      <h1>Каталог книг</h1>
      <div className="books-list">
        {books.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}

export default App;