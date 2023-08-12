function AnimeQ(int) {
  this.intv = parseInt(int, 10) || 10;
  this.queue = [];
}

AnimeQ.prototype.addToQueue = function (item) {
  item.animating = true;
  this.queue.push(item);
  // If this is the first/only item, start queue
  if (this.queue.length == 1) {
    this.startQueue();
  }
};

AnimeQ.prototype.removeFromQueue = function (item) {
  var index = this.queue.indexOf(item);
  return this.queue.splice(index, 1);
};

AnimeQ.prototype.startQueue = function () {
  var inst = this;
  this.timer = window.setInterval(function () {
    inst.processQueue();
  }, this.intv);
};

AnimeQ.prototype.stopQueue = function () {
  window.clearInterval(this.timer);
  this.timer = null;
};

AnimeQ.prototype.processQueue = function () {
  for (var ind in this.queue) {
    var item = this.queue[ind];
    for (var attr in item.endProps) {
      // Check if the steps are done, if so render final position
      if (item.step >= item.steps) {
        item.elm.style[attr] = item.endProps[attr];
        item.animating = false;
      } else {
        var newPos = item.begProps[attr] + item.step * item.modify[attr];
        item.elm.style[attr] = newPos + 'px';
      }
      if (item.animating) {
        item.step++;
      } else {
        this.removeFromQueue(item);
      }
    }
  }
};

AnimeQ.prototype.animate = function (itemElm, props, time) {
  var item = {};
  item.elm = itemElm;
  item.step = 1;
  item.steps = parseInt(time / this.intv, 10);
  item.endProps = {};
  item.begProps = {};
  item.modify = {};

  var style = window.getComputedStyle(item.elm, null);
  for (var attr in props) {
    item.endProps[attr] = props[attr];
    item.begProps[attr] = parseInt(style[attr], 10);
    item.modify[attr] =
      (parseInt(props[attr], 10) - item.begProps[attr]) / item.steps;
    item.elm.style[attr] = style[attr];
  }
  this.addToQueue(item);
};

const anime = new AnimeQ();

anime.animate(document.getElementById('one'), { left: 400, top: 0 }, 2000);
anime.animate(document.getElementById('two'), { left: 600, top: 0 }, 2000);
anime.animate(document.getElementById('three'), { left: 800, top: 0 }, 2000);
