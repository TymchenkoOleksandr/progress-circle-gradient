import React from 'react'

class ProgressCircularGradiented extends React.Component {
  static propTypes = {
    colorEmpty: React.PropTypes.string,
    colorEnd: React.PropTypes.string,
    colorFill: React.PropTypes.string,
    colorStart: React.PropTypes.string,
    percentage: React.PropTypes.number,
    strokeLinecap: React.PropTypes.string,
    strokeWidth: React.PropTypes.number,
    width: React.PropTypes.number
  }

  static defaultProps = {
    colorEmpty: '#37354F',
    colorEnd: '#FADB4D',
    colorFill: 'transparent',
    colorStart: '#E64D59',
    percentage: 0,
    strokeLinecap: 'round',
    strokeWidth: 17,
    width: 160
  }

  componentDidMount() {
    this.updateAttributes()
  }

  shouldComponentUpdate(nextProps) {
    return nextProps !== this.props
  }

  componentDidUpdate() {
    this.updateAttributes()
  }

  updateAttributes() {
    const  { percentage, strokeWidth, width, colorStart, colorEnd } = this.props,
      strokeDasharray = this.calculateStrokeDasharray(width, strokeWidth),
      strokeDashoffset = ( 1 - percentage ) * strokeDasharray

    if (percentage === 0) this.refs.fillingGradient.setAttribute('stroke', 'transparent')
    else {
      this.refs.fillingGradient.setAttribute('stroke', `url(#circle-gradient-angular-${colorStart}-${colorEnd}-${width})`)
      this.refs.fillingGradient.setAttribute('stroke-dashoffset', strokeDashoffset)
    }
  }

  hexToRgb(hex) {
    const result = (/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(hex)
    return result ? {
      red: parseInt(result[1], 16),
      green: parseInt(result[2], 16),
      blue: parseInt(result[3], 16)
    } : null
  }

  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180

    return {
      x: Math.round(centerX + (radius * Math.cos(angleInRadians))),
      y: Math.round(centerY + (radius * Math.sin(angleInRadians)))
    }
  }

  describeArc(x, y, radius, startAngle, endAngle) {
    const start = this.polarToCartesian(x, y, radius, endAngle),
      end = this.polarToCartesian(x, y, radius, startAngle),
      arcSweep = endAngle - startAngle <= 180 ? '0' : '1'

    return {
      startX: start.x,
      startY: start.y,
      radius: radius,
      arcSweep: arcSweep,
      endX: end.x,
      endY: end.y
    }
  }

  calculateCircularPathes(x, y, rad) {
    let startAngle, endAngle, coords, path = '', pathes = []
    const { colorStart, colorEnd, width } = this.props

    for (let i = 15; i >= 0; i--) {
      startAngle = i * 360 / 16
      endAngle = (i + 1) * 360 / 16
      coords = this.describeArc(x, y, Math.floor(rad), startAngle, endAngle)
      const {startX, startY, radius, arcSweep, endX, endY} = coords

      pathes.push(
        <path
          d={`M ${startX > endX ? startX + 1 : startX - 1},${startY > endY ? startY + 1 : startY - 1} A ${radius},${radius} 0 ${arcSweep},0 ${endX},${endY}`}
          key={i}
          stroke={`url(#cl${15 - i}-${colorStart}-${colorEnd}-${width})`}
        />
      )
      if (i === 15) {
        path = path.concat(`M ${startX},${startY} A ${radius},${radius} 0 ${arcSweep},0 ${endX},${endY}`)
      }
      else {
        path = path.concat(` A ${radius},${radius} 0 ${arcSweep},0 ${endX},${endY}`)
      }
    }

    return {pathes, path}
  }

  calculateGradient(colorStart, colorEnd) {
    let resultRed, resultGreen, resultBlue, percent, colors = []

    for (let i = 0; i < 16; i++) {
      percent = i / 16
      resultRed = colorStart.red + percent * (colorEnd.red - colorStart.red)
      resultGreen = colorStart.green + percent * (colorEnd.green - colorStart.green)
      resultBlue = colorStart.blue + percent * (colorEnd.blue - colorStart.blue)

      colors.push(`rgb(${Math.round(resultRed)}, ${Math.round(resultGreen)}, ${Math.round(resultBlue)})`)
    }

    return colors
  }

