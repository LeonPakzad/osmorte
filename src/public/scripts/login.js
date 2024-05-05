document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const username = formData.get('username');
    const password = formData.get('password');

    try 
    {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) 
        {
            document.getElementById("loginForm").style.display = 'none';
            document.getElementById("login-error-message").style.display = 'none';
            document.getElementById("login-success-message").style.display = "initial";
        } 
        else 
        {
            document.getElementById("login-error-message").style.display = 'initial';
            document.getElementById("login-success-message").style.display = "none";

            throw new Error(data.message || 'Login failed');
        }
    } 
    catch (error) 
    {
        console.error('Login error:', error.message);
    }
});