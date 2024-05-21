const cheerio = require('cheerio');
const axios = require('axios');
const FormData = require('form-data');
const { fromBuffer } = require('file-type');

async function uploadImage(buffer) {
  try {
    const { ext } = await fromBuffer(buffer);
    if (!ext) {
      throw new Error('Could not determine file type from buffer');
    }

    let form = new FormData();
    form.append('file', buffer, 'tmp.' + ext);

    const response = await axios.post('https://uploader.nyx.my.id/upload', form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    const $ = cheerio.load(response.data);
    const url = $('a').attr('href');

    if (!url) throw new Error('URL not found in response');

    return url;
  } catch (error) {
    console.error('Error during image upload:', error);
    throw new Error(error.response ? error.response.data : error.message);
  }
}

module.exports = uploadImage;
