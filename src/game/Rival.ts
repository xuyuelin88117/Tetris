import { gameoverAll } from ".";
import { createBoxByType } from "./box";
import { Game } from "./game";
import { message } from "./message";
import { PenaltyStragety } from "./compete";
export class Rival {
    private _game: Game;
    constructor(game: Game) {
        this._game = game;
        message.on("moveBoxToRight", this.moveBoxToRight.bind(this))
        message.on("moveBoxToLeft", this.moveBoxToLeft.bind(this))
        message.on("moveBoxToDown", this.moveBoxToDown.bind(this))
        message.on("rotateBox", this.rotateBox.bind(this))
        message.on("createBox", this.createBoxListener.bind(this))
        message.on("gameover", this.gameWon.bind(this))
        message.on('syncPenalty', (penaltyStrategys) => {
            let orders: PenaltyStragety[] = JSON.parse(penaltyStrategys)
            console.log(orders)
            for (let i = 0; i < orders.length; i++) {
                if (orders[i].order === 'addLine') {
                    this._game.syncAddLine.call(this._game, Number(orders[i].cum))
                } else {
                    this._game[orders[i].order].apply(this._game)
                }
            }
        })
    }
    _boxType = 0;
    _firstAccept = false;
    createBoxListener(info: string) {
        this._boxType = Number(info)
        if (!this._firstAccept) {
            console.log('rival开始');
            this.start();
            this._firstAccept = true;
        }
    }
    gameWon() {
        alert('游戏结束,你赢了');
        gameoverAll();
        // getGameoverHandler()();
    }
    createBoxStrategy() {
        // const box = randomCreateBox();
        // return box;

        return createBoxByType(this._boxType);
    }
    start() {
        this._game._isAutoDown = false;
        this._game.setCreateBoxStrategy(this.createBoxStrategy.bind(this));
        this._game.start();

    }
    // initGame(game: Game) {
    //     this._game = game;

    // }
    moveBoxToRight() {
        this._game.moveBoxToRight();
    }
    moveBoxToLeft() {
        this._game.moveBoxToLeft();
    }
    moveBoxToDown() {
        this._game.moveBoxToDown();
    }
    rotateBox() {
        //可能有问题
        this._game.rotateBox();
    }
}