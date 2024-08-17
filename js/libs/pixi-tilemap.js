var PIXI;
(function (PIXI) {
    var tilemap;
    (function (tilemap) {
        var CanvasTileRenderer = (function () {
            function CanvasTileRenderer(renderer) {
                this.tileAnim = [0, 0];
                this.dontUseTransform = false;
                this.renderer = renderer;
                this.tileAnim = [0, 0];
            }
            return CanvasTileRenderer;
        }());
        tilemap.CanvasTileRenderer = CanvasTileRenderer;
        PIXI.CanvasRenderer.registerPlugin('tilemap', CanvasTileRenderer);
    })(tilemap = PIXI.tilemap || (PIXI.tilemap = {}));
})(PIXI || (PIXI = {}));
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var PIXI;
(function (PIXI) {
    var tilemap;
    (function (tilemap) {
        var CompositeRectTileLayer = (function (_super) {
            __extends(CompositeRectTileLayer, _super);
            function CompositeRectTileLayer(zIndex, bitmaps, useSquare, texPerChild) {
                var _this = _super.call(this) || this;
                _this.shadowColor = new Float32Array([0.0, 0.0, 0.0, 0.5]);
                _this.modificationMarker = 0;
                _this._globalMat = null;
                _this._tempScale = null;
                _this.initialize.apply(_this, arguments);
                return _this;
            }
            CompositeRectTileLayer.prototype.updateTransform = function () {
                _super.prototype.displayObjectUpdateTransform.call(this);
            };
            CompositeRectTileLayer.prototype.initialize = function (zIndex, bitmaps, useSquare, texPerChild) {
                this.z = this.zIndex = zIndex;
                this.useSquare = useSquare;
                this.texPerChild = texPerChild || 16;
                if (bitmaps) {
                    this.setBitmaps(bitmaps);
                }
            };
            CompositeRectTileLayer.prototype.setBitmaps = function (bitmaps) {
                var texPerChild = this.texPerChild;
                var len1 = this.children.length;
                var len2 = Math.ceil(bitmaps.length / texPerChild);
                var i;
                for (i = 0; i < len1; i++) {
                    this.children[i].textures = bitmaps.slice(i * texPerChild, (i + 1) * texPerChild);
                }
                for (i = len1; i < len2; i++) {
                    this.addChild(new tilemap.RectTileLayer(this.zIndex, bitmaps.slice(i * texPerChild, (i + 1) * texPerChild)));
                }
            };
            CompositeRectTileLayer.prototype.clear = function () {
                for (var i = 0; i < this.children.length; i++)
                    this.children[i].clear();
                this.modificationMarker = 0;
            };
            CompositeRectTileLayer.prototype.addRect = function (num, u, v, x, y, tileWidth, tileHeight) {
                if (this.children[num] && this.children[num].textures)
                    this.children[num].addRect(0, u, v, x, y, tileWidth, tileHeight);
            };
            CompositeRectTileLayer.prototype.addFrame = function (texture_, x, y, animX, animY) {
                var texture;
                var layer = null, ind = 0;
                var children = this.children;
                if (typeof texture_ === "number") {
                    var childIndex = texture_ / this.texPerChild >> 0;
                    layer = children[childIndex];
                    if (!layer) {
                        layer = children[0];
                        if (!layer) {
                            return false;
                        }
                        ind = 0;
                    }
                    else {
                        ind = texture_ % this.texPerChild;
                    }
                    texture = layer.textures[ind];
                }
                else if (typeof texture_ === "string") {
                    texture = PIXI.Texture.fromImage(texture_);
                }
                else {
                    texture = texture_;
                    for (var i = 0; i < children.length; i++) {
                        var child = children[i];
                        var tex = child.textures;
                        for (var j = 0; j < tex.length; j++) {
                            if (tex[j].baseTexture == texture.baseTexture) {
                                layer = child;
                                ind = j;
                                break;
                            }
                        }
                        if (layer) {
                            break;
                        }
                    }
                    if (!layer) {
                        for (i = 0; i < children.length; i++) {
                            var child = children[i];
                            if (child.textures.length < this.texPerChild) {
                                layer = child;
                                ind = child.textures.length;
                                child.textures.push(texture);
                                break;
                            }
                        }
                        if (!layer) {
                            children.push(layer = new tilemap.RectTileLayer(this.zIndex, texture));
                            ind = 0;
                        }
                    }
                }
                layer.addRect(ind, texture.frame.x, texture.frame.y, x, y, texture.frame.width, texture.frame.height, animX, animY);
                return true;
            };
            ;
            CompositeRectTileLayer.prototype.renderCanvas = function (renderer) {
                if (!renderer.plugins.tilemap.dontUseTransform) {
                    var wt = this.worldTransform;
                    renderer.context.setTransform(wt.a, wt.b, wt.c, wt.d, wt.tx * renderer.resolution, wt.ty * renderer.resolution);
                }
                var layers = this.children;
                for (var i = 0; i < layers.length; i++)
                    layers[i].renderCanvas(renderer);
            };
            ;
            CompositeRectTileLayer.prototype.renderWebGL = function (renderer) {
                var gl = renderer.gl;
                var shader = renderer.plugins.tilemap.getShader(this.useSquare);
                renderer.setObjectRenderer(renderer.plugins.tilemap);
                renderer.bindShader(shader);
                this._globalMat = this._globalMat || new PIXI.Matrix();
                renderer._activeRenderTarget.projectionMatrix.copy(this._globalMat).append(this.worldTransform);
                shader.uniforms.projectionMatrix = this._globalMat.toArray(true);
                shader.uniforms.shadowColor = this.shadowColor;
                if (this.useSquare) {
                    var tempScale = this._tempScale = (this._tempScale || [0, 0]);
                    tempScale[0] = this._globalMat.a >= 0 ? 1 : -1;
                    tempScale[1] = this._globalMat.d < 0 ? 1 : -1;
                    var ps = shader.uniforms.pointScale = tempScale;
                    shader.uniforms.projectionScale = Math.abs(this.worldTransform.a) * renderer.resolution;
                }
                var af = shader.uniforms.animationFrame = renderer.plugins.tilemap.tileAnim;
                var layers = this.children;
                for (var i = 0; i < layers.length; i++)
                    layers[i].renderWebGL(renderer, this.useSquare);
            };
            CompositeRectTileLayer.prototype.isModified = function (anim) {
                var layers = this.children;
                if (this.modificationMarker != layers.length) {
                    return true;
                }
                for (var i = 0; i < layers.length; i++) {
                    var layer = layers[i];
                    if (layer.modificationMarker != layer.pointsBuf.length ||
                        anim && layer.hasAnim) {
                        return true;
                    }
                }
                return false;
            };
            CompositeRectTileLayer.prototype.clearModify = function () {
                var layers = this.children;
                this.modificationMarker = layers.length;
                for (var i = 0; i < layers.length; i++) {
                    var layer = layers[i];
                    layer.modificationMarker = layer.pointsBuf.length;
                }
            };
            return CompositeRectTileLayer;
        }(PIXI.Container));
        tilemap.CompositeRectTileLayer = CompositeRectTileLayer;
    })(tilemap = PIXI.tilemap || (PIXI.tilemap = {}));
})(PIXI || (PIXI = {}));
var PIXI;
(function (PIXI) {
    var tilemap;
    (function (tilemap) {
        var GraphicsLayer = (function (_super) {
            __extends(GraphicsLayer, _super);
            function GraphicsLayer(zIndex) {
                var _this = _super.call(this) || this;
                _this.z = _this.zIndex = zIndex;
                return _this;
            }
            GraphicsLayer.prototype.renderCanvas = function (renderer) {
                var wt = null;
                if (renderer.plugins.tilemap.dontUseTransform) {
                    wt = this.transform.worldTransform;
                    this.transform.worldTransform = PIXI.Matrix.IDENTITY;
                }
                renderer.plugins.graphics.render(this);
                if (renderer.plugins.tilemap.dontUseTransform) {
                    this.transform.worldTransform = wt;
                }
                renderer.context.globalAlpha = 1.0;
            };
            GraphicsLayer.prototype.renderWebGL = function (renderer) {
                if (!this._webGL[renderer.CONTEXT_UID])
                    this.dirty = true;
                _super.prototype.renderWebGL.call(this, renderer);
            };
            GraphicsLayer.prototype.isModified = function (anim) {
                return false;
            };
            GraphicsLayer.prototype.clearModify = function () {
            };
            return GraphicsLayer;
        }(PIXI.Graphics));
    })(tilemap = PIXI.tilemap || (PIXI.tilemap = {}));
})(PIXI || (PIXI = {}));
var PIXI;
(function (PIXI) {
    var tilemap;
    (function (tilemap) {
        var RectTileLayer = (function (_super) {
            __extends(RectTileLayer, _super);
            function RectTileLayer(zIndex, texture) {
                var _this = _super.call(this) || this;
                _this.z = 0;
                _this.zIndex = 0;
                _this.pointsBuf = [];
                _this._tempSize = new Float32Array([0, 0]);
                _this._tempTexSize = 1;
                _this.modificationMarker = 0;
                _this.hasAnim = false;
                _this.vbId = 0;
                _this.vbBuffer = null;
                _this.vbArray = null;
                _this.vbInts = null;
                _this.initialize(zIndex, texture);
                return _this;
            }
            RectTileLayer.prototype.initialize = function (zIndex, textures) {
                if (!textures) {
                    textures = [];
                }
                else if (!(textures instanceof Array) && textures.baseTexture) {
                    textures = [textures];
                }
                this.textures = textures;
                this.z = this.zIndex = zIndex;
                this.visible = false;
            };
            RectTileLayer.prototype.clear = function () {
                this.pointsBuf.length = 0;
                this.modificationMarker = 0;
                this.hasAnim = false;
            };
            RectTileLayer.prototype.renderCanvas = function (renderer) {
                if (this.textures.length === 0)
                    return;
                var points = this.pointsBuf;
                renderer.context.fillStyle = '#000000';
                for (var i = 0, n = points.length; i < n; i += 9) {
                    var x1 = points[i], y1 = points[i + 1];
                    var x2 = points[i + 2], y2 = points[i + 3];
                    var w = points[i + 4];
                    var h = points[i + 5];
                    x1 += points[i + 6] * renderer.plugins.tilemap.tileAnim[0];
                    y1 += points[i + 7] * renderer.plugins.tilemap.tileAnim[1];
                    var textureId = points[i + 8];
                    if (textureId >= 0) {
                        renderer.context.drawImage(this.textures[textureId].baseTexture.source, x1, y1, w, h, x2, y2, w, h);
                    }
                    else {
                        renderer.context.globalAlpha = 0.5;
                        renderer.context.fillRect(x2, y2, w, h);
                        renderer.context.globalAlpha = 1;
                    }
                }
            };
            RectTileLayer.prototype.addRect = function (textureId, u, v, x, y, tileWidth, tileHeight, animX, animY) {
                if (animX === void 0) { animX = 0; }
                if (animY === void 0) { animY = 0; }
                var pb = this.pointsBuf;
                this.hasAnim = this.hasAnim || animX > 0 || animY > 0;
                if (tileWidth == tileHeight) {
                    pb.push(u);
                    pb.push(v);
                    pb.push(x);
                    pb.push(y);
                    pb.push(tileWidth);
                    pb.push(tileHeight);
                    pb.push(animX | 0);
                    pb.push(animY | 0);
                    pb.push(textureId);
                }
                else {
                    var i;
                    if (tileWidth % tileHeight === 0) {
                        for (i = 0; i < tileWidth / tileHeight; i++) {
                            pb.push(u + i * tileHeight);
                            pb.push(v);
                            pb.push(x + i * tileHeight);
                            pb.push(y);
                            pb.push(tileHeight);
                            pb.push(tileHeight);
                            pb.push(animX | 0);
                            pb.push(animY | 0);
                            pb.push(textureId);
                        }
                    }
                    else if (tileHeight % tileWidth === 0) {
                        for (i = 0; i < tileHeight / tileWidth; i++) {
                            pb.push(u);
                            pb.push(v + i * tileWidth);
                            pb.push(x);
                            pb.push(y + i * tileWidth);
                            pb.push(tileWidth);
                            pb.push(tileWidth);
                            pb.push(animX | 0);
                            pb.push(animY | 0);
                            pb.push(textureId);
                        }
                    }
                    else {
                        pb.push(u);
                        pb.push(v);
                        pb.push(x);
                        pb.push(y);
                        pb.push(tileWidth);
                        pb.push(tileHeight);
                        pb.push(animX | 0);
                        pb.push(animY | 0);
                        pb.push(textureId);
                    }
                }
            };
            ;
            RectTileLayer.prototype.renderWebGL = function (renderer, useSquare) {
                if (useSquare === void 0) { useSquare = false; }
                var points = this.pointsBuf;
                if (points.length === 0)
                    return;
                var rectsCount = points.length / 9;
                var tile = renderer.plugins.tilemap;
                var gl = renderer.gl;
                if (!useSquare) {
                    tile.checkIndexBuffer(rectsCount);
                }
                var shader = tile.getShader(useSquare);
                var textures = this.textures;
                if (textures.length === 0)
                    return;
                var len = textures.length;
                if (this._tempTexSize < shader.maxTextures) {
                    this._tempTexSize = shader.maxTextures;
                    this._tempSize = new Float32Array(2 * shader.maxTextures);
                }
                for (var i = 0; i < len; i++) {
                    if (!textures[i] || !textures[i].valid)
                        return;
                    var texture = textures[i].baseTexture;
                }
                tile.bindTextures(renderer, shader, textures);
                var vb = tile.getVb(this.vbId);
                if (!vb) {
                    vb = tile.createVb(useSquare);
                    this.vbId = vb.id;
                    this.vbBuffer = null;
                    this.modificationMarker = 0;
                }
                var vao = vb.vao;
                renderer.bindVao(vao);
                var vertexBuf = vb.vb;
                vertexBuf.bind();
                var vertices = rectsCount * shader.vertPerQuad;
                if (vertices === 0)
                    return;
                if (this.modificationMarker != vertices) {
                    this.modificationMarker = vertices;
                    var vs = shader.stride * vertices;
                    if (!this.vbBuffer || this.vbBuffer.byteLength < vs) {
                        var bk = shader.stride;
                        while (bk < vs) {
                            bk *= 2;
                        }
                        this.vbBuffer = new ArrayBuffer(bk);
                        this.vbArray = new Float32Array(this.vbBuffer);
                        this.vbInts = new Uint32Array(this.vbBuffer);
                        vertexBuf.upload(this.vbBuffer, 0, true);
                    }
                    var arr = this.vbArray, ints = this.vbInts;
                    var sz = 0;
                    var textureId, shiftU, shiftV;
                    if (useSquare) {
                        for (i = 0; i < points.length; i += 9) {
                            textureId = (points[i + 8] >> 2);
                            shiftU = 1024 * (points[i + 8] & 1);
                            shiftV = 1024 * ((points[i + 8] >> 1) & 1);
                            arr[sz++] = points[i + 2];
                            arr[sz++] = points[i + 3];
                            arr[sz++] = points[i + 0] + shiftU;
                            arr[sz++] = points[i + 1] + shiftV;
                            arr[sz++] = points[i + 4];
                            arr[sz++] = points[i + 6];
                            arr[sz++] = points[i + 7];
                            arr[sz++] = textureId;
                        }
                    }
                    else {
                        var tint = -1;
                        for (i = 0; i < points.length; i += 9) {
                            var eps = 0.5;
                            textureId = (points[i + 8] >> 2);
                            shiftU = 1024 * (points[i + 8] & 1);
                            shiftV = 1024 * ((points[i + 8] >> 1) & 1);
                            var x = points[i + 2], y = points[i + 3];
                            var w = points[i + 4], h = points[i + 5];
                            var u = points[i] + shiftU, v = points[i + 1] + shiftV;
                            var animX = points[i + 6], animY = points[i + 7];
                            arr[sz++] = x;
                            arr[sz++] = y;
                            arr[sz++] = u;
                            arr[sz++] = v;
                            arr[sz++] = u + eps;
                            arr[sz++] = v + eps;
                            arr[sz++] = u + w - eps;
                            arr[sz++] = v + h - eps;
                            arr[sz++] = animX;
                            arr[sz++] = animY;
                            arr[sz++] = textureId;
                            arr[sz++] = x + w;
                            arr[sz++] = y;
                            arr[sz++] = u + w;
                            arr[sz++] = v;
                            arr[sz++] = u + eps;
                            arr[sz++] = v + eps;
                            arr[sz++] = u + w - eps;
                            arr[sz++] = v + h - eps;
                            arr[sz++] = animX;
                            arr[sz++] = animY;
                            arr[sz++] = textureId;
                            arr[sz++] = x + w;
                            arr[sz++] = y + h;
                            arr[sz++] = u + w;
                            arr[sz++] = v + h;
                            arr[sz++] = u + eps;
                            arr[sz++] = v + eps;
                            arr[sz++] = u + w - eps;
                            arr[sz++] = v + h - eps;
                            arr[sz++] = animX;
                            arr[sz++] = animY;
                            arr[sz++] = textureId;
                            arr[sz++] = x;
                            arr[sz++] = y + h;
                            arr[sz++] = u;
                            arr[sz++] = v + h;
                            arr[sz++] = u + eps;
                            arr[sz++] = v + eps;
                            arr[sz++] = u + w - eps;
                            arr[sz++] = v + h - eps;
                            arr[sz++] = animX;
                            arr[sz++] = animY;
                            arr[sz++] = textureId;
                        }
                    }
                    vertexBuf.upload(arr, 0, true);
                }
                if (useSquare)
                    gl.drawArrays(gl.POINTS, 0, vertices);
                else
                    gl.drawElements(gl.TRIANGLES, rectsCount * 6, gl.UNSIGNED_SHORT, 0);
            };
            return RectTileLayer;
        }(PIXI.Container));
        tilemap.RectTileLayer = RectTileLayer;
    })(tilemap = PIXI.tilemap || (PIXI.tilemap = {}));
})(PIXI || (PIXI = {}));
var PIXI;
(function (PIXI) {
    var tilemap;
    (function (tilemap) {
        var rectShaderFrag = "varying vec2 vTextureCoord;\nvarying vec4 vFrame;\nvarying float vTextureId;\nuniform vec4 shadowColor;\nuniform sampler2D uSamplers[%count%];\nuniform vec2 uSamplerSize[%count%];\n\nvoid main(void){\n   vec2 textureCoord = clamp(vTextureCoord, vFrame.xy, vFrame.zw);\n   float textureId = floor(vTextureId + 0.5);\n\n   vec4 color;\n   %forloop%\n   gl_FragColor = color;\n}";
        var rectShaderVert = "\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aFrame;\nattribute vec2 aAnim;\nattribute float aTextureId;\n\nuniform mat3 projectionMatrix;\nuniform vec2 animationFrame;\n\nvarying vec2 vTextureCoord;\nvarying float vTextureId;\nvarying vec4 vFrame;\n\nvoid main(void){\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n   vec2 anim = aAnim * animationFrame;\n   vTextureCoord = aTextureCoord + anim;\n   vFrame = aFrame + vec4(anim, anim);\n   vTextureId = aTextureId;\n}\n";
        var TilemapShader = (function (_super) {
            __extends(TilemapShader, _super);
            function TilemapShader(gl, maxTextures, shaderVert, shaderFrag) {
                var _this = _super.call(this, gl, shaderVert, shaderFrag) || this;
                _this.maxTextures = 0;
                _this.maxTextures = maxTextures;
                tilemap.shaderGenerator.fillSamplers(_this, _this.maxTextures);
                return _this;
            }
            return TilemapShader;
        }(PIXI.Shader));
        tilemap.TilemapShader = TilemapShader;
        var RectTileShader = (function (_super) {
            __extends(RectTileShader, _super);
            function RectTileShader(gl, maxTextures) {
                var _this = _super.call(this, gl, maxTextures, rectShaderVert, tilemap.shaderGenerator.generateFragmentSrc(maxTextures, rectShaderFrag)) || this;
                _this.vertSize = 11;
                _this.vertPerQuad = 4;
                _this.stride = _this.vertSize * 4;
                tilemap.shaderGenerator.fillSamplers(_this, _this.maxTextures);
                return _this;
            }
            RectTileShader.prototype.createVao = function (renderer, vb) {
                var gl = renderer.gl;
                return renderer.createVao()
                    .addIndex(this.indexBuffer)
                    .addAttribute(vb, this.attributes.aVertexPosition, gl.FLOAT, false, this.stride, 0)
                    .addAttribute(vb, this.attributes.aTextureCoord, gl.FLOAT, false, this.stride, 2 * 4)
                    .addAttribute(vb, this.attributes.aFrame, gl.FLOAT, false, this.stride, 4 * 4)
                    .addAttribute(vb, this.attributes.aAnim, gl.FLOAT, false, this.stride, 8 * 4)
                    .addAttribute(vb, this.attributes.aTextureId, gl.FLOAT, false, this.stride, 10 * 4);
            };
            return RectTileShader;
        }(TilemapShader));
        tilemap.RectTileShader = RectTileShader;
    })(tilemap = PIXI.tilemap || (PIXI.tilemap = {}));
})(PIXI || (PIXI = {}));
var PIXI;
(function (PIXI) {
    var tilemap;
    (function (tilemap) {
        var shaderGenerator;
        (function (shaderGenerator) {
            function fillSamplers(shader, maxTextures) {
                var sampleValues = [];
                for (var i = 0; i < maxTextures; i++) {
                    sampleValues[i] = i;
                }
                shader.bind();
                shader.uniforms.uSamplers = sampleValues;
                var samplerSize = [];
                for (i = 0; i < maxTextures; i++) {
                    samplerSize.push(1.0 / 2048);
                    samplerSize.push(1.0 / 2048);
                }
                shader.uniforms.uSamplerSize = samplerSize;
            }
            shaderGenerator.fillSamplers = fillSamplers;
            function generateFragmentSrc(maxTextures, fragmentSrc) {
                return fragmentSrc.replace(/%count%/gi, maxTextures + "")
                    .replace(/%forloop%/gi, this.generateSampleSrc(maxTextures));
            }
            shaderGenerator.generateFragmentSrc = generateFragmentSrc;
            function generateSampleSrc(maxTextures) {
                var src = '';
                src += '\n';
                src += '\n';
                src += 'if(vTextureId <= -1.0) {';
                src += '\n\tcolor = shadowColor;';
                src += '\n}';
                for (var i = 0; i < maxTextures; i++) {
                    src += '\nelse ';
                    if (i < maxTextures - 1) {
                        src += 'if(textureId == ' + i + '.0)';
                    }
                    src += '\n{';
                    src += '\n\tcolor = texture2D(uSamplers[' + i + '], textureCoord * uSamplerSize[' + i + ']);';
                    src += '\n}';
                }
                src += '\n';
                src += '\n';
                return src;
            }
            shaderGenerator.generateSampleSrc = generateSampleSrc;
        })(shaderGenerator = tilemap.shaderGenerator || (tilemap.shaderGenerator = {}));
    })(tilemap = PIXI.tilemap || (PIXI.tilemap = {}));
})(PIXI || (PIXI = {}));
var PIXI;
(function (PIXI) {
    var tilemap;
    (function (tilemap) {
        var squareShaderVert = "\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec2 aAnim;\nattribute float aTextureId;\nattribute float aSize;\n\nuniform mat3 projectionMatrix;\nuniform vec2 samplerSize;\nuniform vec2 animationFrame;\nuniform float projectionScale;\n\nvarying vec2 vTextureCoord;\nvarying float vSize;\nvarying float vTextureId;\n\nvoid main(void){\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition + aSize * 0.5, 1.0)).xy, 0.0, 1.0);\n   gl_PointSize = aSize * projectionScale;\n   vTextureCoord = aTextureCoord + aAnim * animationFrame;\n   vTextureId = aTextureId;\n   vSize = aSize;\n}\n";
        var squareShaderFrag = "\nvarying vec2 vTextureCoord;\nvarying float vSize;\nvarying float vTextureId;\n\nuniform vec4 shadowColor;\nuniform sampler2D uSamplers[%count%];\nuniform vec2 uSamplerSize[%count%];\nuniform vec2 pointScale;\n\nvoid main(void){\n   float margin = 0.5 / vSize;\n   vec2 pointCoord = (gl_PointCoord - 0.5) * pointScale + 0.5;\n   vec2 clamped = vec2(clamp(pointCoord.x, margin, 1.0 - margin), clamp(pointCoord.y, margin, 1.0 - margin));\n   vec2 textureCoord = pointCoord * vSize + vTextureCoord;\n   float textureId = vTextureId;\n   vec4 color;\n   %forloop%\n   gl_FragColor = color;\n}\n\n";
        var SquareTileShader = (function (_super) {
            __extends(SquareTileShader, _super);
            function SquareTileShader(gl, maxTextures) {
                var _this = _super.call(this, gl, maxTextures, squareShaderVert, tilemap.shaderGenerator.generateFragmentSrc(maxTextures, squareShaderFrag)) || this;
                _this.vertSize = 8;
                _this.vertPerQuad = 1;
                _this.stride = _this.vertSize * 4;
                _this.maxTextures = maxTextures;
                tilemap.shaderGenerator.fillSamplers(_this, _this.maxTextures);
                return _this;
            }
            SquareTileShader.prototype.createVao = function (renderer, vb) {
                var gl = renderer.gl;
                return renderer.createVao()
                    .addIndex(this.indexBuffer)
                    .addAttribute(vb, this.attributes.aVertexPosition, gl.FLOAT, false, this.stride, 0)
                    .addAttribute(vb, this.attributes.aTextureCoord, gl.FLOAT, false, this.stride, 2 * 4)
                    .addAttribute(vb, this.attributes.aSize, gl.FLOAT, false, this.stride, 4 * 4)
                    .addAttribute(vb, this.attributes.aAnim, gl.FLOAT, false, this.stride, 5 * 4)
                    .addAttribute(vb, this.attributes.aTextureId, gl.FLOAT, false, this.stride, 7 * 4);
            };
            ;
            return SquareTileShader;
        }(tilemap.TilemapShader));
        tilemap.SquareTileShader = SquareTileShader;
    })(tilemap = PIXI.tilemap || (PIXI.tilemap = {}));
})(PIXI || (PIXI = {}));
var PIXI;
(function (PIXI) {
    var tilemap;
    (function (tilemap) {
        var glCore = PIXI.glCore;
        function _hackSubImage(tex, sprite, clearBuffer, clearWidth, clearHeight) {
            var gl = tex.gl;
            var baseTex = sprite.texture.baseTexture;
            if (clearBuffer && clearWidth > 0 && clearHeight > 0) {
                gl.texSubImage2D(gl.TEXTURE_2D, 0, sprite.position.x, sprite.position.y, clearWidth, clearHeight, tex.format, tex.type, clearBuffer);
            }
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            gl.texSubImage2D(gl.TEXTURE_2D, 0, sprite.position.x, sprite.position.y, tex.format, tex.type, baseTex.source);
        }
        var TileRenderer = (function (_super) {
            __extends(TileRenderer, _super);
            function TileRenderer(renderer) {
                var _this = _super.call(this, renderer) || this;
                _this.vbs = {};
                _this.indices = new Uint16Array(0);
                _this.lastTimeCheck = 0;
                _this.tileAnim = [0, 0];
                _this.maxTextures = 4;
                _this.texLoc = [];
                return _this;
            }
            TileRenderer.prototype.onContextChange = function () {
                var gl = this.renderer.gl;
                var maxTextures = this.maxTextures;
                this.rectShader = new tilemap.RectTileShader(gl, maxTextures);
                this.squareShader = new tilemap.SquareTileShader(gl, maxTextures);
                this.checkIndexBuffer(2000);
                this.rectShader.indexBuffer = this.indexBuffer;
                this.squareShader.indexBuffer = this.indexBuffer;
                this.vbs = {};
                this.glTextures = [];
                this.boundSprites = [];
                this.initBounds();
            };
            TileRenderer.prototype.initBounds = function () {
                var gl = this.renderer.gl;
                var tempCanvas = document.createElement('canvas');
                tempCanvas.width = 2048;
                tempCanvas.height = 2048;
                for (var i = 0; i < this.maxTextures; i++) {
                    var rt = PIXI.RenderTexture.create(2048, 2048);
                    rt.baseTexture.premultipliedAlpha = true;
                    rt.baseTexture.scaleMode = TileRenderer.SCALE_MODE;
                    rt.baseTexture.wrapMode = PIXI.WRAP_MODES.CLAMP;
                    this.renderer.textureManager.updateTexture(rt);
                    this.glTextures.push(rt);
                    var bs = [];
                    for (var j = 0; j < 4; j++) {
                        var spr = new PIXI.Sprite();
                        spr.position.x = 1024 * (j & 1);
                        spr.position.y = 1024 * (j >> 1);
                        bs.push(spr);
                    }
                    this.boundSprites.push(bs);
                }
            };
            TileRenderer.prototype.bindTextures = function (renderer, shader, textures) {
                var bounds = this.boundSprites;
                var glts = this.glTextures;
                var len = textures.length;
                var maxTextures = this.maxTextures;
                if (len > 4 * maxTextures) {
                    return;
                }
                var doClear = TileRenderer.DO_CLEAR;
                if (doClear && !this._clearBuffer) {
                    this._clearBuffer = new Uint8Array(1024 * 1024 * 4);
                }
                var i;
                for (i = 0; i < len; i++) {
                    var texture = textures[i];
                    if (!texture || !textures[i].valid)
                        continue;
                    var bs = bounds[i >> 2][i & 3];
                    if (!bs.texture ||
                        bs.texture.baseTexture !== texture.baseTexture) {
                        bs.texture = texture;
                        var glt = glts[i >> 2];
                        renderer.bindTexture(glt, 0, true);
                        if (doClear) {
                            _hackSubImage(glt.baseTexture._glTextures[renderer.CONTEXT_UID], bs, this._clearBuffer, 1024, 1024);
                        }
                        else {
                            _hackSubImage(glt.baseTexture._glTextures[renderer.CONTEXT_UID], bs);
                        }
                    }
                }
                this.texLoc.length = 0;
                for (i = 0; i < maxTextures; i++) {
                    this.texLoc.push(renderer.bindTexture(glts[i], i, true));
                }
                shader.uniforms.uSamplers = this.texLoc;
            };
            TileRenderer.prototype.checkLeaks = function () {
                var now = Date.now();
                var old = now - 10000;
                if (this.lastTimeCheck < old ||
                    this.lastTimeCheck > now) {
                    this.lastTimeCheck = now;
                    var vbs = this.vbs;
                    for (var key in vbs) {
                        if (vbs[key].lastTimeAccess < old) {
                            this.removeVb(key);
                        }
                    }
                }
            };
            ;
            TileRenderer.prototype.start = function () {
                this.renderer.state.setBlendMode(PIXI.BLEND_MODES.NORMAL);
            };
            TileRenderer.prototype.getVb = function (id) {
                this.checkLeaks();
                var vb = this.vbs[id];
                if (vb) {
                    vb.lastAccessTime = Date.now();
                    return vb;
                }
                return null;
            };
            TileRenderer.prototype.createVb = function (useSquare) {
                var id = ++TileRenderer.vbAutoincrement;
                var shader = this.getShader(useSquare);
                var gl = this.renderer.gl;
                var vb = PIXI.glCore.GLBuffer.createVertexBuffer(gl, null, gl.STREAM_DRAW);
                var stuff = {
                    id: id,
                    vb: vb,
                    vao: shader.createVao(this.renderer, vb),
                    lastTimeAccess: Date.now(),
                    useSquare: useSquare,
                    shader: shader
                };
                this.vbs[id] = stuff;
                return stuff;
            };
            TileRenderer.prototype.removeVb = function (id) {
                if (this.vbs[id]) {
                    this.vbs[id].vb.destroy();
                    this.vbs[id].vao.destroy();
                    delete this.vbs[id];
                }
            };
            TileRenderer.prototype.checkIndexBuffer = function (size) {
                var totalIndices = size * 6;
                var indices = this.indices;
                if (totalIndices <= indices.length) {
                    return;
                }
                var len = indices.length || totalIndices;
                while (len < totalIndices) {
                    len <<= 1;
                }
                indices = new Uint16Array(len);
                this.indices = indices;
                for (var i = 0, j = 0; i + 5 < indices.length; i += 6, j += 4) {
                    indices[i + 0] = j + 0;
                    indices[i + 1] = j + 1;
                    indices[i + 2] = j + 2;
                    indices[i + 3] = j + 0;
                    indices[i + 4] = j + 2;
                    indices[i + 5] = j + 3;
                }
                if (this.indexBuffer) {
                    this.indexBuffer.upload(indices);
                }
                else {
                    var gl = this.renderer.gl;
                    this.indexBuffer = glCore.GLBuffer.createIndexBuffer(gl, this.indices, gl.STATIC_DRAW);
                }
            };
            TileRenderer.prototype.getShader = function (useSquare) {
                return useSquare ? this.squareShader : this.rectShader;
            };
            TileRenderer.prototype.destroy = function () {
                _super.prototype.destroy.call(this);
                this.rectShader.destroy();
                this.squareShader.destroy();
                this.rectShader = null;
                this.squareShader = null;
            };
            ;
            return TileRenderer;
        }(PIXI.ObjectRenderer));
        TileRenderer.vbAutoincrement = 0;
        TileRenderer.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
        TileRenderer.DO_CLEAR = false;
        tilemap.TileRenderer = TileRenderer;
        PIXI.WebGLRenderer.registerPlugin('tilemap', TileRenderer);
    })(tilemap = PIXI.tilemap || (PIXI.tilemap = {}));
})(PIXI || (PIXI = {}));
var PIXI;
(function (PIXI) {
    var tilemap;
    (function (tilemap_1) {
        var ZLayer = (function (_super) {
            __extends(ZLayer, _super);
            function ZLayer(tilemap, zIndex) {
                var _this = _super.call(this) || this;
                _this._lastAnimationFrame = -1;
                _this.tilemap = tilemap;
                _this.z = zIndex;
                return _this;
            }
            ZLayer.prototype.clear = function () {
                var layers = this.children;
                for (var i = 0; i < layers.length; i++)
                    layers[i].clear();
                this._previousLayers = 0;
            };
            ZLayer.prototype.cacheIfDirty = function () {
                var tilemap = this.tilemap;
                var layers = this.children;
                var modified = this._previousLayers != layers.length;
                this._previousLayers = layers.length;
                var buf = this.canvasBuffer;
                var tempRender = this._tempRender;
                if (!buf) {
                    buf = this.canvasBuffer = document.createElement('canvas');
                    tempRender = this._tempRender = new PIXI.CanvasRenderer(100, 100, { view: buf });
                    tempRender.context = tempRender.rootContext;
                    tempRender.plugins.tilemap.dontUseTransform = true;
                }
                if (buf.width != tilemap._layerWidth ||
                    buf.height != tilemap._layerHeight) {
                    buf.width = tilemap._layerWidth;
                    buf.height = tilemap._layerHeight;
                    modified = true;
                }
                var i;
                if (!modified) {
                    for (i = 0; i < layers.length; i++) {
                        if (layers[i].isModified(this._lastAnimationFrame != tilemap.animationFrame)) {
                            modified = true;
                            break;
                        }
                    }
                }
                this._lastAnimationFrame = tilemap.animationFrame;
                if (modified) {
                    if (tilemap._hackRenderer) {
                        tilemap._hackRenderer(tempRender);
                    }
                    tempRender.context.clearRect(0, 0, buf.width, buf.height);
                    for (i = 0; i < layers.length; i++) {
                        layers[i].clearModify();
                        layers[i].renderCanvas(tempRender);
                    }
                }
                this.layerTransform = this.worldTransform;
                for (i = 0; i < layers.length; i++) {
                    this.layerTransform = layers[i].worldTransform;
                    break;
                }
            };
            ;
            ZLayer.prototype.renderCanvas = function (renderer) {
                this.cacheIfDirty();
                var wt = this.layerTransform;
                renderer.context.setTransform(wt.a, wt.b, wt.c, wt.d, wt.tx * renderer.resolution, wt.ty * renderer.resolution);
                var tilemap = this.tilemap;
                renderer.context.drawImage(this.canvasBuffer, 0, 0);
            };
            ;
            return ZLayer;
        }(PIXI.Container));
        tilemap_1.ZLayer = ZLayer;
    })(tilemap = PIXI.tilemap || (PIXI.tilemap = {}));
})(PIXI || (PIXI = {}));
//# sourceMappingURL=pixi-tilemap.js.map