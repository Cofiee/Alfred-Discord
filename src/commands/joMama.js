/**
 * 
 */
module.exports = {
    name: "joMama",
    description: "Asks for random yo mama joke",
    /**
     * RESPONSE SAMPLE
     * {"joke":"Yo mamma so fat when she..."}
     */
    execute(message, args) {
        const https = require('https');
        const options = {
            hostname: 'api.yomomma.info',
            port: 443,
            path: '',
            method: 'GET',
        }
        https.get('https://api.yomomma.info/', (res) => {
            console.log(`res statusCode: ${res.statusCode}`)
            let json = '';
            res.on('data', (chunk) => {
                json += chunk;
            });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        let data = JSON.parse(json);
                        message.channel.send(data.joke);
                    } catch (e) {
                        console.log('Error parsing JSON!');
                    }
                } 
                else {
                    console.log(`res statusCode: ${res.statusCode}`);
                }
            });
        }).on('error', (error) => {
            message.channel.send(error.message);
        });
    }
}