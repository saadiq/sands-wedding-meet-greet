"use client";
import { useState, useEffect } from "react";

const FAMILIES = [
  {
    id: "sands",
    name: "Alexander Durrah Sands' Family",
    nameButton: "Alexander Durrah Sands' Family",
    members: [
      "Michelle Sands",
      "Tom Sands",
      "Kendall Sands",
      "Beverly Rodgers",
      "J.R. Brown",
      "Jared Truss",
      "Saadiq Rodgers-King",
      "Christina Beaumier",
      "Asa King & Zola King",
      "Pamela Rodgers",
      "Lori Scott",
      "Cheryl Rodgers",
      "Wayne Flindall",
    ],
    instructions: "Mingle/Meet as many family members as possible noting 3-5 facts of interest on each. You may call for a BINGO once you get to know 6 family members!",
    bingoWord: "BINGO!",
    lang: "en",
    switchFamily: "Switch family",
    notesPlaceholder: "Notes / fun facts...",
    progressText: (met: number, total: number) => `${met} / ${total} met`,
    congrats: "Congratulations!",
    whichFamily: "Which family are you from?",
    header: "🎉 Meet & Greet! 🎉",
  },
  {
    id: "guillen",
    name: "Familia de Marili Guillen Sands",
    nameButton: "Familia de Marili Guillen Sands",
    members: [
      "Fidel Guillén",
      "Lili Rivera",
      "Loli Rivera",
      "Yunue Ovando",
      "Harley Sosa Guillén",
      "María Parra",
      "Naomi Frias",
      "Juan Lixa",
      "More Miron",
      "Luciana Rojo",
      "Valentina Lara",
    ],
    instructions: "Mezclarse/conocer a tantos miembros de la familia como sea posible, anotando 3-5 hechos de interés. ¡Puedes decir LOTERÍA cuando conozcas a 6 miembros de la familia!",
    bingoWord: "LOTERÍA!",
    lang: "es",
    switchFamily: "Cambiar familia",
    notesPlaceholder: "Notas / hechos interesantes...",
    progressText: (met: number, total: number) => `${met} / ${total} conocidos`,
    congrats: "¡Felicidades!",
    whichFamily: "¿De qué familia eres?",
    header: "🎉 ¡Conoce a la Familia! 🎉",
  },
];

function FestiveHeader({ text }: { text: string }) {
  const [bounce, setBounce] = useState(true);
  useEffect(() => {
    setBounce(true);
    const timeout = setTimeout(() => setBounce(false), 900);
    return () => clearTimeout(timeout);
  }, [text]);
  return (
    <h1 className={`text-3xl sm:text-4xl font-bold text-center text-pink-600 drop-shadow mb-2 ${bounce ? "animate-bounce" : ""}`}>
      {text}
    </h1>
  );
}

