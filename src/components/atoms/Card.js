import React, { Component } from 'react';
import PlayerScene from '../../components/PlayerScene';
import testImage from '../../assets/images/dinos/pixelDinoMonochromeSingleFrame.png'; // 画像ファイルのパスを正しく指定
import './Card.scss';

export default class Card extends Component {
    render() {
        const { id, name, entryFee, incentive } = this.props;

        return (
            <div className="card">
                <img src={testImage} alt={name} />
                <div className="card-content">
                    <h2>{name}</h2>
                    <p>{entryFee}</p>
                    <p>{incentive}</p>
                    <PlayerScene tokenId={id} />
                </div>
            </div>
        );
    }
}