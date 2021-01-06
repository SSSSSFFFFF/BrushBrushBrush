// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, find, instantiate, Label, Prefab } from 'cc';
const { ccclass, property } = _decorator;
import {Player} from './Player'
@ccclass('Bag')
export class Bag extends Component {
    playerData: any;
    bag: any;

    @property({ type: Prefab })
    private goods: Prefab = null;

    start () {
        // Your initialization goes here.
    }
    update(){
        this.checkBag()
    }
    onLoad(){
        //加载玩家数据
        this.playerData = find("Canvas/Player").getComponent(Player).playerData;
        this.bag = this.playerData.bag;
        for (let i = 0; i < this.bag.length; i++) {
            this.setBag(this.bag[i])
        }
        
    }
    checkBag(){

    }
    setBag(name){
        console.log(name);
        let node = instantiate(this.goods);
        node.getComponent(Label).string = name+'x'
        node.getComponent(Label).fontSize = 20
        node.parent = find("Canvas/Bag/Layout");
    }
}
