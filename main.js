new Vue({
  el: "#app",
  data: {
    url: "https://1.bp.blogspot.com/-5S8rmtezagQ/UnyHakT62TI/AAAAAAAAajc/TsAKmkq0wIE/s800/nihonchizu_area.png",
    height: 10,
    width: 20,
    font_color: "black",
    font_size: 10,
    selected: null,
    is_edit: true,
    items: [
      {
        id: 1,
        name: "要素1(黄色)",
        url: "url1",
        coordinate: { x: 0, y: 0 },
        stroke: "rgb(0, 255, 0)",
      },
      {
        id: 2,
        name: "要素2(赤)",
        url: "url2",
        coordinate: { x: 300, y: 300 },
        stroke: "rgb(255, 0, 0)",
      },
    ],
    prev_pos: {  // previous coordinate
      x: 0,
      y: 0,
    },
    is_moving: false,  // moving
  },
  methods: {
    select_item: function (id) {
      this.selected = id;
    },
    unselect_item: function (id) {
      if (!this.is_moving) {
        this.selected = null;
      }
    },
    move_start: function (e) {
      // initialize moving
      if (this.is_edit) {
        this.is_moving = true;
        this.prev_pos.x = e.offsetX;
        this.prev_pos.y = e.offsetY;

        console.log("start: [%d, %d]", e.offsetX, e.offsetY);
      }
    },
    move: function (e) {
      if (this.is_edit) {
        if (this.is_moving) {
          // calc diff between current and previous
          const diff_x = e.offsetX - this.prev_pos.x;
          const diff_y = e.offsetY - this.prev_pos.y;

          // move items
          for (let item of this.items) {
            if (item.id == this.selected) {
              item.coordinate.x += diff_x;
              item.coordinate.y += diff_y;
            }
          }
          // 前回のクリック座標を更新
          this.prev_pos.x = e.offsetX;
          this.prev_pos.y = e.offsetY;
        }
      }
    },
    move_end: function (e) {
      if (this.is_edit) {
        this.is_moving = false;
        console.log("end:   [%d, %d]", this.prev_pos.x, this.prev_pos.y);
      }
    },
    save: function () {
      for (let item of this.items) {
        console.log(item.name);
        console.log(item.coordinate);
      }
    }
  }
});