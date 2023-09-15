import { useEffect, useState } from "react";
import { useGameRoom } from "@/hooks/useGameRoom";
import { number } from "zod";
import { randomMemes } from "../../game/logic";

interface GameProps {
  username: string;
  roomId: string;
}

export interface RandomMemes {
  id: number;
  name: string;
  url: string;
  width?: number;
  height?: number;
  box_count?: number;
  captions?: number;
}

const Game = ({ username, roomId }: GameProps) => {
  const { gameState, dispatch } = useGameRoom(username, roomId);
  const [selectedMemeId, setSelectedMemeId] = useState(null);
  const generatedRandomMemes = randomMemes();

  // Local state to use for the UI
  const [guess, setGuess] = useState<number>(0);

  useEffect(() => {
    console.log(gameState?.currentSecondsElapsed);
  }, [gameState]);

  // Indicated that the game is loading
  if (gameState === null) {
    return (
      <p>
        <span className="transition-all w-fit inline-block mr-4 animate-bounce">
          🍝
        </span>
        Waiting for server...
      </p>
    );
  }

  const handleGuess = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      meme: { value: string };
    };
    const memeID = parseInt(target.meme.value); // typechecks!
    console.log(typeof memeID);
    const meme = gameState.memes.find((m) => m.id === memeID);

    // Dispatch allows you to send an action!
    // Modify /game/logic.ts to change what actions you can send
    if (meme) {
      dispatch({ type: "guess", guess: meme, username: username });
    }
  };

  return (
    <>
      <h1 className="text-2xl border-b border-yellow-400 text-center relative">
        Guess which title belongs to the meme!
      </h1>

      <div className="grid md:grid-cols-6">
        <div className="h-auto md:col-span-1 md:border-r-2 ">
          <h2 className="text-lg">
            Players in room <span className="font-bold">{roomId}</span>
          </h2>
          <div className="flex flex-row flex-wrap gap-2">
            {gameState.users.map((user) => {
              return (
                <p
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-black text-white"
                  key={user.id}
                >
                  {user.id} |{" "}
                  {
                    gameState.scores.find((score) => score.id === user.id)
                      ?.score
                  }
                </p>
              );
            })}
          </div>
        </div>
        <section className="flex flex-col justify-center items-center md:col-span-5">
          {gameState.status === "Started" ? (
            <>
              <img
                className="mx-auto max-h-2/3 object-contain mt-4"
                src={gameState.target.url}
              />
              <form
                className="flex flex-col gap-4 py-6 items-center"
                onSubmit={handleGuess}
              >
                {gameState.memes.map((meme, index) => {
                  // Define options A, B, C
                  const options = ["A", "B", "C"];

                  // Get the corresponding option based on the index
                  const option = options[index % options.length];

                  return (
                    <div key={meme.id}>
                      <label htmlFor={`meme-${meme.id}`}>
                        <input
                          className="mr-2"
                          name="meme"
                          type="radio"
                          id={`meme-${meme.id}`}
                          value={meme.id}
                        ></input>
                        {`${option}) ${meme.name}`}
                      </label>
                    </div>
                  );
                })}
                <button className="rounded border p-5 bg-yellow-400 group text-black shadow hover:shadow-lg transition-all duration-200 hover:animate-wiggle">
                  Guess!
                </button>
              </form>
              <progress
                value={gameState.currentSecondsElapsed}
                max="10"
                className="w-full h-8 bg-gray-300 transition-all duration-300 rotate-180"
              >
                {gameState.currentSecondsElapsed}
              </progress>
            </>
          ) : gameState.status === "Waiting" ? (
            <button
              className="my-8 rounded border p-5 bg-yellow-400 group text-black shadow hover:shadow-lg transition-all duration-200 hover:animate-wiggle"
              onClick={() => dispatch({ type: "start_game" })}
            >
              Start Game!
            </button>
          ) : (
            <div className="flex flex-col py-16">
              <span className="text-2xl">Game is finished 🏁</span>
              <button
                className="my-8 rounded border p-5 bg-yellow-400 group text-black shadow hover:shadow-lg transition-all duration-200 hover:animate-wiggle"
                onClick={() => dispatch({ type: "start_game" })}
              >
                Play again!
              </button>
            </div>
          )}

          <div className="w-full border-t border-yellow-400 py-2" />

          <div className="w-full bg-yellow-100 flex flex-col p-4 rounded text-sm">
            {gameState.log.map((logEntry, i) => (
              <p key={logEntry.dt} className="animate-appear text-black">
                {logEntry.message}
              </p>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Game;
