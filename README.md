### NYX-Uploader


```
api.nyx.my.id present
100% Free but limit 100mb/file and 30 minute remove
```

### General Usage 

```Javascript
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
    const response = await axios.post('https://uploader.nyx.my.id/upload', form, {
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
  "url": "https://uploader.nyx.my.id/tmp/BrBuDr-1716336151327.jpg",
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

```

### Usage IF Output Just Url

```Javascript
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
    const response = await axios.post('https://uploader.nyx.my.id/upload', form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    // Parsing HTML response
    const $ = cheerio.load(response.data);
    const url = $('a').attr('href');
    
    if (!url) throw new Error('URL not found in response');

    return url
  } catch (error) {
    throw new Error(error.response ? error.response.data : error.message);
  }
};

const main = async () => {
  const imageFilePath = 'test.jpg'; // Ganti ini dengan jalur file gambar Anda

  try {
    const imageBuffer = await fs.readFile(imageFilePath);
    const url = await uploadImage(imageBuffer, imageFilePath);
    console.log(url); // Output only the URL
    //https://uploader.nyx.my.id/tmp/Y4pXIR-1716336421030.jpg
  } catch (error) {
    console.error('Error:', error.message);
  }
};

main();

```

### Usage For Whatsapp Bot

biasanya ditaruh di folder lib/uploadImage.js

```Javascript
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
    //console.log(url)
    //https://uploader.nyx.my.id/tmp/lP58de-1716291485588.jpg
  } catch (error) {
    console.error('Error during image upload:', error);
    throw new Error(error.response ? error.response.data : error.message);
  }
}

module.exports = uploadImage;
```
