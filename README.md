# circular-progress-angular-gradient

![Samples](/sample.gif?raw=true "Samples")

A React Component generates SVG circular progress-bar. Animation uses CSS3 transition.


## Installation

The easiest way to use circular-progress-angular-gradient is to install it from NPM and import it in your own React Component.

```
npm install circular-progress-angular-gradient --save
```


## Usage

```jsx
import Progress from 'circular-progress-angular-gradient';

<div>Awesome Progress <Progress percentage={0.5}/></div>
```

paste following styles into your project styles for progress animation:
```css
@keyframes load {0% {stroke-dashoffset: 0;} }

.circular-progress {
  .filling-gradient {animation: load 4s ease-in-out;}
  // transform: scale(-1, 1); // horizontal mirroring if needed
}
```


### Properties

* 'colorEmpty': Color of the empty part of progress-bar. String with hex color code. For example - '#37354F',
* 'colorEnd': Color of the gradient end. String with hex color code. For example - '#FADB4D',
* 'colorStart': Color of the gradient start. String with hex color code. For example - '#E64D59',
* 'percentage': Percentage of progress-bar filling. Float, from 0 to 1. For example - 0.3,
* 'strokeLinecap': Type of filling stroke line ending. Valid values - ['butt', 'round', 'square'],
* 'strokeWidth': Width (px) of stroke line. Integer. For example - 17,
* 'width': Width (px) of progress-bar. Integer. For example - 160


### Examples

```jsx
<Progress
  colorEmpty: '#37354F',
  colorEnd: '#FADB4D',
  colorStart: '#E64D59',
  percentage: {0.4},
  strokeLinecap: 'round',
  strokeWidth: {17},
  width: {160}
/>
```

### Notes

If using on mobile, don't forget the viewport meta tag:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
```

## License

See LICENSE.txt for details.
