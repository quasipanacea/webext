# shellcheck shell=bash

task.dev() {
	find -L . -ignore_readdir_race \( -iname 'node_modules' -o -iname 'dist' -o -iname 'out' -o -iname 'target' \) -prune -o -print | entr -c bake build
}

task.build() {
	rm -rf dist/*
	pnpm parcel build --no-optimize src/manifest.json
}

task.release-nightly() {
	task.build

	mkdir -p './output'
	tar czf './output/build.tar.gz' './dist'

	util.publish './output/build.tar.gz'
}

util.publish() {
	local file="$1"
	bake.assert_not_empty 'file'

	local tag_name='nightly'
	git tag -fa "$tag_name" -m ''
	git push origin ":refs/tags/$tag_name"
	git push --tags
	gh release upload "$tag_name" "$file" --clobber
	gh release edit --draft=false nightly
}
