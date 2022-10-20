import React, { useState } from "react";
// Import the main component
import { Viewer, Worker } from "@react-pdf-viewer/core";

// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import {
  Card,
  CardActionArea,
  CardMedia,
  Chip,
  Icon,
  IconButton,
} from "@mui/material";
import { DOCUMENT_TYPE } from "./Constants";
import PdfPreviewerModal from "./PdfPreviewerModal";
import { Lightbox } from "react-modal-image";

/**
 *
 * @param {title} string
 * @param {url} string
 *  @param {type} "pdf" | "image"
 * @returns
 */
export default function DocumentPreviewerCard({ title, url, type }) {
  console.log("type", type);
  const [previewData, setPreviewData] = useState(false);
  return (
    <div className="m-3 relative">
      <div className="absolute top-1 z-10 right-1 ">
        <div className="bg-gray-50 rounded-md">
          <a href={url} download>
            <IconButton>
              <Icon>download</Icon>
            </IconButton>
          </a>
          <IconButton onClick={() => setPreviewData(true)}>
            <Icon>visibility</Icon>
          </IconButton>
          <Chip size="small" label={title} className="p-2" />
        </div>
      </div>
      <Card>
        <CardActionArea>
          {type === DOCUMENT_TYPE.PDF && (
            <div
              className="h-full overflow-x-auto"
              style={{ maxHeight: "300px" }}
            >
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.5.207/build/pdf.worker.min.js">
                <Viewer fileUrl={url} />
              </Worker>

              {previewData && (
                <PdfPreviewerModal
                  open={previewData}
                  title={title}
                  fileUrl={url}
                  size="md"
                  onClose={() => setPreviewData(false)}
                />
              )}
            </div>
          )}

          {type === DOCUMENT_TYPE.IMAGE && (
            <>
              <CardMedia component="img" height="140" image={url} alt={title} />
              {previewData && type === DOCUMENT_TYPE.IMAGE && (
                <Lightbox
                  alt={title}
                  medium={url}
                  large={url}
                  onClose={() => setPreviewData(false)}
                />
              )}
            </>
          )}
        </CardActionArea>
      </Card>
    </div>
  );
}

DocumentPreviewerCard.defaultProps = {
  type: "image",
};