  calculateStrokeDasharray(width, strokeWidth) {
    return Math.ceil(Math.PI * (width - strokeWidth))
  }

  calculateGradients() {
    const { colorStart, colorEnd, width } = this.props,
      colors = this.calculateGradient(this.hexToRgb(colorStart), this.hexToRgb(colorEnd)),
      gradientsCoordinates = [
        {x1: '1', y1: '0', x2: '0', y2: '0.045'},
        {x1: '1', y1: '0', x2: '0', y2: '0.455'},
        {x1: '0.455', y1: '0', x2: '0', y2: '1'},
        {x1: '0.045', y1: '0', x2: '0', y2: '1'},
        {x1: '0', y1: '0', x2: '0.045', y2: '1'},
        {x1: '0', y1: '0', x2: '0.455', y2: '1'},
        {x1: '0', y1: '0', x2: '1', y2: '0.455'},
        {x1: '0', y1: '0', x2: '1', y2: '0.045'},
        {x1: '0', y1: '0.045', x2: '1', y2: '0'},
        {x1: '0', y1: '0.455', x2: '1', y2: '0'},
        {x1: '0', y1: '1', x2: '0.455', y2: '0'},
        {x1: '0', y1: '1', x2: '0.045', y2: '0'},
        {x1: '0.045', y1: '1', x2: '0', y2: '0'},
        {x1: '0.455', y1: '1', x2: '0', y2: '0'},
        {x1: '1', y1: '0.455', x2: '0', y2: '0'},
        {x1: '1.1', y1: '0.045', x2: '0.2', y2: '0'}
      ]

    return gradientsCoordinates.map((gradient, i) => (
      <linearGradient
        id={`cl${i}-${colorStart}-${colorEnd}-${width}`}
        key={i}
        x1={gradientsCoordinates[i].x1}
        x2={gradientsCoordinates[i].x2}
        y1={gradientsCoordinates[i].y1}
        y2={gradientsCoordinates[i].y2}
      >
        <stop stopColor={colors[i]}/>
        <stop
          offset="100%"
          stopColor={colors[(i + 1) % gradientsCoordinates.length]}
        />
      </linearGradient>
    ))
  }

  render() {
    const { strokeLinecap, strokeWidth, width, colorEmpty, colorFill, colorStart, colorEnd } = this.props,
      height = width,
      pathes = this.calculateCircularPathes(width / 2, height / 2, (width - strokeWidth) / 2).pathes,
      path = this.calculateCircularPathes(width / 2, height / 2, (width - strokeWidth) / 2).path,
      strokeDasharray = this.calculateStrokeDasharray(width, strokeWidth),
      gradients = this.calculateGradients()

    return (
      <svg
        className="circular-progress"
        height={height}
        width={width}
      >
        <defs>
          <pattern
            height={height}
            id={`circle-gradient-angular-${colorStart}-${colorEnd}-${width}`}
            patternUnits="userSpaceOnUse"
            width={width}
          >
            <g
              fill="none"
              strokeWidth={strokeWidth + 2}
            >
              {pathes}
            </g>
          </pattern>
          {gradients}
        </defs>

        <path
          d={path}
          fill={colorFill}
          stroke={colorEmpty}
          strokeDasharray={strokeDasharray}
          strokeLinecap={strokeLinecap}
          strokeWidth={strokeWidth - 1}
        />

        <path
          className="filling-gradient"
          d={path}
          fill="transparent"
          ref="fillingGradient"
          stroke={`url(#circle-gradient-angular-${colorStart}-${colorEnd}-${width})`}
          strokeDasharray={strokeDasharray}
          strokeLinecap={strokeLinecap}
          strokeWidth={strokeWidth}
        />
      </svg>
    )
  }
}

export default ProgressCircularGradiented
