// BoardGameGeek Service calling /api/bgg serverless endpoint
export async function fetchBGG(endpoint, params = {}) {
    let url = `/api/bgg?endpoint=${encodeURIComponent(endpoint)}`;
    if (params.query) url += `&query=${encodeURIComponent(params.query)}`;
    if (params.id) url += `&id=${encodeURIComponent(params.id)}`;

    const response = await fetch(url, { 
        method: 'GET', 
        headers: { 'Accept': 'text/xml' } 
    });

    const text = await response.text();
    if (!response.ok) {
        throw new Error(`BGG API Error HTTP ${response.status}`);
    }
    
    // Status 202 or incomplete queue
    if (response.status === 202 || text.includes("202 Accepted") || !text.includes("<items")) {
        throw new Error("BGG search is queued or warming up. Retrying...");
    }
    return text;
}

export async function parseBGGSearchXml(xmlText, query) {
    const xml = new DOMParser().parseFromString(xmlText, "text/xml");
    const items = Array.from(xml.getElementsByTagName("item"));
    if (items.length === 0) return [];

    const searchTerm = query.trim().toLowerCase();
    const parsedItems = items.map(i => {
        const nameEl = i.getElementsByTagName('name')[0];
        const name = nameEl ? nameEl.getAttribute('value') : "Unknown";
        const id = i.getAttribute('id');
        const yearEl = i.getElementsByTagName('yearpublished')[0];
        const year = yearEl ? yearEl.getAttribute('value') : "";
        const nameLower = name.toLowerCase();
        
        let rank = 3;
        if (nameLower === searchTerm) {
            rank = 0;
        } else if (nameLower.startsWith(searchTerm + ' ') || nameLower.startsWith(searchTerm + '(')) {
            rank = 1;
        } else if (nameLower.startsWith(searchTerm)) {
            rank = 2;
        }

        return { id, name, year, rank };
    });

    parsedItems.sort((a, b) => a.rank - b.rank);
    return parsedItems.slice(0, 15);
}

export async function fetchBGGThingImage(id) {
    const text = await fetchBGG('thing', { id });
    const xml = new DOMParser().parseFromString(text, "text/xml");
    const imgEl = xml.getElementsByTagName("image")[0] || xml.getElementsByTagName("thumbnail")[0];
    return imgEl ? imgEl.textContent : "";
}
