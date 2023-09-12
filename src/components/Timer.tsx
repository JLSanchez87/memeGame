import { useState, useEffect } from "react";
import { RandomMemes } from "@/components/Game";
import memes from "@/pages/data/memes.json";
import { gameUpdater } from "../../game/logic";
import { GameState, ServerAction } from "../../game/logic";
import { initialGame } from "../../game/logic";

// const randomMemes = () => {
//   const shuffledMemes = memes.sort(() => 0.5 - Math.random()); // Shuffle the memes
//   const firstThreeMemes = shuffledMemes.slice(0, 3); // Get the first three memes
//   const randomMemeFromThreeMemes =
//     firstThreeMemes[Math.floor(Math.random() * firstThreeMemes.length)];

//   return { threeMemes: firstThreeMemes, answer: randomMemeFromThreeMemes };
// };

// const addLog = (message: string, logs: GameState["log"]): GameState["log"] => {
//   return [{ dt: new Date().getTime(), message: message }, ...logs].slice(
//     0,
//     MAX_LOG_SIZE
//   );
// };

// const MAX_LOG_SIZE = 4;

// const startNewGameRound = (state: GameState): GameState => {
//   const generatedRandomMemes = randomMemes();
//   return {
//     ...state,
//     memes: generatedRandomMemes.threeMemes,
//     target: generatedRandomMemes.answer.id,
//     log: addLog("New round started!", state.log),
//   };
// };

const Timer = () => {
  // Assumption: gameState is your current game state
  let [gameState, setGameState] = useState(initialGame());

  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      setSeconds(10);
      gameState = startNewGameRound(gameState); //Update game state with new memes after 10 sec
      setGameState(gameState);
    }
  }, [seconds]);

  /* render the game here */
  return <div>Time left: {seconds}</div>;
};

export default Timer;
