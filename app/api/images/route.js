import fs from 'fs';
import path from 'path';

export async function GET() {
    const directoryPath = path.join(process.cwd(), 'public/shoots');
    const filenames = fs.readdirSync(directoryPath).filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    return Response.json(filenames);
}
