
EMPTY = 0
BODY = 1
HEAD = 2
FOOD = 3

UP = 0
RIGHT = 1
DOWN = 2
LEFT = 3

INIT_SNAKE_LENGTH = 9

MARGIN = 10

class Snake

  cell_size: 15
  snake_length: INIT_SNAKE_LENGTH
  x: 11
  y: 20
  direction: LEFT
  filled_ratio: 0.9

  constructor: ->
    canvas = document.getElementById('my-canvas');
    @context = canvas.getContext('2d');
    @food_position = [0,1]
    @snake = @create_snake()
    @draw_board()
    @play()
    window.onkeydown = (key) =>
      switch key.keyCode
        when 37
          unless @snake[0][0] == @snake[1][0] and @snake[0][1] == (@snake[1][1] + 1) % @y
            @direction = LEFT
          return false
        when 38
          unless @snake[0][1] == @snake[1][1] and @snake[0][0] == (@snake[1][0] + 1) % @x
            @direction = UP
          return false
        when 39
          unless (@snake[0][0] == @snake[1][0] and (@snake[0][1] + 1) % @y == @snake[1][1])
            @direction = RIGHT
          return false
        when 40
          unless @snake[0][1] == @snake[1][1] and (@snake[0][0] + 1) % @x == @snake[1][0]
            @direction = DOWN
          return false

  play: =>
    if @make_move()
      setTimeout(@play, 100)

  make_move: =>
    popped = @snake.pop()
    switch @direction
      when LEFT then new_position = [@snake[0][0], @snake[0][1] - 1]
      when RIGHT then new_position = [@snake[0][0], @snake[0][1] + 1]
      when UP then new_position = [@snake[0][0] - 1, @snake[0][1]]
      when DOWN then new_position = [@snake[0][0] + 1, @snake[0][1]]
    new_position[1] = (@y - 1) if new_position[1] < 0
    new_position[1] = 0 if new_position[1] > (@y - 1)
    new_position[0] = (@x - 1) if new_position[0] < 0
    new_position[0] = 0 if new_position[0] > (@x - 1)
    if @conflicted_position(new_position[0], new_position[1])
      @draw_game_over()
      return false
    place_food = false
    if new_position[0] == @food_position[0] and new_position[1] == @food_position[1]
      @snake.push(popped)
      place_food = true
    @snake.unshift(new_position)
    @place_food() if place_food
    @draw_board()
    return true

  place_food: =>
    @food_position[0] = Math.floor(Math.random() * @x)
    @food_position[1] = Math.floor(Math.random() * @y)
    @place_food() if @conflicted_position(@food_position[0], @food_position[1])


  conflicted_position: (x, y) =>
    for s in @snake
      return true if s[0] == x and s[1] == y
    return false

  draw_score: =>
    @draw_text("#{@snake.length - INIT_SNAKE_LENGTH}")

  draw_text: (text) =>
    @context.fillStyle = "#6b5804"
    size = MARGIN * 2
    @context.font = "#{size}px monospace"
    half = (@context.measureText(text).width / 2)
    @context.fillText(text, ((@cell_size * @y + 2 * MARGIN) / 2) - half, @cell_size * @x + 3 * MARGIN)

  draw_game_over: =>
    text = "GAME OVER"
    @context.fillStyle = "#6b5804"
    @context.strokeStyle = "#6b5804"
    size = @cell_size * 2
    @context.font = "#{size}px monospace"
    half = (@context.measureText(text).width / 2)
    @context.strokeStyle = '#b6bf00'
    @context.strokeText(text, ((@cell_size * @y + 2 * MARGIN) / 2) - half, (@cell_size * @x) / 2 + MARGIN)
    @context.fillText(text, ((@cell_size * @y + 2 * MARGIN) / 2) - half, (@cell_size * @x) / 2 + MARGIN)

  draw_board: =>
    @context.fillStyle = '#b6bf00'
    @context.fillRect(0, 0, @cell_size * @y + 2 * MARGIN, @cell_size * @x + 4 * MARGIN)
    @draw_food()
    @context.strokeStyle = "#6b5804"
    outer_margin = 2
    @context.lineWidth = outer_margin
    @context.strokeRect(MARGIN - outer_margin, MARGIN - outer_margin,  @cell_size * @y + 2 * outer_margin - 0.25 * @cell_size, @cell_size * @x + 2 * outer_margin  - 0.25 * @cell_size)
    @draw_score()
    for i in [0..(@snake.length - 1)]
      @context.fillStyle = '#6b5804'
      map = [[1,1,1,0], [1,1,1,0], [1,1,1,0], [0,0,0,0]]
      snake = @snake[i]
      neighbours = []
      neighbours.push(@snake[i - 1]) if @snake[i - 1]
      neighbours.push(@snake[i + 1]) if @snake[i + 1]
      for n in neighbours
        if snake[1] == n[1] and snake[0] + 1 == n[0]
          map[0][3] = 1
          map[1][3] = 1
          map[2][3] = 1
        if snake[0] == n[0] and snake[1] + 1 == n[1]
          map[3][0] = 1
          map[3][1] = 1
          map[3][2] = 1
      @draw_element(@snake[i][1], @snake[i][0] , map)

  draw_food: =>
    @context.fillStyle = "#6b5804"
    @draw_element(@food_position[1], @food_position[0], [[0,1,0,0], [1,0,1,0], [0,1,0,0], [0,0,0,0]])

  draw_element: (x, y, fills) =>
    filled_ratio = @filled_ratio
    @context.fillStyle = "#6b5804"
    for i in [0..(fills.length - 1)]
      for j in [0..(fills[0].length - 1)]
        if fills[i][j] == 1
          s_x = (x * @cell_size + i * filled_ratio * 0.25 * @cell_size + (1 - filled_ratio) * 0.25 * (i + 0.5) * @cell_size)
          s_y = (y * @cell_size + j * filled_ratio * 0.25 * @cell_size + (1 - filled_ratio) * 0.25 * (j + 0.5) * @cell_size)
          width = (@cell_size * filled_ratio * 0.25)
          @context.fillRect( MARGIN + s_x, MARGIN + s_y, width, width)

  draw_food_old: =>
    @context.fillStyle = "#6b5804"
    @context.beginPath();
    @context.arc(@food_position[1] * @cell_size + @cell_size / 2, @food_position[0] * @cell_size + @cell_size / 2, @cell_size / 2, 0, Math.PI*1, true); 
    @context.closePath();
    @context.fill();

  create_snake: =>
    ret = []
    central_line = Math.floor(@x / 2)
    central_row = Math.floor((@y - @snake_length) / 2)
    for i in [(central_row)..(central_row + @snake_length - 1)]
      a = [central_line, i]
      a = (
        x: central_line
        y: i
      )
      ret.push([central_line, i])
    return ret

  create_board: (x, y, snake_length) =>
    ret = []
    for i in [0..(x - 1)]
      line = []
      for j in [0..(y - 1)]
        line.push(EMPTY)
      ret.push(line)
    central_line = Math.floor(x / 2)
    central_row = Math.floor((y - snake_length) / 2)
    ret[central_line][central_row] = HEAD
    for i in [(central_row + 1)..(central_row + snake_length - 1)]
      ret[central_line][i] = BODY
    return ret

