const jwt = require('jsonwebtoken');

export module auth {

    // access config var
    var secretKey = process.env.TOKEN_SECRET;

    export function verifyToken(req: { cookies: { token: string; }; user: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): any; new(): any; }; }; }, next: () => void) 
    {
        const token = req.cookies.token;
        if(token)
        {
            jwt.verify(token, secretKey, (error: string, decoded: string) => {
                if (error) return res.status(403).json({ message: 'Failed to authenticate token' });
                req.user = decoded;
                next();
            });
        }
        else
        {
            return res.status(401).json({ message: 'Token not provided' });
        }
    }

    export function login(req: { body: { username: string; password: string; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): any; new(): any; }; }; cookie: (arg0: string, arg1: any, arg2: { httpOnly: boolean; }) => void; json: (arg0: { message: string; }) => void; }) {
        const { username, password } = req.body;
        if (process.env.TOKEN_USERNAME == username && process.env.TOKEN_PASSWORD == password) {
            // Create JWT token
            jwt.sign({ userId: username }, secretKey, { expiresIn: '1h' }, (error:string, token:string) => {
                if (error) {
                    return res.status(500).json({ message: 'Failed to generate token' });
                }
    
                // Set token as an HTTP cookie
                res.cookie('token', token, { httpOnly: true });
                res.json({ message: 'Login successful' });
            });
        } else {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
    }
}