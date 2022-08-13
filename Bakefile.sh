# shellcheck shell=bash

task.build() {
  yarn run parcel build manifest.json
}

task.watch() {
  yarn run parcel watch manifest.json
}