// Vercel Serverless Function for Hardcover GraphQL API
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        let body = req.body;
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            } catch (e) {
                // Keep as is
            }
        }
        const { query, variables, token } = body || {};

        if (!query) {
            return res.status(400).json({ error: 'Missing GraphQL query' });
        }

        const fallbackToken = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsInZlcnNpb24iOiI4IiwianRpIjoiNjcyYjFlMzUtZTQ3Yy00N2E4LThjOTktZTA4ODVjN2M5ZGI0IiwiYXBwbGljYXRpb25JZCI6Miwic3ViIjoiMTQ2MzgwIiwiYXVkIjoiMSIsImlkIjoiMTQ2MzgwIiwibG9nZ2VkSW4iOnRydWUsImlhdCI6MTc4NjU1OTM3NiwiZXhwIjoxODE4MDk1Mzc2LCJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsidXNlciJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJ1c2VyIiwiXy1oYXN1cmEtcm9sZSI6InVzZXIiLCJYLWhhc3VyYS11c2VyLWlkIjoiMTQ2MzgwIn0sInVzZXIiOnsiaWQiOjE0NjM4MH19.Sxm4xgxWD9F5pk2tEHllK8xFfPXSthiKY8szgR6rtbw";
        const authToken = token || process.env.HARDCOVER_TOKEN || fallbackToken;
        const normalizedToken = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;

        const response = await fetch('https://api.hardcover.app/v1/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': normalizedToken
            },
            body: JSON.stringify({ query, variables })
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (err) {
        console.error("Hardcover Proxy Error:", err.message);
        return res.status(500).json({ error: err.message });
    }
}
