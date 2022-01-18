import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from "@mui/material/styles";
import { createMakeAndWithStyles } from "tss-react/compat";
import React from 'react';
import {useSelector} from 'react-redux';

const augmentData = require('./augmentData.json');

const {makeStyles} = createMakeAndWithStyles({useTheme});
const useStyles = makeStyles()((theme) => ({
  root: {
    width: '350px',
    float: 'left',
    left: '350px',
    position: 'fixed',
    paddingLeft: '40px',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));
function SelectedAugments() {
  const {classes} = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleClick = () => {
    setOpen(!open);
  };

  const checked = useSelector((state) => state.checklist.checked);

  const {categories, warning} = orderCheckedAugmentsByCategory(checked, augmentData);
  let giantList = [];
  Object.keys(categories).forEach((category) => {
    // Add the category first
    giantList.push(
    <ListItem 
      button
      onClick={handleClick}
      key={`item-${category}`}
    >
      <ListItemText>{category}</ListItemText>
    </ListItem>
    );

    // Build up the augment list for that category
    let augmentList = [];
    categories[category].forEach((augmentName) => {
      augmentList.push(
        <ListItem
          button
          key={`item-${category}-${augmentName}`}
          className={classes.nested}
        >
          <ListItemText>{augmentName}</ListItemText>
        </ListItem>
      );
    });

    // Add the augments that have the category
    giantList.push(
      <Collapse in={open} unmountOnExit key={`collapse-${category}`}>
        <List>
          {augmentList}
        </List>
      </Collapse>);
  });

  let totalsList = [];
  const totals = calculatePropertyTotals(checked, augmentData);
  Object.keys(totals).forEach((property) => {
    totalsList.push(
      <ListItem
        key={`item-total-${property}`}
      >
        {property} {formatPropertyTotal(totals[property])}
      </ListItem>
    );
  });

  return (
    <div className={classes.root}>
      <List>{giantList}</List>
      {warning ? <Alert variant='filled' severity='warning'>Warning: There are two or more augment selections from the same category</Alert>: ''}
      TOTALS
      <List>{totalsList}</List>
    </div>
  );
}

function orderCheckedAugmentsByCategory(checkedAugments, augmentData) {
  const ret = {
    categories: {},
    warning: false,
  };
  checkedAugments.forEach((augmentName) => {
    let augmentCategory = augmentData[augmentName].category;
    if (!ret.categories[augmentCategory]) {
      ret.categories[augmentCategory] = [augmentName];
    } else {
      ret.categories[augmentCategory].push(augmentName);
      ret.warning = true;
    }
  });
  return ret;
}

function calculatePropertyTotals(checkedAugments, augmentData) {
  const ret = {};
  checkedAugments.forEach((augmentName) => {
    let augmentProperties = augmentData[augmentName].properties;
    Object.keys(augmentProperties).forEach((property) => {
      const currentAugmentProps = augmentProperties[property];
      if (!ret[property] && currentAugmentProps.isPercent) {
        ret[property] = {
          isPercent: true,
          val: 1,
        };
      } else if (!ret[property]) {
        ret[property] = 0;
      }

      if (currentAugmentProps.isPercent && currentAugmentProps.operand === '+') {
        ret[property].val *= (1 + currentAugmentProps.value/100);
      } else if (currentAugmentProps.isPercent && currentAugmentProps.operand === '-') {
        ret[property].val /= (1 + currentAugmentProps.value/100);
      } else if (currentAugmentProps.operand === '+') {
        ret[property] += currentAugmentProps.value;
      } else if (currentAugmentProps.operand === '-') {
        ret[property] -= currentAugmentProps.value;
      }
    });
  });
  return ret;
}

function formatPropertyTotal(aggregatedProperty) {
  if (aggregatedProperty.isPercent) {
    const value = ((aggregatedProperty.val - 1) * 100).toFixed(2);
    return value >= 0 ? `+${value}%` : `${value}%`;
  }

  return aggregatedProperty >= 0 ? `+${aggregatedProperty}` : `${aggregatedProperty}`;
}

export default SelectedAugments;