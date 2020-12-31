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
    //怪物表
    enemyData: any;
    //当前怪物
    enemyNow: any;
    onLoad () {
        //随机出怪物属性
        this.giveEnemyProperty()
    }
    update(deltaTime: number) {
        this.updateEnemyData();
    }
    updateEnemyData(){

        let enemyNow = this.enemyNow
        let thisLabel = find("Info", this.node)
        thisLabel.getComponent(Label).string = enemyNow.Level + '\n血量：' + enemyNow.MaxHp + '\n攻击力：' + enemyNow.ATK
        if (enemyNow.MaxHp <= 0){
            thisLabel.getComponent(Label).string = 'lose'
            enemyNow.status = 'lose'
            
            if(Math.random() <)
            // let playerData = JSON.parse(localStorage.getItem('playerData'));
            // playerData.bag.push('')
            
        }
    }
    giveEnemyProperty(){
        this.enemyData = JSON.parse(JSON.stringify(globalThis.enemyData))
        let enemyData = this.enemyData
        console.log(enemyData);
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
    }
    
}
