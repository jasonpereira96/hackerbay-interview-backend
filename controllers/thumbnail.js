const axios = require('axios');
const sharp = require('sharp');

const thumbnail = async (request, response, next) => {
    const { url } = request.body;

    try {
        const imageResponse = await axios({
            url,
            method: 'get',
            responseType: 'arraybuffer',
            timeout: 4000,
        });
        const buffer = Buffer.from(imageResponse.data, 'binary');

        const resizedBuffer = await sharp(buffer)
            .resize({
                width: 50,
                height: 50,
            })
            .jpeg()
            .toBuffer();

        response.writeHead(200, {
            'Content-Type': 'image/jpg',
            'Content-Length': resizedBuffer.length,
        });
        response.end(resizedBuffer);
    } catch (e) {
        response.json({
            error: 'Something went wrong. Could not resize image',
        });
    }
};

module.exports = {
    thumbnail,
};
