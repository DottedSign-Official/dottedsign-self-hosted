import { Document, pdfjs } from "react-pdf";

// NOTE: update worker file with PDFJS_VERSION=$(node ./helpers/react-pdf/worker.version.js) && LIB_FOLDER=./public/libs/pdfjs/$PDFJS_VERSION && mkdir -p $LIB_FOLDER && curl http://cdnjs.cloudflare.com/ajax/libs/pdf.js/$PDFJS_VERSION/pdf.worker.min.js --output $LIB_FOLDER/pdf.worker.min.js
const pdfjsWorker = `/libs/pdfjs/${pdfjs.version}/pdf.worker.min.js`;

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export { Document, pdfjs };
