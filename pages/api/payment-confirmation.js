import { ElevenLabsClient } from "elevenlabs";
import * as dotenv from "dotenv";

dotenv.config();

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

// List of allowed origins, can be empty to allow all origins
const allowedOrigins = [
    "https://unlonely-alpha-git-homepage-exp-unlonely-alpha.vercel.app",
    "https://unlonely-alpha-git-staging-unlonely-alpha.vercel.app",
    "https://www.unlonely.app"
];

export default async function handler(req, res) {
  const origin = req.headers.origin || '';

  // If allowedOrigins is empty, allow all origins by setting "*"
  if (allowedOrigins.length === 0) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (allowedOrigins.includes(origin)) {
    // Otherwise, allow only specific origins
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { textToSpeak } = req.body;

    try {
      const audioStream = await client.generate({
        voice: "hHbFRzG8c6FTY0yE5ELM", // or any valid voice ID
        model_id: "eleven_turbo_v2",
        text: textToSpeak
      });

      const chunks = [];
      for await (const chunk of audioStream) {
        chunks.push(chunk);
      }
      const audioBuffer = Buffer.concat(chunks);

      res.status(200).json({ success: true, audio: audioBuffer.toString('base64') });
    } catch (error) {
      console.error("Error with TTS streaming:", error);
      res.status(500).json({ error: 'TTS streaming failed', details: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}