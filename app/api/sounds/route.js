import fs from 'fs';
import path from 'path';

export async function GET() {
    const directoryPath = path.join(process.cwd(), 'public/mp3');
    const filenames = fs.readdirSync(directoryPath).filter(file => file.endsWith('.mp3'));
    return Response.json(filenames);
}
