import React from 'react';
import { useTasks } from "../hooks/useTask";
import { mode } from "./../constants/modeConstants";
import ClaimStageReward from '../hooks/ClaimStageReward';

function CreaterReward({ address, provider }) {
    const [tasks, loading] = useTasks(address, mode.NFT);

    return (
        <div className="nft-list">
            {loading ? (
                <p>Loading NFTs...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>name</th>
                            <th>description</th>
                            <th>reward</th>
                            <th>created_time</th>
                            <th>end_time</th>
                            <th>link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task => (
                            <tr key={task.id}>
                                <td>{task.name}</td>
                                <td>{task.description}</td>
                                <td>{task.reward}</td>
                                <td>{task.created_time}</td>
                                <td>{task.end_time}</td>
                                <td>
                                    <ClaimStageReward tokeId={task.id} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default CreaterReward;
