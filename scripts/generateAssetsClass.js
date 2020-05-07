const shell = require("shelljs");
const fs = require("fs");
const xml2js = require("xml2js");
const commander = require("commander");
const camelCase = require('camelcase');

const ASSET_CLASS_FILE = "src/assets.ts";
const ASSET_TYPE_EXTENSIONS = {
  audio: [ 'flac', 'mp3', 'ogg', 'wav', 'webm' ],
  image: [ 'gif', 'jpg', 'jpeg', 'png', 'webp' ],
  font: [ 'eot', 'otf', 'svg', 'ttf', 'woff', 'woff2' ],
  bitmapFont: ['xml', 'fnt'],
  json: ['json'],
  xml: ['xml'],
  text: ['txt'],
  script: ['js'],
  shader: ['frag'],
}

function toPascalCase(str) {
  return camelCase(str, { pascalCase: true });
}

/**
 * Get asset filename and extensions
 * 
 * @returns {
  *   name: [ 'ext1', 'ext2', ... ]
  * } 
  */
 function findAssetTypeList(files) {
  const assets = {};
  files.forEach((fileName) => {
    const fileNameParts = fileName.split('.');
    const ext = fileNameParts.pop();
    const name = fileNameParts.join();
    assets[name] = (assets[name] || []).concat(ext);
  });
  return assets;
}

const findExtension = (haystack, typeExts) => typeExts.some((v) => haystack.indexOf(v) >= 0);

/**
 * Decide asset type from file name and extensions
 * 
 * @param {string} name file name
 * @param {Array<string>} exts file extensions
 * @results asset type by string
 */
function decideAssetType(name, exts) {
  let type = {
    image: findExtension(exts, ASSET_TYPE_EXTENSIONS.image),
    audio: findExtension(exts, ASSET_TYPE_EXTENSIONS.audio),
    font: findExtension(exts, ASSET_TYPE_EXTENSIONS.font),
    bitmapfont: findExtension(exts, ASSET_TYPE_EXTENSIONS.bitmapFont),
    json: findExtension(exts, ASSET_TYPE_EXTENSIONS.json),
    xml: findExtension(exts, ASSET_TYPE_EXTENSIONS.xml),
    text: findExtension(exts, ASSET_TYPE_EXTENSIONS.text),
    script: findExtension(exts, ASSET_TYPE_EXTENSIONS.script),
    shader: findExtension(exts, ASSET_TYPE_EXTENSIONS.shader),
  };

  if (type.bitmapFont) {
    type.bitmapFont = (exts.findIndex((ext) => shell.grep(/^[\s\S]*?<font>/g, `${key}.${ext}`).length > 1) >= 0);
  }
  if (type.bitmapFont && type.image) {
    return 'bitmapfont';
  }
  if (type.audio && type.json) {
    return 'audiosprites';
  }
  if (type.image) {
    if (type.json || type.xml) {
      return 'atlas';
    } else if (name.match(/\[(-?[0-9],?)*]/)) {
      return 'spritesheet';
    }
    return 'image';
  }
  return Object.keys(type).find((key) => type[key]) || 'misc';
}


function generateAssetParameterSpriteSheet(fileName, extensions) {
  const prop = fileName.replace('[', '').replace(']', '').split(',');
  if (prop.length < 2 || prop.length > 5) {
    console.error('Invalid number of Spritesheet properties provided for \'' + i + '\'. Must have between 2 and 5; [frameWidth, frameHeight, frameMax, margin, spacing] frameWidth and frameHeight are required');
  }

  return {
    members: {
      'FrameWidth': parseInt(prop[0] ? prop[0] : -1),
      'FrameHeight': parseInt(prop[1] ? prop[1] : -1),
      'FrameMax': parseInt(prop[2] ? prop[2] : -1),
      'Margin': parseInt(prop[3] ? prop[3] : 0),
      'Spacing': parseInt(prop[4] ? prop[4] : 0),
    }
  };
}

