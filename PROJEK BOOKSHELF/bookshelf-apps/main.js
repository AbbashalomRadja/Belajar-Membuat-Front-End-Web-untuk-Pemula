document.addEventListener('DOMContentLoaded', function () {
    const inputBookForm = document.getElementById('inputBook');
    const searchBookForm = document.getElementById('searchBook');
  
    inputBookForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });
  
    searchBookForm.addEventListener('submit', function (event) {
      event.preventDefault();
      searchBook();
    });
  
    if (isStorageExist()) {
      loadDataFromStorage();
    }
    renderBooks();
  });
  
  const books = [];
  const STORAGE_KEY = 'BOOKSHELF_APPS';
  
  function generateId() {
    return +new Date();
  }
  
  function generateBookObject(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete
    };
  }
  
  function addBook() {
    const bookId = generateId();
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = parseInt(document.getElementById('inputBookYear').value);
    const bookIsComplete = document.getElementById('inputBookIsComplete').checked;
  
    const bookObject = generateBookObject(bookId, bookTitle, bookAuthor, bookYear, bookIsComplete);
    books.push(bookObject);
    saveData();
    renderBooks();
  }
  
  function renderBooks() {
    const incompleteBookList = document.getElementById('incompleteBookshelfList');
    const completeBookList = document.getElementById('completeBookshelfList');
  
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';
  
    for (const book of books) {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.append(bookElement);
      } else {
        incompleteBookList.append(bookElement);
      }
    }
  }
  
  function createBookElement(book) {
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = book.title;
  
    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = `Penulis: ${book.author}`;
  
    const bookYear = document.createElement('p');
    bookYear.innerText = `Tahun: ${book.year}`;
  
    const bookContainer = document.createElement('article');
    bookContainer.classList.add('book_item');
    bookContainer.append(bookTitle, bookAuthor, bookYear);
  
    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action');
  
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('red');
    deleteButton.innerText = 'Hapus buku';
    deleteButton.addEventListener('click', function () {
      removeBook(book.id);
    });
  
    const toggleButton = document.createElement('button');
    toggleButton.classList.add('green');
    if (book.isComplete) {
      toggleButton.innerText = 'Belum selesai dibaca';
      toggleButton.addEventListener('click', function () {
        toggleBookStatus(book.id);
      });
    } else {
      toggleButton.innerText = 'Selesai dibaca';
      toggleButton.addEventListener('click', function () {
        toggleBookStatus(book.id);
      });
    }
  
    actionContainer.append(toggleButton, deleteButton);
    bookContainer.append(actionContainer);
  
    return bookContainer;
  }
  
  function toggleBookStatus(bookId) {
    const book = findBook(bookId);
    if (book) {
      book.isComplete = !book.isComplete;
      saveData();
      renderBooks();
    }
  }
  
  function removeBook(bookId) {
    const bookIndex = findBookIndex(bookId);
    if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      saveData();
      renderBooks();
    }
  }
  
  function findBook(bookId) {
    return books.find(book => book.id === bookId);
  }
  
  function findBookIndex(bookId) {
    return books.findIndex(book => book.id === bookId);
  }
  
  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
    }
  }
  
  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (serializedData !== null) {
      const data = JSON.parse(serializedData);
      if (Array.isArray(data)) {
        books.push(...data);
      }
    }
  }
  
  function isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  }
  
  function searchBook() {
    const searchBookTitle = document.getElementById('searchBookTitle').value.toLowerCase();
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchBookTitle));
    
    const incompleteBookList = document.getElementById('incompleteBookshelfList');
    const completeBookList = document.getElementById('completeBookshelfList');
  
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';
  
    for (const book of filteredBooks) {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.append(bookElement);
      } else {
        incompleteBookList.append(bookElement);
      }
    }
  }
  