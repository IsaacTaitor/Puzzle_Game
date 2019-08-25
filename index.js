// количество элементов: h и w
var h = 3;
var w = 7;

// размер блоков
var h_el = 127;
var w_el = 93;

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
        d.style.width = w_el + 'px';
        d.style.height = h_el + 'px';
        d.style.cursor = "move";
        d.style.position = "absolute";
        d.style.backgroundImage = "url(images/image_part_" + pad(String(counter), 3) + ".jpg)";
        d.style.top = Math.floor(Math.random() * 500) + "px";
        d.style.left = Math.floor(Math.random() * 500) + "px";
        d.id = "block" + i + "_" + k;
        document.body.appendChild(d);
        block[i][k] = document.getElementById("block" + i + "_" + k);
        /* Ставим обработчики событий на нажатие и отпускание клавиши мыши */
        block[i][k].onmousedown = function (event) {
            var thisBlock = this;
            let shiftX = event.clientX - thisBlock.getBoundingClientRect().left;
            let shiftY = event.clientY - thisBlock.getBoundingClientRect().top;
            
            thisBlock.style.zIndex = 1000;
            document.body.append(thisBlock);

            moveAt(thisBlock, event.pageX, event.pageY);

            // переносит мяч на координаты (pageX, pageY),
            // дополнительно учитывая изначальный сдвиг относительно указателя мыши
            function moveAt(thisBlock, pageX, pageY) {
                new_x = pageX - shiftX;
                new_y = pageY - shiftY;
                isBlockMoved = [];
                moveBlock(thisBlock, 0, 0);
            }

            function onMouseMove(event) {
                moveAt(thisBlock, event.pageX, event.pageY);
            }

            // передвигаем мяч при событии mousemove
            document.addEventListener('mousemove', onMouseMove);

            // отпустить мяч, удалить ненужные обработчики
            this.onmouseup = function () {
                document.removeEventListener('mousemove', onMouseMove);
                this.onmouseup = null;
                this.style.zIndex = 0;
                arr_checked = [];
                check_hook(thisBlock);
            };

        };

        block[i][k].ondragstart = function () {
            return false;
        };
    }
}

for (var i = 0; i < h; i++) {
    for (var k = 0; k < w; k++) {
        initial_info(block[i][k].id, i, k); // информация о всех блоках
    }
}



