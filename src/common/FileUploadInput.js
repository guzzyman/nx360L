import { TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import { formatBytes } from "./Utils";

const maxAllowedSize = 3 * 1024 * 1024;

/**
 *
 * @param {FileUploadInput} props
 * @returns
 */
export default function FileUploadInput(props) {
  const { fileRef, label, onChange, maxSize = maxAllowedSize, ...rest } = props;
  const { enqueueSnackbar } = useSnackbar();

  const restrictImageSize = (event) => {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].size > maxSize) {
        enqueueSnackbar(
          `File is too big!, max size is ${formatBytes(maxSize)}`,
          {
            variant: "error",
          }
        );
        event.target.value = "";
      }
    }
  };
  return (
    <div>
      <TextField
        {...rest}
        onChange={(event) => {
          onChange && onChange(event);
          restrictImageSize(event);
        }}
        label={`${label} (max size: ${formatBytes(maxSize)})`}
        type="file"
        inputRef={fileRef}
        focused
      />
    </div>
  );
}
