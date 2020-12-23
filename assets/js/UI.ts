// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, find, Button,Animation, Label, color, Color, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UI')
export class UI extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start () {
        this.node.getChildByName("toPlayer").on(Button.EventType.CLICK, this.toPlayer, this)
        this.node.getChildByName("toBattle").on(Button.EventType.CLICK, this.toBattle, this)
    }
    toPlayer() {
        find("Canvas/UI/toPlayer").getComponent(Sprite).color  = new Color('#ffffff')
        find("Canvas/UI/toBattle").getComponent(Sprite).color = new Color('#646464')
        find("Canvas/Battle").getComponent(Animation).play("toright");
        find("Canvas/Player").getComponent(Animation).play("PlayerToRight");
    }
    toBattle() {
        find("Canvas/UI/toPlayer").getComponent(Sprite).color = new Color('#646464')
        find("Canvas/UI/toBattle").getComponent(Sprite).color = new Color('#ffffff')
        find("Canvas/Battle").getComponent(Animation).play("toleft");
        find("Canvas/Player").getComponent(Animation).play("PlayerToLeft");
    }
    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
