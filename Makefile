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

# Run linter
lint:
	@echo "Running linter..."
	@pnpm lint

# Format code
format:
	@echo "Formatting code..."
	@pnpm format

cert:
	@pnpm certs:init

dev:
	@pnpm dev
build:
	@pnpm build
serve:
	@pnpm serve

svg:
	@pnpm svg:optimize


build-ssr:
	@pnpm ssr:build
dev-ssr:
	@pnpm ssr:dev
serve-ssr:
	@pnpm ssr:serve
