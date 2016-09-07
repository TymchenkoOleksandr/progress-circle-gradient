'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProgressCircularGradiented = function (_React$Component) {
  _inherits(ProgressCircularGradiented, _React$Component);

  function ProgressCircularGradiented() {
    _classCallCheck(this, ProgressCircularGradiented);

    return _possibleConstructorReturn(this, (ProgressCircularGradiented.__proto__ || Object.getPrototypeOf(ProgressCircularGradiented)).apply(this, arguments));
  }

  _createClass(ProgressCircularGradiented, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.updateAttributes();
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return nextProps !== this.props;
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.updateAttributes();
    }
  }, {
    key: 'updateAttributes',
    value: function updateAttributes() {
      var _props = this.props;
      var percentage = _props.percentage;
      var strokeWidth = _props.strokeWidth;
      var width = _props.width;
      var colorStart = _props.colorStart;
      var colorEnd = _props.colorEnd;
      var strokeDasharray = this.calculateStrokeDasharray(width, strokeWidth);
      var strokeDashoffset = (1 - percentage) * strokeDasharray;

      if (percentage === 0) this.refs.fillingGradient.setAttribute('stroke', 'transparent');else {
        this.refs.fillingGradient.setAttribute('stroke', 'url(#circle-gradient-angular-' + colorStart + '-' + colorEnd + '-' + width + ')');
        this.refs.fillingGradient.setAttribute('stroke-dashoffset', strokeDashoffset);
      }
    }
  }, {
    key: 'hexToRgb',
    value: function hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        red: parseInt(result[1], 16),
        green: parseInt(result[2], 16),
        blue: parseInt(result[3], 16)
      } : null;
    }
  }, {
    key: 'polarToCartesian',
    value: function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
      var angleInRadians = (angleInDegrees - 90) * Math.PI / 180;

      return {
        x: Math.round(centerX + radius * Math.cos(angleInRadians)),
        y: Math.round(centerY + radius * Math.sin(angleInRadians))
      };
    }
  }, {
    key: 'describeArc',
    value: function describeArc(x, y, radius, startAngle, endAngle) {
      var start = this.polarToCartesian(x, y, radius, endAngle),
          end = this.polarToCartesian(x, y, radius, startAngle),
          arcSweep = endAngle - startAngle <= 180 ? '0' : '1';

      return {
        startX: start.x,
        startY: start.y,
        radius: radius,
        arcSweep: arcSweep,
        endX: end.x,
        endY: end.y
      };
    }
  }, {
    key: 'calculateCircularPathes',
    value: function calculateCircularPathes(x, y, rad) {
      var startAngle = void 0,
          endAngle = void 0,
          coords = void 0,
          path = '',
          pathes = [];
      var _props2 = this.props;
      var colorStart = _props2.colorStart;
      var colorEnd = _props2.colorEnd;
      var width = _props2.width;


      for (var i = 15; i >= 0; i--) {
        startAngle = i * 360 / 16;
        endAngle = (i + 1) * 360 / 16;
        coords = this.describeArc(x, y, Math.floor(rad), startAngle, endAngle);
        var _coords = coords;
        var startX = _coords.startX;
        var startY = _coords.startY;
        var radius = _coords.radius;
        var arcSweep = _coords.arcSweep;
        var endX = _coords.endX;
        var endY = _coords.endY;


        pathes.push(_react2.default.createElement('path', {
          d: 'M ' + (startX > endX ? startX + 1 : startX - 1) + ',' + (startY > endY ? startY + 1 : startY - 1) + ' A ' + radius + ',' + radius + ' 0 ' + arcSweep + ',0 ' + endX + ',' + endY,
          key: i,
          stroke: 'url(#cl' + (15 - i) + '-' + colorStart + '-' + colorEnd + '-' + width + ')'
        }));
        if (i === 15) {
          path = path.concat('M ' + startX + ',' + startY + ' A ' + radius + ',' + radius + ' 0 ' + arcSweep + ',0 ' + endX + ',' + endY);
        } else {
          path = path.concat(' A ' + radius + ',' + radius + ' 0 ' + arcSweep + ',0 ' + endX + ',' + endY);
        }
      }

      return { pathes: pathes, path: path };
    }
  }, {
    key: 'calculateGradient',
    value: function calculateGradient(colorStart, colorEnd) {
      var resultRed = void 0,
          resultGreen = void 0,
          resultBlue = void 0,
          percent = void 0,
          colors = [];

      for (var i = 0; i < 16; i++) {
        percent = i / 16;
        resultRed = colorStart.red + percent * (colorEnd.red - colorStart.red);
        resultGreen = colorStart.green + percent * (colorEnd.green - colorStart.green);
        resultBlue = colorStart.blue + percent * (colorEnd.blue - colorStart.blue);

        colors.push('rgb(' + Math.round(resultRed) + ', ' + Math.round(resultGreen) + ', ' + Math.round(resultBlue) + ')');
      }

      return colors;
    }
  }, {
    key: 'calculateStrokeDasharray',
    value: function calculateStrokeDasharray(width, strokeWidth) {
      return Math.ceil(Math.PI * (width - strokeWidth));
    }
  }, {
    key: 'calculateGradients',
    value: function calculateGradients() {
      var _props3 = this.props;
      var colorStart = _props3.colorStart;
      var colorEnd = _props3.colorEnd;
      var width = _props3.width;
      var colors = this.calculateGradient(this.hexToRgb(colorStart), this.hexToRgb(colorEnd));
      var gradientsCoordinates = [{ x1: '1', y1: '0', x2: '0', y2: '0.045' }, { x1: '1', y1: '0', x2: '0', y2: '0.455' }, { x1: '0.455', y1: '0', x2: '0', y2: '1' }, { x1: '0.045', y1: '0', x2: '0', y2: '1' }, { x1: '0', y1: '0', x2: '0.045', y2: '1' }, { x1: '0', y1: '0', x2: '0.455', y2: '1' }, { x1: '0', y1: '0', x2: '1', y2: '0.455' }, { x1: '0', y1: '0', x2: '1', y2: '0.045' }, { x1: '0', y1: '0.045', x2: '1', y2: '0' }, { x1: '0', y1: '0.455', x2: '1', y2: '0' }, { x1: '0', y1: '1', x2: '0.455', y2: '0' }, { x1: '0', y1: '1', x2: '0.045', y2: '0' }, { x1: '0.045', y1: '1', x2: '0', y2: '0' }, { x1: '0.455', y1: '1', x2: '0', y2: '0' }, { x1: '1', y1: '0.455', x2: '0', y2: '0' }, { x1: '1.1', y1: '0.045', x2: '0.2', y2: '0' }];

      return gradientsCoordinates.map(function (gradient, i) {
        return _react2.default.createElement(
          'linearGradient',
          {
            id: 'cl' + i + '-' + colorStart + '-' + colorEnd + '-' + width,
            key: i,
            x1: gradientsCoordinates[i].x1,
            x2: gradientsCoordinates[i].x2,
            y1: gradientsCoordinates[i].y1,
            y2: gradientsCoordinates[i].y2
          },
          _react2.default.createElement('stop', { stopColor: colors[i] }),
          _react2.default.createElement('stop', {
            offset: '100%',
            stopColor: colors[(i + 1) % gradientsCoordinates.length]
          })
        );
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props4 = this.props;
      var strokeLinecap = _props4.strokeLinecap;
      var strokeWidth = _props4.strokeWidth;
      var width = _props4.width;
      var colorEmpty = _props4.colorEmpty;
      var colorFill = _props4.colorFill;
      var colorStart = _props4.colorStart;
      var colorEnd = _props4.colorEnd;
      var height = width;
      var pathes = this.calculateCircularPathes(width / 2, height / 2, (width - strokeWidth) / 2).pathes;
      var path = this.calculateCircularPathes(width / 2, height / 2, (width - strokeWidth) / 2).path;
      var strokeDasharray = this.calculateStrokeDasharray(width, strokeWidth);
      var gradients = this.calculateGradients();

      return _react2.default.createElement(
        'svg',
        {
          className: 'circular-progress',
          height: height,
          width: width
        },
        _react2.default.createElement(
          'defs',
          null,
          _react2.default.createElement(
            'pattern',
            {
              height: height,
              id: 'circle-gradient-angular-' + colorStart + '-' + colorEnd + '-' + width,
              patternUnits: 'userSpaceOnUse',
              width: width
            },
            _react2.default.createElement(
              'g',
              {
                fill: 'none',
                strokeWidth: strokeWidth + 2
              },
              pathes
            )
          ),
          gradients
        ),
        _react2.default.createElement('path', {
          d: path,
          fill: colorFill,
          stroke: colorEmpty,
          strokeDasharray: strokeDasharray,
          strokeLinecap: strokeLinecap,
          strokeWidth: strokeWidth - 1
        }),
        _react2.default.createElement('path', {
          className: 'filling-gradient',
          d: path,
          fill: 'transparent',
          ref: 'fillingGradient',
          stroke: 'url(#circle-gradient-angular-' + colorStart + '-' + colorEnd + '-' + width + ')',
          strokeDasharray: strokeDasharray,
          strokeLinecap: strokeLinecap,
          strokeWidth: strokeWidth
        })
      );
    }
  }]);

  return ProgressCircularGradiented;
}(_react2.default.Component);

ProgressCircularGradiented.propTypes = {
  colorEmpty: _react2.default.PropTypes.string,
  colorEnd: _react2.default.PropTypes.string,
  colorFill: _react2.default.PropTypes.string,
  colorStart: _react2.default.PropTypes.string,
  percentage: _react2.default.PropTypes.number,
  strokeLinecap: _react2.default.PropTypes.string,
  strokeWidth: _react2.default.PropTypes.number,
  width: _react2.default.PropTypes.number
};
ProgressCircularGradiented.defaultProps = {
  colorEmpty: '#37354F',
  colorEnd: '#FADB4D',
  colorFill: 'transparent',
  colorStart: '#E64D59',
  percentage: 0,
  strokeLinecap: 'round',
  strokeWidth: 17,
  width: 160
};
exports.default = ProgressCircularGradiented;