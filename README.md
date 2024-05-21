### nyx-uploader
>  api.nyx.my.id
>  100% Free but limit 100mb/file and 30 minute remove

```Javascript
const fs = require('fs').promises;
const axios = require('axios');
const FormData = require('form-data');
const fileType = require('file-type');
const cheerio = require('cheerio');

const uploadImage = async (buffer) => {
  const { ext } = await fileType.fromBuffer(buffer);
  const form = new FormData();
  form.append('file', buffer, { filename: 'tmp.' + ext });

  try {
    const response = await axios.post('https://uploader.nyx.my.id/upload', form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    // Parsing HTML response
    const $ = cheerio.load(response.data);
    const imageUrl = $('a').attr('href');
    const originalName = $('p').eq(0).text().split('Original Name: ')[1].split('<br>')[0];
    const mimeType = $('p').eq(0).text().split('MIME Type: ')[1].split('<br>')[0];
    const size = $('p').eq(0).text().split('Size: ')[1].split(' ')[0];

    if (!imageUrl) throw new Error('URL not found in response');

    return { url: imageUrl, originalName, mimeType, size };
  // atau alternatif hanya url aja bisa juga
  // return imageUrl

  } catch (error) {
    throw new Error(error.response ? error.response.data : error.message);
  }
};

const main = async () => {
  const imageFilePath = 'test.jpg'; // Ganti ini dengan jalur file nya

  try {
    const imageBuffer = await fs.readFile(imageFilePath);
    const { url, originalName, mimeType, size } = await uploadImage(imageBuffer);
    const result = { status: 'success', url, originalName, mimeType, size };
    console.log(JSON.stringify(result, null, 2));
/*
{
  "status": "success",
  "url": "https://uploader.nyx.my.id/tmp/gYRsbP-1716291051442.jpg",
  "originalName": "tmp.jpgMIME Type: image/jpegSize: 44.33 KB",
  "mimeType": "image/jpegSize: 44.33 KB",
  "size": "44.33"
}
*/


  } catch (error) {
    const result = { status: 'error', message: error.message };
    console.log(JSON.stringify(result, null, 2));
  }
};

main();
```
