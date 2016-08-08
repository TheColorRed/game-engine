import Obj = GameEngine.Obj;
import Component = GameEngine.Component;
import Behavior = GameEngine.Behavior;
import MonoBehavior = GameEngine.MonoBehavior;

import GameObject = GameEngine.GameObject;
import Physics = GameEngine.Physics;
import Vector3 = GameEngine.Vector3;
import Vector2 = GameEngine.Vector2;
import Color = GameEngine.Color;

import Time = GameEngine.Time;
import Debug = GameEngine.Debug;

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
        ItemManager.items.forEach(item => {
            item.sendMessage('awake');
        });
    }

    protected enable(): void {
        ItemManager.items.forEach(item => {
            if (!item.lastFrameEnabled) {
                item.sendMessage('onEnable');
            }
        });
    }

    protected start(): void {
        ItemManager.items.forEach(item => {
            item.sendMessage('start');
        });
    }

    private update(): void {
        ItemManager.items.forEach(item => {
            item.sendMessage('update');
        });
    }

    private lateUpdate(): void {
        ItemManager.items.forEach(item => {
            item.sendMessage('lateUpdate');
        });
    }

    private lastCheck() {
        ItemManager.items.forEach(item => {
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

class ItemManager {

    protected static _items: GameObject[] = [];

    public static get items(): GameObject[] {
        return ItemManager._items;
    }

    public static setItems(items: GameObject[]) {
        ItemManager._items = items;
    }

    public static addItem(item: GameObject) {
        ItemManager._items.push(item);
    }

    public static removeItems(item: GameObject) {
        var idx: number = ItemManager._items.indexOf(item);
        if (idx > -1) {
            ItemManager._items.splice(idx, 1);
        }
    }
}

new GameEngineMain().startGame();