# main.py
from flask import Blueprint, session, request
from flask_cors import CORS, cross_origin
import mysql.connector
from enum import IntEnum
import os
from dotenv import load_dotenv

load_dotenv()
password = os.getenv("MYSQL_ROOT_PASSWORD")
hostname = "db"
if os.getenv("FLASK_DEBUG"):
    hostname = "localhost"
    password = "admin"

print(password)
main = Blueprint('main', __name__)
cors = CORS(main, supports_credentials=True)
user = None

def getConnector():
    db = mysql.connector.connect(
        host=hostname,
        user="root",
        password=password,
        database="allergy"
    )
    return db

@cross_origin()
@main.route("/api/heartbeat")
def heartbeat():
    return {
        "code": 0,
        "error": "Live",
        "data": {
            "email": user['email'],
            "role": user['role']
        },
        "env": os.getenv('FLASK_DEBUG')
    }

@cross_origin()
@main.route('/api/findFood')
def findFood():
    name = request.args.get('name')
    if name == None:
        return {
            "code": 1,
            "error": "Invalid request"
        }
    
    db = getConnector()
    cursor = db.cursor(dictionary = True)
    blurName = '%' + name + '%' # % for pattern search
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
@main.route('/api/findIngredients')
def findIngredients():
    name = request.args.get('name')
    if name == None:
        return {
            "code": 1,
            "error": "Invalid request"
        }
    
    db = getConnector()
    cursor = db.cursor(dictionary = True)
    blurName = '%' + name + '%'
    cursor.execute("""
                   SELECT * FROM ingredient
                   WHERE ing_name_lower LIKE LOWER(%s)""", [blurName])
    print(blurName)
    result = cursor.fetchall()
    cursor.close()
    db.close()
    return {
        "code": 0,
        "error": "",
        "data": result
    }

@cross_origin()
@main.route('/api/findFoodByIngredients', methods = ['POST'])
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
    
    # Remove duplicates using set
    idSet = set() 
    for iId in ingredientsId:
        idSet.add(iId)
    
    idCount = len(idSet)
    idFormat = str(idSet)[1:-1] # Remove {}

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

@cross_origin()
@main.route('/api/addFood', methods = ['POST'])
def addFood():
    if user['role'] < int(Role.EDITOR):
        return {
            "code": 1,
            "error": "Permission not allowed"
        }
    
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
    
    inputList = [data['food_name'], data['food_name'], data['brand'], data['brand'], data['image_url']]
    db = getConnector()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
    INSERT INTO food (food_name, food_name_lower, brand, brand_lower, image_url) VALUES 
                   (%s, LOWER(%s), %s, LOWER(%s), %s)
    """, inputList)

    foodId = cursor.lastrowid
    for ingId in ingredientsId:
        cursor.execute(f"""INSERT INTO food_ingredient (id_food, id_ing) VALUES ({foodId}, {ingId})""")
    
    db.commit()
    cursor.close()
    db.close()
    return {
        "code": 0,
        "error": "success"
    }

@cross_origin()
@main.route('/api/editFood', methods = ['POST'])
def editFood():
    if user['role'] < Role.EDITOR:
        return {
            "code": 1,
            "error": "Permission not allowed"
        }
    
    data = request.get_json(silent=True)
    if data == None:
        data = request.form

    if "id" not in data \
        or "food_name" not in data \
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

    inputList = [data['food_name'], data['food_name'], data['brand'], data['brand'], data['image_url'], data['id']]
    db = getConnector()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
    UPDATE food
    SET food_name = %s, food_name_lower = LOWER(%s), brand = %s, brand_lower = LOWER(%s), image_url = %s, modified = CURRENT_TIMESTAMP
    WHERE id = %s
    """, inputList)

    cursor.execute("DELETE FROM food_ingredient WHERE id_food = %s", [int(data['id'])])
    for ingId in ingredientsId:
        cursor.execute(f"""INSERT INTO food_ingredient (id_food, id_ing) VALUES ({data['id']}, {ingId})""")

    db.commit()
    cursor.close()
    db.close()
    return {
        "code": 0,
        "error": "success"
    }

@cross_origin()
@main.route('/api/deleteFood/<id_food>', methods = ['GET'])
def deleteFood(id_food):
    if user['role'] < int(Role.EDITOR):
        return {
            "code": 1,
            "error": "Permission not allowed"
        }

    id_food = int(id_food)
    db = getConnector()
    cursor = db.cursor(dictionary = True)
    cursor.execute("DELETE FROM food WHERE id = %s", [id_food])
    cursor.execute("DELETE FROM food_ingredient WHERE id_food = %s", [id_food])
    db.commit()
    cursor.close()
    db.close()
    return {
        "code": 0,
        "error": "success"
    }

