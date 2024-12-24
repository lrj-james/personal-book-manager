import os

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
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

#Things above are from CS50

@app.route("/")
def index():
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
        
        rows = db.execute("SELECT * FROM users WHERE username = :username", username=username)
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], password):
            return render_template("error.html", message="Invalid username and/or password")
        
        session["user_id"] = rows[0]["id"]
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
            db.execute("INSERT INTO users (username, hash) VALUES (:username, :hash)", username=username, hash=hash)
        except:
            return render_template("error.html", message="Username already exists")
        rows = db.execute("SELECT * FROM users WHERE username = :username", username=username)
        
        session["user_id"] = rows[0]["id"]
        return redirect("/")
    else:
        return render_template("register.html")