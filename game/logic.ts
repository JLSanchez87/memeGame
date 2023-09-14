import { RandomMemes } from "@/components/Game";
import memes from "@/pages/data/memes.json";
// const [threeMemes, setThreeMemes] = useState([]);

export const randomMemes = () => {
  const shuffledMemes = memes.sort(() => 0.5 - Math.random()); // Shuffle the memes
  const firstThreeMemes = shuffledMemes.slice(0, 3); // Get the first three memes
  const randomMemeFromThreeMemes =
    firstThreeMemes[Math.floor(Math.random() * firstThreeMemes.length)];

  return { threeMemes: firstThreeMemes, answer: randomMemeFromThreeMemes };
};

// util for easy adding logs

export const addLog = (
  message: string,
  logs: GameState["log"]
): GameState["log"] => {
  return [{ dt: new Date().getTime(), message: message }, ...logs].slice(
    0,
    MAX_LOG_SIZE
  );
};

// If there is anything you want to track for a specific user, change this interface
export interface User {
  id: string;
}

// Do not change this! Every game has a list of users and log of actions
interface BaseGameState {
  users: User[];
  log: {
    dt: number;
    message: string;
  }[];
}

// Do not change!
export type Action = DefaultAction | GameAction;

// Do not change!
export type ServerAction = WithUser<DefaultAction> | WithUser<GameAction>;

// The maximum log size, change as needed
const MAX_LOG_SIZE = 4;

type WithUser<T> = T & { user: User };

export type DefaultAction = { type: "UserEntered" } | { type: "UserExit" };

const QUESTION_DURATION_SECONDS = 10;

// This interface holds all the information about your game
export interface GameState extends BaseGameState {
  status: "Started" | "Waiting";
  memes: RandomMemes[];
  scores: { id: string; score: number }[];
  currentAnswer: { userId: string; guess_id: number }[];
  currentSecondsElapsed: number;
  questionDurationSeconds: number;
  target: RandomMemes;
}

// This is how a fresh new game starts out, it's a function so you can make it dynamic!
// In the case of the guesser game we start out with a random target
export const initialGame = (): GameState => {
  const generatedRandomMemes = randomMemes();
  return {
    status: "Waiting",
    memes: generatedRandomMemes.threeMemes,
    target: generatedRandomMemes.answer,
    users: [],
    scores: [],
    currentAnswer: [],
    currentSecondsElapsed: 0,
    questionDurationSeconds: QUESTION_DURATION_SECONDS,
    log: addLog("🐄 Game Created!", []),
  };
};

// Here are all the actions we can dispatch for a user
type GameAction =
  | { type: "guess"; guess: RandomMemes; username: string }
  | { type: "start_game" }
  | { type: "tick" };

export const gameUpdater = (
  action: ServerAction,
  state: GameState
): GameState => {
  switch (action.type) {
    case "UserEntered":
      const newUser = {
        id: action.user.id,
      };
      return {
        ...state,
        users: [...state.users, newUser],
        scores: [...state.scores, { id: newUser.id, score: 0 }],
        log: addLog(`user ${action.user.id} joined 🎉`, state.log),
      };
    case "UserExit":
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.user.id),
        scores: state.scores.filter((score) => score.id !== action.user.id),
        log: addLog(`user ${action.user.id} left 😢`, state.log),
      };
    case "start_game":
      const generatedRandomMemes = randomMemes();

      return {
        ...state,
        memes: generatedRandomMemes.threeMemes,
        target: generatedRandomMemes.answer,
        currentAnswer: [],
        currentSecondsElapsed: 0,
        status: "Started",
      };

    case "guess":
      return {
        ...state,
        currentAnswer: [
          ...state.currentAnswer.filter(
            (answer) => answer.userId !== action.user.id
          ),
          { userId: action.user.id, guess_id: action.guess.id },
        ],
      };
    case "tick":
      const newGeneratedRandomMemes = randomMemes();
      const questionDone =
        state.currentSecondsElapsed >= state.questionDurationSeconds;

      if (questionDone) {
        // check the answers and update scores
        return {
          ...state,
          currentSecondsElapsed: 0,
          memes: newGeneratedRandomMemes.threeMemes,
          target: newGeneratedRandomMemes.answer,
        };
      }

      return {
        ...state,
        currentSecondsElapsed: state.currentSecondsElapsed + 1,
      };
    // if (action.guess.id === state.target.id) {
    //   const newUsers = state.users.map((user) => {
    //     // ALS user.id === action.username
    //     // DAN increase score en return user
    //     // ELSE doe niks en return user
    //     if (user.id === action.username) {
    //       const newScore = user.score + 1;
    //       console.log(newScore);
    //       return { ...user, score: newScore };
    //     } else {
    //       return user;
    //     }
    //   });

    //   console.log(newUsers);

    //   return {
    //     ...state,
    //     // memes: generatedRandomMemes.threeMemes,
    //     // target: generatedRandomMemes.answer.id,
    //     log: addLog(
    //       `user ${action.user.id} answered ${action.guess.name} and won 1 point! 👑`,
    //       state.log
    //     ),
    //   };
    // } else {
    //   return {
    //     ...state,
    //     log: addLog(
    //       `user ${action.user.id} answered ${action.guess.name}`,
    //       state.log
    //     ),
    //   };
    // }
  }
};
