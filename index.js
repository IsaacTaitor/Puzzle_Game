
/* Определяем тип браузера */
var ie = 0;
var op = 0;
var ff = 0;
var browser = navigator.userAgent;
if (browser.indexOf("Opera") != -1) op = 1;
else {
    if (browser.indexOf("MSIE") != -1) ie = 1;
    else {
        if (browser.indexOf("Firefox") != -1) ff = 1;
    }
}
// количество элементов: h и w
var h = 3;
var w = 3;

// размер блоков
var h_block = 100;
var w_block = 100;

//создание 2мер массива для сохранения информации о подкрепленных элементах
var info_about_el_in_block = [];

//масив для проверенных блоков(для избежания повторной проверки на подкрепление)
var arr_checked = [];

//масив для проверенных блоков(для избежания повторной проверки при передвижении блоков при подкреплении)
var arr_checked_moved = [];

function initial_info(id, i, k) {
    if (i != 0) {
        info_about_el_in_block[id] = {
            ...info_about_el_in_block[id],
            top: { block: block[i - 1][k], isHooked: false }
        }
    }
    if (i != (h - 1)) {
        info_about_el_in_block[id] = {
            ...info_about_el_in_block[id],
            bottom: { block: block[i + 1][k], isHooked: false }
        }
    }
    if (k) {
        info_about_el_in_block[id] = {
            ...info_about_el_in_block[id],
            left: { block: block[i][k - 1], isHooked: false },
        }
    }
    if (k != (w - 1)) {
        info_about_el_in_block[id] = {
            ...info_about_el_in_block[id],
            right: { block: block[i][k + 1], isHooked: false },
        }
    }
}

//массив для отлова уже передвигаемых блоков;
var isBlockMoved = [];

//создание блоков
var block = [];
var counter = 0;
for (var i = 0; i < h; i++) {
    block[i] = [];
    for (var k = 0; k < w; k++) {
        counter++;
        var d = document.createElement('div');
        d.style.width = h_block + 'px';
        d.style.height = h_block + 'px';
        d.style.cursor = "move";
        d.style.position = "absolute";
        d.style.backgroundImage = "url(images/image_part_00" + counter + ".jpg)";
        d.style.top = Math.floor(Math.random() * 500) + "px";
        d.style.left = Math.floor(Math.random() * 500) + "px";
        d.id = "block" + i + "_" + k;
        document.body.appendChild(d);
        block[i][k] = document.getElementById("block" + i + "_" + k);
        /* Ставим обработчики событий на нажатие и отпускание клавиши мыши */
        block[i][k].onmousedown = saveXY;
        if (op || ff) {
            block[i][k].addEventListener("onmousedown", saveXY, false);
        }
        block[i][k].onmouseup = clearXY;
    }
}

for (var i = 0; i < h; i++) {
    for (var k = 0; k < w; k++) {
        ;
        initial_info(block[i][k].id, i, k);
    }
}

delta_x = 0;
delta_y = 0;

/* При нажатии кнопки мыши попадаем в эту функцию */
function saveXY(obj_event) {
    /* Получаем текущие координаты курсора */
    if (obj_event) {
        x = obj_event.pageX;
        y = obj_event.pageY;
    }
    else {
        x = window.event.clientX;
        y = window.event.clientY;
        if (ie) {
            y -= 2;
            x -= 2;
        }
    }
    /* Узнаём текущие координаты блока */
    x_block = this.offsetLeft;
    y_block = this.offsetTop;
    /* Узнаём смещение */
    delta_x = x_block - x;
    delta_y = y_block - y;
    /* При движении курсора устанавливаем вызов функции moveWindow */
    this.onmousemove = moveBlock;
    if (op || ff)
        this.addEventListener("onmousemove", moveBlock, false);
}
function clearXY() {
    this.style.zIndex = 0;
    this.onmousemove = null; // При отпускании мыши убираем обработку события движения мыши
    arr_checked = [];
    check_hook(this);
}


