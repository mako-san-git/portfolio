from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__, template_folder='.', static_folder='.', static_url_path='')

# データベースの初期化
def init_db():
    with sqlite3.connect('users.db') as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
        ''')
        conn.commit()

init_db()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/signup')
def signup_page():
    return render_template('signup.html')

@app.route('/login')
def login_page():
    return render_template('login.html')

@app.route('/api/signup', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    try:
        with sqlite3.connect('users.db') as conn:
            cursor = conn.cursor()
            cursor.execute(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                (username, email, password)
            )
            conn.commit()
        return jsonify({"status": "success", "message": f"{username}さんの登録が完了しました！"})
    except sqlite3.IntegrityError:
        return jsonify({"status": "error", "message": "このメールアドレスは既に登録されています。"}), 400

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    with sqlite3.connect('users.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE email = ? AND password = ?', (email, password))
        user = cursor.fetchone()

    if user:
        # データベースの2番目の項目(index 1)であるusernameを返却
        return jsonify({
            "status": "success", 
            "username": user[1], 
            "message": f"ログイン成功！ようこそ {user[1]} さん。"
        })
    else:
        return jsonify({"status": "error", "message": "メールアドレスまたはパスワードが正しくありません。"}), 401

if __name__ == '__main__':
    app.run(debug=True)