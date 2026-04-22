import React, { useState, useEffect } from 'react';
import { fetchCoverBlob } from '../services/api';
import './BookCard.css';

function BookCard({ book }) {
  const [coverImage, setCoverImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCover = async () => {
      const blob = await fetchCoverBlob(book.isbn);
      
      if (isMounted) {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setCoverImage(url);
        }
        setIsLoading(false);
      }
    };

    loadCover();

    return () => {
      isMounted = false;
      if (coverImage) {
        URL.revokeObjectURL(coverImage);
      }
    };
  }, [book.isbn]);

  const authorsText = Array.isArray(book.authors) && book.authors.length > 0
    ? book.authors.join(', ')
    : 'Автор не указан';

  return (
    <div className="card">
      <div className="card__image-wrapper">
        {isLoading ? (
          <div className="card__loader">⏳</div>
        ) : coverImage ? (
          <img src={coverImage} alt={book.title} className="card__img" />
        ) : (
          <div className="card__placeholder">📚</div>
        )}
      </div>
      
      <h3 className="card__title">{book.title}</h3>
      <p className="card__authors">{authorsText}</p>
    </div>
  );
}

export default BookCard;