function generateAssetParameterAtlas(fileName, extensions) {
  var frames = []

  const parseFrame = (frameFull) => {
    const [frame] = frameFull.split('.');
    return {
      name: toPascalCase(frame),
      value: frameFull,
    };
  }

  for (const extName of extensions) {
    const dataFile = `${fileName}.${extName}`;
    if (findExtension([extName], ASSET_TYPE_EXTENSIONS.json)) {
      try {
        const json = JSON.parse(fs.readFileSync(dataFile, 'ascii'));
        const jsonFrames = json['frames'];
        if (Array.isArray(jsonFrames)) {
          dataType = 'Array';
          for (const v of jsonFrames) {
            frames.push(parseFrame(v.filename));
          }
        } else {
          dataType = 'Hash';
          for (const v of Object.keys(jsonFrames)) {
            frames.push(parseFrame(jsonFrames[v]));
          }
        }
      }
      catch (err) {
        console.log('Atlas Data File Error: ' + err);
      }
    } else if (findExtension([extName], ASSET_TYPE_EXTENSIONS.xml)) {
      try {
        const parser = new xml2js.Parser();
        parser.parseString(fs.readFileSync(dataFile, 'ascii'), (err, result) => {
          for (var x of result['TextureAtlas']['SubTexture']) {
            frames.push(parseFrame(x.$.name));
          }
        });
      }
      catch (err) {
        console.log('Atlas Data File Error: ', err);
      }
    }
  }

  return {
    enum: {
      type: 'Frames',
      name: toPascalCase(fileName.split('/')),
      values: frames
    }
  }
}

function generateAssetParameterAudioSprite(fileName, extensions) {
  var audioSprite = []

  for (const extName of extensions) {
    const dataFile = `${fileName}.${extName}`;
    if (findExtension([extName], ASSET_TYPE_EXTENSIONS.json)) {
      try {
        const json = JSON.parse(fs.readFileSync(dataFile, 'ascii'));
        for (const key of Object.keys(json['spritemap'])) {
          audioSprite.push({ name: toPascalCase(key), value: key });
        }
      }
      catch (err) {
        console.log('Atlas Data File Error: ' + err);
      }
    }
  }

  return {
    enum: {
      type: 'Sprites',
      name: toPascalCase(fileName.split('/')),
      values: audioSprite
    }
  }
}

/**
 * generate asset information object for class export 
 * @param { string } name file name
 * @param { Array<string> } extensions file extensions
 */
function generateAssetObject(fileName, extensions) {
  const className = toPascalCase(fileName.split('/'));
  const type = decideAssetType(fileName, extensions);

  const value = { fileName, className, extensions };
  let properties = undefined;
  console.log(type);

  switch(type) {
    case 'spritesheet': {
      properties = generateAssetParameterSpriteSheet(fileName, extensions);
      break;
    }
    case 'atlas': {
      properties = generateAssetParameterAtlas(fileName, extensions);
      break;
    }
    case 'audiosprites': {
      properties = generateAssetParameterAudioSprite(fileName, extensions);
      break;
    }
  }
  return { type, ...value, properties };
}

function generateAssetObjectClassString(className, assets) {
  const s = [];
  s.push(`export namespace ${className} {`);
  if (!assets.length) {
    s.push('  class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}');
  } else {
    for (const asset of assets) {
      const properties = asset.properties;
      if (properties && properties.enum) {
        s.push('');
        s.push(`  enum ${properties.enum.name}${properties.enum.type} {`);
        for (const value of properties.enum.values) {
          s.push(`    ${value.name} = <any>'${value.value}',`);
        }
        s.push('  }');
        s.push('');
      }
    }
    for (const asset of assets) {
        const fileName = asset.fileName;
      const className = asset.className;
      const extensions = asset.extensions;
      const properties = asset.properties;
      
      s.push(`  export class ${className} {`);
      s.push(`    static getName(): string { return "${fileName.split('/').pop()}"; }`);
      
      for (const extName of extensions) {
        s.push(`    static get${extName.toUpperCase()}(): string { return require("assets/${fileName}.${extName}"); }`);
      }

      if (properties && properties.members) {
        s.push('');
        for (const memberName of Object.keys(properties.members)) {
          s.push(`    static get${memberName}(): ${typeof properties.members[memberName]} { return ${properties.members[memberName]}; }`)
        }
      }
      if (properties && properties.enum) {
        s.push('');
        s.push(`    static ${properties.enum.type} = ${properties.enum.name}${properties.enum.type}`);
      }


      s.push('  }');
    }
  }
  s.push('}');
  s.push('');
  return s;
}


