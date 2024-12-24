-- Initialization
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    username TEXT NOT NULL,
    hash TEXT NOT NULL
);

CREATE UNIQUE INDEX username ON users (username);

-- Information of the books
CREATE TABLE books (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    isbn TEXT,
    author TEXT,
    title TEXT NOT NULL,
    publish_area TEXT,
    publisher TEXT,
    publish_date INTEGER,
    translator TEXT,
    translated_from_isbn TEXT,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);