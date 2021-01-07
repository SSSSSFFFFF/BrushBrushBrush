// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, find, instantiate, Label, Prefab, cclegacy, Button } from 'cc';
const { ccclass, property } = _decorator;
import {Player} from './Player'
@ccclass('Bag')
export class Bag extends Component {
    playerData: any;
    bag: any;

    @property({ type: Prefab })
    private goods: Prefab = null;
    goodNodes: any[] = [];

    @property({ type: Prefab })
    private pop: Prefab = null;

    @property({ type: Prefab })
    private equipBtn: Prefab = null;
    start () {
        // Your initialization goes here.
    }
    update(){
    }
    onLoad(){
        //加载玩家数据
        this.playerData = find("Canvas/Player").getComponent(Player).playerData;
        this.bag = this.playerData.bag;
        //加载背包
        for (let i = 0; i < this.bag.length; i++) {
            this.setBag(this.bag[i])
        }
    }
    //更新物品信息
    updateGood(index,good){
        this.goodNodes[index].getComponent(Label).string = good.name + '*' + good.num
    }
    setBag(good){

        let node = instantiate(this.goods);
        if (good.num) {
            node.getComponent(Label).string = good.name + '*' + good.num
        } else {
            node.getComponent(Label).string = good.name 
        }
        node.getComponent(Label).fontSize = 20
        node.parent = find("Canvas/Bag/Layout");
        node.on(Node.EventType.TOUCH_START, (event) => {
            //弹窗
            let node = instantiate(this.pop);
            if (good.ATK){
                find("Label", node).getComponent(Label).string = '物品名：' + good.name + '\n攻击力：' + good.ATK + '\n类别：' + good.type
                //装备按钮
                let equipBtn = instantiate(this.equipBtn);
                equipBtn.parent = node;
                equipBtn.on(Button.EventType.CLICK, (event) => {
                    //装备
                    find("Canvas/Player").getComponent(Player).changeEquipment(good)
                    node.destroy();
                }, this)
            } else {
                find("Label", node).getComponent(Label).string = '介绍：' + good.name
            }
            node.parent = find("Canvas/Bag");
            find("Button", node).on(Button.EventType.CLICK, (event) => {
                node.destroy();
            },this)
        }, this);
        this.goodNodes.push(node)
    }
}
