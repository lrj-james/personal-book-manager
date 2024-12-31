import os

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, jsonify, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from functools import wraps

# Configure application
app = Flask(__name__)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///manager.db")

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

def login_required(f):
    """
    Decorate routes to require login.

    https://flask.palletsprojects.com/en/latest/patterns/viewdecorators/
    """

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)

    return decorated_function


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/logout")
@login_required
def logout():
    session.clear()
    return redirect("/")

#Things above are from CS50 Pset9 Finance

# ===================================================

# Index page is the search page
@app.route("/")
def index():
    username = session.get("username")
    if username:
        is_logged_in = True
        flash("You've logged in as " + session.get("username"))
    else:
        is_logged_in = False
        
    return render_template("index.html", is_logged_in=is_logged_in)


# Rewrite from CS50 Pset9 Finance
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
    

# Rewrite from CS50 Pset9 Finance    
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
    

# Assisted by GitHub Copilot with GPT-4o modal    
# This route catches the async request from the frontend
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
        return jsonify({'success': False, 'message': 'User not logged in'}), 400

    return jsonify({'success': True, 'message': 'Book added successfully'}), 200


# Assisted by GitHub Copilot with GPT-4o modal  
@app.route("/bookshelf", methods=["GET", "POST"])
@login_required
def bookshelf():
    user_id = session.get("user_id")
    
    if request.method == "POST":
        data = request.get_json()
        book_ids = data.get('books', [])

        if not book_ids:
            return jsonify({'success': False, 'message': 'No books selected for deletion'}), 400

        db.execute(
            """
            DELETE FROM books WHERE id IN ({seq}) AND user_id = ?
            """.format(seq=','.join(['?']*len(book_ids))),
            *book_ids, user_id
        )

        return jsonify({'success': True, 'message': 'Books deleted successfully'}), 200

    else:
        books = db.execute(
            """
            SELECT * FROM books WHERE user_id = ?
            """,
            user_id
        )
        for book in books:
            book['authors'] = book['authors'].split(', ')
            
        return render_template("bookshelf.html", books=books)
    
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))