@cross_origin()
@main.route('/api/addIngredient', methods = ['POST'])
def addIngredient():
    if user['role'] < int(Role.EDITOR):
        return {
            "code": 1,
            "error": "Permission not allowed"
        }
    
    data = request.get_json(silent=True)
    if data == None:
        data = request.form

    if "ing_name" not in data:
        return {
            "code": 1,
            "error": "Incorrect format"
        }
    
    ing_name = data["ing_name"]
    db = getConnector()
    cursor = db.cursor(dictionary = True)
    cursor.execute("INSERT INTO ingredient (ing_name, ing_name_lower) values (%s, LOWER(%s))", [ing_name, ing_name])
    db.commit()
    cursor.close()
    db.close()
    return {
        "code": 0,
        "error": "success"
    }

@cross_origin()
@main.route('/api/editIngredient', methods = ['POST'])
def editIngredient():
    if user['role'] < int(Role.EDITOR):
        return {
            "code": 1,
            "error": "Permission not allowed"
        }
    
    data = request.get_json(silent=True)
    if data == None:
        data = request.form

    if "id" not in data \
        or "ing_name" not in data:
        return {
            "code": 1,
            "error": "Incorrect format"
        }
    
    id_ing = data["id"]
    ing_name = data["ing_name"]
    db = getConnector()
    cursor = db.cursor(dictionary = True)
    cursor.execute("UPDATE ingredient SET ing_name = %s, ing_name_lower = LOWER(%s), modified = CURRENT_TIMESTAMP WHERE id = %s", [ing_name, ing_name, id_ing])
    db.commit()
    cursor.close()
    db.close()
    return {
        "code": 0,
        "error": "success"
    }
    
@cross_origin()
@main.route('/api/deleteIngredient/<id_ing>', methods = ['GET'])
def deleteIngredient(id_ing):
    if user['role'] < int(Role.EDITOR):
        return {
            "code": 1,
            "error": "Permission not allowed"
        }

    id_ing = int(id_ing)
    db = getConnector()
    cursor = db.cursor(dictionary = True)
    cursor.execute("DELETE FROM ingredient WHERE id = %s", [id_ing])
    cursor.execute("DELETE FROM food_ingredient WHERE id_ing = %s", [id_ing])
    db.commit()
    cursor.close()
    db.close()
    return {
        "code": 0,
        "error": "success"
    }

@cross_origin()
@main.route('/api/findUser')
def findUser():
    if user['role'] < Role.ADMIN:
        return {
            "code": 1,
            "error": "Permission not allowed"
        }
    
    email = request.args.get('email')
    if email == None:
        return {
            "code": 1,
            "error": "Invalid request"
        }
    
    emailSubstring = '%' + email + '%'

    db = getConnector()
    cursor = db.cursor(dictionary = True)
    cursor.execute("""
        SELECT * FROM user
        WHERE email LIKE %s""", [emailSubstring])
    result = cursor.fetchall()
    cursor.close()
    db.close()

    return {
        "code": 0,
        "error": "success",
        "data": result
    }

@cross_origin()
@main.route('/api/updateUser', methods = ['POST'])
def updateUser():
    if user['role'] < Role.ADMIN:
        return {
            "code": 1,
            "error": "Permission not allowed"
        }
    
    data = request.get_json(silent=True)
    if "id" not in data \
        or "role" not in data \
        or "email" not in data:
            return {
                "code": 1,
                "error": "Incorrect data format"
            }

    db = getConnector()
    cursor = db.cursor(dictionary=True)

    # check if the target user is admin
    cursor.execute("""
        SELECT * FROM user
        WHERE id = %s""", [data['id']])
    result = cursor.fetchall()
    if len(result) > 0:
        current = result[0]
        if current['role'] == Role.ADMIN:
            return {
                "code": 1,
                "error": "Admin's cannot be altered through webpage"
            }

    statement = """UPDATE user SET role = %s WHERE id = %s"""
    cursor.execute(statement, [data['role'], data['id']])

    db.commit()
    cursor.close()
    db.close()
    return {
        "code": 0,
        "error": "success"
    }
    
"""
Always run this before any request to main api
"""
@cross_origin()
@main.before_request
def check_session():
    if request.method == "OPTIONS":
        return {}
    
    if "user" not in session:
        return {
            "code": 1,
            "error": "not signed in"
        }
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
            "code": 1,
            "error": "not signed in"
        }
    global user
    user = result

class Role(IntEnum):
    USER = 0
    EDITOR = 1
    ADMIN = 2