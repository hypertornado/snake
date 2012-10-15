var BODY, DOWN, EMPTY, FOOD, HEAD, INIT_SNAKE_LENGTH, LEFT, MARGIN, RIGHT, Snake, UP,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

window.onload = function() {
  return new Snake();
};

EMPTY = 0;

BODY = 1;

HEAD = 2;

FOOD = 3;

UP = 0;

RIGHT = 1;

DOWN = 2;

LEFT = 3;

INIT_SNAKE_LENGTH = 9;

MARGIN = 10;

Snake = (function() {

  Snake.prototype.cell_size = 15;

  Snake.prototype.snake_length = INIT_SNAKE_LENGTH;

  Snake.prototype.x = 11;

  Snake.prototype.y = 20;

  Snake.prototype.direction = LEFT;

  Snake.prototype.filled_ratio = 0.9;

  function Snake() {
    this.create_board = __bind(this.create_board, this);
    this.create_snake = __bind(this.create_snake, this);
    this.draw_food_old = __bind(this.draw_food_old, this);
    this.draw_element = __bind(this.draw_element, this);
    this.draw_food = __bind(this.draw_food, this);
    this.draw_board = __bind(this.draw_board, this);
    this.draw_game_over = __bind(this.draw_game_over, this);
    this.draw_text = __bind(this.draw_text, this);
    this.draw_score = __bind(this.draw_score, this);
    this.conflicted_position = __bind(this.conflicted_position, this);
    this.place_food = __bind(this.place_food, this);
    this.make_move = __bind(this.make_move, this);
    this.play = __bind(this.play, this);
    var canvas,
      _this = this;
    canvas = document.getElementById('my-canvas');
    this.context = canvas.getContext('2d');
    this.food_position = [0, 1];
    this.snake = this.create_snake();
    this.draw_board();
    this.play();
    window.onkeydown = function(key) {
      switch (key.keyCode) {
        case 37:
          if (!(_this.snake[0][0] === _this.snake[1][0] && _this.snake[0][1] === (_this.snake[1][1] + 1) % _this.y)) {
            _this.direction = LEFT;
          }
          return false;
        case 38:
          if (!(_this.snake[0][1] === _this.snake[1][1] && _this.snake[0][0] === (_this.snake[1][0] + 1) % _this.x)) {
            _this.direction = UP;
          }
          return false;
        case 39:
          if (!(_this.snake[0][0] === _this.snake[1][0] && (_this.snake[0][1] + 1) % _this.y === _this.snake[1][1])) {
            _this.direction = RIGHT;
          }
          return false;
        case 40:
          if (!(_this.snake[0][1] === _this.snake[1][1] && (_this.snake[0][0] + 1) % _this.x === _this.snake[1][0])) {
            _this.direction = DOWN;
          }
          return false;
      }
    };
  }

  Snake.prototype.play = function() {
    if (this.make_move()) return setTimeout(this.play, 100);
  };

  Snake.prototype.make_move = function() {
    var new_position, place_food, popped;
    popped = this.snake.pop();
    switch (this.direction) {
      case LEFT:
        new_position = [this.snake[0][0], this.snake[0][1] - 1];
        break;
      case RIGHT:
        new_position = [this.snake[0][0], this.snake[0][1] + 1];
        break;
      case UP:
        new_position = [this.snake[0][0] - 1, this.snake[0][1]];
        break;
      case DOWN:
        new_position = [this.snake[0][0] + 1, this.snake[0][1]];
    }
    if (new_position[1] < 0) new_position[1] = this.y - 1;
    if (new_position[1] > (this.y - 1)) new_position[1] = 0;
    if (new_position[0] < 0) new_position[0] = this.x - 1;
    if (new_position[0] > (this.x - 1)) new_position[0] = 0;
    if (this.conflicted_position(new_position[0], new_position[1])) {
      this.draw_game_over();
      return false;
    }
    place_food = false;
    if (new_position[0] === this.food_position[0] && new_position[1] === this.food_position[1]) {
      this.snake.push(popped);
      place_food = true;
    }
    this.snake.unshift(new_position);
    if (place_food) this.place_food();
    this.draw_board();
    return true;
  };

  Snake.prototype.place_food = function() {
    this.food_position[0] = Math.floor(Math.random() * this.x);
    this.food_position[1] = Math.floor(Math.random() * this.y);
    if (this.conflicted_position(this.food_position[0], this.food_position[1])) {
      return this.place_food();
    }
  };

  Snake.prototype.conflicted_position = function(x, y) {
    var s, _i, _len, _ref;
    _ref = this.snake;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      s = _ref[_i];
      if (s[0] === x && s[1] === y) return true;
    }
    return false;
  };

  Snake.prototype.draw_score = function() {
    return this.draw_text("" + (this.snake.length - INIT_SNAKE_LENGTH));
  };

  Snake.prototype.draw_text = function(text) {
    var half, size;
    this.context.fillStyle = "#6b5804";
    size = MARGIN * 2;
    this.context.font = "" + size + "px monospace";
    half = this.context.measureText(text).width / 2;
    return this.context.fillText(text, ((this.cell_size * this.y + 2 * MARGIN) / 2) - half, this.cell_size * this.x + 3 * MARGIN);
  };

  Snake.prototype.draw_game_over = function() {
    var half, size, text;
    text = "GAME OVER";
    this.context.fillStyle = "#6b5804";
    this.context.strokeStyle = "#6b5804";
    size = this.cell_size * 2;
    this.context.font = "" + size + "px monospace";
    half = this.context.measureText(text).width / 2;
    this.context.strokeStyle = '#b6bf00';
    this.context.strokeText(text, ((this.cell_size * this.y + 2 * MARGIN) / 2) - half, (this.cell_size * this.x) / 2 + MARGIN);
    return this.context.fillText(text, ((this.cell_size * this.y + 2 * MARGIN) / 2) - half, (this.cell_size * this.x) / 2 + MARGIN);
  };

  Snake.prototype.draw_board = function() {
    var i, map, n, neighbours, outer_margin, snake, _i, _len, _ref, _results;
    this.context.fillStyle = '#b6bf00';
    this.context.fillRect(0, 0, this.cell_size * this.y + 2 * MARGIN, this.cell_size * this.x + 4 * MARGIN);
    this.draw_food();
    this.context.strokeStyle = "#6b5804";
    outer_margin = 2;
    this.context.lineWidth = outer_margin;
    this.context.strokeRect(MARGIN - outer_margin, MARGIN - outer_margin, this.cell_size * this.y + 2 * outer_margin - 0.25 * this.cell_size, this.cell_size * this.x + 2 * outer_margin - 0.25 * this.cell_size);
    this.draw_score();
    _results = [];
    for (i = 0, _ref = this.snake.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
      this.context.fillStyle = '#6b5804';
      map = [[1, 1, 1, 0], [1, 1, 1, 0], [1, 1, 1, 0], [0, 0, 0, 0]];
      snake = this.snake[i];
      neighbours = [];
      if (this.snake[i - 1]) neighbours.push(this.snake[i - 1]);
      if (this.snake[i + 1]) neighbours.push(this.snake[i + 1]);
      for (_i = 0, _len = neighbours.length; _i < _len; _i++) {
        n = neighbours[_i];
        if (snake[1] === n[1] && snake[0] + 1 === n[0]) {
          map[0][3] = 1;
          map[1][3] = 1;
          map[2][3] = 1;
        }
        if (snake[0] === n[0] && snake[1] + 1 === n[1]) {
          map[3][0] = 1;
          map[3][1] = 1;
          map[3][2] = 1;
        }
      }
      _results.push(this.draw_element(this.snake[i][1], this.snake[i][0], map));
    }
    return _results;
  };

  Snake.prototype.draw_food = function() {
    this.context.fillStyle = "#6b5804";
    return this.draw_element(this.food_position[1], this.food_position[0], [[0, 1, 0, 0], [1, 0, 1, 0], [0, 1, 0, 0], [0, 0, 0, 0]]);
  };

  Snake.prototype.draw_element = function(x, y, fills) {
    var filled_ratio, i, j, s_x, s_y, width, _ref, _results;
    filled_ratio = this.filled_ratio;
    this.context.fillStyle = "#6b5804";
    _results = [];
    for (i = 0, _ref = fills.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
      _results.push((function() {
        var _ref2, _results2;
        _results2 = [];
        for (j = 0, _ref2 = fills[0].length - 1; 0 <= _ref2 ? j <= _ref2 : j >= _ref2; 0 <= _ref2 ? j++ : j--) {
          if (fills[i][j] === 1) {
            s_x = x * this.cell_size + i * filled_ratio * 0.25 * this.cell_size + (1 - filled_ratio) * 0.25 * (i + 0.5) * this.cell_size;
            s_y = y * this.cell_size + j * filled_ratio * 0.25 * this.cell_size + (1 - filled_ratio) * 0.25 * (j + 0.5) * this.cell_size;
            width = this.cell_size * filled_ratio * 0.25;
            _results2.push(this.context.fillRect(MARGIN + s_x, MARGIN + s_y, width, width));
          } else {
            _results2.push(void 0);
          }
        }
        return _results2;
      }).call(this));
    }
    return _results;
  };

  Snake.prototype.draw_food_old = function() {
    this.context.fillStyle = "#6b5804";
    this.context.beginPath();
    this.context.arc(this.food_position[1] * this.cell_size + this.cell_size / 2, this.food_position[0] * this.cell_size + this.cell_size / 2, this.cell_size / 2, 0, Math.PI * 1, true);
    this.context.closePath();
    return this.context.fill();
  };

  Snake.prototype.create_snake = function() {
    var a, central_line, central_row, i, ret, _ref, _ref2;
    ret = [];
    central_line = Math.floor(this.x / 2);
    central_row = Math.floor((this.y - this.snake_length) / 2);
    for (i = _ref = central_row, _ref2 = central_row + this.snake_length - 1; _ref <= _ref2 ? i <= _ref2 : i >= _ref2; _ref <= _ref2 ? i++ : i--) {
      a = [central_line, i];
      a = {
        x: central_line,
        y: i
      };
      ret.push([central_line, i]);
    }
    return ret;
  };

  Snake.prototype.create_board = function(x, y, snake_length) {
    var central_line, central_row, i, j, line, ret, _ref, _ref2, _ref3, _ref4;
    ret = [];
    for (i = 0, _ref = x - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
      line = [];
      for (j = 0, _ref2 = y - 1; 0 <= _ref2 ? j <= _ref2 : j >= _ref2; 0 <= _ref2 ? j++ : j--) {
        line.push(EMPTY);
      }
      ret.push(line);
    }
    central_line = Math.floor(x / 2);
    central_row = Math.floor((y - snake_length) / 2);
    ret[central_line][central_row] = HEAD;
    for (i = _ref3 = central_row + 1, _ref4 = central_row + snake_length - 1; _ref3 <= _ref4 ? i <= _ref4 : i >= _ref4; _ref3 <= _ref4 ? i++ : i--) {
      ret[central_line][i] = BODY;
    }
    return ret;
  };

  return Snake;

})();
