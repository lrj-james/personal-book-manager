-- Initialization
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    username TEXT NOT NULL,
    hash TEXT NOT NULL,
);

CREATE TABLE sqlite_sequence(name,seq);

CREATE UNIQUE INDEX username ON users (username);

-- Information of the books
CREATE TABLE books (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    isbn TEXT NOT NULL,
    author TEXT NOT NULL,
    title TEXT NOT NULL,
    publish_area TEXT NOT NULL,
    publisher TEXT NOT NULL,
    year INTEGER NOT NULL,
    translator TEXT,
    translated_from_isbn TEXT,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);