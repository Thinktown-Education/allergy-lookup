# main.py
from flask import Blueprint, session
from flask_cors import CORS, cross_origin
import mysql.connector

main = Blueprint('main', __name__)
cors = CORS(main, supports_credentials=True)
db = mysql.connector.connect(
  host="localhost",
  user="root",
  password="admin",
  database="allergy"
)

user = {}

@cross_origin()
@main.route("/heartbeat")
def heartbeat():
    print(user)
    return {
        "code": 0,
        "error": "Live",
        "data": {
            "email": user['email'],
            "role": user['role']
        }
    }

@cross_origin()
@main.route('/getFood')
def dbtest():
    cursor = db.cursor()
    cursor.execute("SELECT * FROM food")
    result = cursor.fetchall()
    return result

@cross_origin()
@main.route('/getUser')
def dbadd():
    cursor = db.cursor()
    cursor.execute("SELECT * FROM user")
    result = cursor.fetchall()
    return {
        "data": result
    }

@cross_origin()
@main.before_request
def check_session():
    if "user" not in session:
        return {
            "error": "not signed in"
        }, 401
    cursor = db.cursor()
    sql = "SELECT * FROM user where id = %s"
    val = [int(session["user"])]
    cursor.execute(sql, val)
    result = cursor.fetchone()
    if not result:
        return {
            "error": "not signed in"
        }, 401
    global user
    user = convertUser(result)

def convertUser(info):
    return {
        "id": info[0],
        "email": info[2],
        "role": info[1]
    }
