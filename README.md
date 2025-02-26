# node-link

> Cross-package-manager Node.js package linking tool

`node-link` is a simple and efficient package linking tool that allows you to easily share locally developed Node.js packages between projects without frequent publishing to npm.

## Features

- 🔗 Easily create symlinks between packages
- 🌐 Works across package managers (npm, yarn, pnpm)
- 🔄 Simplifies local development workflow
- 📦 Unified global link storage management
- 🛠️ Automatic binary file linking

## Installation
```
npm install -g @hcl-z/node-link
```

## Usage

### Link current package to global store
```
cd /path/to/your/package
node-link link
```

### Link current package from global store
```
cd /path/to/your/project
node-link link package-name
```


### Unlink current package from global store
```
cd /path/to/your/package
node-link unlink
```


### Unlink package from current project
```
cd /path/to/your/project
node-link unlink package-name
```


## Command Reference

### `node-link link [target]`

Create package links.

### `node-link unlink [target]`

Remove package links.

## How It Works

`node-link` maintains a global link store in the user's home directory (default: `~/.node-link/store`) to manage all linked packages.

## Configuration

The global store is located at `~/.node-link/store` by default. You can customize it:


