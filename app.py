import sqlite3
from flask import Flask, render_template, redirect, url_for, request

app = Flask(__name__)

# 🔹 DB connection
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

# 🔹 Initialize DB
def init_db():
    conn = get_db_connection()

    conn.execute('''
        CREATE TABLE IF NOT EXISTS medicines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            price INTEGER
        )
    ''')

    conn.execute('''
        CREATE TABLE IF NOT EXISTS cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            price INTEGER
        )
    ''')

    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            password TEXT
        )
    ''')

    medicines = conn.execute('SELECT * FROM medicines').fetchall()
    if not medicines:
        medicines_list = [
            ("Paracetamol", 50), ("Crocin", 30), ("Aspirin", 40),
            ("Ibuprofen", 60), ("Amoxicillin", 120), ("Azithromycin", 150),
            ("Cetirizine", 20), ("Dolo 650", 35), ("Metformin", 80),
            ("Atorvastatin", 90), ("Pantoprazole", 70), ("Omeprazole", 75),
            ("Ranitidine", 65), ("Losartan", 110), ("Amlodipine", 95),
            ("Clopidogrel", 130), ("Warfarin", 140), ("Insulin", 200),
            ("Thyroxine", 85), ("Salbutamol", 55), ("Montelukast", 100),
            ("Fexofenadine", 60), ("Loratadine", 50), ("Hydroxychloroquine", 180),
            ("Dexamethasone", 90), ("Prednisone", 85), ("Vitamin C", 40),
            ("Vitamin D3", 60), ("Calcium Tablets", 70), ("Iron Tablets", 50),
            ("Zinc Tablets", 45), ("ORS", 20), ("Antacid", 25),
            ("Digoxin", 160), ("Propranolol", 75), ("Ciprofloxacin", 120),
            ("Levofloxacin", 140), ("Clarithromycin", 150), ("Norfloxacin", 110),
            ("Ketoconazole", 130), ("Fluconazole", 145), ("Metronidazole", 100),
            ("Albendazole", 90), ("Ivermectin", 80), ("Codeine", 200),
            ("Tramadol", 180), ("Morphine", 300), ("Diazepam", 120),
            ("Alprazolam", 130), ("Sertraline", 150)
        ]

        for name, price in medicines_list:
            conn.execute(
                "INSERT INTO medicines (name, price) VALUES (?, ?)",
                (name, price)
            )

    conn.commit()
    conn.close()

init_db()

# 🏠 Home + Search
@app.route('/')
def home():
    conn = get_db_connection()
    search = request.args.get('search')

    if search:
        medicines = conn.execute(
            "SELECT * FROM medicines WHERE name LIKE ?",
            ('%' + search + '%',)
        ).fetchall()
    else:
        medicines = conn.execute('SELECT * FROM medicines').fetchall()

    conn.close()
    return render_template('index.html', medicines=medicines)

# ➕ Add to cart
@app.route('/add/<int:id>')
def add_to_cart(id):
    conn = get_db_connection()
    med = conn.execute('SELECT * FROM medicines WHERE id = ?', (id,)).fetchone()

    conn.execute(
        'INSERT INTO cart (name, price) VALUES (?, ?)',
        (med['name'], med['price'])
    )
    conn.commit()
    conn.close()

    return redirect(url_for('home'))

# 🛒 Cart
@app.route('/cart')
def view_cart():
    conn = get_db_connection()
    cart = conn.execute('SELECT * FROM cart').fetchall()
    total = sum(item['price'] for item in cart)
    conn.close()
    return render_template('cart.html', cart=cart, total=total)

# ❌ Remove
@app.route('/remove/<int:id>')
def remove_from_cart(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM cart WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return redirect(url_for('view_cart'))

# 🧹 Clear
@app.route('/clear')
def clear_cart():
    conn = get_db_connection()
    conn.execute('DELETE FROM cart')
    conn.commit()
    conn.close()
    return redirect(url_for('view_cart'))

# 🔐 Register
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        conn = get_db_connection()
        conn.execute(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            (username, password)
        )
        conn.commit()
        conn.close()

        return redirect(url_for('login'))

    return render_template('register.html')

# 🔐 Login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        conn = get_db_connection()
        user = conn.execute(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            (username, password)
        ).fetchone()
        conn.close()

        if user:
            return redirect(url_for('home'))
        else:
            return "Invalid credentials ❌"

    return render_template('login.html')

# ▶️ Run
if __name__ == '__main__':
    app.run(debug=True)