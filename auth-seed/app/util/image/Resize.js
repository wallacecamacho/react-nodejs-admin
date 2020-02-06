const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const mkdirp = require('mkdirp');
const concat = require('concat-stream');
const streamifier = require('streamifier');
const upload = require('../upload/S3Upload');
const criptoUtils = require('../../util/cripto/cripto-utils');

// process.env.AVATAR_STORAGE contains uploads/avatars

class Resize {
  constructor(opts) {
    const baseUrl = process.env.AVATAR_BASE_URL;

    const allowedStorageSystems = ['local', 'remoto'];
    const allowedOutputFormats = ['jpg', 'png'];

    this.ret = null;



    // fallback for the options
    const defaultOptions = {
      storage: 'local',
      output: 'png',
      greyscale: false,
      quality: 70,
      square: true,
      threshold: 500,
      responsive: false,
    };

    // extend default options with passed options
    const options = (opts && _.isObject(opts)) ? _.extend(defaultOptions, opts) : {};

    // check the options for correct values and use fallback value where necessary
    this.options = _.forIn(options, (pvalue, pkey, pobject) => {
      let value = pvalue;
      const key = pkey;
      const object = pobject;

      switch (key) {
        case 'square':
        case 'greyscale':
        case 'responsive':
          object[key] = _.isBoolean(value) ? value : defaultOptions[key];
          break;

        case 'storage':
          value = String(value).toLowerCase();
          object[key] = _.includes(allowedStorageSystems, value) ? value : defaultOptions[key];
          break;

        case 'output':
          value = String(value).toLowerCase();
          object[key] = _.includes(allowedOutputFormats, value) ? value : defaultOptions[key];
          break;

        case 'quality':
          value = _.isFinite(value) ? value : Number(value);
          object[key] = (value && value >= 0 && value <= 100) ? value : defaultOptions[key];
          break;

        case 'threshold':
          value = _.isFinite(value) ? value : Number(value);
          object[key] = (value && value >= 0) ? value : defaultOptions[key];
          break;
        default:
          object[key] = _.isBoolean(value) ? value : defaultOptions[key];
          break;
      }
    });

    // set the upload path
    this.uploadPath = this.options.responsive ? path.join(this.options.path, 'responsive') : this.options.path;

    // set the upload base url
    this.uploadBaseUrl = this.options.responsive ? path.join(baseUrl, 'responsive') : baseUrl;

    if (this.options.storage === 'local') {
      // if upload path does not exist, create the upload path structure
      if (!fs.existsSync(this.uploadPath)) {
        mkdirp.sync(this.uploadPath);
      }
    }

    this.handleFile2(this.options);
  }

  createOutputStream(filepath, cb) {
    // create a reference for this to use in local functions
    const that = this;

    // create a writable stream from the filepath

    if (that.options.storage === 'local') {
      const output = fs.createWriteStream(filepath);
      // set callback fn as handler for the error event
    //output.on('error', cb);

      // set handler for the finish event
      output.on('finish', () => {
      this.ret = {
        destination: that.uploadPath,
        baseUrl: that.uploadBaseUrl,
        filename: path.basename(filepath),
        storage: that.options.storage,
      };
    });

    // return the output stream
    return output;
    }
      this.ret = {
        destination: that.uploadPath,
        baseUrl: that.uploadBaseUrl,
        filename: path.basename(filepath),
        storage: that.options.storage,
      };
      return this.ret;

  }

