const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// console.log("Upload type:", typeof imagekit.upload);

async function fileUpload(file, filename) {

    const result = await imagekit.upload({
        file: file.toString("base64"),
        fileName: filename + ".mp4",
    });

    return result;
}

async function imageUpload(file, filename) {
    const result = await imagekit.upload({
        file: file.toString("base64"),
        fileName: filename + ".jpg",
    });
    return result;
}

module.exports = {
    fileUpload,
    imageUpload
};
