System.register("chunks:///Player.js", ["./_virtual/_rollupPluginBabelHelpers.js", "cc"], function (_export, _context) {
  "use strict";

  var _applyDecoratedDescriptor, _inheritsLoose, _defineProperty, _assertThisInitialized, _initializerDefineProperty, cclegacy, _decorator, Prefab, find, Button, instantiate, Label, Component, _dec, _dec2, _class, _class2, _descriptor, _temp, ccclass, property, Player;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _inheritsLoose = _virtual_rollupPluginBabelHelpersJs.inheritsLoose;
      _defineProperty = _virtual_rollupPluginBabelHelpersJs.defineProperty;
      _assertThisInitialized = _virtual_rollupPluginBabelHelpersJs.assertThisInitialized;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
    }, function (_cc) {
      cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Prefab = _cc.Prefab;
      find = _cc.find;
      Button = _cc.Button;
      instantiate = _cc.instantiate;
      Label = _cc.Label;
      Component = _cc.Component;
    }],
    execute: function () {
      cclegacy._RF.push({}, "f471054CdFNOoYxGcVmhC9I", "Player", undefined);

      ccclass = _decorator.ccclass;
      property = _decorator.property;

      _export("Player", Player = (_dec = ccclass('Player'), _dec2 = property({
        type: Prefab
      }), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(Player, _Component);

        function Player() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _defineProperty(_assertThisInitialized(_this), "playerData", void 0);

          _initializerDefineProperty(_assertThisInitialized(_this), "Model", _descriptor, _assertThisInitialized(_this));

          return _this;
        }

        var _proto = Player.prototype;

        _proto.start = function start() {
          //获取用户信息
          this.getPlayerData(); //清除存档

          find("Canvas/Player/ClearSave").on(Button.EventType.CLICK, this.clickClearSave, this);
        };

        _proto.update = function update(deltaTime) {
          //刷新属性面板
          this.updateUserInfo();
        };

        _proto.clickClearSave = function clickClearSave() {
          var node = instantiate(this.Model);
          node.parent = find("Canvas/Player");
          node.setPosition(0, 0);
          find("Canvas/Player/Model/Cancel").on(Button.EventType.CLICK, function () {
            node.destroy();
          }, this);
          find("Canvas/Player/Model/Confirm").on(Button.EventType.CLICK, function () {
            localStorage.removeItem('playerData');
            window.location.reload();
          }, this);
        };

        _proto.getPlayerData = function getPlayerData() {
          this.playerData = JSON.parse(localStorage.getItem('playerData')); //如果不存在用户数据则新建

          if (!this.playerData) {
            this.playerData = {
              'MaxHp': 20,
              'EXP': 0,
              'ATK': 2,
              'Crit': 0.1,
              'CritD': 1.5,
              'Level': 1,
              'LevelUpNeedExp': [0, 5, 20, 50]
            };
            localStorage.setItem('playerData', JSON.stringify(this.playerData));
          } //创建临时血量


          this.playerData.HP = this.playerData.MaxHp;
        } //存储用户信息
        ;

        _proto.setPlayerData = function setPlayerData(playerData) {
          localStorage.setItem('playerData', JSON.stringify(playerData));
        } //回复血量
        ;

        _proto.reset = function reset(HP) {
          this.playerData.HP = HP;
        };

        _proto.updateUserInfo = function updateUserInfo() {
          var playerData = this.playerData;
          find("Info", this.node).getComponent(Label).string = '\n等级：' + playerData.Level + '\n生命值：' + playerData.HP + '/' + playerData.MaxHp + '\n攻击力：' + playerData.ATK + '\n经验值：' + playerData.EXP + '/' + playerData.LevelUpNeedExp[playerData.Level] + '\n暴击率：' + playerData.Crit * 100 + '%' + '\n暴击伤害：' + playerData.CritD * 100 + '%';
        } //验证等级
        ;

        _proto.checkLevel = function checkLevel() {
          var i = 1,
              playerData = this.playerData;

          while (playerData.EXP >= playerData.LevelUpNeedExp[i]) {
            playerData.Level++;
            this.setPlayerData(playerData);
            i++;
          }
        };

        return Player;
      }(Component), _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "Model", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///Enemy.js", ["./_virtual/_rollupPluginBabelHelpers.js", "cc"], function (_export, _context) {
  "use strict";

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Component, _dec, _class, _class2, _descriptor, _descriptor2, _temp, ccclass, property, Enemy;

  _export({
    _dec: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _descriptor2: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _inheritsLoose = _virtual_rollupPluginBabelHelpersJs.inheritsLoose;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
      _assertThisInitialized = _virtual_rollupPluginBabelHelpersJs.assertThisInitialized;
    }, function (_cc) {
      cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Component = _cc.Component;
    }],
    execute: function () {
      cclegacy._RF.push({}, "8ec21OeeVxEfbc1CgDYIMvZ", "Enemy", undefined);

      ccclass = _decorator.ccclass;
      property = _decorator.property;

      _export("Enemy", Enemy = (_dec = ccclass('Enemy'), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(Enemy, _Component);

        function Enemy() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_assertThisInitialized(_this), "HP", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_assertThisInitialized(_this), "ATK", _descriptor2, _assertThisInitialized(_this));

          return _this;
        }

        var _proto = Enemy.prototype;

        _proto.start = function start() {// Your initialization goes here.
        };

        _proto.reset = function reset(hp) {
          this.HP = hp;
        };

        _proto.update = function update(deltaTime) {// Your update function goes here.
        };

        return Enemy;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "HP", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "ATK", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///Battle.js", ["./_virtual/_rollupPluginBabelHelpers.js", "cc", "./Player.js", "./Enemy.js"], function (_export, _context) {
  "use strict";

  var _inheritsLoose, _defineProperty, _assertThisInitialized, cclegacy, _decorator, find, Label, UITransform, Button, Component, Player, Enemy, _dec, _class, _temp, ccclass, property, integer, _float, _boolean, string, type, Battle;

  _export({
    _dec: void 0,
    _class: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_virtual_rollupPluginBabelHelpersJs) {
      _inheritsLoose = _virtual_rollupPluginBabelHelpersJs.inheritsLoose;
      _defineProperty = _virtual_rollupPluginBabelHelpersJs.defineProperty;
      _assertThisInitialized = _virtual_rollupPluginBabelHelpersJs.assertThisInitialized;
    }, function (_cc) {
      cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      find = _cc.find;
      Label = _cc.Label;
      UITransform = _cc.UITransform;
      Button = _cc.Button;
      Component = _cc.Component;
    }, function (_PlayerJs) {
      Player = _PlayerJs.Player;
    }, function (_EnemyJs) {
      Enemy = _EnemyJs.Enemy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "d56f6odbjhHCqU0stzg58sx", "Battle", undefined);

      ccclass = _decorator.ccclass;
      property = _decorator.property;
      integer = _decorator.integer;
      _float = _decorator["float"];
      _boolean = _decorator["boolean"];
      string = _decorator.string;
      type = _decorator.type;

      _export("Battle", Battle = (_dec = ccclass('Battle'), _dec(_class = (_temp = /*#__PURE__*/function (_Component) {
        _inheritsLoose(Battle, _Component);

        function Battle() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _defineProperty(_assertThisInitialized(_this), "callback", void 0);

          _defineProperty(_assertThisInitialized(_this), "startBtn", void 0);

          _defineProperty(_assertThisInitialized(_this), "enemyHp", 10);

          _defineProperty(_assertThisInitialized(_this), "battleShow", true);

          return _this;
        }

        var _proto = Battle.prototype;

        _proto.start = function start() {
          this.Battle();
        };

        _proto.update = function update(deltaTime) {
          //fight
          var PlayerCom = find("Canvas/Player").getComponent(Player).playerData;
          var EnemyCom = find("Canvas/Battle/Enemy").getComponent(Enemy);
          find("Canvas/Battle/Player/Info").getComponent(Label).string = "Player\nHP：" + PlayerCom.HP.toString();
          find("Canvas/Battle/Enemy/Info").getComponent(Label).string = "Enemy\nHP：" + EnemyCom.HP.toString() + "\nATK: " + EnemyCom.ATK.toString();
          find("Canvas/Battle/ScrollView/view/content").getComponent(UITransform).height = find("Canvas/Battle/ScrollView/view/content/item").getComponent(UITransform).height;
        };

        _proto.Battle = function Battle() {
          this.startBtn = find("Canvas/Battle/Button");
          this.startBtn.on(Button.EventType.CLICK, this.btnClick, this);
        };

        _proto.btnClick = function btnClick(button) {
          // 注意这种方式注册的事件，无法传递 customEventData
          var player = find("Canvas/Player").getComponent(Player);
          var enemy = find("Canvas/Battle/Enemy").getComponent(Enemy);
          this.startBtn.getComponent(Button).interactable = false;
          this.checkNums();
        };

        _proto.checkNums = function checkNums() {
          //战斗结果
          var result = find("Canvas/Battle/ScrollView/view/content/item").getComponent(Label);
          result.string = '\n' + result.string;
          var player = find("Canvas/Player").getComponent(Player).playerData;
          var enemy = find("Canvas/Battle/Enemy").getComponent(Enemy);
          this.schedule(this.callback = function () {
            var damgeReult = player.ATK;

            if (Math.random() < player.Crit) {
              //暴击成功
              damgeReult = player.ATK * player.CritD;
              result.string = '暴击了！你造成了' + damgeReult + '点伤害，受到了' + enemy.ATK + '点伤害\n' + result.string;
            } else {
              result.string = '你造成了' + damgeReult + '点伤害，受到了' + enemy.ATK + '点伤害\n' + result.string;
            } // 怪物血量


            enemy.HP -= damgeReult; // 玩家血量

            player.HP -= enemy.ATK;
            var battleResult; //player失败

            if (player.HP <= 0) {
              player.HP = 0;
              battleResult = '战斗失败\n' + result.string;
            } //enemy失败


            if (enemy.HP <= 0) {
              player.MaxHp++;
              player.EXP++;
              find("Canvas/Player").getComponent(Player).checkLevel();
              this.enemyHp += 4;
              enemy.HP = 0;
              battleResult = '战斗成功\n' + result.string;
            } //结束


            if (player.HP <= 0 || enemy.HP <= 0) {
              result.string = battleResult;
              find("Canvas/Player").getComponent(Player).setPlayerData(player);
              find("Canvas/Player").getComponent(Player).reset(player.MaxHp);
              enemy.reset(this.enemyHp);
              this.startBtn.getComponent(Button).interactable = true;
              this.unschedule(this.callback);
            }
          }, 1);
        };

        return Battle;
      }(Component), _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///UI.js", ["./_virtual/_rollupPluginBabelHelpers.js", "cc"], function (_export, _context) {
  "use strict";

  var _inheritsLoose, cclegacy, _decorator, Button, find, Sprite, Color, Animation, Component, _dec, _class, ccclass, property, UI;

  _export({
    _dec: void 0,
    _class: void 0
  });

  return {
    setters: [function (_virtual_rollupPluginBabelHelpersJs) {
      _inheritsLoose = _virtual_rollupPluginBabelHelpersJs.inheritsLoose;
    }, function (_cc) {
      cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Button = _cc.Button;
      find = _cc.find;
      Sprite = _cc.Sprite;
      Color = _cc.Color;
      Animation = _cc.Animation;
      Component = _cc.Component;
    }],
    execute: function () {
      cclegacy._RF.push({}, "4211e/PRFxGa4OlVYyIy4re", "UI", undefined);

      ccclass = _decorator.ccclass;
      property = _decorator.property;

      _export("UI", UI = (_dec = ccclass('UI'), _dec(_class = /*#__PURE__*/function (_Component) {
        _inheritsLoose(UI, _Component);

        function UI() {
          return _Component.apply(this, arguments) || this;
        }

        var _proto = UI.prototype;
        /* class member could be defined like this */
        // dummy = '';

        /* use `property` decorator if your want the member to be serializable */
        // @property
        // serializableDummy = 0;

        _proto.start = function start() {
          this.node.getChildByName("toPlayer").on(Button.EventType.CLICK, this.toPlayer, this);
          this.node.getChildByName("toBattle").on(Button.EventType.CLICK, this.toBattle, this);
        };

        _proto.toPlayer = function toPlayer() {
          find("Canvas/UI/toPlayer").getComponent(Sprite).color = new Color('#ffffff');
          find("Canvas/UI/toBattle").getComponent(Sprite).color = new Color('#646464');
          find("Canvas/Battle").getComponent(Animation).play("toright");
          find("Canvas/Player").getComponent(Animation).play("PlayerToRight");
        };

        _proto.toBattle = function toBattle() {
          find("Canvas/UI/toPlayer").getComponent(Sprite).color = new Color('#646464');
          find("Canvas/UI/toBattle").getComponent(Sprite).color = new Color('#ffffff');
          find("Canvas/Battle").getComponent(Animation).play("toleft");
          find("Canvas/Player").getComponent(Animation).play("PlayerToLeft");
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }
        ;

        return UI;
      }(Component)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/main", ["../Player.js", "../Enemy.js", "../Battle.js", "../UI.js"], function (_export, _context) {
  "use strict";

  return {
    setters: [function (_PlayerJs) {}, function (_EnemyJs) {}, function (_BattleJs) {}, function (_UIJs) {}],
    execute: function () {}
  };
});

(function(r) {
  r('project:///assets/js/Player.js', 'chunks:///Player.js');
  r('project:///assets/js/Enemy.js', 'chunks:///Enemy.js');
  r('project:///assets/js/Battle.js', 'chunks:///Battle.js');
  r('project:///assets/js/UI.js', 'chunks:///UI.js');
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});