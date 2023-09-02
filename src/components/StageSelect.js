import React from 'react';
import PlayerScene from '../components/PlayerScene';
import { useTasks } from "../hooks/useTask";
import { mode } from "./../constants/modeConstants";

function StageSelect({ address, provider }) {
  const [tasks, loading] = useTasks(address, mode.ALL);

  return (
    <div className="nft-list">
      {loading ? (
        <p>Loading NFTs...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>name</th>
              <th>owner</th>
              <th>entryFee</th>
              <th>incentive</th>
              <th>link</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>{task.name}</td>
                <td>{task.owner}</td>
                <td>{task.entryFee}</td>
                <td>{task.incentive}</td>
                <td>
                  <PlayerScene tokenId={task.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StageSelect;
