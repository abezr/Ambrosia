import React from react;
import Heroes from './components/heroes.jsx';

var Heroes = React.createFactory(Heroes);

//Note: Allways pass in props when building an element with 'createFactory'!
React.render(Heroes);
