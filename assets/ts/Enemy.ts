// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, find, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {
    enemyData: any;
    enemyNow: any;
    onLoad () {
        //随机出怪物属性
        this.giveEnemyProperty()
    }
    update(deltaTime: number) {
    }
    giveEnemyProperty(){
        this.enemyData = JSON.parse(localStorage.getItem('enemyData'));
        let enemyData = this.enemyData
        //当前生成的怪物属性
        let enemyNow 
        if (Math.random() < enemyData.gold.chance) {
            enemyNow = enemyData.gold
        } else if (Math.random() < enemyData.blue.chance && Math.random() > enemyData.gold.chance){
            enemyNow = enemyData.blue
        } else {
            enemyNow = enemyData.white
        }
        this.enemyNow = enemyNow
        find("Info", this.node).getComponent(Label).string = enemyNow.Level + '\n血量：' + enemyNow.MaxHp + '\n攻击力：' + enemyNow.ATK 
    }
}
