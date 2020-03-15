'use strict';

(function () {
  var LOCATION_MIN_Y = 130;
  var LOCATION_MAX_Y = 630;
  var LOCATION_MIN_X = 25;
  var map = document.querySelector('.map');
  var locationMaxX = map.offsetWidth - 25;
  var mainMapPin = map.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var adGuestNumber = adForm.querySelector('#capacity');

  var onSuccess = function (data) {
    window.data.save(data);
    window.pins.show(data);
  };

  var onError = function (error) {
    window.error.show(error);
  };

  var onMainMapMousedown = function () {
    window.form.enableAll();
    window.form.fillCurrentAddress();
    adGuestNumber.value = '1';
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');

    window.backend.download(onSuccess, onError);
  };

  var onMainButtonMousedown = function (evt) {
    if (evt.button === window.utils.MAIN_MOUSE_BUTTON) {
      onMainMapMousedown();
      mainMapPin.removeEventListener('mousedown', onMainButtonMousedown);
      mainMapPin.removeEventListener('keydown', onEnterKeydown);
    }
  };

  var onEnterKeydown = function (evt) {
    if (evt.key === window.utils.ENTER_KEY) {
      onMainMapMousedown();
      mainMapPin.removeEventListener('keydown', onEnterKeydown);
      mainMapPin.removeEventListener('mousedown', onMainButtonMousedown);
    }
  };

  var onMainPinMove = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var currentX = mainMapPin.offsetLeft + Math.floor(window.form.MAIN_MAP_PIN_WIDTH / 2);
      var currentY = mainMapPin.offsetTop + window.form.MAIN_MAP_PIN_HEIGHT;

      if (currentY >= LOCATION_MIN_Y && currentY <= LOCATION_MAX_Y) {
        mainMapPin.style.top = (mainMapPin.offsetTop - shift.y) + 'px';
      } else if (currentY < LOCATION_MIN_Y) {
        mainMapPin.style.top = LOCATION_MIN_Y - window.form.MAIN_MAP_PIN_HEIGHT + 'px';
      } else if (currentY > LOCATION_MAX_Y) {
        mainMapPin.style.top = LOCATION_MAX_Y - window.form.MAIN_MAP_PIN_HEIGHT + 'px';
      }

      if (currentX >= LOCATION_MIN_X && currentX <= locationMaxX) {
        mainMapPin.style.left = (mainMapPin.offsetLeft - shift.x) + 'px';
      } else if (currentX < LOCATION_MIN_X) {
        mainMapPin.style.left = LOCATION_MIN_X - Math.floor(window.form.MAIN_MAP_PIN_WIDTH / 2) + 'px';
      } else if (currentX > locationMaxX) {
        mainMapPin.style.left = locationMaxX - Math.floor(window.form.MAIN_MAP_PIN_WIDTH / 2) + 'px';
      }

      window.form.fillCurrentAddress();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      window.form.fillCurrentAddress();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  mainMapPin.addEventListener('mousedown', onMainButtonMousedown);
  mainMapPin.addEventListener('keydown', onEnterKeydown);
  mainMapPin.addEventListener('mousedown', onMainPinMove);
})();
