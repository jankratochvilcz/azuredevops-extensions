const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    target: "web",
    entry: {
        js: ["babel-polyfill", "./src/index.js"]
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                options: { presets: ["@babel/env"] }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.less$/,
                use: ["style-loader", "css-loader", "less-loader"]
            }
        ]
    },
    resolve: { extensions: ["*", ".js", ".jsx"] },
    output: {
        path: path.resolve(__dirname, "dist/"),
        publicPath: "/dist/",
        filename: "bundle.js"
    },
    externals: [
        /^VSS\/.*/, /^TFS\/.*/
    ],
    devtool: "inline-source-map",
    devServer: {
        https: true
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: "./assets/*.png", to: "./" },
            { from: "./node_modules/vss-web-extension-sdk/lib/VSS.SDK.min.js", to: "lib/VSS.SDK.min.js" },
            { from: "./node_modules/office-ui-fabric-react/dist/css/fabric.min.css", to: "lib/fabric.min.css" },
            { from: "./src/*.html", to: "./" },
            { from: "./vss-extension.json", to: "vss-extension.json" },
            { from: "./gallery/*.md", to: "." },
            { from: "./gallery/images/*.png", to: "./" }
        ])]
};
