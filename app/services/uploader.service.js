const multer = require('multer');
const crypto = require('crypto-js');

module.exports = class Uploader {
    constructor(storagePath) {
        this.storagePath = storagePath;
    }

    static getExtension(mimeType) {
        if (mimeType === 'image/jpeg') {
            return '.jpg';
        }
        if (mimeType === 'image/png') {
            return '.png';
        }
        return '';
    }

    get storage() {
        return multer.diskStorage({
            destination: (req, file, callback) => {
                callback(null, this.storagePath);
            },
            filename: (req, file, callback) => {
                const fileName = file.originalname;
                const uploadDate = new Date().toISOString();

                callback(
                    null,
                    crypto.MD5(fileName + uploadDate).toString()
                        + Uploader.getExtension(file.mimetype),
                );
            },
        });
    }

    static fileFilter(req, file, callback) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            callback(null, true);
        }
        callback(null, false);
    }

    get upload() {
        return multer({
            storage: this.storage,
            limits: { fileSize: 1024 * 1024 * 5 },
            fileFilter: Uploader.fileFilter,
        });
    }
};
