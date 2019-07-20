# Node.js Addons Example/Cheat-sheet
Exploring Node.js C/C++ addons using N-API by following the tutorial below.

The aim of this project is to provide a cheat-sheet for N-API and some example code.

Amazing tutorial: https://medium.com/@atulanand94/beginners-guide-to-writing-nodejs-addons-using-c-and-n-api-node-addon-api-9b3b718a9a7f

Documentation: https://nodejs.org/api/addons.html#addons_n_api

## Table of Contents
* [Setup](#Setup)
* [node-gyp commands](#node-gyp-commands)
* [General Steps](#General-Steps)
* [Functions](#Functions)
* [Class](#Class)

## Setup
1. Install the dependencies
```
npm install node-gyp --save-dev
npm install node-addon-api
```

2. binding.gyp
```
{
    "targets": [{
        "target_name": "testaddon",
        "cflags!": [ "-fno-exceptions" ],
        "cflags_cc!": [ "-fno-exceptions" ],
        "sources": [
            "cppsrc/main.cpp" # sources
        ],
        'include_dirs': [
            "<!@(node -p \"require('node-addon-api').include\")"
        ],
        'libraries': [],
        'dependencies': [
            "<!(node -p \"require('node-addon-api').gyp\")"
        ],
        'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ]
    }]
}
```

3. package.json
```
"gypfile": true,
"scripts": {
  "build": "node-gyp rebuild", // compling (run clean, configure and build)
  "clean": "node-gyp clean"
}
```

## node-gyp commands
| Command | Description |
| --- | --- |
| help | Shows the help dialog |
| build |	Invokes make/msbuild.exe and builds the native addon |
| clean |	Removes the build directory if it exists |
| configure |	Generates project build files for the current platform |
| rebuild |	Runs clean, configure and build all in a row |
| install |	Installs Node.js header files for the given version |
| list | Lists the currently installed Node.js header versions |
| remove | Removes the Node.js header files for the given version |

Table from https://github.com/nodejs/node-gyp#commands (node-gyp github page)

## General Steps
Anything that needs to be exported to JS world needs to be wrapped with N-API

1. Create a wrapper function/class.
2. Create an Init method to set the export key.

## Functions
functionexample.h
```
#include <napi.h>

namespace functionexample
{
int add(int a, int b);
Napi::Number AddWrapped(const Napi::CallbackInfo &info);

Napi::Object Init(Napi::Env env, Napi::Object exports);
}
```

functionexample.cc
```
#include "functionexample.h"

int functionexample::add(int a, int b)
{
  return a + b;
}

Napi::Number functionexample::AddWrapped(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();
  if (info.Length() < 2 || !info[0].IsNumber() || !info[1].IsNumber())
  {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }

  Napi::Number first = info[0].As<Napi::Number>();
  Napi::Number second = info[1].As<Napi::Number>();

  int returnValue = functionexample::add(first.Int32Value(), second.Int32Value());
 
  return Napi::Number::New(env, returnValue);
}

Napi::Object functionexample::Init(Napi::Env env, Napi::Object exports)
{
  exports.Set("add", Napi::Function::New(env, functionexample::AddWrapped)); // define (key, value)
  return exports;
}
```

main.cc
```
#include <napi.h>
#include "Samples/functionexample.h"

Napi::Object InitAll(Napi::Env env, Napi::Object exports)
{
  return functionexample::Init(env, exports);
}

NODE_API_MODULE(testaddon, InitAll) // define (module name, register function)
```

## Class


