import React from 'react';
import Card from '../components/atoms/Card'
import PlayerScene from '../components/PlayerScene';
import { useTasks } from "../hooks/useTask";
import { mode } from "./../constants/modeConstants";

function StageSelect({ address, provider }) {
  // const [tasks, loading] = useTasks(address, mode.ALL);
  const tasks = [
    {
      id: 1, // idを追加
      name: 'テストステージ1',
      entryFee: 'テストステージ1の説明',
      incentive: '1.0',
    },
    {
      id: 2, // idを追加
      name: 'テストステージ2',
      entryFee: 'テストステージ2の説明',
      incentive: '1.0',
    },
    {
      id: 3, // idを追加
      name: 'テストステージ3',
      entryFee: 'テストステージ3の説明',
      incentive: '1.0',
    },
  ];
  const loading = false;

  return (
    <div className="nft-list">
      {loading ? (
        <p>Loading NFTs...</p>
      ) : (
        <div>
          {
            tasks.map(task => (
              <Card
                key={task.id} // idをキーとして使用
                id={task.id} // idをCardコンポーネントに渡す
                name={task.name}
                entryFee={task.entryFee}
                incentive={task.incentive}
              />
            ))
          }
        </div>
      )}
    </div>
  );
}

export default StageSelect;