function check_hook(el) {
    if (!arr_checked[el.id]) {

        var el_on_mouse_top = parseInt(el.style.top, 10);
        var el_on_mouse_left = parseInt(el.style.left, 10);
        var adjacent_el;
        el.style.zIndex = 0;
        isBlockMoved = [];
        arr_checked_moved = [];
        if (info_about_el_in_block[el.id].left && !info_about_el_in_block[el.id].left.isHooked) {  //присоединить справа
            adjacent_el = info_about_el_in_block[el.id].left.block;
            block_top = parseInt(adjacent_el.style.top, 10);
            block_left = parseInt(adjacent_el.style.left, 10);

            if (((block_top - 10 < el_on_mouse_top) && (block_top + 10 > el_on_mouse_top)) &&
                ((block_left - 10 + w_el < el_on_mouse_left) && (block_left + 10 + w_el > el_on_mouse_left))) {

                connectBlock(el, block_top - parseInt(el.style.top, 10), block_left + w_el - parseInt(el.style.left, 10))

                info_about_el_in_block[el.id].left.isHooked = true;
                info_about_el_in_block[adjacent_el.id].right.isHooked = true;
                return;
            }
        }
        if (info_about_el_in_block[el.id].right && !info_about_el_in_block[el.id].right.isHooked) { //присоединить слева
            adjacent_el = info_about_el_in_block[el.id].right.block;
            block_top = parseInt(adjacent_el.style.top, 10);
            block_left = parseInt(adjacent_el.style.left, 10);

            if (((block_top - 10 < el_on_mouse_top) && (block_top + 10 > el_on_mouse_top)) &&
                ((block_left - 10 - w_el < el_on_mouse_left) && (block_left + 10 - w_el > el_on_mouse_left))) {

                connectBlock(el, block_top - parseInt(el.style.top, 10), block_left - w_el - parseInt(el.style.left, 10))

                info_about_el_in_block[el.id].right.isHooked = true;
                info_about_el_in_block[adjacent_el.id].left.isHooked = true;
                return;
            }
        }

        if (info_about_el_in_block[el.id].top && !info_about_el_in_block[el.id].top.isHooked) { // присоеднить сверху
            adjacent_el = info_about_el_in_block[el.id].top.block;
            block_top = parseInt(adjacent_el.style.top, 10);
            block_left = parseInt(adjacent_el.style.left, 10);

            if (((block_top - 10 + h_el < el_on_mouse_top) && (block_top + 10 + h_el > el_on_mouse_top)) &&
                ((block_left - 10 < el_on_mouse_left) && (block_left + 10 > el_on_mouse_left))) {

                connectBlock(el, block_top + h_el - parseInt(el.style.top, 10), block_left - parseInt(el.style.left, 10))

                info_about_el_in_block[el.id].top.isHooked = true;
                info_about_el_in_block[adjacent_el.id].bottom.isHooked = true;
                return;
            }
        }
        if (info_about_el_in_block[el.id].bottom && !info_about_el_in_block[el.id].bottom.isHooked) { //присоеднить снизу
            adjacent_el = info_about_el_in_block[el.id].bottom.block;
            block_top = parseInt(adjacent_el.style.top, 10);
            block_left = parseInt(adjacent_el.style.left, 10);
            
            if (((block_top - 10 - h_el < el_on_mouse_top) && (block_top + 10 - h_el > el_on_mouse_top)) &&
                ((block_left - 10 < el_on_mouse_left) && (block_left + 10 > el_on_mouse_left))) {

                connectBlock(el, block_top - h_el - parseInt(el.style.top, 10), block_left - parseInt(el.style.left, 10))

                info_about_el_in_block[el.id].bottom.isHooked = true;
                info_about_el_in_block[adjacent_el.id].top.isHooked = true;
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

function moveBlock(movedBlock, y, x) {
    if (!isBlockMoved[movedBlock.id]) {
        isBlockMoved[movedBlock.id] = true;
        movedBlock.style.top = new_y + y + "px";
        movedBlock.style.left = new_x + x + "px";
        movedBlock.style.zIndex = 1;

        if (info_about_el_in_block[movedBlock.id].left && info_about_el_in_block[movedBlock.id].left.isHooked) {
            moveBlock(info_about_el_in_block[movedBlock.id].left.block, y, -w_el + x)
        }
        if (info_about_el_in_block[movedBlock.id].top && info_about_el_in_block[movedBlock.id].top.isHooked) {
            moveBlock(info_about_el_in_block[movedBlock.id].top.block, -h_el + y, x)
        }
        if (info_about_el_in_block[movedBlock.id].right && info_about_el_in_block[movedBlock.id].right.isHooked) {
            moveBlock(info_about_el_in_block[movedBlock.id].right.block, y, w_el + x)
        }
        if (info_about_el_in_block[movedBlock.id].bottom && info_about_el_in_block[movedBlock.id].bottom.isHooked) {
            moveBlock(info_about_el_in_block[movedBlock.id].bottom.block, h_el + y, x)
        }
    }
}

function connectBlock(movedEl, onTop, onLeft) {

    if (!arr_checked_moved[movedEl.id]) {
        movedEl.style.left = parseInt(movedEl.style.left, 10) + onLeft + "px";
        movedEl.style.top = parseInt(movedEl.style.top) + onTop + "px";
        arr_checked_moved[movedEl.id] = true;

        if (info_about_el_in_block[movedEl.id].left && info_about_el_in_block[movedEl.id].left.isHooked) {
            connectBlock(info_about_el_in_block[movedEl.id].left.block, onTop, onLeft)
        }
        if (info_about_el_in_block[movedEl.id].right && info_about_el_in_block[movedEl.id].right.isHooked) {
            connectBlock(info_about_el_in_block[movedEl.id].right.block, onTop, onLeft)
        }
        if (info_about_el_in_block[movedEl.id].top && info_about_el_in_block[movedEl.id].top.isHooked) {
            connectBlock(info_about_el_in_block[movedEl.id].top.block, onTop, onLeft)
        }
        if (info_about_el_in_block[movedEl.id].bottom && info_about_el_in_block[movedEl.id].bottom.isHooked) {
            connectBlock(info_about_el_in_block[movedEl.id].bottom.block, onTop, onLeft)
        }

    }
}

function pad(str, max) { //для нахождения нужной картинки
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}