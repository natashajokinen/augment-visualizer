import { configureStore, createSlice } from '@reduxjs/toolkit'

const checklistSlice = createSlice({
  name: 'checklist',
  initialState: {
    checked: [],
  },
  reducers: {
    updateChecklist: (state, action) => {
      const checked = state.checked;
      const currentIndex = checked.indexOf(action.payload);
      const newChecked = [...checked];
      
      if (currentIndex === -1) {
        newChecked.push(action.payload);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      state.checked = newChecked;
    }
  }
});

export default configureStore({
  reducer: {
    checklist: checklistSlice.reducer,
  }
});

export const {updateChecklist} = checklistSlice.actions;
