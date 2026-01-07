BASE_DIR := $(dir $(realpath $(firstword $(MAKEFILE_LIST))))
OS_TYPE := $(shell uname -s)

.PHONY: all
all: setup check compile test

.PHONY: setup
setup:
	@asdf plugin update nodejs || (asdf plugin add nodejs && ~/.asdf/plugins/nodejs/bin/import-release-team-keyring)
	@asdf plugin update yarn || asdf plugin add yarn
	@asdf install
	@yarn --cwd "$(BASE_DIR)"

.PHONY: check
check:
	@yarn eslint

.PHONY: dev
dev:
	@yarn dev:watch

.PHONY: compile
compile:
	@yarn build

.PHONY: test
test:
	@yarn test
