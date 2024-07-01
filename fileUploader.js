const fs = require('fs').promises;
const axios = require('axios');
const FormData = require('form-data');
const fileType = require('file-type');
const cheerio = require('cheerio');

const uploadImage = async (buffer, filename) => {
  const { ext } = await fileType.fromBuffer(buffer);
  const form = new FormData();
  form.append('file', buffer, { filename: filename });

  try {
    const response = await axios.post('https://uploader.nyxs.pw/upload', form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    // Parsing HTML response
    const $ = cheerio.load(response.data);
    const imageUrl = $('a').attr('href');
    const textContent = $('p').eq(0).html(); // Get HTML content to avoid splitting issues
    const originalName = textContent.split('Original Name: ')[1].split('<br>')[0];
    const mimeType = textContent.split('MIME Type: ')[1].split('<br>')[0];
    const size = textContent.split('Size: ')[1].split(' ')[0];

    if (!imageUrl) throw new Error('URL not found in response');

    return { url: imageUrl, originalName, mimeType, size };
  } catch (error) {
    throw new Error(error.response ? error.response.data : error.message);
  }
};

const main = async () => {
  const imageFilePath = 'test.jpg'; // Ganti ini dengan jalur file gambar kamu

  try {
    const imageBuffer = await fs.readFile(imageFilePath);
    const { url, originalName, mimeType, size } = await uploadImage(imageBuffer, imageFilePath);
    const result = { status: 'success', url, originalName, mimeType, size };
    console.log(JSON.stringify(result, null, 2));

/*
{
  "status": "success",
  "url": "https://uploader.nyxs.pw/tmp/BrBuDr-1716336151327.jpg",
  "originalName": "test.jpg",
  "mimeType": "image/jpeg",
  "size": "44.33"
}
*/
  } catch (error) {
    const result = { status: 'error', message: error.message };
    console.log(JSON.stringify(result, null, 2));
  }
};

main();
