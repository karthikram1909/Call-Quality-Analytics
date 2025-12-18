
const url = 'https://one.2440066.xyz/call-logs-api/api/call-logs';

console.log('Fetching from:', url);

async function fetchData() {
    try {
        const response = await fetch(url);
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);

        const text = await response.text();
        console.log('Raw Response Length:', text.length);
        console.log('Raw Response Preview:', text.substring(0, 500));

        try {
            const json = JSON.parse(text);
            console.log('Is Array?', Array.isArray(json));
            if (Array.isArray(json)) {
                console.log('Item count:', json.length);
                if (json.length > 0) console.log('First item:', json[0]);
            } else {
                console.log('Keys:', Object.keys(json));
                if (json.data) {
                    console.log('json.data type:', Array.isArray(json.data) ? 'Array' : typeof json.data);
                    console.log('json.data length:', json.data.length);
                }
            }
        } catch (e) {
            console.error('Failed to parse JSON:', e.message);
        }
    } catch (error) {
        console.error('Fetch error:', error.message);
    }
}

fetchData();
