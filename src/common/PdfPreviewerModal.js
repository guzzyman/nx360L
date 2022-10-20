import React from 'react';
import Modal from './Modal';
// Import the main component
import {Viewer, Worker} from '@react-pdf-viewer/core';

// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';

/**
 * 
 * @param {string} fileUrl 
 * @returns 
 */
export default function PdfPreviewerModal({fileUrl, ...rest}) {
  return (
    <Modal {...rest}>
      <div className="h-full overflow-x-auto" style={{maxHeight: '80vh'}}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.5.207/build/pdf.worker.min.js">
          <Viewer fileUrl={fileUrl} />
        </Worker>
      </div>
    </Modal>
  );
}
