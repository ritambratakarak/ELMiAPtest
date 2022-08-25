import {VIDEO} from '../type'

export default function(state = [], action) {
    switch (action.type) {
      case VIDEO:
        return action.payload;
      default :
    }
    return state
  }
  