  processImage(image, cb) {
    // create a reference for this to use in local functions
    const that = this;

    let batch = [];

    // the responsive sizes
    const sizes = ['lg', 'md', 'sm'];

    const filename = `${this.options.name}.${this.options.output}`;

    let mime = Jimp.MIME_PNG;

    // create a clone of the Jimp image
    let clone = image.clone();

    // fetch the Jimp image dimensions
    const width = clone.bitmap.width;
    const height = clone.bitmap.height;
    let square = Math.min(width, height);
    const threshold = this.options.threshold;

    // resolve the Jimp output mime type
    switch (this.options.output) {
      case 'jpg':
        mime = Jimp.MIME_JPEG;
        break;
      case 'png':
      default:
        mime = Jimp.MIME_PNG;
        break;
    }

    // auto scale the image dimensions to fit the threshold requirement
    if (threshold && square > threshold) {
      clone = (square == width) ? clone.resize(threshold, Jimp.AUTO) : clone.resize(Jimp.AUTO, threshold);
    }

    // crop the image to a square if enabled
    if (this.options.square) {
      if (threshold) {
        square = Math.min(square, threshold);
      }

      // fetch the new image dimensions and crop
      clone = clone.crop((clone.bitmap.width - square) / 2, (clone.bitmap.height - square) / 2, square, square);
    }

    // convert the image to greyscale if enabled
    if (this.options.greyscale) {
      clone = clone.greyscale();
    }

    // set the image output quality
    clone = clone.quality(this.options.quality);
    let imagep = null;

    if (this.options.responsive) {
      // map through  the responsive sizes and push them to the batch
      batch = _.map(sizes, (size) => {
        let filepath = filename.split('.');

        // create the complete filepath and create a writable stream for it
        filepath = `${filepath[0]}_${size}.${filepath[1]}`;
        filepath = path.join(that.uploadPath, filepath);
        const outputStream = that.createOutputStream(filepath, cb);

        // scale the image based on the size
        switch (size) {
          case 'sm':
            imagep = clone.clone().scale(0.3);
            break;
          case 'md':
            imagep = clone.clone().scale(0.7);
            break;
          case 'lg':
            imagep = clone.clone();
            break;
          default:
            imagep = clone.clone();
            break;
        }

        // return an object of the stream and the Jimp image
        return {
          stream: outputStream,
          imagep,
        };
      });
    } else {
      // push an object of the writable stream and Jimp image to the batch
      batch.push({
        stream: that.createOutputStream(path.join(that.uploadPath, filename), cb),
        imagep: clone,
      });
    }

    // process the batch sequence
    _.each(batch, (current) => {
      // get the buffer of the Jimp image using the output mime type
      current.imagep.getBuffer(mime, (err, buffer) => {
        if (that.options.storage === 'local') {
          // create a read stream from the buffer and pipe it to the output stream
          streamifier.createReadStream(buffer).pipe(current.stream);
        } else if (that.options.storage === 'remoto') {
          // create a read stream from the buffer and pipe it to the output stream
          Jimp.read(buffer, (errorBufffer, imag) => {
            if (errorBufffer) throw errorBufffer;
            // process the Jimp image buffer
            
            upload.putObject({ mime, filename, buffer }).then((value) => {
              console.log(value);
              this.ret = value;
              return this.value;
            });

/*
            imag.getBase64(Jimp.AUTO, (er, dataImage64) => {
              if (er) {
                this.events.emit('error', err);
                throw er;
              }
              
              //  this.events.emit('success', { filename, mime, dataImage64 });
              upload.putObject({ mime, filename, dataImage64 }).then((value) => {
                console.log(value);
                this.ret = value;
                return this.value;
              });
            });

            */
          });
        }
      });
    });
  }

  outputLocal(batch) {
    const that = this;
    let mime = Jimp.MIME_PNG;

    // resolve the Jimp output mime type
    switch (this.options.output) {
      case 'jpg':
        mime = Jimp.MIME_JPEG;
        break;
      case 'png':
      default:
        mime = Jimp.MIME_PNG;
        break;
    }

    // process the batch sequence
    _.each(batch, (current) => {
      // get the buffer of the Jimp image using the output mime type
      current.image.getBuffer(mime, (err, buffer) => {
        if (that.options.storage === 'local') {
          // create a read stream from the buffer and pipe it to the output stream
          streamifier.createReadStream(buffer).pipe(current.stream);
        } else if (that.options.storage === 'remoto') {
          // create a read stream from the buffer and pipe it to the output stream
          streamifier.createReadStream(buffer).pipe(current.stream);
          Jimp.getBase64Async(buffer, (erR, image) => {
            if (erR) throw erR;
            // process the Jimp image buffer
            that.processImage(image);
          });
        }
      });
    });
  }

  handleFile(file, cb) {
    // create a reference for this to use in local functions
    const that = this;

    // create a writable stream using concat-stream that will
    // concatenate all the buffers written to it and pass the
    // complete buffer to a callback fn
    const fileManipulate = concat((imageData) => {
      // read the image buffer with Jimp
      // it returns a promise
      Jimp.read(imageData)
        .then((image) => {
          // process the Jimp image buffer
          that.processImage(image, cb);
        })
        .catch(cb);
    });

    // write the uploaded file buffer to the fileManipulate stream
    file.stream.pipe(fileManipulate);
  }

  handleFile2(options, cb) {
    // create a reference for this to use in local functions
    const that = this;
    const buf = Buffer.from(options.base64Image.slice(options.base64Image.indexOf('base64') + 7), 'base64');
    // create a writable stream using concat-stream that will
    // concatenate all the buffers written to it and pass the
    // complete buffer to a callback fn
    // read the image buffer with Jimp
    // it returns a promise
    Jimp.read(buf, (err, image) => {
      if (err) throw err;
      // process the Jimp image buffer
      that.processImage(image, cb);
    });
  }

  removeFile(req, file, cb) {
    let matches;
    let pathsplit;
    const filename = file.filename;
    const _path = path.join(this.uploadPath, filename);
    let paths = [];

    // delete the file properties
    delete file.filename;
    delete file.destination;
    delete file.baseUrl;
    delete file.storage;

    // create paths for responsive images
    if (this.options.responsive) {
      pathsplit = _path.split('/');
      matches = pathsplit.pop().match(/^(.+?)_.+?\.(.+)$/i);

      if (matches) {
        paths = _.map(['lg', 'md', 'sm'], (size) => pathsplit.join('/') + '/' + (matches[1] + '_' + size + '.' + matches[2]));
      }
    } else {
      paths = [_path];
    }

    // delete the files from the filesystem
    _.each(paths, (_path) => {
      fs.unlink(_path, cb);
    });
  }
}
module.exports = Resize;
