import express from 'express';
import bcrypt, { compare } from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js'

// express init
const app = express();
const PORT = 7291;

//dotenv init
const env = dotenv.config();

//supabase init
const supabaseUrl = 'https://ujhoojeuuvuqldusmfuy.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

app.use(express.json());


app.post('/auth/sign-in', async (req, res)=>{
    
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).send({ message: '"email" and "password" are required' });
    }

    const payload = { email: email, password: password };
    
    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_PRIVATE_KEY,
        { expiresIn: '1h' }
    );    

    let userId = '';
    let refreshToken = '';

    try{
        const { data, error } = await supabase
        .from('Users')
        .select('id,password_hash,refresh_token')
        .eq('email', email);

        if(!await bcrypt.compare(password, data[0].password_hash)){
            throw error;
        }

        if (error) {
            console.error('Supabase error:', error);
          } else {
            userId = data[0].id;
            refreshToken = data[0].refresh_token;
          }

    }catch(err){
        res.json(
          {
            success: true,
            error: "wrong credentials"
          });
          return;
    }

    res.json(
        {
            success: true,
            data: {
              id: userId,
              accessToken: accessToken,
              refreshToken: refreshToken
            }
        }
    );
});

app.post('/auth/sign-up', async (req, res)=>{
    
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).send({ message: '"email" and "password" are required' });
    }

    const payload = { email: email, password: password };

    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_PRIVATE_KEY,
        { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_PRIVATE_KEY,
        { expiresIn: '100y'}
    );

    const hashedPassword = await hashPassword(password);
    
    try{
        const { data, error } = await supabase
        .from('Users')
        .insert([
          { email: email, password_hash: hashedPassword, refresh_token: refreshToken },
        ])
        .select()

        if(error){
            throw error
        }
    }
    catch(err){
        res.json(
            {
              success: true,
              error: err.message
            });
            return;
    }

    res.json({
        success: true,
        data: {
          id: 0,
          accessToken: accessToken,
          refreshToken: refreshToken
        }
      });
});

app.get('/me', (req, res) => {
    const authHeader = req.headers.authorization;

    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY, (err, decoded) => {
        if (err) {
            res.status(403).json({ error: 'Token verification failed' });
        } else {
            const { id, email } = decoded;
            res.json({ id, email });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}/`);
});


async function hashPassword(password) {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error(error);
        return null;
    }
}