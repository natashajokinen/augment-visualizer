
import Checkbox from '@material-ui/core/Checkbox';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {updateChecklist} from './app/store';

const augmentData = require('./augmentData.json');

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));
function AugmentChecklist() {
  const dispatch = useDispatch();
  const classes = useStyles();
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
    </ListItem>
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
          <ListItemIcon onClick={()=>handleCheckboxToggle(augmentName)}>
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
    <List className={classes.root} component="nav">{giantList}</List>
  );
}

function orderAugmentsByProperty(augmentData) {
  let ret = {};
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