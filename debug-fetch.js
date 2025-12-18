
const url = 'https://one.2440066.xyz/call-logs-api/api/call-logs';

console.log('Fetching from:', url);

async function fetchData() {
    try {
        const response = await fetch(url, {
            headers: {
                'x-api-key': '0297e443f25d40ac1f1484942aee0d16f54f70bb8117c32682c539bfcdfe8145'
            }
        });
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
                if (json.length > 0) console.log('First item:', JSON.stringify(json[0], null, 2));
            } else {
                console.log('Keys:', Object.keys(json));
                if (json.data) {
                    console.log('json.data type:', Array.isArray(json.data) ? 'Array' : typeof json.data);
                    console.log('json.data length:', json.data.length);
                    if (json.data.length > 0) console.log('First item keys:', Object.keys(json.data[0]));
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