function check_hook(el) {
    if (!arr_checked[el.id]) {

        var block_on_mouse_top = parseInt(el.style.top, 10);
        var block_on_mouse_left = parseInt(el.style.left, 10);
        var block_2;
        el.style.zIndex = 0;
        isBlockMoved = [];
        arr_checked_moved = [];
        if (info_about_el_in_block[el.id].left && !info_about_el_in_block[el.id].left.isHooked) {  //присоединить справа
            block_2 = info_about_el_in_block[el.id].left.block;
            block_top = parseInt(block_2.style.top, 10);
            block_left = parseInt(block_2.style.left, 10);
            if (((block_top - 10 < block_on_mouse_top) && (block_top + 10 > block_on_mouse_top)) &&
                ((block_left - 10 + w_block < block_on_mouse_left) && (block_left + 10 + w_block > block_on_mouse_left))) {
                
                moveAllBlock(el, block_top - parseInt(el.style.top, 10), block_left + w_block - parseInt(el.style.left, 10))

                info_about_el_in_block[el.id].left.isHooked = true;
                info_about_el_in_block[block_2.id].right.isHooked = true;
                return;
            }
        }
        if (info_about_el_in_block[el.id].right && !info_about_el_in_block[el.id].right.isHooked) { //присоединить слева
            block_2 = info_about_el_in_block[el.id].right.block;
            block_top = parseInt(block_2.style.top, 10);
            block_left = parseInt(block_2.style.left, 10);
            if (((block_top - 10 < block_on_mouse_top) && (block_top + 10 > block_on_mouse_top)) &&
                ((block_left - 10 - w_block < block_on_mouse_left) && (block_left + 10 + w_block > block_on_mouse_left))) {

                moveAllBlock(el, block_top - parseInt(el.style.top, 10), block_left - w_block - parseInt(el.style.left, 10))

                info_about_el_in_block[el.id].right.isHooked = true;
                info_about_el_in_block[block_2.id].left.isHooked = true;
                return;
            }
        }

        if (info_about_el_in_block[el.id].top && !info_about_el_in_block[el.id].top.isHooked) { // присоеднить сверху
            block_2 = info_about_el_in_block[el.id].top.block;
            block_top = parseInt(block_2.style.top, 10);
            block_left = parseInt(block_2.style.left, 10);
            if (((block_top - 10 + w_block < block_on_mouse_top) && (block_top + 10 + w_block > block_on_mouse_top)) &&
                ((block_left - 10 < block_on_mouse_left) && (block_left + 10 > block_on_mouse_left))) {

                moveAllBlock(el, block_top + w_block - parseInt(el.style.top, 10), block_left - parseInt(el.style.left, 10))

                info_about_el_in_block[el.id].top.isHooked = true;
                info_about_el_in_block[block_2.id].bottom.isHooked = true;
                return;
            }
        }
        if (info_about_el_in_block[el.id].bottom && !info_about_el_in_block[el.id].bottom.isHooked) { //присоеднить снизу
            block_2 = info_about_el_in_block[el.id].bottom.block;
            block_top = parseInt(block_2.style.top, 10);
            block_left = parseInt(block_2.style.left, 10);
            if (((block_top - 10 - w_block < block_on_mouse_top) && (block_top + 10 - w_block > block_on_mouse_top)) &&
                ((block_left - 10 < block_on_mouse_left) && (block_left + 10 > block_on_mouse_left))) {

                moveAllBlock(el, block_top - w_block - parseInt(el.style.top, 10), block_left - parseInt(el.style.left, 10))

                info_about_el_in_block[el.id].bottom.isHooked = true;
                info_about_el_in_block[block_2.id].top.isHooked = true;
                return;
            }
        }
        arr_checked[el.id] = true;
        if (info_about_el_in_block[el.id].left && info_about_el_in_block[el.id].left.isHooked) {
            check_hook(info_about_el_in_block[el.id].left.block)
        }
        if (info_about_el_in_block[el.id].right && info_about_el_in_block[el.id].right.isHooked) {
            check_hook(info_about_el_in_block[el.id].right.block)
        }
        if (info_about_el_in_block[el.id].top && info_about_el_in_block[el.id].top.isHooked) {
            check_hook(info_about_el_in_block[el.id].top.block)
        }
        if (info_about_el_in_block[el.id].bottom && info_about_el_in_block[el.id].bottom.isHooked) {
            check_hook(info_about_el_in_block[el.id].bottom.block)
        }
    }
}

function moveBlock(obj_event) {
    /* Получаем новые координаты курсора мыши */
    if (obj_event) {
        x = obj_event.pageX;
        y = obj_event.pageY;
    }
    else {
        x = window.event.clientX;
        y = window.event.clientY;
        if (ie) {
            y -= 2;
            x -= 2;
        }
    }
    /* Вычисляем новые координаты блока */
    new_x = delta_x + x;
    new_y = delta_y + y;
    isBlockMoved = [];
    moveOtherBlock(this, 0, 0);
}

function moveOtherBlock(movedBlock, y, x) {
    if (!isBlockMoved[movedBlock.id]) {
        isBlockMoved[movedBlock.id] = true;
        movedBlock.style.top = new_y + y + "px";
        movedBlock.style.left = new_x + x + "px";
        movedBlock.style.zIndex = 1;

        if (info_about_el_in_block[movedBlock.id].left && info_about_el_in_block[movedBlock.id].left.isHooked) {
            moveOtherBlock(info_about_el_in_block[movedBlock.id].left.block, y, -h_block + x)
        }
        if (info_about_el_in_block[movedBlock.id].top && info_about_el_in_block[movedBlock.id].top.isHooked) {
            moveOtherBlock(info_about_el_in_block[movedBlock.id].top.block, -w_block + y, x)
        }
        if (info_about_el_in_block[movedBlock.id].right && info_about_el_in_block[movedBlock.id].right.isHooked) {
            moveOtherBlock(info_about_el_in_block[movedBlock.id].right.block, y, h_block + x)
        }
        if (info_about_el_in_block[movedBlock.id].bottom && info_about_el_in_block[movedBlock.id].bottom.isHooked) {
            moveOtherBlock(info_about_el_in_block[movedBlock.id].bottom.block, w_block + y, x)
        }
    }
}

function moveAllBlock(movedEl, onTop, onLeft) {
    if (!arr_checked_moved[movedEl.id]) {
        movedEl.style.left = parseInt(movedEl.style.left, 10) + onLeft + "px";
        movedEl.style.top = parseInt(movedEl.style.top) + onTop + "px";
        arr_checked_moved[movedEl.id] = true;

        if (info_about_el_in_block[movedEl.id].left && info_about_el_in_block[movedEl.id].left.isHooked) {
            moveAllBlock(info_about_el_in_block[movedEl.id].left.block, onTop, onLeft)
        }
        if (info_about_el_in_block[movedEl.id].right && info_about_el_in_block[movedEl.id].right.isHooked) {
            moveAllBlock(info_about_el_in_block[movedEl.id].right.block, onTop, onLeft)
        }
        if (info_about_el_in_block[movedEl.id].top && info_about_el_in_block[movedEl.id].top.isHooked) {
            moveAllBlock(info_about_el_in_block[movedEl.id].top.block, onTop, onLeft)
        }
        if (info_about_el_in_block[movedEl.id].bottom && info_about_el_in_block[movedEl.id].bottom.isHooked) {
            moveAllBlock(info_about_el_in_block[movedEl.id].bottom.block, onTop, onLeft)
        }

    }
}