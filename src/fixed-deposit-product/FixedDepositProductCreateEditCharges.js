import { useState } from "react";
import {
  Paper,
  TextField,
  Typography,
  MenuItem,
  IconButton,
  Button,
  Icon,
} from "@mui/material";
import CurrencyTextField from "common/CurrencyTextField";

function FixedDepositProductCreateEditCharges({
  formik,
  fixedDepositProductTemplate,
}) {
  const [selectedCharge, setSelectedCharge] = useState(null);

  function renderCharges(
    title,
    selectValue,
    onSelectChange,
    chargesFormikKey,
    options
  ) {
    const selectedChargeIndex = formik.values[chargesFormikKey]?.findIndex(
      (chargeFragment) => chargeFragment.id === selectValue
    );

    const normalizedOptions = options?.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {});

    return (
      <Paper className="p-4 mb-4">
        <Typography variant="h6" className="font-bold mb-4">
          {title}
        </Typography>
        <div
          className="flex items-center gap-4 mt-4 mb-2"
          style={{ maxWidth: 400 }}
        >
          <TextField
            fullWidth
            select
            margin="normal"
            label="Select Charges"
            value={selectValue}
            onChange={(e) => onSelectChange(e.target.value)}
          >
            {options?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          {selectedChargeIndex > -1 ? (
            <Button
              disabled={selectValue === undefined || selectValue === null}
              startIcon={<Icon>remove_circle</Icon>}
              color="error"
              onClick={() => {
                const newCharges = [...formik.values[chargesFormikKey]];
                newCharges.splice(selectedChargeIndex, 1);
                formik.setFieldValue(chargesFormikKey, newCharges);
              }}
            >
              Remove
            </Button>
          ) : (
            <Button
              disabled={selectValue === undefined || selectValue === null}
              startIcon={<Icon>add</Icon>}
              onClick={() =>
                formik.setFieldValue(chargesFormikKey, [
                  ...formik.values[chargesFormikKey],
                  { id: selectValue },
                ])
              }
            >
              Add
            </Button>
          )}
        </div>
        {formik.values[chargesFormikKey]?.map((chargeFragment, index) => {
          // const valueKey = `${chargesFormikKey}[${index}]`;
          const charge = normalizedOptions?.[chargeFragment.id];

          if (!charge) {
            return null;
          }

          return (
            <div
              key={index}
              className="relative grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 p-2 mb-2"
            >
              {formik.values[chargesFormikKey]?.length > 1 && (
                <div className="absolute -right-4 -top-4">
                  <IconButton
                    onClick={() => {
                      const newCharges = [...formik.values[chargesFormikKey]];
                      newCharges.splice(index, 1);
                      formik.setFieldValue(chargesFormikKey, newCharges);
                    }}
                  >
                    <Icon>cancel</Icon>
                  </IconButton>
                </div>
              )}
              <TextField
                fullWidth
                label="Name"
                inputProps={{ readOnly: true }}
                value={charge?.name}
              />
              <TextField
                fullWidth
                label="Type"
                inputProps={{ readOnly: true }}
                value={charge?.chargeCalculationType?.value}
              />
              <CurrencyTextField
                code={charge?.currency?.code}
                fullWidth
                label="Amount"
                inputProps={{ readOnly: true }}
                value={charge?.amount}
              />
              <TextField
                fullWidth
                label="Collected On"
                inputProps={{ readOnly: true }}
                value={charge?.chargeTimeType?.value}
              />
              <TextField
                fullWidth
                label="Mode"
                inputProps={{ readOnly: true }}
                value={charge?.chargePaymentMode?.value}
              />
            </div>
          );
        })}
      </Paper>
    );
  }

  return (
    <>
      {renderCharges(
        "Charges",
        selectedCharge,
        setSelectedCharge,
        "charges",
        fixedDepositProductTemplate?.chargeOptions
      )}
    </>
  );
}

export default FixedDepositProductCreateEditCharges;
