import { initMap } from './map'
import { Game, MGame } from './game';
import { Player } from './Player';
import { initMessage } from './message';
import { Rival } from './Rival';
import mitt from 'mitt';
import { Alone } from './alone';
const emitter = mitt();

export type ExternalState = {
    getScore: () => number
    getEmitter: () => any
}
export function getEmitter() {
    return emitter;
}
export function initGameMult(name: string, isHost: boolean) {
    initMessage(name, isHost
    );
    emitter.emit('startGame')
}

export function initGameSelf() {
    emitter.emit('startGame');
}
let singleGame: Game;
let alone: Alone;

//单人游戏
export function initAloneGame(mapRef: React.MutableRefObject<number[][]>, setMapRef: Function): ExternalState {
    initMap(setMapRef);
    singleGame = new Game(mapRef, setMapRef);
    alone = new Alone(singleGame);
    return { getEmitter: singleGame.getEmitter.bind(singleGame), getScore: singleGame.getGameState().getScore.bind(singleGame.getGameState()) };
}


//双人游戏
let selfGame: MGame;
let player: Player;
export function initSelfGame(mapRef: React.MutableRefObject<number[][]>, setMapRef: Function) {
    initMap(setMapRef);
    selfGame = new MGame(mapRef, setMapRef);
    player = new Player(selfGame);

}

let rivalGame: MGame;
let rivalPlayer: Rival
export function initRivalGame(mapRef: React.MutableRefObject<number[][]>, setMapRef: Function) {
    initMap(setMapRef);
    rivalGame = new MGame(mapRef, setMapRef);
    rivalPlayer = new Rival(rivalGame);
}
export function getRival() {
    return rivalPlayer;
}

export function startGameSingle() {
    alone.start();
}

export function startGame() {
    player.start();
}
export function operateInMobile(order: string) {
    player && player.handlerButton(order)
    alone && alone.handlerButton(order)
}
let _gameoverHandler: Function;
export function setGameoverHandler(fn: Function) {
    _gameoverHandler = fn;
}
export function getGameoverHandler() {
    return _gameoverHandler;
}


//单人游戏生效
export function forceOverSelfGame() {
    singleGame.endGame();
    singleGame.forceOverGame();
}

export function gameoverAll() {
    singleGame && singleGame.endGame();
    rivalGame && rivalGame.endGame();
    selfGame && selfGame.endGame();
    window.location.href = '/'
}