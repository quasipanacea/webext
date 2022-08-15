# shellcheck shell=bash

task.build() {
	rm -rf dist/**
	PATH="$HOME/.local/state/woof/installs/nodejs/v18.7.0/files/bin:$PATH" yarn run parcel build --no-optimize src/manifest.json
}

task.watch() {
	find -L . -ignore_readdir_race \( -iname 'node_modules' -o -iname 'dist' -o -iname 'out' -o -iname 'target' \) -prune -o -print | entr -c bake build
}
