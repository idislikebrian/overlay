import { ElevenLabsClient } from "elevenlabs";
import * as dotenv from "dotenv";
import fetch from 'node-fetch';

dotenv.config();

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

const allowedOrigins = [
    "https://unlonely-alpha-git-homepage-exp-unlonely-alpha.vercel.app",
    "https://unlonely-alpha-git-staging-unlonely-alpha.vercel.app",
    "https://www.unlonely.app"
];

export default async function handler(req, res) {
    const origin = req.headers.origin || '';
  
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  
    if (req.method === 'POST') {
      const { textToSpeak } = req.body;
  
      try {
        const audioStream = await client.generate({
          voice: "hHbFRzG8c6FTY0yE5ELM",
          model_id: "eleven_turbo_v2",
          text: textToSpeak
        });
  
        const chunks = [];
        for await (const chunk of audioStream) {
          chunks.push(chunk);
        }
        const audioBuffer = Buffer.concat(chunks);
        const base64Audio = audioBuffer.toString('base64');
  
        const serverUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL + '/emit-play-audio'; // Ensure this URL is correct
        await fetch(serverUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: base64Audio })
        });
  
        res.status(200).json({ success: true, message: 'Audio sent to server.' });
      } catch (error) {
        console.error("Error with TTS streaming:", error);
        res.status(500).json({ error: 'TTS streaming failed', details: error.message });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }