var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PIXI;
(function (PIXI) {
    var extras;
    (function (extras) {
        var shaderLib = [
            {
                vertUniforms: "",
                vertCode: "vTextureCoord = aTextureCoord;",
                fragUniforms: "uniform vec4 uTextureClamp;",
                fragCode: "vec2 textureCoord = clamp(vTextureCoord, uTextureClamp.xy, uTextureClamp.zw);"
            },
            {
                vertUniforms: "uniform mat3 uTransform;",
                vertCode: "vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;",
                fragUniforms: "",
                fragCode: "vec2 textureCoord = vTextureCoord;"
            },
            {
                vertUniforms: "uniform mat3 uTransform;",
                vertCode: "vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;",
                fragUniforms: "uniform mat3 uMapCoord;\nuniform vec4 uClampFrame;\nuniform vec2 uClampOffset;",
                fragCode: "vec2 textureCoord = mod(vTextureCoord - uClampOffset, vec2(1.0, 1.0)) + uClampOffset;" +
                    "\ntextureCoord = (uMapCoord * vec3(textureCoord, 1.0)).xy;" +
                    "\ntextureCoord = clamp(textureCoord, uClampFrame.xy, uClampFrame.zw);"
            }
        ];
        var PictureShader = (function (_super) {
            __extends(PictureShader, _super);
            function PictureShader(gl, vert, frag, tilingMode) {
                var lib = shaderLib[tilingMode];
                _super.call(this, gl, vert.replace(/%SPRITE_UNIFORMS%/gi, lib.vertUniforms)
                    .replace(/%SPRITE_CODE%/gi, lib.vertCode), frag.replace(/%SPRITE_UNIFORMS%/gi, lib.fragUniforms)
                    .replace(/%SPRITE_CODE%/gi, lib.fragCode));
                this.bind();
                this.tilingMode = tilingMode;
                this.tempQuad = new PIXI.Quad(gl);
                this.tempQuad.initVao(this);
                this.uniforms.uColor = new Float32Array([1, 1, 1, 1]);
                this.uniforms.uSampler = [0, 1];
            }
            PictureShader.blendVert = "\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\n\nuniform mat3 projectionMatrix;\nuniform mat3 mapMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec2 vMapCoord;\n%SPRITE_UNIFORMS%\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    %SPRITE_CODE%\n    vMapCoord = (mapMatrix * vec3(aVertexPosition, 1.0)).xy;\n}\n";
            return PictureShader;
        }(PIXI.Shader));
        extras.PictureShader = PictureShader;
    })(extras = PIXI.extras || (PIXI.extras = {}));
})(PIXI || (PIXI = {}));
var PIXI;
(function (PIXI) {
    var extras;
    (function (extras) {
        var overlayFrag = "\nvarying vec2 vTextureCoord;\nvarying vec2 vMapCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler[2];\nuniform vec4 uColor;\n%SPRITE_UNIFORMS%\n\nvoid main(void)\n{\n    %SPRITE_CODE%\n    vec4 source = texture2D(uSampler[0], textureCoord) * uColor;\n    vec4 target = texture2D(uSampler[1], vMapCoord);\n\n    //reverse hardlight\n    if (source.a == 0.0) {\n        gl_FragColor = vec4(0, 0, 0, 0);\n        return;\n    }\n    //yeah, premultiplied\n    vec3 Cb = source.rgb/source.a, Cs;\n    if (target.a > 0.0) {\n        Cs = target.rgb / target.a;\n    }\n    vec3 multiply = Cb * Cs * 2.0;\n    vec3 Cs2 = Cs * 2.0 - 1.0;\n    vec3 screen = Cb + Cs2 - Cb * Cs2;\n    vec3 B;\n    if (Cb.r <= 0.5) {\n        B.r = multiply.r;\n    } else {\n        B.r = screen.r;\n    }\n    if (Cb.g <= 0.5) {\n        B.g = multiply.g;\n    } else {\n        B.g = screen.g;\n    }\n    if (Cb.b <= 0.5) {\n        B.b = multiply.b;\n    } else {\n        B.b = screen.b;\n    }\n    vec4 res;\n    res.xyz = (1.0 - source.a) * Cs + source.a * B;\n    res.a = source.a + target.a * (1.0-source.a);\n    gl_FragColor = vec4(res.xyz * res.a, res.a);\n}\n";
        var HardLightShader = (function (_super) {
            __extends(HardLightShader, _super);
            function HardLightShader(gl, tilingMode) {
                _super.call(this, gl, extras.PictureShader.blendVert, overlayFrag, tilingMode);
            }
            return HardLightShader;
        }(extras.PictureShader));
        extras.HardLightShader = HardLightShader;
    })(extras = PIXI.extras || (PIXI.extras = {}));
})(PIXI || (PIXI = {}));
var PIXI;
(function (PIXI) {
    var extras;
    (function (extras) {
        function mapFilterBlendModesToPixi(gl, array) {
            if (array === void 0) { array = []; }
            array[PIXI.BLEND_MODES.OVERLAY] = [new extras.OverlayShader(gl, 0), new extras.OverlayShader(gl, 1), new extras.OverlayShader(gl, 2)];
            array[PIXI.BLEND_MODES.HARD_LIGHT] = [new extras.HardLightShader(gl, 0), new extras.HardLightShader(gl, 1), new extras.HardLightShader(gl, 2)];
            return array;
        }
        extras.mapFilterBlendModesToPixi = mapFilterBlendModesToPixi;
    })(extras = PIXI.extras || (PIXI.extras = {}));
})(PIXI || (PIXI = {}));
var PIXI;
(function (PIXI) {
    var extras;
    (function (extras) {
        var normalFrag = "\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler[2];\nuniform vec4 uColor;\n%SPRITE_UNIFORMS%\n\nvoid main(void)\n{\n    %SPRITE_CODE%\n\n    vec4 sample = texture2D(uSampler[0], textureCoord);\n    gl_FragColor = sample * uColor;\n}\n";
        var normalVert = "\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n%SPRITE_UNIFORMS%\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    %SPRITE_CODE%\n}\n";
        var NormalShader = (function (_super) {
            __extends(NormalShader, _super);
            function NormalShader(gl, tilingMode) {
                _super.call(this, gl, normalVert, normalFrag, tilingMode);
            }
            return NormalShader;
        }(extras.PictureShader));
        extras.NormalShader = NormalShader;
    })(extras = PIXI.extras || (PIXI.extras = {}));
})(PIXI || (PIXI = {}));
var PIXI;
(function (PIXI) {
    var extras;
    (function (extras) {
        var overlayFrag = "\nvarying vec2 vTextureCoord;\nvarying vec2 vMapCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler[2];\nuniform vec4 uColor;\n%SPRITE_UNIFORMS%\n\nvoid main(void)\n{\n    %SPRITE_CODE%\n    vec4 source = texture2D(uSampler[0], textureCoord) * uColor;\n    vec4 target = texture2D(uSampler[1], vMapCoord);\n\n    //reverse hardlight\n    if (source.a == 0.0) {\n        gl_FragColor = vec4(0, 0, 0, 0);\n        return;\n    }\n    //yeah, premultiplied\n    vec3 Cb = source.rgb/source.a, Cs;\n    if (target.a > 0.0) {\n        Cs = target.rgb / target.a;\n    }\n    vec3 multiply = Cb * Cs * 2.0;\n    vec3 Cb2 = Cb * 2.0 - 1.0;\n    vec3 screen = Cb2 + Cs - Cb2 * Cs;\n    vec3 B;\n    if (Cs.r <= 0.5) {\n        B.r = multiply.r;\n    } else {\n        B.r = screen.r;\n    }\n    if (Cs.g <= 0.5) {\n        B.g = multiply.g;\n    } else {\n        B.g = screen.g;\n    }\n    if (Cs.b <= 0.5) {\n        B.b = multiply.b;\n    } else {\n        B.b = screen.b;\n    }\n    vec4 res;\n    res.xyz = (1.0 - source.a) * Cs + source.a * B;\n    res.a = source.a + target.a * (1.0-source.a);\n    gl_FragColor = vec4(res.xyz * res.a, res.a);\n}\n";
        var OverlayShader = (function (_super) {
            __extends(OverlayShader, _super);
            function OverlayShader(gl, tilingMode) {
                _super.call(this, gl, extras.PictureShader.blendVert, overlayFrag, tilingMode);
            }
            return OverlayShader;
        }(extras.PictureShader));
        extras.OverlayShader = OverlayShader;
    })(extras = PIXI.extras || (PIXI.extras = {}));
})(PIXI || (PIXI = {}));
var PIXI;
(function (PIXI) {
    var extras;
    (function (extras) {
        function nextPow2(v) {
            v += (v === 0) ? 1 : 0;
            --v;
            v |= v >>> 1;
            v |= v >>> 2;
            v |= v >>> 4;
            v |= v >>> 8;
            v |= v >>> 16;
            return v + 1;
        }
        var PictureRenderer = (function (_super) {
            __extends(PictureRenderer, _super);
            function PictureRenderer(renderer) {
                _super.call(this, renderer);
            }
            PictureRenderer.prototype.onContextChange = function () {
                var gl = this.renderer.gl;
                this.drawModes = extras.mapFilterBlendModesToPixi(gl);
                this.normalShader = [new extras.NormalShader(gl, 0), new extras.NormalShader(gl, 1), new extras.NormalShader(gl, 2)];
                this._tempClamp = new Float32Array(4);
                this._tempColor = new Float32Array(4);
                this._tempRect = new PIXI.Rectangle();
                this._tempRect2 = new PIXI.Rectangle();
                this._tempRect3 = new PIXI.Rectangle();
                this._tempMatrix = new PIXI.Matrix();
                this._tempMatrix2 = new PIXI.Matrix();
                this._bigBuf = new Uint8Array(1 << 20);
                this._renderTexture = new PIXI.BaseRenderTexture(1024, 1024);
            };
            PictureRenderer.prototype.start = function () {
            };
            PictureRenderer.prototype.flush = function () {
            };
            PictureRenderer.prototype._getRenderTexture = function (minWidth, minHeight) {
                if (this._renderTexture.width < minWidth ||
                    this._renderTexture.height < minHeight) {
                    minHeight = nextPow2(minWidth);
                    minHeight = nextPow2(minHeight);
                    this._renderTexture.resize(minWidth, minHeight);
                }
                return this._renderTexture;
            };
            PictureRenderer.prototype._getBuf = function (size) {
                var buf = this._bigBuf;
                if (buf.length < size) {
                    size = nextPow2(size);
                    buf = new Uint8Array(size);
                    this._bigBuf = buf;
                }
                return buf;
            };
            PictureRenderer.prototype.render = function (sprite) {
                if (!sprite.texture.valid) {
                    return;
                }
                var tilingMode = 0;
                if (sprite.tileTransform) {
                    tilingMode = this._isSimpleSprite(sprite) ? 1 : 2;
                }
                var blendShader = this.drawModes[sprite.blendMode];
                if (blendShader) {
                    this._renderBlend(sprite, blendShader[tilingMode]);
                }
                else {
                    this._renderNormal(sprite, this.normalShader[tilingMode]);
                }
            };
            PictureRenderer.prototype._renderNormal = function (sprite, shader) {
                var renderer = this.renderer;
                renderer.bindShader(shader);
                renderer.state.setBlendMode(sprite.blendMode);
                this._renderInner(sprite, shader);
            };
            PictureRenderer.prototype._renderBlend = function (sprite, shader) {
                var renderer = this.renderer;
                var spriteBounds = sprite.getBounds();
                var renderTarget = renderer._activeRenderTarget;
                var matrix = renderTarget.projectionMatrix;
                var flipX = matrix.a < 0;
                var flipY = matrix.d < 0;
                var resolution = renderTarget.resolution;
                var screen = this._tempRect;
                var fr = renderTarget.sourceFrame || renderTarget.destinationFrame;
                screen.x = 0;
                screen.y = 0;
                screen.width = fr.width;
                screen.height = fr.height;
                var bounds = this._tempRect2;
                var fbw = fr.width * resolution, fbh = fr.height * resolution;
                bounds.x = (spriteBounds.x + matrix.tx / matrix.a) * resolution + fbw / 2;
                bounds.y = (spriteBounds.y + matrix.ty / matrix.d) * resolution + fbh / 2;
                bounds.width = spriteBounds.width * resolution;
                bounds.height = spriteBounds.height * resolution;
                if (flipX) {
                    bounds.y = fbw - bounds.width - bounds.x;
                }
                if (flipY) {
                    bounds.y = fbh - bounds.height - bounds.y;
                }
                var screenBounds = this._tempRect3;
                var x_1 = Math.floor(Math.max(screen.x, bounds.x));
                var x_2 = Math.ceil(Math.min(screen.x + screen.width, bounds.x + bounds.width));
                var y_1 = Math.floor(Math.max(screen.y, bounds.y));
                var y_2 = Math.ceil(Math.min(screen.y + screen.height, bounds.y + bounds.height));
                var pixelsWidth = x_2 - x_1;
                var pixelsHeight = y_2 - y_1;
                if (pixelsWidth <= 0 || pixelsHeight <= 0) {
                    return;
                }
                var rt = this._getRenderTexture(pixelsWidth, pixelsHeight);
                renderer.bindTexture(rt, 1, true);
                var gl = renderer.gl;
                if (renderer.renderingToScreen && renderTarget.root) {
                    var buf = this._getBuf(pixelsWidth * pixelsHeight * 4);
                    gl.readPixels(x_1, y_1, pixelsWidth, pixelsHeight, gl.RGBA, gl.UNSIGNED_BYTE, this._bigBuf);
                    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, pixelsWidth, pixelsHeight, gl.RGBA, gl.UNSIGNED_BYTE, this._bigBuf);
                }
                else {
                    gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, 0, 0, x_1, y_1, pixelsWidth, pixelsHeight);
                }
                renderer.bindShader(shader);
                renderer.state.setBlendMode(PIXI.BLEND_MODES.NORMAL);
                if (shader.uniforms.mapMatrix) {
                    var mapMatrix = this._tempMatrix;
                    mapMatrix.a = bounds.width / rt.width / spriteBounds.width;
                    if (flipX) {
                        mapMatrix.a = -mapMatrix.a;
                        mapMatrix.tx = (bounds.x - x_1) / rt.width - (spriteBounds.x + spriteBounds.width) * mapMatrix.a;
                    }
                    else {
                        mapMatrix.tx = (bounds.x - x_1) / rt.width - spriteBounds.x * mapMatrix.a;
                    }
                    mapMatrix.d = bounds.height / rt.height / spriteBounds.height;
                    if (flipY) {
                        mapMatrix.d = -mapMatrix.d;
                        mapMatrix.ty = (bounds.y - y_1) / rt.height - (spriteBounds.y + spriteBounds.height) * mapMatrix.d;
                    }
                    else {
                        mapMatrix.ty = (bounds.y - y_1) / rt.height - spriteBounds.y * mapMatrix.d;
                    }
                    shader.uniforms.mapMatrix = mapMatrix.toArray(true);
                }
                this._renderInner(sprite, shader);
            };
            PictureRenderer.prototype._renderInner = function (sprite, shader) {
                var renderer = this.renderer;
                if (shader.tilingMode > 0) {
                    this._renderWithShader(sprite, shader.tilingMode === 1, shader);
                }
                else {
                    this._renderSprite(sprite, shader);
                }
            };
            PictureRenderer.prototype._renderWithShader = function (ts, isSimple, shader) {
                var quad = shader.tempQuad;
                var renderer = this.renderer;
                renderer.bindVao(quad.vao);
                var vertices = quad.vertices;
                var _width = ts._width;
                var _height = ts._height;
                var _anchorX = ts._anchor._x;
                var _anchorY = ts._anchor._y;
                var w0 = _width * (1 - _anchorX);
                var w1 = _width * -_anchorX;
                var h0 = _height * (1 - _anchorY);
                var h1 = _height * -_anchorY;
                var wt = ts.transform.worldTransform;
                var a = wt.a;
                var b = wt.b;
                var c = wt.c;
                var d = wt.d;
                var tx = wt.tx;
                var ty = wt.ty;
                vertices[0] = (a * w1) + (c * h1) + tx;
                vertices[1] = (d * h1) + (b * w1) + ty;
                vertices[2] = (a * w0) + (c * h1) + tx;
                vertices[3] = (d * h1) + (b * w0) + ty;
                vertices[4] = (a * w0) + (c * h0) + tx;
                vertices[5] = (d * h0) + (b * w0) + ty;
                vertices[6] = (a * w1) + (c * h0) + tx;
                vertices[7] = (d * h0) + (b * w1) + ty;
                vertices = quad.uvs;
                vertices[0] = vertices[6] = -ts.anchor.x;
                vertices[1] = vertices[3] = -ts.anchor.y;
                vertices[2] = vertices[4] = 1.0 - ts.anchor.x;
                vertices[5] = vertices[7] = 1.0 - ts.anchor.y;
                quad.upload();
                var tex = ts._texture;
                var lt = ts.tileTransform.localTransform;
                var uv = ts.uvTransform;
                var mapCoord = uv.mapCoord;
                var uClampFrame = uv.uClampFrame;
                var uClampOffset = uv.uClampOffset;
                var w = tex.width;
                var h = tex.height;
                var W = _width;
                var H = _height;
                var tempMat = this._tempMatrix2;
                tempMat.set(lt.a * w / W, lt.b * w / H, lt.c * h / W, lt.d * h / H, lt.tx / W, lt.ty / H);
                tempMat.invert();
                if (isSimple) {
                    tempMat.append(mapCoord);
                }
                else {
                    shader.uniforms.uMapCoord = mapCoord.toArray(true);
                    shader.uniforms.uClampFrame = uClampFrame;
                    shader.uniforms.uClampOffset = uClampOffset;
                }
                shader.uniforms.uTransform = tempMat.toArray(true);
                var color = this._tempColor;
                var alpha = ts.worldAlpha;
                PIXI.utils.hex2rgb(ts.tint, color);
                color[0] *= alpha;
                color[1] *= alpha;
                color[2] *= alpha;
                color[3] = alpha;
                shader.uniforms.uColor = color;
                renderer.bindTexture(tex, 0, true);
                quad.vao.draw(this.renderer.gl.TRIANGLES, 6, 0);
            };
            PictureRenderer.prototype._renderSprite = function (sprite, shader) {
                var renderer = this.renderer;
                var quad = shader.tempQuad;
                renderer.bindVao(quad.vao);
                var uvs = sprite.texture._uvs;
                var vertices = quad.vertices;
                var vd = sprite.vertexData;
                for (var i = 0; i < 8; i++) {
                    quad.vertices[i] = vd[i];
                }
                quad.uvs[0] = uvs.x0;
                quad.uvs[1] = uvs.y0;
                quad.uvs[2] = uvs.x1;
                quad.uvs[3] = uvs.y1;
                quad.uvs[4] = uvs.x2;
                quad.uvs[5] = uvs.y2;
                quad.uvs[6] = uvs.x3;
                quad.uvs[7] = uvs.y3;
                quad.upload();
                var frame = sprite.texture.frame;
                var base = sprite.texture.baseTexture;
                var clamp = this._tempClamp;
                var eps = 0.5 / base.resolution;
                clamp[0] = (frame.x + eps) / base.width;
                clamp[1] = (frame.y + eps) / base.height;
                clamp[2] = (frame.x + frame.width - eps) / base.width;
                clamp[3] = (frame.y + frame.height - eps) / base.height;
                shader.uniforms.uTextureClamp = clamp;
                var color = this._tempColor;
                PIXI.utils.hex2rgb(sprite.tint, color);
                var alpha = sprite.worldAlpha;
                color[0] *= alpha;
                color[1] *= alpha;
                color[2] *= alpha;
                color[3] = alpha;
                shader.uniforms.uColor = color;
                renderer.bindTexture(base, 0, true);
                quad.vao.draw(this.renderer.gl.TRIANGLES, 6, 0);
            };
            PictureRenderer.prototype._isSimpleSprite = function (ts) {
                var renderer = this.renderer;
                var tex = ts._texture;
                var baseTex = tex.baseTexture;
                var isSimple = baseTex.isPowerOfTwo && tex.frame.width === baseTex.width && tex.frame.height === baseTex.height;
                if (isSimple) {
                    if (!baseTex._glTextures[renderer.CONTEXT_UID]) {
                        if (baseTex.wrapMode === PIXI.WRAP_MODES.CLAMP) {
                            baseTex.wrapMode = PIXI.WRAP_MODES.REPEAT;
                        }
                    }
                    else {
                        isSimple = baseTex.wrapMode !== PIXI.WRAP_MODES.CLAMP;
                    }
                }
                return isSimple;
            };
            return PictureRenderer;
        }(PIXI.ObjectRenderer));
        extras.PictureRenderer = PictureRenderer;
        PIXI.WebGLRenderer.registerPlugin('picture', PictureRenderer);
        PIXI.CanvasRenderer.registerPlugin('picture', PIXI.CanvasSpriteRenderer);
    })(extras = PIXI.extras || (PIXI.extras = {}));
})(PIXI || (PIXI = {}));
var PIXI;
(function (PIXI) {
    var extras;
    (function (extras) {
        var PictureSprite = (function (_super) {
            __extends(PictureSprite, _super);
            function PictureSprite(texture) {
                _super.call(this, texture);
                this.pluginName = 'picture';
            }
            return PictureSprite;
        }(PIXI.Sprite));
        extras.PictureSprite = PictureSprite;
    })(extras = PIXI.extras || (PIXI.extras = {}));
})(PIXI || (PIXI = {}));
var PIXI;
(function (PIXI) {
    var extras;
    (function (extras) {
        var PictureTilingSprite = (function (_super) {
            __extends(PictureTilingSprite, _super);
            function PictureTilingSprite(texture) {
                _super.call(this, texture);
                this.pluginName = 'picture';
            }
            return PictureTilingSprite;
        }(extras.TilingSprite));
        extras.PictureTilingSprite = PictureTilingSprite;
    })(extras = PIXI.extras || (PIXI.extras = {}));
})(PIXI || (PIXI = {}));
//# sourceMappingURL=pixi-picture.js.map