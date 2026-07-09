import { Document, pdfjs } from "react-pdf";

// NOTE: update worker file with PDFJS_VERSION=$(node ./helpers/react-pdf/worker.version.js) && LIB_FOLDER=./public/libs/pdfjs/$PDFJS_VERSION && mkdir -p $LIB_FOLDER && cp node_modules/pdfjs-dist/build/pdf.worker.min.mjs $LIB_FOLDER/pdf.worker.min.mjs
const pdfjsWorker = `/libs/pdfjs/${pdfjs.version}/pdf.worker.min.mjs`;

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export { Document, pdfjs };
