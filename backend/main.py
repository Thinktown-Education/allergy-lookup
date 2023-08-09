# main.py
from flask import Blueprint, session, request
from flask_cors import CORS, cross_origin
import mysql.connector
from enum import Enum
from dotenv import load_dotenv
from contextlib import closing

main = Blueprint('main', __name__)
cors = CORS(main, supports_credentials=True)
user = None

def getConnector():
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="admin",
        database="allergy"
    )
    return db

@cross_origin()
@main.route("/heartbeat")
def heartbeat():
    return {
        "code": 0,
        "error": "Live",
        "data": {
            "email": user['email'],
            "role": user['role']
        }
    }

@cross_origin()
@main.route('/findFood')
def findFood():
    name = request.args.get('name')
    if name == None:
        return {
            "code": 1,
            "error": "Invalid request"
        }
    
    db = getConnector()
    cursor = db.cursor(dictionary = True)
    blurName = '%' + name + '%' # SQL中使用%符号进行模糊查询
    cursor.execute("""
                   SELECT * FROM food 
                   WHERE food_name_lower LIKE LOWER(%s) or brand_lower LIKE LOWER(%s)""", [blurName, blurName])
    result = cursor.fetchall()
    for food in result:
        cursor.execute("""SELECT
                * 
            FROM
                ingredient
                LEFT JOIN food_ingredient ON ingredient.id = food_ingredient.id_ing
            WHERE
            id_food = %s""", [food["id"]])
        food["ingredients"] = cursor.fetchall()

    cursor.close()
    db.close()
    return {
        "code": 0,
        "error": "",
        "data": result
    }


@cross_origin()
@main.route('/findIngredients')
def findIngredients():
    name = request.args.get('name')
    if not name:
        return {
            "code": 1,
            "error": "Invalid request"
        }

    db = getConnector()
    cursor = db.cursor(dictionary=True)
    blurName = '%' + name + '%'
    cursor.execute("""
                   SELECT * FROM ingredient
                   WHERE ing_name_lower LIKE LOWER(%s)""", [blurName])
    result = cursor.fetchall()
    cursor.close()
    db.close()
    return {
        "code": 0,
        "error": "",
        "data": result
    }


@cross_origin()
@main.route('/findFoodByIngredients', methods=['POST'])
def findFoodByIngredients():
    data = request.get_json(silent=True)
    if data == None:
        data = request.form

    if "ingredients" not in data:
        return {
            "code": 1,
            "error": "Incorrect data format"
        }

    ingredientsId = data["ingredients"]
    if not isinstance(ingredientsId, list):
        return {
            "code": 1,
            "error": "Incorrect data format"
        }

    if len(ingredientsId) == 0:
        return {
            "code": 0,
            "error": "",
            "data": []
        }

    # 使用set类型对id进行去重
    idSet = set()
    for iId in ingredientsId:
        idSet.add(iId)

    idCount = len(idSet)
    idFormat = str(idSet)[1:-1]  # 去除首尾花括号

    queryTemplate = f"""
    SELECT
        food.*,
        count(1) AS count 
    FROM
        food
        LEFT JOIN food_ingredient ON food.id = food_ingredient.id_food 
    WHERE
        id_ing IN ( {idFormat} ) 
    GROUP BY
        id_food 
    HAVING
        count = {idCount}
    """

    db = getConnector()
    cursor = db.cursor(dictionary=True)
    cursor.execute(queryTemplate)
    queryResult = cursor.fetchall()
    for food in queryResult:
        query = f"""
        SELECT
            * 
        FROM
            ingredient
            LEFT JOIN food_ingredient ON ingredient.id = food_ingredient.id_ing
        WHERE
            id_food = {food['id']}
        """
        cursor.execute(query)
        food['ingredients'] = cursor.fetchall()

    cursor.close()
    db.close()
    return {
        "code": 0,
        "error": "",
        "data": queryResult
    }

@main.route('/addFood', methods = ['POST'])
def addFood():
    data = request.get_json(silent=True)
    if data == None:
        data = request.form

    if "food_name" not in data \
        or "brand" not in data \
        or "image_url" not in data \
        or "ingredients" not in data:
        return {
            "code": 1,
            "error": "Incorrect data format"
        }
        
    ingredientsId = data["ingredients"]
    if not isinstance(ingredientsId, list):
        return {
            "code": 1,
            "error": "Incorrect data format"
        }
    
    if len(ingredientsId) == 0:
        return {
            "code": 0,
            "error": "",
            "data": []
        }
    
    inputList = [data['food_name'], data['food_name'], data['brand'], data['brand'], data['image_url']]
    db = getConnector()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
    INSERT INTO food (food_name, food_name_lower, brand, brand_lower, image_url) VALUES 
                   (%s, LOWER(%s), %s, LOWER(%s), %s)
    """, inputList)

    foodId = cursor.lastrowid
    for ingId in ingredientsId:
        print(f"""INSERT INTO food_ingredient (id_food, id_ing) VALUES ({foodId}, {ingId})""")
        cursor.execute(f"""INSERT INTO food_ingredient (id_food, id_ing) VALUES ({foodId}, {ingId})""")
    
    db.commit()
    cursor.close()
    db.close()
    return {
        "code": 0,
        "error": "success"
    }


@cross_origin()
@main.route('/permission')
def findUser():
    print(request)
    email = request.args.get('email')
    if email == None:
        return {
            "code": 1,
            "error": "Invalid request"
        }
    
    with closing(getConnector()) as db:
        with closing(db.cursor(dictionary = True)) as cursor:
            emailSubstring = '%' + email + '%'
            cursor.execute("""
                   SELECT * FROM user
                   WHERE email LIKE %s""", [emailSubstring])
            result = cursor.fetchall()
    return {
        "code": 0,
        "error": "",
        "data": result
    }



@cross_origin()
@main.route('/permission', methods = ['POST'])
def updatePermission():
    data = request.get_json(silent=True)
    print(data)

    success = {"code": 0, "error": "success"}
    failure = {"code": 201, "error": "failure"}

    db = getConnector()
    cursor = db.cursor(dictionary=True)

    newRole = data['role']
    statement = """UPDATE user SET role = %s WHERE id = %s"""
    cursor.execute(statement, [data['role'], data['id']])

    db.commit()
    cursor.close()
    db.close()
    return success

"""
所有需要登陆状态的请求都必须经过session检查
"""
@cross_origin()
@main.before_request
def check_session():
    if request.method == "OPTIONS":
        return {}
    if "user" not in session:
        return {
            "error": "not signed in"
        }, 401
    db = getConnector()
    cursor = db.cursor(dictionary = True)
    sql = "SELECT * FROM user where id = %s"
    val = [int(session["user"])]
    cursor.execute(sql, val)
    result = cursor.fetchone()
    cursor.close()
    db.close()
    if not result:
        return {
            "error": "not signed in"
        }, 401
    global user
    user = result

class Role(Enum):
    USER = 0
    EDITOR = 1
    ADMIN = 2
