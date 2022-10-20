import {Button} from '@mui/material';
import React from 'react';

/**
 *
 * @param {} fileRef file input ref
 * @returns <Button/>
 */
export default function FileOpenButton({fileRef}) {
  const openFile = () => {
    // Note that the ref is set async,
    // so it might be null at some point
    if (fileRef.current) {
      fileRef.current.click ();
    }
  };
  return (
    <Button onClick={openFile} variant="outlined" size="large">
      Choose File
    </Button>
  );
}
