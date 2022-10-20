import * as React from 'react';
import {Box} from '@mui/system';
import {Icon, IconButton, Modal as MUIModal} from '@mui/material';

export default function Modal (props) {
  const {title, open, cancel, onClose, children, size, ...rest} = props;

  return (
    <div>
      <MUIModal
        open={open}
        {...rest}
        onClose={onClose}
        aria-labelledby={title}
        aria-describedby={title}
      >
        <Box
          className="p-10 absolute rounded-md w-full bg-white"
          style={{
            top: '50%',
            left: '50%',
            maxHeight: '95vh',
            overflowY: 'scroll',
            transform: 'translate(-50%, -50%)',
            maxWidth: `${size === 'md' ? '700px' : size === 'lg' ? '1000px' : '400px'}`,
          }}
        >
          <div>
            <h2 className="text-center capitalize font-semibold text-lg mb-2">
              {title}
            </h2>

            {cancel &&
              <IconButton className="absolute top-0 right-0" onClick={onClose}>
                <Icon>cancel</Icon>
              </IconButton>}
          </div>

          {children}
        </Box>
      </MUIModal>
    </div>
  );
}
