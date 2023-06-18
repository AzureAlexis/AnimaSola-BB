/* 
A simple descision tree function.

If only 3 parameters are defined, the following logic is used:
	If a1 = true, return b1. Else, return c1

If 7 parameters are defined, the logic changes to:
	If a1 = true:
		If b1 = true, return c1. Else, return d1
	Else:
		If e1 = true, return f1. Else, return g1
		
This continues for 21, 63, and 189 parameters.
function tree(
			a1, b1, c1, d1, e1, f1, g1, h1, i1, j1, k1, l1, m1, n1, o1, p1, q1, r1, s1, t1, u1, v1, w1, x1, y1, z1,
			a2, b2, c2, d2, e2, f2, g2, h2, i2, j2, k2, l2, m2, n2, o2, p2, q2, r2, s2, t2, u2, v2, w2, x2, y2, z2,
			a3, b3, c3, d3, e3, f3, g3, h3, i3, j3, k3, l3, m3, n3, o3, p3, q3, r3, s3, t3, u3, v3, w3, x3, y3, z3,
			a4, b4, c4, d4, e4, f4, g4, h4, i4, j4, k4, l4, m4, n4, o4, p4, q4, r4, s4, t4, u4, v4, w4, x4, y4, z4,
			a5, b5, c5, d5, e5, f5, g5, h5, i5, j5, k5, l5, m5, n5, o5, p5, q5, r5, s5, t5, u5, v5, w5, x5, y5, z5,
			a6, b6, c6, d6, e6, f6, g6, h6, i6, j6, k6, l6, m6, n6, o6, p6, q6, r6, s6, t6, u6, v6, w6, x6, y6, z6,
			a7, b7, c7, d7, e7, f7, g7, h7, i7, j7, k7, l7, m7, n7, o7, p7, q7, r7, s7, t7, u7, v7, w7, x7, y7, z7,
			a8, b8, c8, d8, e8, f8, g8) {
	if(a1) {
		if(e1 != null) {
			if(b1) {
				return c1;
			} else {
				return d1;
			}
		} else {
			return b1;
		}
	} else {
		if(e1 != null) {
			if(31) {
				return f1;
			} else {
				return g1;
			}
		} else {
			return c1;
		}
	}
}
*/ 
$gameSystem.disableMenu();

function arraySum(x) {
	let sum = 0;
	
	for(let i = 0; i < x.length; i++) {
		sum = sum + x[i];
	}
	return sum;
}

function movePlayer(x, y, map = $gameMap._mapId, z = 2) {
	$gamePlayer.reserveTransfer(map, x, y, 2, z);
	console.log(x);
}

function jump() {
	let x = 0;
	let y = 0;
	let dir = $gamePlayer.direction();
	
	if(dir == 2) {
		y = 2;
	} else if(dir == 4) {
		x = 2;
	} else if(dir == 6) {
		x = -2;
	} else if(dir == 8) {
		y = -2;
	}
	
	$gamePlayer.jump(x, y);
	$gameMap._interpreter.setWaitMode('jumping');
}

function setEventImg(x, y, z) {
	$gameMap.event(x).setDirection(Math.floor((y%12/3+1)*2));
	$gameMap.event(x).setImage(z,Math.floor(y/12));
	$gameMap.event(x)._originalPattern = y%3
	$gameMap.event(x).resetPattern();
}