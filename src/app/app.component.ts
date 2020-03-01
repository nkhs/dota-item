import { Component, OnInit } from '@angular/core';
import { Const } from './data';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {


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
  ngOnInit(): void {
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
