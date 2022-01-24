import { combineReducers } from "@reduxjs/toolkit";

import { game } from "./slices/gameSlice";
import { players } from "./slices/playersSlice";

export const reducer = combineReducers({
  game: game.reducer,
  players: players.reducer,
});
