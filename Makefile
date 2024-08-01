include .make/image.mk
include .make/help.mk
include .make/tag.mk

# Application name
APP_NAME := react-ssr-starter

# Set default target to help
.DEFAULT_GOAL := help

# Remove dist folder
rmdist:
	@echo "Removing dist folder..."
	@pnpm rmdist

# Clean project
clean:
	@echo "Cleaning project..."
	@pnpm clean

# Update version
version-up:
	@echo "Updating version..."
	@pnpm version-up

# Run pre-commit checks
pre:
	@echo "Running pre-commit checks..."
	@pnpm pre-commit


cert:
	@pnpm certs:init

dev:
	@pnpm dev

dev-ssr:
	@pnpm ssr:dev

run:
	@pnpm build
	@pnpm serve
serve:
	$(MAKE) run

run-ssr:
	@pnpm ssr:build
	@pnpm ssr:serve
serve-ssr:
	$(MAKE) run-ssr
