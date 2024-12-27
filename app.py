import os

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, jsonify, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

# Configure application
app = Flask(__name__)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///manager.db")


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

#Things above are from CS50

@app.route("/")
def index():
    if session.get("username"):
        flash("You've logged in as " + session.get("username"))
    return render_template("index.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        
        if not username:
            return render_template("error.html", message="Please provide a username")
        if not password:
            return render_template("error.html", message="Please provide a password")
        
        rows = db.execute(
            "SELECT * FROM users WHERE username = ?", username
            )
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], password):
            return render_template("error.html", message="Invalid username and/or password")
        
        session["user_id"] = rows[0]["id"]
        session["username"] = username
        
        return redirect("/")
    else:
        return render_template("login.html")
    
@app.route("/register", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirmation = request.form.get("confirmation")
        
        if not username:
            return render_template("error.html", message="Please provide a username")
        if not password:
            return render_template("error.html", message="Please provide a password")
        if not confirmation:
            return render_template("error.html", message="Please provide a confirmation")
        if password != confirmation:
            return render_template("error.html", message="Passwords do not match")
        
        hash = generate_password_hash(password)
        
        try:
            db.execute(
                """
                INSERT INTO users (
                    username, hash
                ) VALUES (?, ?)
                """, 
                username, 
                hash
            )
        except:
            return render_template("error.html", message="Username already exists")
        rows = db.execute("SELECT * FROM users WHERE username = ?", username)
        
        session["user_id"] = rows[0]["id"]
        return redirect("/")
    else:
        return render_template("register.html")
    
@app.route("/add-book", methods=["POST"])
def add_book():
    book_info = request.get_json()
    if not book_info:
        return jsonify({'success': False, 'message': 'No book info provided'}), 400
    
    # Sanitize book info
    title = book_info['title'].strip() if 'title' in book_info else 'Unknown title'
    authors = ', '.join(book_info['authors']) if 'authors' in book_info else 'Unknown authors'
    publisher = book_info['publisher'] if 'publisher' in book_info else 'Unknown publisher'
    date = book_info['publishedDate'] if 'publishedDate' in book_info else 'Unknown date'
    
    # Add book to database
    user_id = session.get('user_id')
    if user_id:
        print(f"{user_id} added a book {book_info['title']}")
        db.execute(
            """
            INSERT INTO books (
                title, 
                authors, 
                publisher,
                publishedDate,
                user_id
            ) VALUES (?, ?, ?, ?, ?)
            """,
            title, 
            authors, 
            publisher,
            date,
            user_id
            )
    else:
        print(f"Anonymous added a book {book_info['title']}")
        db.execute(
            """
            INSERT INTO books (
                title, 
                authors, 
                publisher,
                publishedDate
            ) VALUES (?, ?, ?, ?)
            """,
            title, 
            authors, 
            publisher,
            date,
            )

    return jsonify({'success': True, 'message': 'Book added successfully'}), 200
