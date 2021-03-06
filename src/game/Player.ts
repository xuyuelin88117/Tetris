import { randomCreateBox } from "./box";
import { Game } from "./game";
import isMobile from './utils/checkServices'
import { message } from "./message";
import { gameoverAll } from ".";
import { randomPenaltyStrategy } from "./compete";
export class Player {
    private _game: Game;
    constructor(game: Game) {
        this._game = game;
        this._game.setCreateBoxStrategy(this.createBoxStrategy.bind(this));
        this._game._emitter.on('gameover', this.gameLose.bind(this));
        this._game._emitter.on('moveBoxToDown', () => { message.emit('moveBoxToDown') })
        this._game._emitter.on('eliminateLine', (num) => { message.emit('eliminateLine', num) })

        message.on('createPenaltyStrategy', (num) => {
            let penaltyStrategys = [];
            for (let i = 0; i < num; i++) {
                let penalty = randomPenaltyStrategy()
                let cum = this._game[penalty.order].apply(this._game);
                penalty.cum = cum;
                console.log(penalty);
                penaltyStrategys.push(penalty);
                console.log(penaltyStrategys)
            }
            console.log(penaltyStrategys)
            console.log(randomPenaltyStrategy())
            message.emit('penaltyStrategys', JSON.stringify(penaltyStrategys));
        });
        if (isMobile()) {

        } else {
            window.onkeydown = this.handlerKeyDown.bind(this)
        }
        // window.addEventListener('keydown', this.handlerKeyDown.bind(this))
    }
    createBoxStrategy() {
        const box = randomCreateBox();
        message.emit('createBox', box.type);
        // console.log('发送createBox')
        return box;
    }
    gameLose() {
        message.emit('gameover');
        alert('游戏结束,你输了');
        // this._game.endGame();
        gameoverAll();
        // getGameoverHandler()();
    }
    start() {
        this._game.start();
    }
    //在index.ts里导出该函数，在Game组件里绑定
    handlerButton(order: string) {
        switch (order) {
            case "ArrowDown":
                this._game.moveBoxToDown();
                message.emit('moveBoxToDown')
                break;
            case "ArrowLeft":
                this._game.moveBoxToLeft();
                message.emit('moveBoxToLeft')
                break;
            case "ArrowRight":
                this._game.moveBoxToRight();
                message.emit('moveBoxToRight')
                break;
            case "ArrowUp":
                this._game.rotateBox();
                message.emit('rotateBox')
                break;
            default: break;
        }
    }
    handlerKeyDown(e: KeyboardEvent) {
        switch (e.code) {
            case "ArrowDown":
                this._game.moveBoxToDown();
                message.emit('moveBoxToDown')
                break;
            case "ArrowLeft":
                this._game.moveBoxToLeft();
                message.emit('moveBoxToLeft')
                break;
            case "ArrowRight":
                this._game.moveBoxToRight();
                message.emit('moveBoxToRight')
                break;
            case "ArrowUp":
                this._game.rotateBox();
                message.emit('rotateBox')
                break;
            default: break;
        }
    }
}