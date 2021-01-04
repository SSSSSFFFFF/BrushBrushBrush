// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, find, Label, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {
    //怪物表
    enemyData: any;
    //当前怪物
    enemyNow: any;
    playerData: any;
    onLoad () {
        //随机出怪物属性
        this.giveEnemyProperty()
    }
    update(deltaTime: number) {
        this.updateEnemyData();
    }
    updateEnemyData(){
        let enemyNow = this.enemyNow
        if (enemyNow.status != 'lose'){
            let thisLabel = find("Info", this.node)
            //战斗失败
            if (enemyNow.MaxHp <= 0) {
                this.playerData = JSON.parse(localStorage.getItem('playerData'));
                thisLabel.getComponent(Label).string = 'lose'
                enemyNow.status = 'lose'
                switch (enemyNow.Level) {
                    case 'white':
                        this.playerData.progress = this.playerData.progress + 1
                        break;
                    case 'blue':
                        this.playerData.progress = this.playerData.progress + 2
                        break;
                    case 'gold':
                        this.playerData.progress = this.playerData.progress + 4
                        break;
                    default:
                        break;
                }
                for (let i = 0; i < enemyNow.spoils.length; i++) {
                    if (Math.random() <= enemyNow.spoils[i].chance) {
                        this.playerData.bag.push(enemyNow.spoils[i].name)
                        thisLabel.getComponent(Label).string += '\n' + enemyNow.spoils[i].name
                    }
                }
                localStorage.setItem('playerData', JSON.stringify(this.playerData))
            } else {
                thisLabel.getComponent(Label).string = enemyNow.Level + '\n血量：' + enemyNow.MaxHp + '\n攻击力：' + enemyNow.ATK
            }
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
