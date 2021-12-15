const initialState = { count: 0 }
 // The reducer function
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
     return { count: state.count  }
  }
}

export {
    reducer,
    initialState
}