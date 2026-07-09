const { version } = require("pdfjs-dist/package.json");

const pdfjs = {
  version,
  GlobalWorkerOptions: { workerSrc: "" },
  getDocument: jest.fn(() => ({
    promise: Promise.resolve({ numPages: 1 }),
    destroy: jest.fn(),
    destroyed: false,
  })),
};

module.exports = pdfjs;
module.exports.default = pdfjs;
