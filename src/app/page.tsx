"use client";
import { useState, useEffect, useCallback } from "react";

const energyGeneratorText = `《エネルギージェネレーター/Energy Generator》
ライドデッキクレスト

（ライドデッキクレストをライドデッキに１枚だけ入れられる）
【自】【ライドデッキ】：あなたがライドした時、このカードをクレストゾーンに置き、あなたが後攻なら【エネルギーチャージ】(3)。
【永】：あなたはエネルギーを10個まで持てる。
【自】：あなたのライドフェイズ開始時、【エネルギーチャージ】(3)。
【起】【ターン1回】：【コスト】[【エネルギーブラスト】(7)]することで、１枚引く。
`;

export default function Home() {
  const [now1pEnergy, setNow1pEnergy] = useState(0);
  const [now2pEnergy, setNow2pEnergy] = useState(0);
  const [isVertical, setIsVertical] = useState(false);

  // 画面の向きに応じてレイアウトを切り替え
  useEffect(() => {
    const update = () => {
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      setIsVertical(winH > winW);
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  const clickNumHandler = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLDivElement;
      const id = target.id;
      const player = id.split("_")[0]; // "p1" or "p2"
      const number = parseInt(id.split("_")[1], 10);

      target.style.backgroundColor = "#55ff55"; // lightgreen
      for (let i = number + 1; i < 11; i++) {
        const el = document.getElementById(`${player}_${i}`);
        if (el) el.style.backgroundColor = "transparent";
      }
      for (let i = 0; i < number; i++) {
        const el = document.getElementById(`${player}_${i}`);
        if (el) el.style.backgroundColor = "#55ffff";
      }
      player === "p1" ? setNow1pEnergy(number) : setNow2pEnergy(number);
    },
    []
  );

  const clickChangeHandler = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, direction: number) => {
      const target = event.target as HTMLButtonElement;
      const player = target.id.split("_")[0]; // "p1" or "p2"
      const nowEnergy = player === "p1" ? now1pEnergy : now2pEnergy;
      const newValue = Math.max(0, Math.min(10, nowEnergy + direction));
      document.getElementById(`${player}_${newValue}`)?.click();
      player === "p1" ? setNow1pEnergy(newValue) : setNow2pEnergy(newValue);
    },
    [now1pEnergy, now2pEnergy]
  );

  // vminベースのセルサイズ（画面に追従、最大56px）
  const cellSize = "min(12vmin, 96px)";
  const fontSize = "calc(min(7vmin, 96px) * 0.45)";

  const energyGageElements = (player: string, rotate: boolean) => {
    const energyNumberClass =
      "flex items-center justify-center border-r border-black text-center select-none";
    const upDownClass =
      "flex items-center justify-center border border-black text-white select-none";
    const rotateClass = rotate ? "rotate-180" : "";
    const playerBg = player === "p1" ? "bg-blue-200" : "bg-red-200";
    const divClass = `flex items-center gap-[1vmin] w-full h-full justify-center border ${rotateClass} ${playerBg}`;

    return (
      <div key={player} className={divClass}>
        <button
          id={`${player}_minus`}
          className={`${upDownClass} bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-lg`}
          style={{ width: cellSize as any, height: cellSize as any, fontSize }}
          onClick={(e) => clickChangeHandler(e, -1)}
        >
          -
        </button>
        <div className="flex border border-black rounded-lg overflow-hidden">
          {Array.from({ length: 11 }, (_, index) => (
            <div
              key={index}
              id={`${player}_${index}`}
              className={energyNumberClass}
              draggable={false}
              onClick={clickNumHandler}
              style={{
                width: cellSize as any,
                height: cellSize as any,
                fontSize,
              }}
            >
              {index}
            </div>
          ))}
        </div>
        <button
          id={`${player}_plus`}
          className={`${upDownClass} bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-lg`}
          style={{ width: cellSize as any, height: cellSize as any, fontSize }}
          onClick={(e) => clickChangeHandler(e, 1)}
        >
          +
        </button>
      </div>
    );
  };

  return (
    // 画面いっぱいに（100vw/100vh）広げる
    <div className="fixed inset-0 w-screen h-screen">
      <div className="w-full h-full flex flex-col items-center justify-between p-[2vmin] box-border gap-[2vmin]">
        {energyGageElements("p2", true)}

        <div
          className={`flex ${
            isVertical ? "flex-col" : "flex-row"
          } gap-[2vmin] items-center w-full flex-1`}
        >
          <pre className="whitespace-pre-wrap border p-[1.5vmin] text-[2vmin] leading-[3vmin] rotate-180 flex-1 overflow-auto rounded-xl bg-red-200">
            {energyGeneratorText}
          </pre>
          <pre className="whitespace-pre-wrap border p-[1.5vmin] text-[2vmin] leading-[3vmin] flex-1 overflow-auto rounded-xl bg-blue-200">
            {energyGeneratorText}
          </pre>
        </div>

        {energyGageElements("p1", false)}
      </div>
    </div>
  );
}
