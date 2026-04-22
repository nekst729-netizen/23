const BOOKS_API_URL = 'https://fakeapi.extendsclass.com/books';

// Тестовые данные на случай недоступности API
const MOCK_BOOKS = [
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
  },
  {
    id: 3,
    title: "The Pragmatic Programmer",
    isbn: "020161622X",
    pageCount: 352,
    authors: ["Andrew Hunt", "David Thomas"]
  },
  {
    id: 4,
    title: "Design Patterns",
    isbn: "0201633612",
    pageCount: 395,
    authors: ["Erich Gamma", "Richard Helm", "Ralph Johnson", "John Vlissides"]
  }
];

export async function fetchBooks() {
  try {
    const response = await fetch(BOOKS_API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Книги загружены с API:', data);
    return data;
    
  } catch (error) {
    console.warn('⚠️ API недоступен, используем тестовые данные');
    console.warn('Ошибка:', error.message);
    // Возвращаем тестовые данные если API не работает
    return MOCK_BOOKS;
  }
}

export async function fetchCoverBlob(isbn) {
  try {
    const searchUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.items && searchData.items.length > 0) {
      const imageUrl = searchData.items[0].volumeInfo?.imageLinks?.thumbnail;
      
      if (imageUrl) {
        const imgRes = await fetch(imageUrl);
        return await imgRes.blob();
      }
    }
    return null;
  } catch (error) {
    console.error("Ошибка загрузки обложки:", error);
    return null;
  }
}