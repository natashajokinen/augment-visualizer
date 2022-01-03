import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
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
    float: 'right',
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
  return (
    <List className={classes.root}>{giantList}</List>
  );
}

function orderCheckedAugmentsByCategory(checkedAugments, augmentData) {
  let ret = {
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

export default SelectedAugments;