function main() {
  // get /asset files with extensions
  shell.cd('assets');
  const assetFiles = shell.ls('**/*.*');
  const assetTypeList = findAssetTypeList(assetFiles);

  // generate asset values for export
  const assets = [];
  for (const key of Object.keys(assetTypeList)) {
    assets.push(generateAssetObject(key, assetTypeList[key]));
  }

  const result = [];
  result.push("/* AUTO GENERATED FILE. DO NOT MODIFY. YOU WILL LOSE YOUR CHANGES ON BUILD. */");
  result.push("");
  result.push(... generateAssetObjectClassString('Images', assets.filter((asset) => asset.type === 'image')));
  result.push(... generateAssetObjectClassString('Spritesheets', assets.filter((asset) => asset.type === 'spritesheet')));
  result.push(... generateAssetObjectClassString('Atlases', assets.filter((asset) => asset.type === 'atlas')));
  result.push(... generateAssetObjectClassString('Audio', assets.filter((asset) => asset.type === 'audio')));
  result.push(... generateAssetObjectClassString('Audiosprites', assets.filter((asset) => asset.type === 'audiosprites')));
  result.push(... generateAssetObjectClassString('CustomWebFonts', assets.filter((asset) => asset.type === 'font')));
  result.push(... generateAssetObjectClassString('BitmapFonts', assets.filter((asset) => asset.type === 'bitmapfont')));
  result.push(... generateAssetObjectClassString('JSON', assets.filter((asset) => asset.type === 'json')));
  result.push(... generateAssetObjectClassString('Text', assets.filter((asset) => asset.type === 'text')));
  result.push(... generateAssetObjectClassString('Scripts', assets.filter((asset) => asset.type === 'script')));
  result.push(... generateAssetObjectClassString('Shaders', assets.filter((asset) => asset.type === 'shader')));
  result.push("");
  
  console.log(result);  
}

main();
return;


shell.rm('-f', ASSET_CLASS_FILE);
shell.ShellString('/* AUTO GENERATED FILE. DO NOT MODIFY. YOU WILL LOSE YOUR CHANGES ON BUILD. */\n\n').to(ASSET_CLASS_FILE);
shell.ShellString('export namespace Spritesheets {').toEnd(ASSET_CLASS_FILE);



shell.ShellString('export namespace Audiosprites {').toEnd(assetsClassFile);
if (!Object.keys(loaderTypes.audiosprite).length) {
  shell.ShellString('\n    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}').toEnd(assetsClassFile);
} else {
  for (var i in loaderTypes.audiosprite) {
    for (var t in loaderTypes.audiosprite[i]) {
      var dataFile = ('assets/' + i + '.' + loaderTypes.audiosprite[i][t]);
      var fileData = null;
      var json = null;
      var sprite = null;
      
      if (jsonExtensions.indexOf(loaderTypes.audiosprite[i][t]) !== -1) {
        shell.ShellString('\n    enum ' + toPascalCase(i) + 'Sprites {').toEnd(assetsClassFile);
        
        try {
          fileData = fs.readFileSync(dataFile, 'ascii');
          json = JSON.parse(fileData);
          
          for (var h in json['spritemap']) {
            sprite = (h);
            shell.ShellString('\n        ' + toPascalCase(sprite) + ' = <any>\'' + sprite + '\',').toEnd(assetsClassFile);
          }
        } catch (e) {
          console.log('Audiosprite Data File Error: ', e);
        }
        
        shell.ShellString('\n    }').toEnd(assetsClassFile);
      }
    }
    
    shell.ShellString('\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
    shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; }\n').toEnd(assetsClassFile);
    for (var t in loaderTypes.audiosprite[i]) {
      shell.ShellString('\n        static get' + loaderTypes.audiosprite[i][t].toUpperCase() + '(): string { return require(\'assets/' + i + '.' + loaderTypes.audiosprite[i][t] + '\'); }').toEnd(assetsClassFile);
    }
    shell.ShellString('\n\n        static Sprites = ' + toPascalCase(i) + 'Sprites;').toEnd(assetsClassFile);
    shell.ShellString('\n    }').toEnd(assetsClassFile);
  }
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);

