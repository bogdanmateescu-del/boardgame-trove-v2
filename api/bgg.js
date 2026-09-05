// Vercel Serverless Function for BoardGameGeek XMLAPI2
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { endpoint, query, id } = req.query || {};
    if (!endpoint) {
        return res.status(400).json({ error: 'Missing endpoint parameter' });
    }

    let bggUrl = `https://boardgamegeek.com/xmlapi2/${endpoint}?`;
    if (query) bggUrl += `type=boardgame,boardgameexpansion&query=${encodeURIComponent(query)}`;
    if (id) bggUrl += `id=${encodeURIComponent(id)}`;

    const authToken = process.env.BGG_AUTH_TOKEN || '672d74b8-c3cd-4855-b223-4add9e21c240';
    const maxAttempts = 3;
    let attempts = 0;

    while (attempts < maxAttempts) {
        try {
            attempts++;
            const response = await fetch(bggUrl, {
                method: 'GET',
                headers: {
                    'User-Agent': 'BoardGameTroveApp/1.0',
                    'Authorization': `Bearer ${authToken}`
                }
            });

            // BGG returns 202 Accepted when a search query is queued on their servers
            if (response.status === 202) {
                if (attempts < maxAttempts) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    continue;
                }
            }

            const text = await response.text();
            res.setHeader('Content-Type', 'text/xml; charset=utf-8');
            return res.status(response.status).send(text);
        } catch (error) {
            if (attempts >= maxAttempts) {
                return res.status(500).send(error.message);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}
