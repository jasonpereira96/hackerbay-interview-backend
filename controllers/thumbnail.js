/**
 * Controllers module.
 * @module controllers
 */
const axios = require('axios');
const sharp = require('sharp');
/**
 * Downloads a file from the given url and resizes it.
 * @param {Request} request 
 * @param {Response} response 
 * @param {function} next 
 */

const thumbnail = async (request, response, next) => {
    let { url } = request.body;
    //validate non empty either here or in middleware

    try {
        const imageResponse = await axios({ url, responseType: 'arraybuffer' });
        const buffer = Buffer.from(imageResponse.data, 'binary');

        let resizedBuffer = await sharp(buffer)
            .resize({
                width: 50,
                height: 50
            })
            .jpeg()
            .toBuffer();

        response.writeHead(200, {
            'Content-Type': 'image/jpg',
            'Content-Length': resizedBuffer.length
        });
        response.end(resizedBuffer);

    } catch (e) {
        response.json({
            error: 'Something went wrong. Could not resize image'
        });
    }
};

module.exports = {
    thumbnail
};