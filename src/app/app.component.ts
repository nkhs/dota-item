import { Component, OnInit } from '@angular/core';
import { Const } from './data';


declare let io: any;
declare let firebase: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  socket: any;
  initSocket() {
    this.socket = io("https://localhost");
    this.socket.on('connect', () => {
      console.log('connected');
    })
    this.socket.on('disconnect', () => {
      console.log('disconnected');
    })


    this.socket.on('chat message', (data) => this.onSocketDataChatMessage(data));
  }
  log = ["test"]
  onSocketDataChatMessage(data) {
    console.error(data);
  }

  data: any[] = Const.data.reverse();
  dataDisplay: any[] = []
  base: any[] = Const.of;

  search = '';
  getItemWithName(name: string, self) {
    if (name.includes('Recipe')) {
      return {
        name: 'Recipe',//`Recipe - ${self.name}`,
        of: self.of,
        img: self.img
      }
    }
    for (var i = 0; i < this.data.length; i++) {
      var item: any = this.data[i];
      item.name = item.name.replace('  ', ' ');
      name = name.replace('  ', ' ');
      if (name == item.name || name.includes(item.name) || item.name.includes(name)) return item;
    }
    // console.log(name)
    return null;
  }
  getOfObjectWithName(item) {
    let ofName: string = item.of;
    if (ofName == 'Recipe') {
      return item;
    }
    for (var i = 0; i < this.base.length; i++) {
      var baseItem: any = this.base[i];
      if (ofName.toLowerCase() == baseItem.name.toLowerCase() || ofName.toLowerCase().includes(baseItem.name.toLowerCase()) || baseItem.name.toLowerCase().includes(ofName.toLowerCase())) return baseItem;
    }
  }

  COMPUTER = "DESKTOP-93C0J9U";

  initFirebase() {
    var config = {
      apiKey: "AIzaSyAxHtLArlYkXIFI2PStYIqEsHZJ7qa6hNg",
      authDomain: "dota-item.firebaseapp.com",
      databaseURL: "https://dota-item.firebaseio.com",
      projectId: "dota-item",
      storageBucket: "dota-item.appspot.com",
      messagingSenderId: "434749815159",
      appId: "1:434749815159:web:e6ea59c6b7f5a245508972",
      measurementId: "G-S92E5G11KR"
    };
    firebase.initializeApp(config);

    var commentsRef = firebase.database().ref(`dota/${this.COMPUTER}/`);

    commentsRef.on('child_added', (data) => {
      console.log(data.key, data.val())
      this.search = data.val();
      this.onChangeSearch();
    });

    // var commentsRef = firebase.database().ref(`dota/${this.COMPUTER}/`);
    // commentsRef.once('value', function (snapshot) {
    //   snapshot.forEach(function (childSnapshot) {
    //     var childKey = childSnapshot.key;
    //     var childData = childSnapshot.val();
    //     console.log(childKey, childData)

    //   });
    // });

  }
  ngOnInit(): void {
    this.initFirebase();
    // this.initSocket();

    for (var i = 0; i < this.base.length; i++) {
      this.base[i].img = `assets/${this.base[i].img}`
    }
    for (var i = 0; i < this.data.length; i++) {
      var item: any = this.data[i];
      item.ofObj = this.getOfObjectWithName(item);
    }

    for (var i = 0; i < this.data.length; i++) {
      var item: any = this.data[i];
      if (item.Requires) {

        var requires = item.Requires.split(',');
        requires = requires.map(req => req.trim());
        var list = []
        requires.forEach(requireItem => {
          var a = this.getItemWithName(requireItem, item);
          if (a) {
            list.push(a);
          } else {
            console.error(requireItem);
            list.push({
              name: requireItem
            })
            // console.error(item);
          }
        });

        item.requiresObjectList = list;
        if (item.name.includes('Null Talisma'))
          console.log(item.requiresObjectList)
        // item.RequiresList = item.Requires.split(',').map(req => req.trim());
      }

      if (item.buy_sell) {
        var buy_sell = item.buy_sell + '';
        //Buy 900 Sell 450
        buy_sell = buy_sell.replace('Buy ', '')
        var Buy = parseInt(buy_sell.substring(0, buy_sell.indexOf(' Sell')))

        var Sell = parseInt(buy_sell.substring(buy_sell.indexOf('Sell') + 4, buy_sell.length));
        // console.log(Buy, Sell)
        item.Buy = Buy;
        item.Sell = Sell;
      }
    }
    this.dataDisplay = this.data;
    // this.dataDisplay = this.dataDisplay.sort((a: any, b: any) => {
    //   return a.Buy - b.Buy
    // })
  }

  onChangeSearch() {

    this.dataDisplay = this.data.filter(item => {
      if (item.name.toLowerCase().includes(this.search.toLowerCase())) return item
    })
  }
}
