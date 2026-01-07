import { NextApiRequest, NextApiResponse } from 'next';
import { readFileSync } from 'fs';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const filePath = 'c:\\Users\\tabva\\Documents\\trae_projects\\LoveNewTrae\\app\\src\\assets\\logo\\mainlogoone-transparent.png';
    const buf = readFileSync(filePath);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(buf);
  } catch {
    res.status(404).json({ error: 'logo_not_found' });
  }
}
