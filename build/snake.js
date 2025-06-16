// Transcrypt'ed from Python, 2025-06-16 13:43:29
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {Sprite} from './bedlam.js';
import {Scene} from './bedlam.js';
import {GameObject} from './bedlam.js';
import {Game} from './bedlam.js';
var __name__ = '__main__';
export var BOARD_SIZE = 16;
export var CELL_SIZE = 28;
export var BOARD_MARGIN_LEFT = 50;
export var BOARD_MARGIN_TOP = 5;
export var SNAKE_TIME_STEP = 300;
export var SNAKE_TIME_STEP_MIN = 150;
export var GAME_BEGIN = 'GAME_BEGIN';
export var GAME_RUNNING = 'GAME_RUNNING';
export var GAME_OVER = 'GAME_OVER';
export var UP = 'UP';
export var DOWN = 'DOWN';
export var LEFT = 'LEFT';
export var RIGHT = 'RIGHT';
export var DEBUG = false;
export var COLOR_TIME = 1500;
export var COLOR_APPLE = ['#ff0000', '#ff3333', '#ff6666', '#ff9999', '#ffcccc', '#ffffff'];
export var SCORE_TIME = 3000;
export var COLOR_SCORE = ['#ffffff', '#cccccc', '#999999', '#666666', '#333333', '#000000'];
export var Apple =  __class__ ('Apple', [GameObject], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, game, cx, cy) {
		GameObject.__init__ (self, game);
		self.cell_x = cx;
		self.cell_y = cy;
	});},
	get py_update () {return __get__ (this, function (self, delta_time) {
		GameObject.py_update (self, delta_time);
	});},
	get draw () {return __get__ (this, function (self, ctx) {
		GameObject.draw (self, ctx);
		Sprite.draw (self, ctx);
		ctx.save ();
		ctx.strokeStyle = 'red';
		ctx.fillStyle = COLOR_APPLE [0];
		ctx.lineWidth = COLOR_APPLE [0];
		ctx.beginPath ();
		var radius = Math.floor ((CELL_SIZE - 4) / 2);
		var apple_x = (self.cell_x * CELL_SIZE + BOARD_MARGIN_LEFT) + Math.floor (CELL_SIZE / 2);
		var apple_y = (self.cell_y * CELL_SIZE + BOARD_MARGIN_TOP) + Math.floor (CELL_SIZE / 2);
		ctx.arc (apple_x, apple_y, radius, 0, 2 * Math.PI);
		ctx.fill ();
		ctx.stroke ();
		ctx.restore ();
	});}
});
export var Snake =  __class__ ('Snake', [GameObject], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, game) {
		GameObject.__init__ (self, game);
		self.segments = [];
		self.time_used = 0;
	});},
	get append () {return __get__ (this, function (self, snakesegment) {
		if (len (self.segments) > 0) {
			snakesegment.prev_seg = self.segments [len (self.segments) - 1];
		}
		self.segments.append (snakesegment);
	});},
	get reset () {return __get__ (this, function (self) {
		var cx = 2;
		var cy = Math.floor (BOARD_SIZE / 2);
		self.segments = [];
		self.append (SnakeSegment (self.game, cx, cy, RIGHT));
		self.append (SnakeSegment (self.game, cx - 1, cy, RIGHT));
		for (var snakesegment of self.segments) {
			snakesegment.scene = self.scene;
			snakesegment.reset ();
		}
	});},
	get set_direction () {return __get__ (this, function (self, dr) {
		var snakesegment = self.segments [0];
		if (!(self.opposite (snakesegment.direction, dr))) {
			snakesegment.set_direction (dr);
		}
	});},
	get opposite () {return __get__ (this, function (self, d1, d2) {
		return d1 == LEFT && d2 == RIGHT || d1 == RIGHT && d2 == LEFT || d1 == UP && d2 == DOWN || d1 == DOWN && d2 == UP;
	});},
	get py_update () {return __get__ (this, function (self, delta_time) {
		GameObject.py_update (self, delta_time);
		if (self.scene.mode == GAME_RUNNING) {
			self.time_used = self.time_used + delta_time;
			while (self.time_used > SNAKE_TIME_STEP) {
				self.time_used = self.time_used - SNAKE_TIME_STEP;
				self.move_at_cell ();
				SNAKE_TIME_STEP = Math.max (SNAKE_TIME_STEP_MIN, SNAKE_TIME_STEP - 1);
			}
			for (var snakesegment of self.segments) {
				snakesegment.py_update (delta_time);
			}
		}
	});},
	get move_at_cell () {return __get__ (this, function (self) {
		for (var snakesegment of self.segments) {
			if (snakesegment.prev_seg !== null) {
				snakesegment.next_direction = snakesegment.prev_seg.direction;
			}
		}
		for (var snakesegment of self.segments) {
			snakesegment.move_at_cell ();
		}
		var seg = self.segments [0];
		var __left0__ = seg.next_cell (seg.cell_x, seg.cell_y, seg.direction);
		var nx = __left0__ [0];
		var ny = __left0__ [1];
		for (var apple of self.scene.apples) {
			if (apple.cell_x == nx && apple.cell_y == ny) {
				self.eat_apple (apple);
				break;
			}
		}
	});},
	get draw () {return __get__ (this, function (self, ctx) {
		GameObject.draw (self, ctx);
		for (var snakesegment of self.segments) {
			snakesegment.draw (ctx);
		}
	});},
	get eat_apple () {return __get__ (this, function (self, apple) {
		var seg = self.segments [0];
		var snakesegment = SnakeSegment (self.game, apple.cell_x, apple.cell_y);
		snakesegment.scene = self.scene;
		snakesegment.color_time = COLOR_TIME;
		seg.prev_seg = snakesegment;
		snakesegment.set_cell (apple.cell_x, apple.cell_y, seg.direction);
		self.scene.apples.remove (apple);
		self.scene.remove (apple);
		self.segments.insert (0, snakesegment);
		var __left0__ = snakesegment.next_cell (snakesegment.cell_x, snakesegment.cell_y, snakesegment.direction);
		var nx = __left0__ [0];
		var ny = __left0__ [1];
		self.scene.sound_eat_apple.play ();
		if (nx < 0 || nx > BOARD_SIZE - 1 || ny < 0 || ny > BOARD_SIZE - 1) {
			self.scene.collision ();
			if (DEBUG) {
				console.log ((('Collision with wall at ' + nx) + ',') + ny);
			}
		}
		if (len (self.scene.apples) == 0 && self.scene.mode == GAME_RUNNING) {
			self.schedule (self.scene.add_apple, 1000);
		}
		self.scene.score.inc ();
	});}
});
export var SnakeSegment =  __class__ ('SnakeSegment', [GameObject], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, game, cx, cy, dr) {
		if (typeof dr == 'undefined' || (dr != null && dr.hasOwnProperty ("__kwargtrans__"))) {;
			var dr = RIGHT;
		};
		GameObject.__init__ (self, game);
		self.cell_x = cx;
		self.cell_y = cy;
		self.start_x = cx;
		self.start_y = cy;
		self.start_dir = dr;
		self.x = 0;
		self.y = 0;
		self.direction = dr;
		self.next_direction = dr;
		self.prev_seg = null;
		self.color_time = 0;
	});},
	get set_direction () {return __get__ (this, function (self, dr) {
		self.next_direction = dr;
		if (self.scene.mode == GAME_BEGIN) {
			self.scene.mode = GAME_RUNNING;
			self.direction = dr;
		}
	});},
	get set_cell () {return __get__ (this, function (self, cx, cy, dr) {
		if (typeof dr == 'undefined' || (dr != null && dr.hasOwnProperty ("__kwargtrans__"))) {;
			var dr = null;
		};
		self.cell_x = cx;
		self.cell_y = cy;
		self.x = self.cell_x * CELL_SIZE;
		self.y = self.cell_y * CELL_SIZE;
		if (dr !== null) {
			self.direction = dr;
			self.next_direction = dr;
		}
	});},
	get reset () {return __get__ (this, function (self) {
		self.set_cell (self.start_x, self.start_y, self.start_dir);
	});},
	get py_update () {return __get__ (this, function (self, delta_time) {
		GameObject.py_update (self, delta_time);
		if (self.scene.mode == GAME_RUNNING) {
			var dist = Math.round (delta_time * (CELL_SIZE / SNAKE_TIME_STEP));
			if (self.direction == LEFT) {
				self.x = self.x - dist;
			}
			else if (self.direction == RIGHT) {
				self.x = self.x + dist;
			}
			else if (self.direction == UP) {
				self.y = self.y - dist;
			}
			else if (self.direction == DOWN) {
				self.y = self.y + dist;
			}
			self.color_time = Math.max (0, self.color_time - delta_time);
		}
	});},
	get move_at_cell () {return __get__ (this, function (self) {
		var collision = false;
		var cx = self.cell_x;
		var cy = self.cell_y;
		if (self.direction == LEFT && self.cell_x <= 1) {
			var cx = 0;
			if (self.next_direction == self.direction) {
				var collision = true;
			}
			else {
				self.direction = self.next_direction;
			}
		}
		else if (self.direction == RIGHT && self.cell_x >= BOARD_SIZE - 2) {
			var cx = BOARD_SIZE - 1;
			if (self.next_direction == self.direction) {
				var collision = true;
			}
			else {
				self.direction = self.next_direction;
			}
		}
		else if (self.direction == UP && self.cell_y <= 1) {
			var cy = 0;
			if (self.next_direction == self.direction) {
				var collision = true;
			}
			else {
				self.direction = self.next_direction;
			}
		}
		else if (self.direction == DOWN && self.cell_y >= BOARD_SIZE - 2) {
			var cy = BOARD_SIZE - 1;
			if (self.next_direction == self.direction) {
				var collision = true;
			}
			else {
				self.direction = self.next_direction;
			}
		}
		else {
			var __left0__ = self.next_cell (self.cell_x, self.cell_y, self.direction);
			var cx = __left0__ [0];
			var cy = __left0__ [1];
		}
		if (DEBUG && collision) {
			console.log ((('collision with wall at ' + cx) + ',') + cy);
		}
		if (self.prev_seg === null) {
			var __left0__ = self.next_cell (cx, cy, self.next_direction);
			var nx = __left0__ [0];
			var ny = __left0__ [1];
			for (var seg of self.scene.snake.segments) {
				if (self != seg && seg.cell_x == nx && seg.cell_y == ny) {
					var collision = true;
					if (DEBUG) {
						console.log ((('collision with snake at ' + nx) + ',') + ny);
					}
				}
			}
		}
		if (DEBUG) {
			console.log ((((((self.cell_x + ', ') + self.cell_y) + '    : ') + self.direction) + '  : ') + self.scene.mode);
		}
		if (collision) {
			self.scene.collision ();
		}
		else {
			self.set_cell (cx, cy, self.next_direction);
		}
	});},
	get next_cell () {return __get__ (this, function (self, cx, cy, dr) {
		var __left0__ = tuple ([cx, cy]);
		var nx = __left0__ [0];
		var ny = __left0__ [1];
		if (dr == LEFT) {
			var nx = nx - 1;
		}
		else if (dr == RIGHT) {
			var nx = nx + 1;
		}
		else if (dr == UP) {
			var ny = ny - 1;
		}
		else if (dr == DOWN) {
			var ny = ny + 1;
		}
		return tuple ([nx, ny]);
	});},
	get draw () {return __get__ (this, function (self, ctx) {
		GameObject.draw (self, ctx);
		Sprite.draw (self, ctx);
		ctx.save ();
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 3;
		ctx.beginPath ();
		var radius = Math.floor ((CELL_SIZE - 4) / 2);
		var snake_x = (self.x + BOARD_MARGIN_LEFT) + Math.floor (CELL_SIZE / 2);
		var snake_y = (self.y + BOARD_MARGIN_TOP) + Math.floor (CELL_SIZE / 2);
		if (self.color_time > 0) {
			var t = Math.floor ((len (COLOR_APPLE) * (COLOR_TIME - self.color_time)) / COLOR_TIME);
			ctx.fillStyle = COLOR_APPLE [t];
			ctx.arc (snake_x, snake_y, radius, 0, 2 * Math.PI);
			ctx.fill ();
			ctx.stroke ();
		}
		else {
			ctx.arc (snake_x, snake_y, radius, 0, 2 * Math.PI);
			ctx.stroke ();
		}
		ctx.restore ();
	});}
});
export var SnakeScene =  __class__ ('SnakeScene', [Scene], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, game, py_name) {
		Scene.__init__ (self, game, py_name);
		self.sound_add_apple = null;
		self.mode = GAME_BEGIN;
		self.snake = Snake (game);
		self.append (self.snake);
		self.apples = [];
		self.add_apple (BOARD_SIZE - 3, Math.floor (BOARD_SIZE / 2));
		self.reset_board ();
		self.sound_add_apple = self.game.load_audio ('add_apple');
		self.sound_collision = self.game.load_audio ('collision');
		self.sound_eat_apple = self.game.load_audio ('eat_apple');
		self.score = Score (game);
		self.append (self.score);
	});},
	get reset_board () {return __get__ (this, function (self) {
		self.mode = GAME_BEGIN;
		self.snake.reset ();
	});},
	get add_apple () {return __get__ (this, function (self, cx, cy) {
		if (typeof cx == 'undefined' || (cx != null && cx.hasOwnProperty ("__kwargtrans__"))) {;
			var cx = null;
		};
		if (typeof cy == 'undefined' || (cy != null && cy.hasOwnProperty ("__kwargtrans__"))) {;
			var cy = null;
		};
		while (cx === null) {
			var xx = Math.floor (Math.random () * BOARD_SIZE);
			var yy = Math.floor (Math.random () * BOARD_SIZE);
			if (!(self._occupied (xx, yy)) && !(self._bad (xx, yy))) {
				var cx = xx;
				var cy = yy;
			}
		}
		var apple = Apple (self.game, cx, cy);
		self.apples.append (apple);
		self.append (apple);
		if (self.sound_add_apple !== null) {
			self.sound_add_apple.play ();
		}
	});},
	get _occupied () {return __get__ (this, function (self, cx, cy) {
		for (var apple of self.apples) {
			if (apple.cell_x == cx && apple.cell_y == cy) {
				return true;
			}
		}
		for (var snakesegment of self.snake.segments) {
			if (snakesegment.cell_x == cx && snakesegment.cell_y == cy) {
				return true;
			}
		}
		return false;
	});},
	get _bad () {return __get__ (this, function (self, cx, cy) {
		return (cx <= 0 || cx >= BOARD_SIZE - 1) && (cy <= 0 || cy >= BOARD_SIZE - 1);
	});},
	get _set_direction () {return __get__ (this, function (self, d) {
		self.snake.set_direction (d);
	});},
	get handle_keydown () {return __get__ (this, function (self, event) {
		Scene.handle_keydown (self, event);
		if (event.key == 'a' || event.key == 'ArrowLeft') {
			self._set_direction (LEFT);
		}
		else if (event.key == 'd' || event.key == 'ArrowRight') {
			self._set_direction (RIGHT);
		}
		else if (event.key == 'w' || event.key == 'ArrowUp') {
			self._set_direction (UP);
		}
		else if (event.key == 's' || event.key == 'ArrowDown') {
			self._set_direction (DOWN);
		}
	});},
	get handle_gamepad () {return __get__ (this, function (self, gp) {
		Scene.handle_gamepad (self, gp);
		var a0 = self.get_axis_value (gp, 0);
		var a1 = self.get_axis_value (gp, 1);
		if (self.is_button_pressed (gp, 14) || self.is_button_pressed (gp, 2) || a0 < -(0.5)) {
			self._set_direction (LEFT);
		}
		else if (self.is_button_pressed (gp, 15) || self.is_button_pressed (gp, 3) || a0 > 0.5) {
			self._set_direction (RIGHT);
		}
		else if (self.is_button_pressed (gp, 12) || self.is_button_pressed (gp, 0) || a1 < -(0.5)) {
			self._set_direction (UP);
		}
		else if (self.is_button_pressed (gp, 13) || self.is_button_pressed (gp, 1) || a1 > 0.5) {
			self._set_direction (DOWN);
		}
	});},
	get collision () {return __get__ (this, function (self) {
		self.sound_collision.play ();
		self.mode = GAME_OVER;
		self.score.start_fade (true);
	});},
	get py_update () {return __get__ (this, function (self, delta_time) {
		Scene.py_update (self, delta_time);
		// pass;
	});},
	get draw () {return __get__ (this, function (self, ctx) {
		Scene.draw (self, ctx);
		ctx.save ();
		ctx.globalCompositeOperation = 'source-over';
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 2;
		ctx.beginPath ();
		var board_width = BOARD_SIZE * CELL_SIZE;
		ctx.rect (BOARD_MARGIN_LEFT, BOARD_MARGIN_TOP, board_width, board_width);
		ctx.stroke ();
		if (DEBUG) {
			ctx.strokeStyle = '#CCCCCC';
			ctx.lineWidth = 1;
			ctx.beginPath ();
			for (var n = 1; n < BOARD_SIZE; n++) {
				ctx.moveTo (BOARD_MARGIN_LEFT, BOARD_MARGIN_TOP + n * CELL_SIZE);
				ctx.lineTo (BOARD_MARGIN_LEFT + board_width, BOARD_MARGIN_TOP + n * CELL_SIZE);
				ctx.moveTo (BOARD_MARGIN_LEFT + n * CELL_SIZE, BOARD_MARGIN_TOP);
				ctx.lineTo (BOARD_MARGIN_LEFT + n * CELL_SIZE, BOARD_MARGIN_TOP + board_width);
			}
			ctx.stroke ();
		}
		ctx.restore ();
	});}
});
export var Score =  __class__ ('Score', [GameObject], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, game) {
		GameObject.__init__ (self, game);
		self.score = 2;
		self.font = '18pt sans-serif';
		self.fade_mode = 'blank';
		self.fade_time = 0;
		self.color = COLOR_SCORE [0];
		self.left_side = true;
	});},
	get inc () {return __get__ (this, function (self) {
		self.score = self.score + 1;
		if (__mod__ (self.score, 5) == 0) {
			self.start_fade ();
		}
	});},
	get start_fade () {return __get__ (this, function (self, game_over) {
		if (typeof game_over == 'undefined' || (game_over != null && game_over.hasOwnProperty ("__kwargtrans__"))) {;
			var game_over = false;
		};
		self.fade_mode = 'fade-in';
		self.fade_time = 0;
		self.color = COLOR_SCORE [0];
		if (game_over) {
			self.xx = 15;
			self.yy = 30;
		}
		else {
			self.left_side = !(self.left_side);
			self.xx = (self.left_side ? 15 : (BOARD_SIZE + 2) * CELL_SIZE);
			self.yy = Math.floor (Math.random () * (BOARD_SIZE - 2)) * CELL_SIZE + CELL_SIZE;
		}
	});},
	get py_update () {return __get__ (this, function (self, delta_time) {
		GameObject.py_update (self, delta_time);
		if (self.fade_mode == 'fade-in') {
			self.fade_time += delta_time;
			var t = Math.floor ((len (COLOR_SCORE) * self.fade_time) / SCORE_TIME);
			if (t < len (COLOR_SCORE)) {
				self.color = COLOR_SCORE [t];
			}
			else {
				self.fade_mode = 'fade-out';
			}
		}
		else if (self.fade_mode == 'fade-out' && self.scene.mode != GAME_OVER) {
			self.fade_time -= delta_time;
			var t = Math.floor ((len (COLOR_SCORE) * self.fade_time) / SCORE_TIME);
			if (t > 0) {
				self.color = COLOR_SCORE [t];
			}
			else {
				self.fade_mode = 'blank';
				self.fade_time = 0;
				self.color = COLOR_SCORE [0];
			}
		}
	});},
	get draw () {return __get__ (this, function (self, ctx) {
		GameObject.draw (self, ctx);
		ctx.save ();
		ctx.globalCompositeOperation = 'source-over';
		ctx.font = self.font;
		ctx.fillStyle = self.color;
		ctx.fillText ('{}'.format (self.score), self.xx, self.yy);
		ctx.restore ();
	});}
});
export var SnakeGame =  __class__ ('SnakeGame', [Game], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, loop_time) {
		if (typeof loop_time == 'undefined' || (loop_time != null && loop_time.hasOwnProperty ("__kwargtrans__"))) {;
			var loop_time = 20;
		};
		Game.__init__ (self, 'Snake', loop_time);
		self.append (SnakeScene (self, 'MAIN'));
	});},
	get set_debug () {return function (b) {
		if (b !== null && b == 'true') {
			DEBUG = true;
			SNAKE_TIME_STEP = SNAKE_TIME_STEP * 2;
		}
	};}
});

//# sourceMappingURL=snake.map