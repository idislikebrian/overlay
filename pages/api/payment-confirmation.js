import { ElevenLabsClient } from "elevenlabs";
import * as dotenv from "dotenv";

dotenv.config();

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { textToSpeak } = req.body;

        try {
            const audioStream = await client.generate({
                voice: "Rachel", // or any valid voice ID
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
