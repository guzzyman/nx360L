import * as React from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

function predicate(a) {
  return (b) => a?.id === b?.id;
}

function not(a, b) {
  return a?.filter((aa) => b?.findIndex(predicate(aa)) === -1);
}

function intersection(a, b) {
  return a?.filter((aa) => b?.findIndex(predicate(aa)) !== -1);
}

export default function RolePermissionsEditThreshold({loanProductsData, formik, isEdit }) {
  const left = formik.values.loanProductPermissionsLeft, right = formik.values.loanProductPermissionsRight, checked = formik.values.loanProductPermissionsChecked;

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.findIndex(predicate(value));
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    formik.setFieldValue("loanProductPermissionsChecked", newChecked);
  };

  const handleAllRight = () => {
    formik.setValues({
      ...formik.values,
      loanProductPermissionsLeft: [],
      loanProductPermissionsRight: [...right, ...left],
    });
  };

  const handleCheckedRight = () => {
    formik.setValues({
      ...formik.values,
      loanProductPermissionsLeft: not(left, leftChecked),
      loanProductPermissionsRight: [...right, ...leftChecked],
      loanProductPermissionsChecked: not(checked, leftChecked),
    });
  };

  const handleCheckedLeft = () => {
    formik.setValues({
      ...formik.values,
      loanProductPermissionsLeft: [...left, ...rightChecked],
      loanProductPermissionsRight: not(right, rightChecked),
      loanProductPermissionsChecked: not(checked, rightChecked),
    });
  };

  const handleAllLeft = () => {
    formik.setValues({
      ...formik.values,
      loanProductPermissionsLeft: [...left, ...right],
      loanProductPermissionsRight: [],
    });
  };

  const customList = (items) => (    
    <Paper sx={{ width: 300, height: 230, overflow: "auto" }}>
      <List dense component="div" role="list">
        {items?.map((value) => {
          const labelId = `transfer-list-item-${value}-label`;

          return (
            <ListItem
              key={value}
              role="listitem"
              button
              onClick={handleToggle(value)}
              disabled={!isEdit}
            >
              <ListItemIcon>
                <Checkbox
                  disabled={!isEdit}
                  checked={checked?.findIndex(predicate(value)) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value.name} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

  return (
    <Grid container spacing={5} justifyContent="left" alignItems="center">
      <Grid item>{customList(left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleAllRight}
            disabled={!isEdit || left?.length === 0}
            aria-label="move all right"
          >
            ≫
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={!isEdit || leftChecked?.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={!isEdit || rightChecked?.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleAllLeft}
            disabled={!isEdit || right?.length === 0}
            aria-label="move all left"
          >
            ≪
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList(right)}</Grid>
    </Grid>
  );
}
