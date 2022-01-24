import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GameState {
  status: "waiting" | "playing" | "paused" | "ended";
  timeRemaining: number;
}

const initialState: GameState = {
  status: "waiting",
  timeRemaining: 15 * 60,
};

export const game = createSlice({
  name: "game",
  initialState,
  reducers: {
    advanceTime: (state, {payload}) => {
      state.timeRemaining += 1;
    },
    start: (state) => {
      state.status = "playing";
    },
    pause: (state) => {
      state.status = "paused";
    },
    end: (state) => {
      state.status = "ended";
    },
  },
});
