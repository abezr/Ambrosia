var React = require('react');

var Html = React.createClass({

    /**
     * Refer to React documentation render
     *
     * @method render
     * @return {Object} HTML head section
     */
    render: function() {
        return (
            <html>
            <head>
                <meta charSet="utf-8" />
                <title>Relay Implementation</title>
                <meta name="viewport" content="width=device-width, user-scalable=no" />
            </head>
            <body>
              <div id="app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
            <script src='node_modules/react/dist/react.min.js'></script>
            </body>
            </html>
        );
    }
});

module.exports = Html;
export default Html;
