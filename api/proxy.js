export default async function handler(req, res) {
    // 允许跨域
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    try {
        let targetUrl = '';
        let fetchOptions = { method: req.method };
        
        if (req.method === 'GET') {
            const { uid, topic } = req.query;
            targetUrl = `https://api.bemfa.com/api/device/v1/data/1/${uid}/${topic}/`;
            fetchOptions.headers = { 'Content-Type': 'text/plain' };
        } 
        else if (req.method === 'POST') {
            const { uid, topic, msg } = req.body;
            targetUrl = `https://api.bemfa.com/api/device/v1/data/1/${uid}/${topic}/`;
            fetchOptions.headers = { 'Content-Type': 'text/plain' };
            fetchOptions.body = msg;
        }
        
        if (!targetUrl) {
            return res.status(400).json({ error: '缺少参数' });
        }
        
        const response = await fetch(targetUrl, fetchOptions);
        const data = await response.text();
        res.status(200).send(data);
        
    } catch (error) {
        console.error('代理错误:', error);
        res.status(500).json({ error: '代理请求失败: ' + error.message });
    }
}
