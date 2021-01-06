// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, find, Label, ProgressBar } from 'cc';
import { Player } from './Player';
import { Battle } from './Battle';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {
    //怪物表
    enemyData: any;
    //当前怪物
    enemyNow: any;
    playerData: any;
    onLoad () {
        //加载玩家数据
        this.playerData = find("Canvas/Player").getComponent(Player).playerData;
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
            //战斗成功
            if (enemyNow.MaxHp <= 0) {
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
                //变更进度条
                find("Canvas/Battle").getComponent(Battle).updateProgress();
                for (let i = 0; i < enemyNow.spoils.length; i++) {
                    if (Math.random() <= enemyNow.spoils[i].chance) {
                        for (let j = 0; j < this.playerData.bag.length; j++) {
                            let ele = this.playerData.bag[j];
                            console.log(ele, enemyNow.spoils[i]);
                            if (ele.name == enemyNow.spoils[i].name) {
                                ele.num = Number(ele.num) + 1
                            } else {
                                let good = {
                                    name: enemyNow.spoils[i].name,
                                    num: 1
                                }
                                this.playerData.bag.push(good)
                            }
                        }
                           
                        thisLabel.getComponent(Label).string += '\n' + enemyNow.spoils[i].name
                    }
                }
                console.log(this.playerData);
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
        if (this.playerData.progress >= 100){
            //boss
            enemyNow = enemyData.boss
        } else {
            // 小怪
            if (Math.random() < enemyData.gold.chance) {
                enemyNow = enemyData.gold
            } else if (Math.random() < enemyData.blue.chance && Math.random() > enemyData.gold.chance) {
                enemyNow = enemyData.blue
            } else {
                enemyNow = enemyData.white
            }
        }


        this.enemyNow = enemyNow
    }
    
}
