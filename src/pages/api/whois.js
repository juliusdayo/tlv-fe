

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { domain, type = 'domain' } = req.query;

        if (!domain || domain.trim().length === 0) {
            return res.status(400).json({
                error: 'Domain parameter is required'
            });
        }

        const cleanDomain = domain.trim().toLowerCase()
            .replace(/^https?:\/\//, '')
            .replace(/^www\./, '')
            .replace(/\/$/, '');



        const apiEndpoint = process.env.API_ENDPOINT || 'http://localhost:3001';

        if (!apiEndpoint) {
            return res.status(500).json({
                error: 'API endpoint not configured'
            });
        }

        const apiUrl = `${apiEndpoint}/api/domain/${encodeURIComponent(cleanDomain)}?type=${encodeURIComponent(type)}`;

        console.log(`Fetching domain data from: ${apiUrl}`);

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log(`Response status: ${response.status}`);
        console.log(`Response ok: ${response.ok}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.log(`Error response: ${errorText}`);
            let errorData = {};
            try {
                errorData = JSON.parse(errorText);
            } catch (e) {
                errorData = { error: errorText || `Backend API error: ${response.status} ${response.statusText}` };
            }
            return res.status(response.status).json(errorData);
        }

        const responseText = await response.text();
        console.log(`Response text: ${responseText}`);

        let data = {};
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse JSON response:', e);
            return res.status(500).json({
                error: 'Invalid JSON response from backend'
            });
        }

        res.status(200).json(data);

    } catch (error) {
        console.error('API error:', error);

        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            return res.status(503).json({
                error: 'Unable to connect to backend service'
            });
        }

        res.status(500).json({
            error: 'Internal server error'
        });
    }
}