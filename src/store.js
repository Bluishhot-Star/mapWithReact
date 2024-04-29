import { configureStore, createSlice } from '@reduxjs/toolkit'

let point = createSlice({
  name : 'point',
  initialState : {'gu':"중구",'dong':'소공동','longitude':37.5648117,"latitude":126.9750053},
  reducers : {
    setGu(state, action){
      state.gu = action.payload
    },
    setDong(state, action){
      state.dong = action.payload
    },
    setXY(state, action){
      state.latitude=action.payload[0];
      state.longitude=action.payload[1];
    }
  }
})

export default configureStore({
  reducer: {
    point : point.reducer
  }
}) 

export let { setGu, setDong, setXY } = point.actions 