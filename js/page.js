$(function() {

  // установка вертикального выравнивания
  setVerticalAlign();

  // показ первого меню
  $('.menu').hover(
    function() {
      $('.menu__zero').toggle();
    },
  );
  // показ второго меню
  $('.menu__level1').hover(
    function() {
      $('.menu__second').hide();
      $(this).find('.menu__second').show();
    },
  );
  // смена вида списка товаров
  $('.view').mouseenter(
    function() {
      if ($('.products_table').length) {
        $('.products').removeClass('products_table');
        $('.wrap').removeClass('wrap_table');
      } else {
        $('.products').addClass('products_table');
        $('.wrap').addClass('wrap_table');
      }
      setVerticalAlign();
    }
  );

  $(window).resize(function () {
    setVerticalAlign();
  });

  // редактирование наименования товара
  $('.title').click(function () {
    if ($(this).attr('contenteditable') == 'false') {
      $(this).attr('contenteditable', 'true');
    }
    // показ кнопки "Готово"
    $(this).next().show();
  });

  // сохранение измененного наименования
  $('.product__title-change-btn').on(
    'click',
    function () {
      $(this).prev().attr('contenteditable', 'false');
      $(this).hide();
      let title = $(this).prev().text();
      $.post(
        'https://someurl.ru/setname',
        {'title': title},
      ).done(function( data ) {
        console.log( "title changed: " + title );
      }).fail(function() {
        console.log('error');
      });
    }
  );
  // drag and drop товаров
  $('.products').sortable();
});

// установка вертикального выравнивания блока
function setVerticalAlign() {
  if ($('body').height() < $(window).height()) {
    $('.wrap').css('margin-top', ($(window).height() - $('body').height())/2);
  } else {
    $('.wrap').css('margin-top', 0);
  }
}

// функция формирования строки скобок
function brackets (num) {
  let bracketsStr = '';
  let types = {'open': ['(', '{', '['], 'close': [')', '}', ']']};
  let last = '';

  for (let i = 1; i <= num; i++) {
    let type = Math.round(Math.random() * 2);
    let nesting = Math.round(Math.random());
    if (nesting) {
      last = types['open'][type] + last + types['close'][type];
    } else {
      bracketsStr += last;
      last = types['open'][type] + types['close'][type];
    }
  }
  if (last) {
    bracketsStr += last;
  }

  return bracketsStr;
}

// функция проверки вложенности скобок в строке
function bracketsCheck(bracketsStr) {
  let open = {'(': 1, '{': 2, '[': 3};
  let close = {')': 1, '}': 2, ']': 3};
  let stack = [];
  let num = bracketsStr.length;
  let last = '';

  // перебираем все символы строки
  for (let i = 0; i < num; i++) {
    let type = bracketsStr[i];
    // если открывающая скобка
    if (typeof open[type] !== 'undefined') {
      stack.push(type);
    } else {
      // если есть список открывающих скобок, то сравниваем последнюю открывающую скобку с текущей закрывающей
      if (stack.length) {
        last = stack.pop();
        if (open[last] !== close[type]) {
          return false;
        }
      } else {
        return false;
      }
    }
  }

  // если остались открывающие скобки
  if (stack.length) {
    return false
  }
  return true;
}
