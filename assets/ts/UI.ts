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
    //上一个页面index
    lastIndex: number;

    start () {
        this.lastIndex = 2
        this.node.getChildByName("toPlayer").on(Button.EventType.CLICK, this.toPlayer, this)
        this.node.getChildByName("toBag").on(Button.EventType.CLICK, this.toBag, this)
        this.node.getChildByName("toBattle").on(Button.EventType.CLICK, this.toBattle, this)
    }
    toPlayer() {
        this.changeIndex(0)
        this.lastIndex = 0
    }
    toBag () {
        this.changeIndex(1)
        this.lastIndex = 1
    }
    toBattle() {
        this.changeIndex(2)
        this.lastIndex = 2
    }
    changeIndex(num) {
        let that = this;
        find("Canvas/UI/toPlayer").getComponent(Sprite).color = new Color('#646464')
        find("Canvas/UI/toBag").getComponent(Sprite).color = new Color('#646464')
        find("Canvas/UI/toBattle").getComponent(Sprite).color = new Color('#646464')
        find("Canvas/UI/toPlayer").getComponent(Button).interactable = true
        find("Canvas/UI/toBag").getComponent(Button).interactable = true
        find("Canvas/UI/toBattle").getComponent(Button).interactable = true
        switch (num) {
            case 0:
                find("Canvas/UI/toPlayer").getComponent(Sprite).color = new Color('#ffffff')
                find("Canvas/UI/toPlayer").getComponent(Button).interactable = false
                if (checkFrom()) {
                } else {
                    find("Canvas/Player").getComponent(Animation).play("fromLeft");
                    find(checkNode(this.lastIndex)).getComponent(Animation).play("toRight");
                }
                break;
            case 1:
                find("Canvas/UI/toBag").getComponent(Sprite).color = new Color('#ffffff')
                find("Canvas/UI/toBag").getComponent(Button).interactable = false
                if (checkFrom()) {
                    find("Canvas/Bag").getComponent(Animation).play("fromRight");
                    find(checkNode(this.lastIndex)).getComponent(Animation).play("toLeft");
                } else {
                    find("Canvas/Bag").getComponent(Animation).play("fromLeft");
                    find(checkNode(this.lastIndex)).getComponent(Animation).play("toRight");
                }
                break;
            case 2:
                find("Canvas/UI/toBattle").getComponent(Sprite).color = new Color('#ffffff')
                find("Canvas/UI/toBattle").getComponent(Button).interactable = false
                if (checkFrom()) {
                    find("Canvas/Battle").getComponent(Animation).play("fromRight");
                    find(checkNode(this.lastIndex)).getComponent(Animation).play("toLeft");
                } else {
                   
                }
                break;
            default:
                break;
        }
        //index是否从左边来，本体从右边来
        function checkFrom() {
            let result
            if (num > that.lastIndex) {
                result =  true
            } else {
                result = false
            }
            return result
        }
        function checkNode(num) {
            let result
            switch (num) {
                case 0:
                    result = "Canvas/Player"   
                    break;
                case 1:
                    result = "Canvas/Bag"
                    break;
                case 2:
                    result = "Canvas/Battle"
                    break;
                default:
                    break;
            }
            return result
        }
    }
    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
