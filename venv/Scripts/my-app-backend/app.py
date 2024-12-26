from flask_cors import CORS  # Import CORS
from flask import Flask, request, jsonify
from flask_mysqldb import MySQL

app = Flask(__name__)

# Enable CORS for all origins
CORS(app)

# Alternatively, if you want to restrict it to specific origins (e.g., React frontend at localhost:3000)
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Configure MySQL Database connection
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Laxman1436@'
app.config['MYSQL_DB'] = 'sms'

mysql = MySQL(app)

# Route to get all stored form data
@app.route('/api/data', methods=['GET'])
def get_data():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM form_data")
    result = cursor.fetchall()
    data = [{"id": row[0], "name": row[1], "company": row[2], "email": row[3], "position": row[4]} for row in result]
    cursor.close()
    return jsonify(data)

# Route to add form data to the database
@app.route('/api/data', methods=['POST'])
def add_data():
    form_data = request.get_json()
    cursor = mysql.connection.cursor()
    cursor.execute("""
        INSERT INTO form_data (name, company, email, position)
        VALUES (%s, %s, %s, %s)
    """, (form_data['name'], form_data['company'], form_data['email'], form_data['position']))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"message": "Data added successfully!"})

# Route to update data in the database
@app.route('/api/data/<int:id>', methods=['PUT'])
def update_data(id):
    form_data = request.get_json()
    cursor = mysql.connection.cursor()
    cursor.execute("""
        UPDATE form_data
        SET name = %s, company = %s, email = %s, position = %s
        WHERE id = %s
    """, (form_data['name'], form_data['company'], form_data['email'], form_data['position'], id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"message": "Data updated successfully!"})

# Route to delete data from the database
@app.route('/api/data/<int:id>', methods=['DELETE'])
def delete_data(id):
    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM form_data WHERE id = %s", [id])
    mysql.connection.commit()
    cursor.close()
    return jsonify({"message": "Data deleted successfully!"})

if __name__ == "__main__":
    app.run(debug=True)