/*
shell.ShellString('export namespace GoogleWebFonts {').toEnd(assetsClassFile);
var webFontsToUse = JSON.parse(webpackConfig.plugins[webpackConfig.plugins.findIndex(function(element) { return (element instanceof webpack.DefinePlugin); })].definitions.GOOGLE_WEB_FONTS);
if (!webFontsToUse.length) {
  shell.ShellString('\n    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}').toEnd(assetsClassFile);
} else {
  for (var i in webFontsToUse) {
    shell.ShellString('\n    export const ' + toPascalCase(webFontsToUse[i]) + ': string = \'' + webFontsToUse[i] + '\';').toEnd(assetsClassFile);
  }
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);
*/

shell.ShellString('export namespace CustomWebFonts {').toEnd(assetsClassFile);
if (!Object.keys(loaderTypes.font).length) {
  shell.ShellString('\n    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}').toEnd(assetsClassFile);
} else {
  for (var i in loaderTypes.font) {
    shell.ShellString('\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
    shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; }\n').toEnd(assetsClassFile);
    
    var cssFileData = fs.readFileSync(('assets/' + i + '.css'), 'ascii');
    var family = /font-family:(\s)*('|")([\w-]*\W*)('|")/g.exec(cssFileData)[3];
    shell.ShellString('\n        static getFamily(): string { return \'' + family + '\'; }\n').toEnd(assetsClassFile);
    
    for (var t in loaderTypes.font[i]) {
      shell.ShellString('\n        static get' + loaderTypes.font[i][t].toUpperCase() + '(): string { return require(\'!file-loader?name=assets/fonts/[name].[ext]!assets/' + i + '.' + loaderTypes.font[i][t] + '\'); }').toEnd(assetsClassFile);
    }
    
    shell.ShellString('\n    }').toEnd(assetsClassFile);
  }
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);

shell.ShellString('export namespace BitmapFonts {').toEnd(assetsClassFile);
if (!Object.keys(loaderTypes.bitmap_font).length) {
  shell.ShellString('\n    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}').toEnd(assetsClassFile);
} else {
  for (var i in loaderTypes.bitmap_font) {
    shell.ShellString('\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
    shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; }\n').toEnd(assetsClassFile);
    
    for (var t in loaderTypes.bitmap_font[i]) {
      shell.ShellString('\n        static get' + loaderTypes.bitmap_font[i][t].toUpperCase() + '(): string { return require(\'assets/' + i + '.' + loaderTypes.bitmap_font[i][t] + '\'); }').toEnd(assetsClassFile);
    }
    
    shell.ShellString('\n    }').toEnd(assetsClassFile);
  }
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);

shell.ShellString('export namespace JSON {').toEnd(assetsClassFile);
if (!Object.keys(loaderTypes.json).length) {
  shell.ShellString('\n    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}').toEnd(assetsClassFile);
} else {
  for (var i in loaderTypes.json) {
    shell.ShellString('\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
    shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; }\n').toEnd(assetsClassFile);
    
    for (var t in loaderTypes.json[i]) {
      shell.ShellString('\n        static get' + loaderTypes.json[i][t].toUpperCase() + '(): string { return require(\'assets/' + i + '.' + loaderTypes.json[i][t] + '\'); }').toEnd(assetsClassFile);
    }
    
    shell.ShellString('\n    }').toEnd(assetsClassFile);
  }
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);

shell.ShellString('export namespace XML {').toEnd(assetsClassFile);
if (!Object.keys(loaderTypes.xml).length) {
  shell.ShellString('\n    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}').toEnd(assetsClassFile);
} else {
  for (var i in loaderTypes.xml) {
    shell.ShellString('\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
    shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; }\n').toEnd(assetsClassFile);
    
    for (var t in loaderTypes.xml[i]) {
      shell.ShellString('\n        static get' + loaderTypes.xml[i][t].toUpperCase() + '(): string { return require(\'assets/' + i + '.' + loaderTypes.xml[i][t] + '\'); }').toEnd(assetsClassFile);
    }
    
    shell.ShellString('\n    }').toEnd(assetsClassFile);
  }
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);

shell.ShellString('export namespace Text {').toEnd(assetsClassFile);
if (!Object.keys(loaderTypes.text).length) {
  shell.ShellString('\n    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}').toEnd(assetsClassFile);
} else {
  for (var i in loaderTypes.text) {
    shell.ShellString('\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
    shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; }\n').toEnd(assetsClassFile);
    
    for (var t in loaderTypes.text[i]) {
      shell.ShellString('\n        static get' + loaderTypes.text[i][t].toUpperCase() + '(): string { return require(\'assets/' + i + '.' + loaderTypes.text[i][t] + '\'); }').toEnd(assetsClassFile);
    }
    
    shell.ShellString('\n    }').toEnd(assetsClassFile);
  }
}
shell.ShellString('\n}\n\n').toEnd(assetsClassFile);

shell.ShellString('export namespace Scripts {').toEnd(assetsClassFile);
if (!Object.keys(loaderTypes.script).length) {
  shell.ShellString('\n    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}').toEnd(assetsClassFile);
} else {
  for (var i in loaderTypes.script) {
    shell.ShellString('\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
    shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; }\n').toEnd(assetsClassFile);
    
    for (var t in loaderTypes.script[i]) {
      shell.ShellString('\n        static get' + loaderTypes.script[i][t].toUpperCase() + '(): string { return require(\'assets/' + i + '.' + loaderTypes.script[i][t] + '\'); }').toEnd(assetsClassFile);
    }
    
    shell.ShellString('\n    }').toEnd(assetsClassFile);
  }
}
shell.ShellString('\n}\n').toEnd(assetsClassFile);

shell.ShellString('export namespace Shaders {').toEnd(assetsClassFile);
if (!Object.keys(loaderTypes.shader).length) {
  shell.ShellString('\n    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}').toEnd(assetsClassFile);
} else {
  for (var i in loaderTypes.shader) {
    shell.ShellString('\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
    shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; }\n').toEnd(assetsClassFile);
    
    for (var t in loaderTypes.shader[i]) {
      shell.ShellString('\n        static get' + loaderTypes.shader[i][t].toUpperCase() + '(): string { return require(\'assets/' + i + '.' + loaderTypes.shader[i][t] + '\'); }').toEnd(assetsClassFile);
    }
    
    shell.ShellString('\n    }').toEnd(assetsClassFile);
  }
}
shell.ShellString('\n}\n').toEnd(assetsClassFile);

shell.ShellString('export namespace Misc {').toEnd(assetsClassFile);
if (!Object.keys(loaderTypes.misc).length) {
  shell.ShellString('\n    class IExistSoTypeScriptWillNotComplainAboutAnEmptyNamespace {}').toEnd(assetsClassFile);
} else {
  for (var i in loaderTypes.misc) {
    shell.ShellString('\n    export class ' + toPascalCase(i) + ' {').toEnd(assetsClassFile);
    shell.ShellString('\n        static getName(): string { return \'' + i.split('/').pop() + '\'; }\n').toEnd(assetsClassFile);
    
    for (var t in loaderTypes.misc[i]) {
      shell.ShellString('\n        static get' + loaderTypes.misc[i][t].toUpperCase() + '(): string { return require(\'assets/' + i + '.' + loaderTypes.misc[i][t] + '\'); }').toEnd(assetsClassFile);
    }
    
    shell.ShellString('\n    }').toEnd(assetsClassFile);
  }
}
shell.ShellString('\n}\n').toEnd(assetsClassFile);
