const HtmlWebpackPlugin = require('html-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development';
const config = require('./public/config')[isDev ? 'dev' : 'build'];
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
module.exports ={
    mode: isDev ? 'development' : 'production',
    devServer: {
      port: 3000,
      quiet: false,
      overlay: false
    },
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'), //必须是绝对路径
        filename: 'bundle.js',
        publicPath: '/' //通常是CDN地址
    },
    devtool: 'source-map', //开发环境下使用
    module: {
        rules:[
            {
                test: '/\.jsx?$/',
                use: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /.html$/,
                use: 'html-withimg-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(le|c)ss$/,
                use: ['style-loader', 'css-loader', {
                    loader:'postcss-loader',
                    options: {
                        plugins: function () {
                            return [
                                require('autoprefixer')({
                                    "overrideBrowserslist": [
                                        ">0.25%",
                                        "not dead"
                                    ]
                                })
                            ]
                        }
                    }
                }, 'less-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 3000,
                        esModule: false,
                        outputPath: 'assets'
                    }
                }],
                exclude: /node_modules/
            }
            
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html',
            config: config.template,
            minify: {
                removeAttributeQuotes: false,
                collapseWhitespace: false
            }
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['!dist/assets/**']
        })
    ]
}