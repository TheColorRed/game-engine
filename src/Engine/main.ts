import Obj from './core/Obj';
import Component from './core/Component';
import Behavior from './core/Behavior';
import MonoBehavior from './core/MonoBehavior';
import ObjectManager from './core/ObjectManager';

import GameObject from './core/GameObject';
import Physics from './physics/Physics';
import Vector3 from './util/Vector3';
import Vector2 from './util/Vector2';
import Color from './util/color/Color';

import Time from './util/Time';
import Debug from './util/Debug';

class GameEngineMain {

    private lastLoopTime = this.getNanoSeconds;
    private targetFps = 120;
    private optimalTime = 1000000000 / this.targetFps;
    private lastFpsTime = 0;

    private startTime = 0;

    public startGame() {
        this.tick();
    }

    private get getNanoSeconds(): number {
        // console.log((new Date).getMilliseconds())
        return (new Date()).getTime() * 1000000;
    }

    protected tick(): void {
        let d = new Date().getTime();
        Time.setFrameTime((d - this.startTime) / 1000);
        var nanoSeconds = this.getNanoSeconds;
        var now = nanoSeconds;
        var updateLength = now - this.lastLoopTime;
        this.lastLoopTime = now;
        var delta = updateLength / this.optimalTime;

        this.lastFpsTime += updateLength;
        if (this.lastFpsTime >= 1000000000) {
            this.lastFpsTime = 0;
        }

        // Set the delta on each berry
        Time.setDeltaTime(delta / this.targetFps);

        this.awake();
        this.enable();
        this.start();

        this.lastCheck();

        var next = (this.lastLoopTime - nanoSeconds + this.optimalTime) / 1000000;
        setTimeout(this.tick.bind(this), next);
    }

    protected awake(): void {
        ObjectManager.items.forEach(item => {
            item.sendMessage('awake');
        });
    }

    protected enable(): void {
        ObjectManager.items.forEach(item => {
            if (!item.lastFrameEnabled) {
                item.sendMessage('onEnable');
            }
        });
    }

    protected start(): void {
        ObjectManager.items.forEach(item => {
            item.sendMessage('start');
        });
    }

    private update(): void {
        ObjectManager.items.forEach(item => {
            item.sendMessage('update');
        });
    }

    private lateUpdate(): void {
        ObjectManager.items.forEach(item => {
            item.sendMessage('lateUpdate');
        });
    }

    private lastCheck() {
        ObjectManager.items.forEach(item => {
            if (item.shouldDisable) {
                item.isEnabled = false;
                item.shouldDisable = false;
            }
            item.getComponents().forEach(comp => {
                if (!comp.isEnabled) {
                    item.lastFrameEnabled = false;
                } else {
                    item.lastFrameEnabled = true;
                }
                if (item.shouldDisable) {
                    comp.behavior.isEnabled = false;
                }
            });
        });
    }

}

new GameEngineMain().startGame();