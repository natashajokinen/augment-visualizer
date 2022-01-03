import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from "@mui/material/styles";
import { createMakeAndWithStyles } from "tss-react/compat";
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {updateChecklist} from './app/store';

const augmentData = require('./augmentData.json');

const {makeStyles} = createMakeAndWithStyles({useTheme});
const useStyles = makeStyles()((theme) => ({
  root: {
    width: '350px',
    float: 'left',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  propertyNested: {
    paddingLeft: theme.spacing(13),
  }
}));
function AugmentChecklist() {
  const dispatch = useDispatch();
  const {classes} = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleClick = () => {
    setOpen(!open);
  };

  const checked = useSelector((state) => state.checklist.checked);
  const handleCheckboxToggle = (augmentName) => {
    dispatch(updateChecklist(augmentName));
  }

  const propertyAugments = orderAugmentsByProperty(augmentData);
  let giantList = [];
  Object.keys(propertyAugments).forEach((property) => {
    // Add the property first
    giantList.push(
    <ListItem 
      button
      onClick={handleClick}
      key={`item-${property}`}
    >
      <ListItemText>{property}</ListItemText>
      {open ? <ExpandLess/> : <ExpandMore/>}
    </ListItem>,
    );

    // Build up the augment list for that property
    let augmentList = [];
    propertyAugments[property].forEach((augmentName) => {
      augmentList.push(
        <ListItem
          button
          key={`item-${property}-${augmentName}`}
          className={classes.nested}
          onClick={()=>handleCheckboxToggle(augmentName)}
        >
          <ListItemIcon>
            <Checkbox
              checked={checked.indexOf(augmentName) !== -1}
              tabIndex={-1}
              disableRipple
              inputProps={{'aria-labelledby': `checkbox-list-label-${augmentName}`}}
            />
          </ListItemIcon>
          <ListItemText>{augmentName}</ListItemText>
        </ListItem>
      );

      let augmentPropertiesList = [];
      const propertiesToShow = augmentData[augmentName].properties;
      Object.keys(propertiesToShow).forEach((augmentProperty) => {
        const formattedPropertyValue = `${propertiesToShow[augmentProperty].operand}${propertiesToShow[augmentProperty].value}${propertiesToShow[augmentProperty].isPercent ? '%' : ''}`
        augmentPropertiesList.push(
          <ListItem
            key={`item-${property}-${augmentName}-${augmentProperty}`}
            className={classes.propertyNested}
          >
            <ListItemText>{augmentProperty} {formattedPropertyValue}</ListItemText>
          </ListItem>
        );
      });
      augmentList.push(
        <List>
          {augmentPropertiesList}
        </List>
      );
    });

    // Add the augments that have the property
    giantList.push(
      <Collapse in={open} unmountOnExit key={`collapse-${property}`}>
        <List>
          {augmentList}
        </List>
      </Collapse>);
  });
  return (
    <List className={classes.root}>{giantList}</List>
  );
}

function orderAugmentsByProperty(augmentData) {
  const ret = {};
  Object.keys(augmentData).forEach((augmentName) => {
    let augmentProperties = augmentData[augmentName].properties;
    Object.keys(augmentProperties).forEach((property) => {
      if (!ret[property]) {
        ret[property] = [augmentName];
      } else {
        ret[property].push(augmentName);
      }
    });
  });
  return ret;
}

export default AugmentChecklist;