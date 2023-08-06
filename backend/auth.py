# auth.py
from flask import Blueprint, request, session
from flask_cors import CORS, cross_origin
import mysql.connector
import hashlib

auth = Blueprint('auth', __name__)
cors = CORS(auth, supports_credentials=True)
db = mysql.connector.connect(
  host="localhost",
  user="root",
  password="admin",
  database="allergy"
)

@cross_origin()
@auth.route("/login", methods=['POST'])
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
    cursor = db.cursor()
    sql = "SELECT * FROM user where email = %s and password = %s"
    val = [data['email'], encodedPassword]
    cursor.execute(sql, val)
    result = cursor.fetchone()
    db.commit()
    cursor.close()
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
@auth.route("/register", methods=['POST'])
def register():
    data = request.get_json(silent=True)
    if data == None:
        data = request.form
        
    if ("email" not in data) or ("password" not in data):
        return {
            "code": 1,
            "error": "Missing information"
        }
    
    cursor = db.cursor()
    sql = "SELECT * FROM user where email = %s"
    val = [data['email']]
    cursor.execute(sql, val)
    result = cursor.fetchone()
    db.commit()
    cursor.close()
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
    return {
        "code": 0,
        "error": ""
    }

@cross_origin()
@auth.route("/logout")
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