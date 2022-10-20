import { useMemo, useState } from "react";
import { Icon, IconButton, Paper, Typography } from "@mui/material";
import DynamicTable from "common/DynamicTable";
import TableViewToggleButton from "common/TableViewToggleButton";
import useTable from "hooks/useTable";
import { ReactComponent as PdfSvg } from "assets/svgs/pdf.svg";
import { ReactComponent as JpegSvg } from "assets/svgs/jpeg.svg";
import { byteToMegaByte } from "common/Utils";
import dfnFormat from "date-fns/format";
import { DateConfig } from "common/Constants";
import PdfPreviewerModal from "common/PdfPreviewerModal";
import { Lightbox } from "react-modal-image";

function HotLeadDetailsFile(props) {
  const { recoveryQueryResult } = props;
  const [view, setView] = useState("list");
  const images = recoveryQueryResult?.data?.data?.images;
  const imagesWithAttachment = useMemo(
    () => images?.filter((image) => !!image?.attachment),
    [images]
  );

  const [previewOpen, setPreviewOpen] = useState({});
  const closePreview = (id) => {
    setPreviewOpen({ [id]: false });
  };

  const onDownload = (attachment, fileName) => {
    const link = document.createElement("a");
    let fileType = "";
    attachment.includes("png") ? (
      fileType = `./${fileName === null ? "" : fileName}.png`
    ) : (
      fileType = `./${fileName === null ? "" : fileName}.jpg`
    )
    link.download = fileType;
    link.href = `${attachment}`;
    link.click();
  };

  const columns = useMemo(
    () => [
      { Header: "File Name", accessor: "fileName" },
      {
        Header: "File Size",
        accessor: (row, i) => `${byteToMegaByte(row?.fileSize)} MB`,
      },
      {
        Header: "Date",
        accessor: (row) =>
          dfnFormat(new Date(row?.dateAdded), DateConfig.FORMAT),
      },
      {
        Header: "Actions",
        accessor: "action",
        Cell: (row, i) => (
          <div className="flex items-center">
            {previewOpen[row?.row.index] &&
              (row?.row?.original?.attachment.includes("/pdf") ? (
                <PdfPreviewerModal
                  open={previewOpen[row?.row.index]}
                  title={row?.data[row?.row.index]?.fileName}
                  fileUrl={row?.data[row?.row.index]?.attachment}
                  size="md"
                  onClose={() => closePreview(row?.row.index)}
                />
              ) : (
                <Lightbox
                  alt={row?.data[row?.row.index]?.fileName}
                  medium={row?.data[row?.row.index]?.attachment}
                  large={row?.data[row?.row.index]?.attachment}
                  onClose={() => closePreview(row?.row.index)}
                />
              ))}
            <IconButton size="small"
              onClick={() => {
                const attachment = row?.row?.original?.attachment;
                const fileName = row?.row?.original?.fileName;
                onDownload(attachment, fileName);
              }}
            >
              <Icon>download</Icon>
            </IconButton>
            <IconButton
              size="small"
              onClick={() => {
                setPreviewOpen({ [row?.row.index]: true });
              }}
              color="primary"
            >
              <Icon>visibility</Icon>
            </IconButton>
          </div>
        ),
      },
    ],
    [previewOpen]
  );

  const tableInstance = useTable({ data: imagesWithAttachment, columns });

  return (
    <>
      <div className="flex items-center justify-end mb-3">
        <TableViewToggleButton
          size="small"
          value={view}
          onChange={(_, value) => setView(value)}
        />
      </div>
      <DynamicTable
        instance={tableInstance}
        view={view}
        classes={{
          content:
            "grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10",
        }}
        renderItem={(row) => {
          return (
            <Paper
              variant="outlined"
              className="py-2 text-center"
              key={row.index}
            >
              <div className="flex justify-center">
                {getFileIcon(row.original?.attachment)}
              </div>
              <Typography variant="body2">{row.original?.fileName}</Typography>
              <Typography variant="caption">
                {byteToMegaByte(row?.original?.fileSize)} MB
              </Typography>
            </Paper>
          );
        }}
      />
    </>
  );
}

export default HotLeadDetailsFile;

const getFileIcon = (base64 = "") => {
  if (base64.includes("image/")) {
    return <JpegSvg />;
  }
  if (base64.includes("/pdf")) {
    return <PdfSvg />;
  }
  return <JpegSvg />;
};
