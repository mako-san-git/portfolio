/**
 * 共通処理: ロゴの色変更とログイン状態の監視
 */
const updateNavForLoggedInUser = () => {
    const userName = sessionStorage.getItem('loggedInUser');
    const navUl = document.querySelector('nav ul');

    if (userName && navUl) {
        // ログイン中のメニュー表示に書き換え
        navUl.innerHTML = `
            <li><a href="/">ホーム</a></li>
            <li><span style="color: #007bff; font-weight: bold;">👤 ${userName}さん</span></li>
            <li><a href="#" id="logout-link">ログアウト</a></li>
        `;

        document.getElementById('logout-link').addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('loggedInUser');
            alert('ログアウトしました');
            window.location.href = "/";
        });
    }
};

// ページ読み込み時にログイン状態をチェック
window.addEventListener('load', updateNavForLoggedInUser);

const logo = document.querySelector('.logo h1');
if (logo) {
    const colorPalette = ['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#ffa500', '#00ffff'];
    logo.addEventListener('click', () => {
        const index = Math.floor(Math.random() * colorPalette.length);
        logo.style.color = colorPalette[index];
    });
}

/**
 * 新規登録フォーム（signup.html）の処理
 */
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    const signupUsername = document.getElementById('username');
    const signupEmail = document.getElementById('email');
    const signupPassword = document.getElementById('password');
    const submitBtn = document.getElementById('submit-btn');

    let isUsernameValid = false;
    let isEmailValid = false;
    let isPasswordValid = false;

    const toggleSubmitButton = () => {
        submitBtn.disabled = !(isUsernameValid && isEmailValid && isPasswordValid);
    };

    signupUsername.addEventListener('input', () => {
        isUsernameValid = signupUsername.value.length >= 3;
        document.getElementById('username-status').textContent = isUsernameValid ? '✅' : '❌';
        toggleSubmitButton();
    });

    signupEmail.addEventListener('input', () => {
        const emailValue = signupEmail.value;
        isEmailValid = emailValue.includes('@') && emailValue.includes('.') && emailValue.length > 5;
        const statusElement = document.getElementById('email-status');
        if (statusElement) {
            statusElement.textContent = isEmailValid ? '✅' : '❌';
        }
        toggleSubmitButton();
    });

    signupPassword.addEventListener('input', () => {
        isPasswordValid = signupPassword.value.length >= 8;
        document.getElementById('password-status').textContent = isPasswordValid ? '✅' : '❌';
        toggleSubmitButton();
    });

    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = {
            username: signupUsername.value,
            email: signupEmail.value,
            password: signupPassword.value
        };

        fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.status === 'success') {
                window.location.href = "/login";
            }
        })
        .catch(error => console.error("Error:", error));
    });
}

/**
 * ログインフォーム（login.html）の処理
 */
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const loginData = {
            email: document.getElementById('login-email').value,
            password: document.getElementById('login-password').value
        };

        fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.status === "success") {
                // ブラウザにユーザー名を一時保存
                sessionStorage.setItem('loggedInUser', data.username);
                window.location.href = "/";
            }
        })
        .catch(error => console.error("Error:", error));
    });
}