export default function Home() {
  // LocalStorage keys
  const FAMILY_KEY = 'meetgreet_family';
  const CHECKED_KEY = 'meetgreet_checked';
  const NOTES_KEY = 'meetgreet_notes';
  const CELEBRATION_DISMISSED_KEY = 'meetgreet_celebration_dismissed';

  // State with localStorage hydration
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [checked, setChecked] = useState<{ [name: string]: boolean }>({});
  const [notes, setNotes] = useState<{ [name: string]: string }>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationDismissed, setCelebrationDismissed] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const fam = localStorage.getItem(FAMILY_KEY);
    if (fam) setSelectedFamily(fam);
    const checkedRaw = localStorage.getItem(CHECKED_KEY);
    if (checkedRaw) setChecked(JSON.parse(checkedRaw));
    const notesRaw = localStorage.getItem(NOTES_KEY);
    if (notesRaw) setNotes(JSON.parse(notesRaw));
    const dismissedRaw = localStorage.getItem(CELEBRATION_DISMISSED_KEY);
    if (dismissedRaw) setCelebrationDismissed(JSON.parse(dismissedRaw));
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (selectedFamily) {
      localStorage.setItem(FAMILY_KEY, selectedFamily);
    } else {
      localStorage.removeItem(FAMILY_KEY);
    }
  }, [selectedFamily]);

  useEffect(() => {
    localStorage.setItem(CHECKED_KEY, JSON.stringify(checked));
  }, [checked]);

  useEffect(() => {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(CELEBRATION_DISMISSED_KEY, JSON.stringify(celebrationDismissed));
  }, [celebrationDismissed]);

  // Game logic variables (safe defaults if no family selected)
  const myFamily = FAMILIES.find((f) => f.id === selectedFamily);
  const otherFamily = FAMILIES.find((f) => f.id !== selectedFamily);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const bingoReached = checkedCount >= 6;

  // Always call useEffect, but only run logic if families are selected
  useEffect(() => {
    if (selectedFamily && bingoReached && !showCelebration && !celebrationDismissed) {
      const t = setTimeout(() => setShowCelebration(true), 500);
      return () => clearTimeout(t);
    }
  }, [selectedFamily, bingoReached, showCelebration, celebrationDismissed]);

  if (!selectedFamily) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 p-4 gap-8">
        <FestiveHeader text="Meet & Greet / ¡Conoce a la Familia!" />
        <div className="flex flex-col gap-6 w-full max-w-xs">
          <p className="text-center text-lg font-semibold text-gray-700">
            Which family are you from? / ¿De qué familia eres?
          </p>
          <button
            className="rounded-xl py-4 px-6 bg-pink-500 text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform border-4 border-pink-300 hover:border-yellow-300 focus:outline-none focus:ring-4 focus:ring-pink-200"
            onClick={() => setSelectedFamily("sands")}
          >
            Alexander Durrah Sands&apos; Family
          </button>
          <button
            className="rounded-xl py-4 px-6 bg-pink-500 text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform border-4 border-pink-300 hover:border-yellow-300 focus:outline-none focus:ring-4 focus:ring-pink-200"
            onClick={() => setSelectedFamily("guillen")}
          >
            Familia de Marili Guillen Sands
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 flex flex-col items-center p-2 sm:p-6 pb-32">
      <FestiveHeader text={myFamily!.header} />
      <div className="max-w-lg w-full flex flex-col gap-4 items-center">
        <div className="bg-white/80 rounded-xl p-4 shadow text-center mb-2">
          <div className="font-bold text-lg text-pink-700 mb-1">
            {otherFamily!.name}
          </div>
          <div className="text-sm text-gray-700 whitespace-pre-line">
            {myFamily!.instructions}
          </div>
        </div>
        <div className="w-full flex flex-col gap-3">
          {otherFamily!.members.map((member) => (
            <div
              key={member}
              className={`flex flex-col sm:flex-row items-center gap-2 bg-white rounded-lg shadow p-3 transition-all border-2 ${checked[member] ? "border-green-400 scale-105" : "border-transparent"}`}
            >
              <label className="flex items-center gap-2 w-full cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-pink-500 w-5 h-5"
                  checked={!!checked[member]}
                  onChange={() => {
                    setChecked((prev) => ({ ...prev, [member]: !prev[member] }));
                  }}
                />
                <span className={`font-semibold text-base ${checked[member] ? "text-green-600" : "text-gray-800"}`}>{member}</span>
              </label>
              <textarea
                className="w-full sm:w-1/2 mt-2 sm:mt-0 p-2 rounded border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 text-sm bg-pink-50"
                placeholder={myFamily!.notesPlaceholder}
                value={notes[member] || ""}
                onChange={(e) => setNotes((prev) => ({ ...prev, [member]: e.target.value }))}
                rows={1}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Celebration Modal Overlay */}
      {showCelebration && !celebrationDismissed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center max-w-xs w-full relative animate-bounce">
            <button
              aria-label="Close"
              className="absolute top-2 right-2 text-pink-400 hover:text-pink-600 text-2xl font-bold focus:outline-none"
              onClick={() => { setShowCelebration(false); setCelebrationDismissed(true); }}
            >
              ×
            </button>
            <div className="text-5xl font-extrabold text-yellow-500 drop-shadow mb-2">
              {myFamily!.bingoWord}
            </div>
            <div className="text-3xl text-pink-600 font-bold mb-2">🎊🎉</div>
            <div className="text-lg text-gray-700 mb-2 text-center">{myFamily!.congrats}</div>
            {/* Placeholder for confetti animation */}
            <div className="mt-1 animate-pulse text-2xl">🎈🎈🎈</div>
          </div>
        </div>
      )}
      {/* Pinned footer for progress and switch button */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/90 border-t border-pink-200 shadow-lg flex flex-col items-center z-50 py-3 px-2">
        <div className="relative w-full max-w-xs mb-2 flex items-center justify-center">
          <div className="h-4 bg-pink-200 rounded-full overflow-hidden flex-1">
            <div
              className="h-full bg-pink-500 transition-all"
              style={{ width: `${(checkedCount / otherFamily!.members.length) * 100}%` }}
            />
          </div>
          {/* Status indicator if celebration was dismissed */}
          {celebrationDismissed && (
            <span className="ml-3 text-yellow-600 text-base font-bold" title="Success">
              🏆
            </span>
          )}
          {/* Progress count centered over the bar */}
          <div className="absolute inset-0 flex justify-center items-center text-xs font-bold text-pink-700 pointer-events-none">
            {checkedCount} / {otherFamily!.members.length}
          </div>
        </div>
        <button
          className="mt-1 text-sm text-pink-500 underline hover:text-pink-700"
          onClick={() => {
            setSelectedFamily(null);
            setChecked({});
            setNotes({});
            setShowCelebration(false);
            setCelebrationDismissed(false);
          }}
        >
          {myFamily!.switchFamily}
        </button>
      </footer>
    </div>
  );
}
