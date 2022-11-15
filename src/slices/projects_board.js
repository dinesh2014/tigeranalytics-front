import { createSlice } from '@reduxjs/toolkit';

import { projects } from 'src/api/projects';

import objectArray from 'src/utils/objectArray';

const initialState = {
  isLoaded: false,
  lists: {
    byId: {},
    allIds: []
  },
  tasks: {
    byId: {},
    allIds: []
  },
  members: {
    byId: {},
    allIds: []
  }
};

const slice = createSlice({
  name: 'projects_board',
  initialState,
  reducers: {
    getProject(state, action) {
      const project = action.payload;

      state.lists.byId = objectArray(project.lists);
      state.lists.allIds = Object.keys(state.lists.byId);
      state.tasks.byId = objectArray(project.tasks);
      state.tasks.allIds = Object.keys(state.tasks.byId);
      state.members.byId = objectArray(project.members);
      state.members.allIds = Object.keys(state.members.byId);
      state.isLoaded = true;
    },
  }
});

export const { reducer } = slice;

export const getProject = () => async (dispatch) => {
  const response = await projects.getProject();
  dispatch(slice.actions.getProject(response));
};


