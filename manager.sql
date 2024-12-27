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
    title TEXT,
    authors TEXT,
    publisher TEXT,
    publishedDate INTEGER,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id)
);