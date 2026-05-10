import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.post('/chat', async (req, res) => {

  try {

    const { message } = req.body;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message
    });

    res.json({
      reply: response.text || "AI tidak memberikan jawaban"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }

});

app.listen(3000, () => {
  console.log('Server jalan di http://localhost:3000');
});