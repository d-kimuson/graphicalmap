new Vue({
  el: "#app",
  data: {
    url: "https://1.bp.blogspot.com/-5S8rmtezagQ/UnyHakT62TI/AAAAAAAAajc/TsAKmkq0wIE/s800/nihonchizu_area.png",  // map url
    vh_rate: 1.0,  // (vertical / horizon)
    size: 500,
    rx: 0.1,
    ry: 0.1,
    font_color: "black",
    selected: null,
    is_edit: true,
    items: [],
    bef_items: [],  // for map size changing
    prev_pos: {  // previous coordinate
      x: 0,
      y: 0,
    },
    is_moving: false,  // moving
    saved_data: "",
  },
  mounted: function () {
    // setup data from data.json file
    const req = new XMLHttpRequest();
    req.open("GET", "data.json", false);
    req.send(null);
    var data = JSON.parse(req.responseText);
    this.load(data.items);
    this.save();
  },
  computed: {
    width () { return this.size * this.vh_rate },  // map width
    height () { return this.size },  // map height
    item_width () { return this.size / 25 },  // item width
    item_height () { return this.size / 50 },  // item height
    font_size () { return this.size / 50 },
  },
  methods: {
    // Slider for changing map size
    slide_start: function () {
      this.bef_items = [];
      for (let i = 0; i <= this.items.length; i += 1) {
        this.bef_items.push({
          x: this.items[i].coordinate.x / this.width,
          y: this.items[i].coordinate.y / this.height
        })
      }
    },
    slide_end: function () {
      for (let i = 0; i <= this.items.length; i += 1) {
        this.items[i].coordinate = {
          x: this.bef_items[i].x * this.width,
          y: this.bef_items[i].y * this.height
        }
      }
    },
    // selector for moving item
    select_item: function (id) {
      this.selected = id;
    },
    unselect_item: function (id) {
      if (!this.is_moving) {
        this.selected = null;
      }
    },
    // funcs for moving item
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
          // update position
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
    // update map from saved_data(json string)
    load_from_data: function () {
      let data = JSON.parse(this.saved_data);
      this.load(data.items);
    },
    // update map from item objects
    load: function (items) {
      this.items = items;
      for (let item of this.items) {
        item.coordinate.x = item.coordinate.x * this.width;
        item.coordinate.y = item.coordinate.y * this.height;
        item.stroke = `rgb(${item.rgb[0]}, ${item.rgb[1]}, ${item.rgb[2]})`;
      };
    },
    init: function () {
      for (let item of this.items) {
        item.coordinate.x = 0;
        item.coordinate.y = 0;
      }
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
          coordinate: {
            x: item.coordinate.x / this.width,
            y: item.coordinate.y / this.height
          },
          rgb: item.rgb,
        })
      }

      this.saved_data = JSON.stringify(data);
    }
  }
});
