import path from "path";
import { fileURLToPath } from "url";
import webpack from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { EsbuildPlugin } from "esbuild-loader";

// Reconstruct __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getUtilsChunkName(module) {
    const resource = module.nameForCondition?.() || module.resource || "";
    const normalizedResource = resource.replace(/\\/g, "/");
    const match = normalizedResource.match(
        /\/CoCreate-utils\/src\/modules\/(.+?)\.js$/
    );

    if (!match) {
        return "utils-shared";
    }

    const modulePath = match[1];
    if (modulePath === "ast/index" || modulePath === "ast/operators") {
        return "utils-ast";
    }

    const readableName = modulePath
        .replace(/\/index$/, "")
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/[\/_]+/g, "-")
        .toLowerCase();

    return `utils-${readableName}`;
}

function getEditorChunkName(module) {
    const resource = module.nameForCondition?.() || module.resource || "";
    const normalizedResource = resource.replace(/\\/g, "/");
    const match = normalizedResource.match(
        /\/CoCreate-editor\/src\/editors\/(.+?)\.js$/
    );

    if (!match) {
        return "editor-shared";
    }

    const readableName = match[1]
        .replace(/\/index$/, "")
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/[\/_]+/g, "-")
        .toLowerCase();

    if (readableName === "utilities-config") {
        return "editor-syntax";
    }

    return `editor-${readableName}`;
}

import CoCreateConfig from "./CoCreate.config.js";
import cocreateWebpack from "@cocreate/webpack";
const { ModuleGenerator, FileUploader, UnicodeLoader } = cocreateWebpack;

const workspaceAliases = Object.values(CoCreateConfig.modules || {}).reduce(
    (aliases, moduleConfig) => {
        if (moduleConfig.import && moduleConfig.path) {
            aliases[`${moduleConfig.import}$`] = path.resolve(
                __dirname,
                moduleConfig.path
            );
        }
        return aliases;
    },
    {}
);

export default async (env, argv) => {
    const isProduction = argv.mode === "production";
    
    const config = {
        entry: {
            CoCreate: "./CoCreate.index.js"
        },

        output: {
            path: path.resolve(__dirname, "./src/dist"),
            filename: isProduction ? "[name].js" : "[name].js",
            chunkFilename: isProduction ? "[name].js" : "[name].js",
            library: "CoCreate", // Global namespace in the browser
            libraryExport: "default", 
            clean: true
        },

        // Explicitly target client/browser environment
        target: "web", 

        experiments: {
            asyncWebAssembly: true,
            topLevelAwait: true
        },

        resolve: {
            // Prioritize browser fields/conditions when resolving package exports
            conditionNames: ["browser", "import", "require"],

            alias: {
                // Resolve every configured CoCreate dependency to one workspace module
                ...workspaceAliases,
                // Force @cocreate/utils to resolve directly to the browser entry point
                "@cocreate/utils$": path.resolve(__dirname, "node_modules/@cocreate/utils/src/browser.js")
            },

            fallback: {
                // Completely exclude server-only node core modules from the client bundle
                "child_process": false,
                "fs": false,
                "module": false,
                "os": false,
                "path": false,
                "readline": false,
                "url": false,
                "util": false,
                "stream": false,
                "crypto": false,
                "http": false,
                "https": false,
                "zlib": false,
                "assert": false,
                "buffer": false
            }
        },
        
        plugins: [
            new ModuleGenerator(CoCreateConfig),
            new FileUploader(env, argv),
            
            // Bypass compile-time evaluation and prevent compiling of 'node:*' schemes
            new webpack.IgnorePlugin({
                resourceRegExp: /^node:/
            }),
            
            // Redirect any dynamic import of "CoCreate.config.js" straight to root
            new webpack.NormalModuleReplacementPlugin(
                /CoCreate\.config\.js$/,
                function (resource) {
                    resource.request = path.resolve(__dirname, "./CoCreate.config.js");
                }
            ),

            new MiniCssExtractPlugin({
                filename: isProduction ? "[name].css" : "[name].css",
            })
        ],

        mode: isProduction ? "production" : "development",
        devtool: isProduction ? false : "eval-source-map",

        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: (modulePath) => {
                        if (/ffmpeg/.test(modulePath)) {
                            return true;
                        }
                        // Do not exclude @cocreate modules inside node_modules
                        if (/node_modules/.test(modulePath) && !/@cocreate/.test(modulePath)) {
                            return true;
                        }
                        return false;
                    },
                    use: [
                        {
                            loader: "esbuild-loader",
                            options: {
                                target: "es2017"
                            }
                        },
                        {
                            // Positioned last in array to execute FIRST on raw files
                            loader: path.resolve(
                                __dirname,
                                "node_modules/@cocreate/webpack/src/replace-unicode.js"
                            )
                        }
                    ]
                },
                {
                    test: /\.css$/i,
                    use: [MiniCssExtractPlugin.loader, "css-loader"]
                },
                {
                    test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                    type: "asset/resource",
                    generator: {
                        filename: "fonts/[name][ext][query]"
                    }
                }
            ]
        },

        optimization: {
            minimize: isProduction,
            minimizer: [
                new EsbuildPlugin({
                    target: "es2017",
                    minify: true,
                    css: true,
                    charset: "utf8" // Prevents esbuild from stripping/mangling unicode escapes
                })
            ],

            splitChunks: {
                chunks: "all",
                minSize: 1,
                minChunks: 1,
                maxAsyncRequests: 30,
                maxInitialRequests: 30,
                enforceSizeThreshold: 50000,
                cacheGroups: {
                    defaultVendors: false,
                    utils: {
                        test: /[\\/]CoCreate-utils[\\/]src[\\/]modules[\\/]/,
                        name: getUtilsChunkName,
                        chunks: "all",
                        enforce: true,
                        priority: 30,
                        reuseExistingChunk: true
                    },
                    editor: {
                        test: /[\\/]CoCreate-editor[\\/]src[\\/]editors[\\/]/,
                        name: getEditorChunkName,
                        chunks: "all",
                        enforce: true,
                        priority: 30,
                        reuseExistingChunk: true
                    },
                    ws: {
                        test: /[\\/]CoCreate-socket-client[\\/]node_modules[\\/]ws[\\/]browser\.js$/,
                        name: "ws",
                        chunks: "all",
                        enforce: true,
                        priority: 30,
                        reuseExistingChunk: true
                    }
                }
            }
        },
        
        performance: {
            hints: isProduction ? "warning" : false,
            maxEntrypointSize: 512000,
            maxAssetSize: 512000
        }
    };

    return config;
};
