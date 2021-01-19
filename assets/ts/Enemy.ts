// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, find, Label, ProgressBar, cclegacy } from 'cc';
import { Player } from './Player';
import { Battle } from './Battle';
import { Bag } from './Bag';
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
        this.playerData = find("Canvas").getComponent(Player).playerData;
        //随机出怪物属性
        this.giveEnemyProperty()
    }
    update(deltaTime: number) {
        this.updateEnemyData();
    }
    updateEnemyData(){
        let enemyNow = this.enemyNow
        if (enemyNow.status != 'lose'){
            let thisLabel = find("Widget/Info", this.node)
            //战斗成功，怪物死亡
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
                find("Canvas").getComponent(Battle).updateProgress();
                //掉落战利品
                for (let i = 0; i < enemyNow.spoils.length; i++) {
                    if (Math.random() <= enemyNow.spoils[i].chance) {
                        let isInBag:boolean = false
                        for (let j = 0; j < this.playerData.bag.length; j++) {
                            const ele = this.playerData.bag[j];
                            if(ele.name == enemyNow.spoils[i].name){
                                isInBag = true
                                ele.num++
                                find("Canvas").getComponent(Bag).updateGood(j, ele)
                            } 
                        }
                        //如果没有在包里找到则新增
                        if(!isInBag){
                            let good = {
                                name: enemyNow.spoils[i].name,
                                num: 1
                            }
                            this.playerData.bag.push(good)   
                            find("Canvas").getComponent(Bag).setBag(good)
                        }
                        thisLabel.getComponent(Label).string += '\n' + enemyNow.spoils[i].name
                    }
                }
                //掉落装备
                for (let i = 0; i < enemyNow.equipment.length; i++) {
                    if (Math.random() <= enemyNow.equipment[i].chance) {
                        let good = {
                            name: enemyNow.equipment[i].name,
                            ATK: enemyNow.equipment[i].ATK,
                            type: enemyNow.equipment[i].type,
                        }
                        this.playerData.bag.push(good)
                        find("Canvas").getComponent(Bag).setBag(good)
                        thisLabel.getComponent(Label).string += '\n' + enemyNow.equipment[i].name
                    }
                }
                this.playerData.EXP = Number((this.playerData.EXP + enemyNow.EXP).toFixed(0))
                this.playerData.Gold = Number((this.playerData.Gold + enemyNow.Gold).toFixed(0))
                //存档
                localStorage.setItem('playerData', JSON.stringify(this.playerData))

            } else {
                thisLabel.getComponent(Label).string = enemyNow.Level + '\n血量：' + enemyNow.MaxHp + '\n攻击力：' + enemyNow.ATK
            }
        }

    }

    giveEnemyProperty(){
        this.enemyData = JSON.parse(JSON.stringify(globalThis.enemyData))
        let enemyData = this.enemyData
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
