export default async function handler(req, res) {
    // 设置 CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // 处理预检请求
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    try {
        const { uid, topic } = req.method === 'GET' ? req.query : req.body;
        
        if (!uid || !topic) {
            return res.status(400).json({ error: '缺少 uid 或 topic 参数' });
        }
        
        const targetUrl = `https://api.bemfa.com/api/device/v1/data/1/${uid}/${topic}/`;
        
        if (req.method === 'GET') {
            // 获取数据
            const response = await fetch(targetUrl);
            const data = await response.text();
            return res.status(200).send(data);
        } 
        else if (req.method === 'POST') {
            // 发送命令
            const { msg } = req.body;
            const response = await fetch(targetUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: msg || ''
            });
            const data = await response.text();
            return res.status(200).send(data);
        }
        
        return res.status(400).json({ error: '不支持的请求方法' });
        
    } catch (error) {
        console.error('代理错误:', error);
        return res.status(500).json({ error: '代理请求失败: ' + error.message });
    }
}
