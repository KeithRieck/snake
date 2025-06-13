from bedlam import Game
from bedlam import GameObject
from bedlam import Scene
from bedlam import Sprite

# __pragma__('skip')
document = window = Math = Date = console = 0  # Prevent complaints by optional static checker

# __pragma__('noskip')
# __pragma__('noalias', 'clear')

BOARD_SIZE = 16
CELL_SIZE = 28
BOARD_MARGIN_LEFT = 50
BOARD_MARGIN_TOP = 5
SNAKE_TIME_STEP = 300
SNAKE_TIME_STEP_MIN = 150
GAME_BEGIN = "GAME_BEGIN"
GAME_RUNNING = "GAME_RUNNING"
GAME_OVER = "GAME_OVER"
UP = "UP"
DOWN = "DOWN"
LEFT = "LEFT"
RIGHT = "RIGHT"
DEBUG = False
COLOR_TIME = 1500
COLOR_APPLE = ['#ff0000', '#ff3333', '#ff6666', '#ff9999', '#ffcccc', '#ffffff']
SCORE_TIME = 3000
COLOR_SCORE = ['#ffffff', '#cccccc', '#999999', '#666666', '#333333', '#000000']


class Apple(GameObject):
    def __init__(self, game, cx, cy):
        GameObject.__init__(self, game)
        self.cell_x = cx
        self.cell_y = cy

    def update(self, delta_time: float):
        GameObject.update(self, delta_time)

    def draw(self, ctx):
        GameObject.draw(self, ctx)
        Sprite.draw(self, ctx)
        ctx.save()
        # ctx.globalCompositeOperation = 'source-over'
        ctx.strokeStyle = 'red'
        ctx.fillStyle = COLOR_APPLE[0]
        ctx.lineWidth = COLOR_APPLE[0]
        ctx.beginPath()
        radius = (CELL_SIZE - 4) // 2
        apple_x = self.cell_x * CELL_SIZE + BOARD_MARGIN_LEFT + CELL_SIZE // 2
        apple_y = self.cell_y * CELL_SIZE + BOARD_MARGIN_TOP + CELL_SIZE // 2
        ctx.arc(apple_x, apple_y, radius, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
        ctx.restore()


class Snake(GameObject):
    def __init__(self, game):
        GameObject.__init__(self, game)
        self.segments = []
        self.time_used = 0

    def append(self, snakesegment):
        if len(self.segments) > 0:
            snakesegment.prev_seg = self.segments[len(self.segments) - 1]
        self.segments.append(snakesegment)

    def reset(self):
        cx = 2
        cy = BOARD_SIZE // 2
        self.segments = []
        self.append(SnakeSegment(self.game, cx, cy, RIGHT))
        self.append(SnakeSegment(self.game, cx - 1, cy, RIGHT))
        for snakesegment in self.segments:
            snakesegment.scene = self.scene
            snakesegment.reset()

    def set_direction(self, dr):
        snakesegment = self.segments[0]
        if not self.opposite(snakesegment.direction, dr):
            snakesegment.set_direction(dr)

    def opposite(self, d1, d2):
        return (d1 == LEFT and d2 == RIGHT) or (d1 == RIGHT and d2 == LEFT) \
               or (d1 == UP and d2 == DOWN) or (d1 == DOWN and d2 == UP)

    def update(self, delta_time: float):
        global SNAKE_TIME_STEP
        GameObject.update(self, delta_time)
        if self.scene.mode == GAME_RUNNING:
            self.time_used = self.time_used + delta_time
            while self.time_used > SNAKE_TIME_STEP:
                self.time_used = self.time_used - SNAKE_TIME_STEP
                self.move_at_cell()
                SNAKE_TIME_STEP = Math.max(SNAKE_TIME_STEP_MIN, SNAKE_TIME_STEP-1)
            for snakesegment in self.segments:
                snakesegment.update(delta_time)

    def move_at_cell(self):
        for snakesegment in self.segments:
            if snakesegment.prev_seg is not None:
                snakesegment.next_direction = snakesegment.prev_seg.direction
        for snakesegment in self.segments:
            snakesegment.move_at_cell()
        seg = self.segments[0]
        nx, ny = seg.next_cell(seg.cell_x, seg.cell_y, seg.direction)
        for apple in self.scene.apples:
            if apple.cell_x == nx and apple.cell_y == ny:
                self.eat_apple(apple)
                break

    def draw(self, ctx):
        GameObject.draw(self, ctx)
        for snakesegment in self.segments:
            snakesegment.draw(ctx)

    def eat_apple(self, apple):
        global DEBUG
        seg = self.segments[0]
        snakesegment = SnakeSegment(self.game, apple.cell_x, apple.cell_y)
        snakesegment.scene = self.scene
        snakesegment.color_time = COLOR_TIME
        seg.prev_seg = snakesegment
        snakesegment.set_cell(apple.cell_x, apple.cell_y, seg.direction)
        self.scene.apples.remove(apple)
        self.scene.remove(apple)
        self.segments.insert(0, snakesegment)
        nx, ny = snakesegment.next_cell(snakesegment.cell_x, snakesegment.cell_y, snakesegment.direction)
        self.scene.sound_eat_apple.play()
        if nx < 0 or nx > BOARD_SIZE - 1 or ny < 0 or ny > BOARD_SIZE - 1:
            self.scene.collision()
            if DEBUG:
                console.log("Collision with wall at " + nx + "," + ny)
        if len(self.scene.apples) == 0 and self.scene.mode == GAME_RUNNING:
            self.schedule(self.scene.add_apple, 1000)
        self.scene.score.inc()


class SnakeSegment(GameObject):
    def __init__(self, game, cx, cy, dr=RIGHT):
        GameObject.__init__(self, game)
        self.cell_x = cx
        self.cell_y = cy
        self.start_x = cx
        self.start_y = cy
        self.start_dir = dr
        self.x = 0
        self.y = 0
        self.direction = dr
        self.next_direction = dr
        self.prev_seg = None
        self.color_time = 0

    def set_direction(self, dr):
        self.next_direction = dr
        if self.scene.mode == GAME_BEGIN:
            self.scene.mode = GAME_RUNNING
            self.direction = dr

    def set_cell(self, cx, cy, dr=None):
        self.cell_x = cx
        self.cell_y = cy
        self.x = self.cell_x * CELL_SIZE
        self.y = self.cell_y * CELL_SIZE
        if dr is not None:
            self.direction = dr
            self.next_direction = dr

    def reset(self):
        self.set_cell(self.start_x, self.start_y, self.start_dir)

    def update(self, delta_time: float):
        GameObject.update(self, delta_time)
        if self.scene.mode == GAME_RUNNING:
            dist = Math.round(delta_time * (CELL_SIZE / SNAKE_TIME_STEP))
            if self.direction == LEFT:
                self.x = self.x - dist
            elif self.direction == RIGHT:
                self.x = self.x + dist
            elif self.direction == UP:
                self.y = self.y - dist
            elif self.direction == DOWN:
                self.y = self.y + dist
            self.color_time = Math.max(0, self.color_time - delta_time)

    def move_at_cell(self):
        global DEBUG
        collision = False
        cx = self.cell_x
        cy = self.cell_y
        if self.direction == LEFT and self.cell_x <= 1:
            cx = 0
            if self.next_direction == self.direction:
                collision = True
            else:
                self.direction = self.next_direction
        elif self.direction == RIGHT and self.cell_x >= (BOARD_SIZE - 2):
            cx = BOARD_SIZE - 1
            if self.next_direction == self.direction:
                collision = True
            else:
                self.direction = self.next_direction
        elif self.direction == UP and self.cell_y <= 1:
            cy = 0
            if self.next_direction == self.direction:
                collision = True
            else:
                self.direction = self.next_direction
        elif self.direction == DOWN and self.cell_y >= (BOARD_SIZE - 2):
            cy = BOARD_SIZE - 1
            if self.next_direction == self.direction:
                collision = True
            else:
                self.direction = self.next_direction
        else:
            cx, cy = self.next_cell(self.cell_x, self.cell_y, self.direction)
        if DEBUG and collision:
            console.log("collision with wall at " + cx + "," + cy)
        if self.prev_seg is None:
            nx, ny = self.next_cell(cx, cy, self.next_direction)
            for seg in self.scene.snake.segments:
                if self != seg and seg.cell_x == nx and seg.cell_y == ny:
                    collision = True
                    if (DEBUG):
                        console.log("collision with snake at " + nx + "," + ny)
        if DEBUG:
            console.log(self.cell_x + ", " + self.cell_y + "    : " + self.direction + "  : " + self.scene.mode)
        if collision:
            self.scene.collision()
        else:
            self.set_cell(cx, cy, self.next_direction)

    def next_cell(self, cx, cy, dr):
        nx, ny = cx, cy
        if dr == LEFT:
            nx = nx - 1
        elif dr == RIGHT:
            nx = nx + 1
        elif dr == UP:
            ny = ny - 1
        elif dr == DOWN:
            ny = ny + 1
        return nx, ny

    def draw(self, ctx):
        GameObject.draw(self, ctx)
        Sprite.draw(self, ctx)
        ctx.save()
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 3
        ctx.beginPath()
        radius = (CELL_SIZE - 4) // 2
        snake_x = self.x + BOARD_MARGIN_LEFT + CELL_SIZE // 2
        snake_y = self.y + BOARD_MARGIN_TOP + CELL_SIZE // 2
        if self.color_time > 0:
            t = Math.floor(len(COLOR_APPLE) * (COLOR_TIME - self.color_time) / COLOR_TIME)
            ctx.fillStyle = COLOR_APPLE[t]
            ctx.arc(snake_x, snake_y, radius, 0, 2 * Math.PI)
            ctx.fill()
            ctx.stroke()
        else:
            ctx.arc(snake_x, snake_y, radius, 0, 2 * Math.PI)
            ctx.stroke()
        ctx.restore()


class SnakeScene(Scene):
    def __init__(self, game, name):
        Scene.__init__(self, game, name)
        self.sound_add_apple = None
        self.mode = GAME_BEGIN
        self.snake = Snake(game)
        self.append(self.snake)
        self.apples = []
        self.add_apple(BOARD_SIZE - 3, BOARD_SIZE // 2)
        self.reset_board()
        self.sound_add_apple = self.game.load_audio('add_apple')
        self.sound_collision = self.game.load_audio('collision')
        self.sound_eat_apple = self.game.load_audio('eat_apple')
        self.score = Score(game)
        self.append(self.score)

    def reset_board(self):
        self.mode = GAME_BEGIN
        self.snake.reset()

    def add_apple(self, cx=None, cy=None):
        while cx is None:
            xx = Math.floor(Math.random() * BOARD_SIZE)
            yy = Math.floor(Math.random() * BOARD_SIZE)
            if not self._occupied(xx, yy) and not self._bad(xx, yy):
                cx = xx
                cy = yy
        apple = Apple(self.game, cx, cy)
        self.apples.append(apple)
        self.append(apple)
        if self.sound_add_apple is not None:
            self.sound_add_apple.play()

    def _occupied(self, cx, cy):
        for apple in self.apples:
            if apple.cell_x == cx and apple.cell_y == cy:
                return True
        for snakesegment in self.snake.segments:
            if snakesegment.cell_x == cx and snakesegment.cell_y == cy:
                return True
        return False

    def _bad(self, cx, cy):
        return (cx <= 0 or cx >= BOARD_SIZE - 1) and (cy <= 0 or cy >= BOARD_SIZE - 1)

    def _set_direction(self, d):
        self.snake.set_direction(d)

    def handle_keydown(self, event):
        Scene.handle_keydown(self, event)
        if event.key == 'a' or event.key == 'ArrowLeft':
            self._set_direction(LEFT)
        elif event.key == 'd' or event.key == 'ArrowRight':
            self._set_direction(RIGHT)
        elif event.key == 'w' or event.key == 'ArrowUp':
            self._set_direction(UP)
        elif event.key == 's' or event.key == 'ArrowDown':
            self._set_direction(DOWN)
    
    def handle_gamepad(self, gp):
        Scene.handle_gamepad(self, gp)
        if self.is_button_pressed(gp, 14) or self.is_button_pressed(gp, 2):
            self._set_direction(LEFT)
        elif self.is_button_pressed(gp, 15) or self.is_button_pressed(gp, 3):
            self._set_direction(RIGHT)
        elif self.is_button_pressed(gp, 12) or self.is_button_pressed(gp, 0):
            self._set_direction(UP)
        elif self.is_button_pressed(gp, 13) or self.is_button_pressed(gp, 1):
            self._set_direction(DOWN)

    def collision(self):
        self.sound_collision.play()
        self.mode = GAME_OVER
        self.score.start_fade(True)

    def update(self, delta_time: float):
        Scene.update(self, delta_time)
        pass

    def draw(self, ctx):
        global DEBUG
        Scene.draw(self, ctx)
        ctx.save()
        ctx.globalCompositeOperation = 'source-over'
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 2
        ctx.beginPath()
        board_width = BOARD_SIZE * CELL_SIZE
        ctx.rect(BOARD_MARGIN_LEFT, BOARD_MARGIN_TOP, board_width, board_width)
        ctx.stroke()
        if DEBUG:
            ctx.strokeStyle = '#CCCCCC'
            ctx.lineWidth = 1
            ctx.beginPath()
            for n in range(1, BOARD_SIZE):
                ctx.moveTo(BOARD_MARGIN_LEFT, BOARD_MARGIN_TOP + n * CELL_SIZE)
                ctx.lineTo(BOARD_MARGIN_LEFT + board_width, BOARD_MARGIN_TOP + n * CELL_SIZE)
                ctx.moveTo(BOARD_MARGIN_LEFT + n * CELL_SIZE, BOARD_MARGIN_TOP)
                ctx.lineTo(BOARD_MARGIN_LEFT + n * CELL_SIZE, BOARD_MARGIN_TOP + board_width)
            ctx.stroke()
        ctx.restore()


class Score(GameObject):
    def __init__(self, game):
        GameObject.__init__(self, game)
        self.score = 2
        self.font = '18pt sans-serif'
        self.fade_mode = 'blank'
        self.fade_time = 0
        self.color = COLOR_SCORE[0]
        self.left_side = True
    
    def inc(self):
        global DEBUG
        self.score = self.score + 1
        if self.score % 5 == 0:
            self.start_fade()
    
    def start_fade(self, game_over=False):
        self.fade_mode = 'fade-in'
        self.fade_time = 0
        self.color = COLOR_SCORE[0]
        if game_over:
            self.xx = 15
            self.yy = 30
        else:
            self.left_side = not self.left_side
            self.xx = 15 if self.left_side else (BOARD_SIZE + 2) * CELL_SIZE
            self.yy = Math.floor(Math.random() * (BOARD_SIZE - 2)) * CELL_SIZE + CELL_SIZE
    
    def update(self, delta_time: float):
        GameObject.update(self, delta_time)
        if self.fade_mode == 'fade-in':
            self.fade_time += delta_time
            t = Math.floor(len(COLOR_SCORE) * self.fade_time / SCORE_TIME)
            if t < len(COLOR_SCORE):
                self.color = COLOR_SCORE[t]
            else:
                self.fade_mode = 'fade-out'
        elif self.fade_mode == 'fade-out' and self.scene.mode != GAME_OVER:
            self.fade_time -= delta_time
            t = Math.floor(len(COLOR_SCORE) * self.fade_time / SCORE_TIME)
            if t > 0:
                self.color = COLOR_SCORE[t]
            else:
                self.fade_mode = 'blank'
                self.fade_time = 0
                self.color = COLOR_SCORE[0]

    
    def draw(self, ctx):
        GameObject.draw(self, ctx)
        ctx.save()
        ctx.globalCompositeOperation = 'source-over'
        ctx.font = self.font
        ctx.fillStyle = self.color
        ctx.fillText('{}'.format(self.score), self.xx, self.yy)
        ctx.restore()


class SnakeGame(Game):
    def __init__(self, loop_time=20):
        Game.__init__(self, 'Snake', loop_time)
        self.append(SnakeScene(self, 'MAIN'))

    @staticmethod 
    def set_debug(b):
        global DEBUG, SNAKE_TIME_STEP
        if b is not None and b == 'true':
            DEBUG = True
            SNAKE_TIME_STEP = SNAKE_TIME_STEP * 2
