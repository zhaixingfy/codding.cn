var data = []

if (0) {
  data = Array(100).fill().map((_, idx) => {
    let pid
    let isPrev

    if (idx === 0) {
      pid = 0
    } else if (idx < 20) {
      pid = 1
      isPrev = idx < 10
    } else if (idx < 40) {
      pid = rand(1, 20 - 1)
    } else if (idx < 60) {
      pid = rand(20, 40 - 1)
    } else if (idx < 80) {
      pid = rand(40, 60 - 1)
    } else {
      pid = rand(60, 80 - 1)
    }

    return {
      id: idx + 1,
      pid,
      isPrev,
      name: 'id: ' + (idx + 1) + ' - 自由的网络百科全书,旨在创造一个涵盖所有领域知识,服务所有互联网用户的中文知识性百科全书' + (idx + 1),
      cash: '认证金额：' + (idx + 1) + '00万人民币'
    }
  }).shuffle()

  // data = [{"id":11,"pid":1,"isPrev":false},{"id":32,"pid":14},{"id":15,"pid":1,"isPrev":false},{"id":30,"pid":6},{"id":10,"pid":1,"isPrev":true},{"id":38,"pid":13},{"id":8,"pid":1,"isPrev":true},{"id":13,"pid":1,"isPrev":false},{"id":60,"pid":22},{"id":21,"pid":2},{"id":20,"pid":1,"isPrev":false},{"id":1,"pid":0},{"id":31,"pid":12},{"id":26,"pid":1},{"id":3,"pid":1,"isPrev":true},{"id":5,"pid":1,"isPrev":true},{"id":33,"pid":12},{"id":56,"pid":28},{"id":40,"pid":10},{"id":39,"pid":5},{"id":19,"pid":1,"isPrev":false},{"id":9,"pid":1,"isPrev":true},{"id":7,"pid":1,"isPrev":true},{"id":42,"pid":33},{"id":54,"pid":35},{"id":36,"pid":18},{"id":58,"pid":25},{"id":57,"pid":34},{"id":16,"pid":1,"isPrev":false},{"id":43,"pid":20},{"id":18,"pid":1,"isPrev":false},{"id":37,"pid":7},{"id":45,"pid":27},{"id":49,"pid":28},{"id":17,"pid":1,"isPrev":false},{"id":14,"pid":1,"isPrev":false},{"id":23,"pid":2},{"id":24,"pid":8},{"id":28,"pid":12},{"id":4,"pid":1,"isPrev":true},{"id":29,"pid":8},{"id":48,"pid":30},{"id":46,"pid":20},{"id":12,"pid":1,"isPrev":false},{"id":52,"pid":32},{"id":47,"pid":38},{"id":41,"pid":39},{"id":2,"pid":1,"isPrev":true},{"id":22,"pid":19},{"id":55,"pid":39},{"id":27,"pid":18},{"id":34,"pid":5},{"id":25,"pid":2},{"id":51,"pid":38},{"id":35,"pid":4},{"id":44,"pid":24},{"id":6,"pid":1,"isPrev":true},{"id":59,"pid":32},{"id":53,"pid":31},{"id":50,"pid":26}]
  // console.log(JSON.stringify(data))
} else {
  // data = [{"id":7,"pid":6},{"id":44,"pid":28},{"id":69,"pid":12},{"id":46,"pid":19},{"id":14,"pid":8},{"id":88,"pid":39},{"id":72,"pid":20},{"id":51,"pid":22},{"id":58,"pid":15},{"id":5,"pid":4},{"id":78,"pid":25},{"id":70,"pid":20},{"id":85,"pid":54},{"id":1,"pid":0},{"id":43,"pid":11},{"id":65,"pid":19},{"id":9,"pid":8},{"id":61,"pid":12},{"id":13,"pid":3},{"id":67,"pid":11},{"id":48,"pid":27},{"id":89,"pid":67},{"id":42,"pid":11},{"id":8,"pid":7},{"id":19,"pid":1},{"id":41,"pid":13},{"id":15,"pid":10},{"id":100,"pid":76},{"id":55,"pid":13},{"id":49,"pid":30},{"id":29,"pid":8},{"id":64,"pid":27},{"id":35,"pid":25},{"id":52,"pid":14},{"id":20,"pid":2},{"id":6,"pid":5},{"id":66,"pid":17},{"id":98,"pid":70},{"id":57,"pid":28},{"id":16,"pid":2},{"id":45,"pid":21},{"id":81,"pid":13},{"id":95,"pid":35},{"id":10,"pid":9},{"id":60,"pid":17},{"id":83,"pid":46},{"id":3,"pid":2},{"id":23,"pid":3},{"id":82,"pid":36},{"id":93,"pid":65},{"id":86,"pid":76},{"id":80,"pid":14},{"id":21,"pid":4},{"id":2,"pid":1},{"id":30,"pid":1},{"id":54,"pid":11},{"id":25,"pid":10},{"id":73,"pid":27},{"id":71,"pid":26},{"id":26,"pid":9},{"id":63,"pid":19},{"id":79,"pid":11},{"id":90,"pid":65},{"id":56,"pid":30},{"id":40,"pid":15},{"id":84,"pid":34},{"id":91,"pid":36},{"id":62,"pid":21},{"id":32,"pid":16},{"id":94,"pid":44},{"id":99,"pid":55},{"id":75,"pid":26},{"id":96,"pid":50},{"id":22,"pid":5},{"id":74,"pid":12},{"id":59,"pid":28},{"id":31,"pid":9},{"id":68,"pid":20},{"id":38,"pid":30},{"id":92,"pid":59},{"id":47,"pid":25},{"id":28,"pid":7},{"id":11,"pid":10},{"id":18,"pid":3},{"id":77,"pid":16},{"id":36,"pid":16},{"id":37,"pid":27},{"id":39,"pid":26},{"id":33,"pid":25},{"id":53,"pid":16},{"id":34,"pid":26},{"id":87,"pid":55},{"id":76,"pid":13},{"id":4,"pid":3},{"id":12,"pid":8},{"id":97,"pid":80},{"id":17,"pid":6},{"id":27,"pid":2},{"id":50,"pid":12},{"id":24,"pid":2}]
  data = [
    {id: 1, pid: 0, name: 'id: 1, 阳光灿烂的日子，好听的歌儿随风飘，我们的回忆慢慢消失', cash: '认证金额：100万人民币', isControl: false, percent: '10%'},
    {id: 2, pid: 1, name: 'id: 2, 阳光灿烂的日子，好听的歌儿随风飘，我们的回忆慢慢消失', cash: '认证金额：200万人民币', isControl: false, percent: '20%', isPrev: true},
    {id: 3, pid: 1, name: 'id: 3, 阳光灿烂的日子，好听的歌儿随风飘，我们的回忆慢慢消失', cash: '认证金额：300万人民币', isControl: false, percent: '30%', isPrev: false},
    {id: 4, pid: 2, name: 'id: 4, 阳光灿烂的日子，好听的歌儿随风飘，我们的回忆慢慢消失', cash: '认证金额：400万人民币', isControl: false, percent: '40%'},
    {id: 5, pid: 2, name: 'id: 5, 阳光灿烂的日子，好听的歌儿随风飘，我们的回忆慢慢消失', cash: '认证金额：500万人民币', isControl: true, percent: '50%'},
    {id: 6, pid: 2, name: 'id: 6, 阳光灿烂的日子，好听的歌儿随风飘，我们的回忆慢慢消失', cash: '认证金额：600万人民币', isControl: true, percent: '60%'},
    {id: 7, pid: 3, name: 'id: 7, 阳光灿烂的日子，好听的歌儿随风飘，我们的回忆慢慢消失', cash: '认证金额：700万人民币', isControl: true, percent: '70%'},
    {id: 8, pid: 3, name: 'id: 8, 阳光灿烂的日子，好听的歌儿随风飘，我们的回忆慢慢消失', cash: '认证金额：800万人民币', isControl: false, percent: '80%'},
    {id: 9, pid: 3, name: 'id: 9, 阳光灿烂的日子，好听的歌儿随风飘，我们的回忆慢慢消失', cash: '认证金额：900万人民币', isControl: false, percent: '90%'},
  ]
}