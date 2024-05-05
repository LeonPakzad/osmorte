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
            console.log('Login successful');
        } else 
        {
            throw new Error(data.message || 'Login failed');
        }
    } 
    catch (error) 
    {
        console.error('Login error:', error.message);
    }
});