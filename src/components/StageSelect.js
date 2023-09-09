import React, { useState } from 'react';
import PlayerScene from '../components/PlayerScene';
import { useTasks } from "../hooks/useTask";
import { mode } from "./../constants/modeConstants";
import "./React.css";

function StageSelect({ address, provider }) {
  const [tasks, loading] = useTasks(address, mode.ALL);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState(null);

  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sortKey) {
      return a[sortKey] < b[sortKey] ? -1 : 1;
    }
    return filteredTasks;
  });

  return (
    <div className="home-container">
      <div className="search-sort-container">
        {/* 検索バー */}
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        {/* ソートドロップダウン */}
        <select onChange={e => setSortKey(e.target.value)}>
          <option value="">Sort By...</option>
          <option value="name">Name</option>
          <option value="owner">Owner</option>
          <option value="entryFee">Entry Fee</option>
          <option value="incentive">Incentive</option>
        </select>
      </div>

      <div className="nft-list">
        {loading ? (
          <p>Loading NFTs...</p>
        ) : (
          <div className="task-cards">
            {sortedTasks.map(task => (
              <div className="task-card" key={task.id}>
                <h3>{task.name}</h3>
                <p>Owner: {task.owner.slice(0, 6)}...{task.owner.slice(-6)}</p>
                <p>Entry Fee: {task.entryFee}</p>
                <p>Incentive: {task.incentive}</p>
                <PlayerScene tokenId={task.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div >
  );
}

export default StageSelect;
