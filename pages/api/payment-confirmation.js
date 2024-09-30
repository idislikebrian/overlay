import { ElevenLabsClient } from "elevenlabs";
import fetch from 'node-fetch';

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

const allowedOrigins = [
  "https://unlonely-alpha-git-homepage-exp-unlonely-alpha.vercel.app",
  "https://unlonely-alpha-git-staging-unlonely-alpha.vercel.app",
  "https://www.unlonely.app",
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
      if (!process.env.ELEVENLABS_API_KEY) {
        console.error("ELEVENLABS_API_KEY is not defined");
        return res.status(500).json({ error: 'Server configuration error: ELEVENLABS_API_KEY is not defined' });
      }

      const audioStream = await client.generate({
        voice: "hHbFRzG8c6FTY0yE5ELM",
        model_id: "eleven_turbo_v2",
        text: textToSpeak,
      });

      const chunks = [];
      for await (const chunk of audioStream) {
        chunks.push(chunk);
      }
      const audioBuffer = Buffer.concat(chunks);
      const base64Audio = audioBuffer.toString('base64');

      if (!process.env.SOCKET_SERVER_URL) {
        console.error("SOCKET_SERVER_URL is not defined");
        return res.status(500).json({ error: 'Server configuration error: SOCKET_SERVER_URL is not defined' });
      }

      const serverUrl = process.env.SOCKET_SERVER_URL + '/emit-play-audio';

      console.log('Sending audio to:', serverUrl);

      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: base64Audio }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error sending audio to server:', errorText);
        return res.status(500).json({ error: 'Failed to send audio to server', details: errorText });
      }

      res.status(200).json({ success: true, message: 'Audio sent to server.' });
    } catch (error) {
      console.error("Error with TTS streaming:", error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message, stack: error.stack });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
