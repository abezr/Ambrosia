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
                <title></title>
                <meta name="viewport" content="width=device-width, user-scalable=no" />
                <link rel='stylesheet' href='' />
            </head>
            <body>
                <div id="app" className='' dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
            </body>
            <script dangerouslySetInnerHTML={{__html: this.props.state}}></script>
            <script src="/dist/bundle.js" defer></script>
            </html>
        );
    }
});

module.exports = Html;
export default Html;
