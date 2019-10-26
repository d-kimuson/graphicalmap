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
    ],
    prev_pos: {  // previous coordinate
      x: 0,
      y: 0,
    },
    is_moving: false,  // moving
    saved_data: "",
  },
  mounted: function () {
    const req = new XMLHttpRequest();
    req.open("GET", "data.json", false);
    req.send(null);
    var data = JSON.parse(req.responseText);
    this.load(data.items);
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
    load_from_data: function () {
      let data = JSON.parse(this.saved_data);
      this.load(data.items);
    },
    load: function (items) {
      this.items = items;
      for (let item of this.items) {
        item.stroke = `rgb(${item.rgb[0]}, ${item.rgb[1]}, ${item.rgb[2]})`;
      };
    },
    save: function () {
      let data = {
        items: []
      }
      for (let item of this.items) {
        data.items.push({
          id: item.id,
          name: item.name,
          url: item.url,
          coordinate: item.coordinate,
          rgb: item.rgb,
        })
      }

      this.saved_data = JSON.stringify(data);
    }
  }
});