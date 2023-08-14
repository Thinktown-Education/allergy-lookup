# auth.py
from flask import Blueprint, request, session
from flask_cors import CORS, cross_origin
import mysql.connector
import hashlib
import os

auth = Blueprint('auth', __name__)
cors = CORS(auth, supports_credentials=True)

def getConnector():
    hostname = "db"
    if os.getenv("FLASK_DEBUG"):
        hostname = "localhost"

    db = mysql.connector.connect(
        host=hostname,
        user="root",
        password="admin",
        database="allergy"
    )
    return db

@cross_origin()
@auth.route("/api/login", methods=['POST'])
def login():
    data = request.get_json(silent=True)
    if data == None:
        data = request.form
    
    if ("email" not in data) or ("password" not in data):
        return {
            "code": 1,
            "error": "Missing information"
        }
    # MD5加密
    encodedPassword = hashlib.md5(data["password"].encode()).hexdigest()
    db = getConnector()
    cursor = db.cursor()
    sql = "SELECT * FROM user where email = %s and password = %s"
    val = [data['email'], encodedPassword]
    cursor.execute(sql, val)
    result = cursor.fetchone()
    cursor.close()
    db.close()
    if not result:
        return {
            "code": 1,
            "error": "Incorrect login information"
        }

    session["user"] = result[0]
    return {
        "data": result[1],
        "code": 0,
        "error": ""
    }

@cross_origin()
@auth.route("/api/register", methods=['POST'])
def register():
    data = request.get_json(silent=True)
    if data == None:
        data = request.form
        
    if ("email" not in data) or ("password" not in data):
        return {
            "code": 1,
            "error": "Missing information"
        }
    
    db = getConnector()
    cursor = db.cursor()
    sql = "SELECT * FROM user where email = %s"
    val = [data['email']]
    cursor.execute(sql, val)
    result = cursor.fetchone()
    if result:
        return {
            "code": 1,
            "error": "Email is already registered"
        }
    
    # MD5加密
    encodedPassword = hashlib.md5(data["password"].encode()).hexdigest()
    sql = "INSERT INTO user(email, password, role) values (%s, %s, 0)"
    val = (data["email"], encodedPassword)
    cursor.execute(sql, val)
    db.commit()
    cursor.close()
    db.close()
    return {
        "code": 0,
        "error": ""
    }

@cross_origin()
@auth.route("/api/logout")
def logout():
    if "user" in session:
        session.clear()
        return {
            "code": 0,
            "error": ""
        }
    return {
        "code": 1,
        "error": "Not logged in"
    }